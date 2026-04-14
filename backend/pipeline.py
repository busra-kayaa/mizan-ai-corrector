import os
import sys
import json
import re
import threading
from difflib import SequenceMatcher
from llama_cpp import Llama

current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.append(current_dir)

try:
    from core.rule_based_layer import RuleBasedCorrector
    print("✅ RuleBasedCorrector (Regex Layer) başarıyla bağlandı.")
except ImportError:
    print("⚠️ Uyarı: rule_based_layer.py bulunamadı, sistem sadece Neural modda çalışacak.")
    RuleBasedCorrector = None

class MizanHybridPipeline:
    def __init__(self, gguf_path=None):
        self.regex_layer = RuleBasedCorrector() if RuleBasedCorrector else None
        self.lock = threading.Lock()

        if gguf_path is None:
            base_dir = os.path.dirname(os.path.abspath(__file__))
            gguf_path = os.path.join(base_dir, "models", "Meta-Llama-3.1-8B.Q4_K_M.gguf")

        if not os.path.exists(gguf_path):
            raise ValueError(f"❌ MODEL BULUNAMADI! Lütfen şu yolu kontrol et: {gguf_path}")

        print(f"🧠 Mizan Neural Engine Yükleniyor... ({gguf_path})")
        self.model = Llama(
            model_path=gguf_path,
            n_gpu_layers=-1,
            n_ctx=8192, 
            n_threads=8,
            verbose=False
        )

        self.system_instruction = (
            "You are an expert text correction system. Fix ALL errors and output JSON. "
            "SEQUENTIAL ORDER RULE: List corrections in the EXACT order they appear. "
            "STRICT ATOMIC RULE: Split corrections into single words or punctuation marks. DO NOT group multiple words together. "
            "If a word or punctuation is missing, use an empty string '' as the original text."
        )

    def _build_prompt(self, text):
        return f"""Below is an instruction that describes a task, paired with an input that provides further context. Write a response that appropriately completes the request.

### Instruction:
{self.system_instruction}

### Input:
{text}

### Response:
"""

    def _determine_error_type(self, original, corrected, is_start_of_sentence=False):
        orig = (original or "").strip()
        corr = (corrected or "").strip()
        orig_l = orig.lower()
        corr_l = corr.lower()

        if not orig and not corr:
            return "lexical"

        # 1. ÖNCELİK: NOKTALAMA (Punctuation)
        # Sadece noktalama işareti değişimi veya eklemesi/silmesi mi diye bakıyoruz
        punctuation_regex = r"^[.,!?;:()\"\'\-]+$"
        if re.match(punctuation_regex, corr) or (orig and not corr and re.match(punctuation_regex, orig)):
            return "punctuation"

        # 2. ÖNCELİK: TÜRKÇE KARAKTER (Deascii)
        # Kelimenin ASCII maskesini alarak net Türkçe karakter değişimi tespiti
        turkish_map = str.maketrans("çğıöşüİĞÜŞÖÇ", "cgiosuIGUSOC")
        if orig_l != corr_l and orig_l.translate(turkish_map) == corr_l.translate(turkish_map):
            return "deascii"

        # 3. ÖNCELİK: BÜYÜK/KÜÇÜK HARF
        if orig_l == corr_l and orig != corr:
            return "capitalization" if is_start_of_sentence else "terminology"

        # 4. ÖNCELİK: DİLBİLGİSİ (Grammar)
        grammar_words = {
            "a", "an", "the", "in", "on", "at", "to", "for", "of", "with", "by", "from",
            "is", "are", "am", "was", "were", "has", "have", "had", "do", "does", "did",
            "their", "there", "they're", "its", "it's", "your", "you're", "whose", "who's"
        }
        if orig_l in grammar_words or corr_l in grammar_words:
            return "grammar"

        # 5. ÖNCELİK: TERMİNOLOJİ (Özel İsimler)
        if corr and corr[0].isupper() and not is_start_of_sentence:
            return "terminology"

        # 6. SON ADIM: YAZIM HATASI vs KELİME SEÇİMİ (Typo vs Lexical)
        similarity = SequenceMatcher(None, orig_l, corr_l).ratio()
        if similarity >= 0.70:
            return "typographic"
        
        return "lexical"

    def _get_explanation(self, err_type):
        EXPLANATIONS = {
            "deascii": "Türkçe karakter eksikliği veya hatası düzeltildi.",
            "lexical": "Yaygın kelime yazım hatası düzeltildi.",
            "typographic": "Tipografik harf veya klavye hatası düzeltildi.",
            "punctuation": "Noktalama işareti hatası veya eksiği düzeltildi.",
            "grammar": "Dilbilgisi veya edat kullanımı düzeltildi.",
            "terminology": "Özel isim veya terminoloji hatası düzeltildi.",
            "capitalization": "Cümle başı büyük harf kullanımı düzeltildi."
        }
        return EXPLANATIONS.get(err_type, "Sözdizimi veya yapısal bir hata düzeltildi.")

    def _extract_corrections(self, original_text, corrected_text):
        # MÜKEMMEL TOKENİZASYON: Kelimeleri ve noktalamaları kesin olarak ayırır.
        token_pattern = r"[\wüçşığöİÜÇŞĞÖ]+(?:['’][\wüçşığöİÜÇŞĞÖ]+)*|[^\w\s]"
        orig_tokens = re.findall(token_pattern, original_text)
        corr_tokens = re.findall(token_pattern, corrected_text)

        # SequenceMatcher'a direkt veriyoruz ki Büyük/Küçük harf değişimlerini 'replace' olarak algılasın
        matcher = SequenceMatcher(None, orig_tokens, corr_tokens)
        verified_corrections = []

        for tag, i1, i2, j1, j2 in matcher.get_opcodes():
            if tag == 'replace':
                # Karmaşık döngüler yerine temiz 1'e 1 map
                sub_orig = orig_tokens[i1:i2]
                sub_corr = corr_tokens[j1:j2]
                
                for k in range(max(len(sub_orig), len(sub_corr))):
                    o = sub_orig[k] if k < len(sub_orig) else ""
                    c = sub_corr[k] if k < len(sub_corr) else ""
                    
                    if o != c:
                        is_start = (j1 + k == 0) or (j1 + k > 0 and corr_tokens[j1 + k - 1] in ['.', '!', '?'])
                        err_type = self._determine_error_type(o, c, is_start)
                        verified_corrections.append({
                            "original": o,
                            "corrected": c,
                            "type": err_type,
                            "explanation": self._get_explanation(err_type)
                        })
            
            elif tag == 'insert':
                for k in range(j1, j2):
                    c = corr_tokens[k]
                    err_type = self._determine_error_type("", c)
                    verified_corrections.append({
                        "original": "",
                        "corrected": c,
                        "type": err_type,
                        "explanation": self._get_explanation(err_type)
                    })
                    
            elif tag == 'delete':
                for k in range(i1, i2):
                    o = orig_tokens[k]
                    err_type = self._determine_error_type(o, "")
                    verified_corrections.append({
                        "original": o,
                        "corrected": "", # UI tarafı için '[Silindi]' veya boşluk
                        "type": err_type,
                        "explanation": "Gereksiz karakter veya kelime temizlendi."
                    })

        return verified_corrections

    def _merge_and_sort_corrections(self, regex_list, ai_list):
        # KRONOLOJİK SIRAYI BOZMAMA VE DEDUPLICATION (GİZLEME) KALDIRILDI!
        # Böylece metinde aynı cümle 2 kere geçerse, 2 kere listelenecek ve UI boyayabilecek.
        
        # Sadece Regex'ten gelen çok özel açıklamalar varsa AI listesine giydiriyoruz.
        regex_explanations = {c.get("corrected", "").lower(): c.get("explanation") for c in regex_list}
        
        for c in ai_list:
            corr_lower = c.get("corrected", "").lower()
            if corr_lower in regex_explanations:
                c["explanation"] = regex_explanations[corr_lower]
                
        return ai_list

    def process(self, text):
        rb_text = text
        rb_corrections = []
        
        if self.regex_layer:
            try:
                rb_text, rb_corrections = self.regex_layer.process(text)
            except Exception as e:
                print(f"⚠️ Regex işleme hatası: {e}")

        prompt = self._build_prompt(rb_text)

        prompt_bytes = prompt.encode("utf-8")
        prompt_token_count = len(self.model.tokenize(prompt_bytes))
        
        max_available_space = 8192 - prompt_token_count - 50
        needed_space = int(prompt_token_count * 1.5) + 1000
        safe_max_tokens = min(max_available_space, needed_space)

        print(f"📊 Token Analizi: Girdi={prompt_token_count}, Ayrılan Çıktı Alanı={safe_max_tokens}")

        if max_available_space <= 100:
            print("🚨 UYARI: Metin çok uzun! LLM'in cevap yazacağı alan kalmadı.")
            return {
                "originalText": text,
                "correctedText": rb_text,
                "corrections": rb_corrections,
                "metadata": {
                    "mode": "regex_fallback",
                    "error": "Context Overflow",
                    "regex_count": len(rb_corrections),
                    "neural_count": 0
                }
            }

        with self.lock:
            output = self.model(
                prompt,
                max_tokens=safe_max_tokens,
                stop=["###", "</s>", "<|eot_id|>", "<|end_of_text|>"],
                temperature=0.0,
                echo=False
            )

        raw_response = output["choices"][0]["text"].strip()
        final_text = rb_text

        try:
            json_match = re.search(r'\{.*\}', raw_response, re.DOTALL)
            if json_match:
                clean_json = json_match.group(0)
                ai_data = json.loads(clean_json)
                final_text = ai_data.get("correctedText", rb_text)
            else:
                print("⚠️ Llama JSON formatında cevap vermedi.")
        except (json.JSONDecodeError, ValueError) as e:
            print(f"⚠️ JSON Parse Hatası: {e}")

        verified_corrections = self._extract_corrections(text, final_text)
        combined_corrections = self._merge_and_sort_corrections(rb_corrections, verified_corrections)

        return {
            "originalText": text,
            "correctedText": final_text,
            "corrections": combined_corrections,
            "metadata": {
                "regex_count": len(rb_corrections),
                "neural_count": len(verified_corrections),
                "prompt_tokens": prompt_token_count,
                "generated_tokens": safe_max_tokens,
                "processing_time_ms": output.get("usage", {}).get("total_time", 0) 
            }
        }