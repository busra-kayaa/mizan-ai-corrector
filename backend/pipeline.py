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

        # GÜNCEL PROMPT: Özel isimleri, markaları ve yer adlarını koruması/büyütmesi için kesin talimat
        self.system_instruction = (
            "You are an expert text correction system. Fix ALL spelling, grammar, punctuation, and capitalization errors. "
            "CRITICAL: You must capitalize proper nouns, places, brands, and landmarks correctly (e.g., 'london' -> 'London', 'big ben' -> 'Big Ben', 'micro soft' -> 'Microsoft'). "
            "IMPORTANT: Output ONLY a valid JSON object with a single key 'correctedText' containing the fully corrected text. "
            "Do NOT provide explanations. Do NOT list the corrections. Just return the JSON."
            "\nExample: {\"correctedText\": \"This is the fully fixed text.\"}"
        )

    def _build_prompt(self, text):
        return f"""Below is an instruction that describes a task, paired with an input that provides further context. Write a response that appropriately completes the request.

### Instruction:
{self.system_instruction}

### Input:
{text}

### Response:
"""

    def _turkish_lower(self, text):
        return text.replace('I', 'ı').replace('İ', 'i').lower()

    def _determine_error_type(self, original, corrected, is_start_of_sentence=False):
        orig = (original or "").strip()
        corr = (corrected or "").strip()
        
        # Standart lower() yerine kendi fonksiyonumuzu kullanıyoruz
        orig_l = self._turkish_lower(orig)
        corr_l = self._turkish_lower(corr)

        if not orig and not corr:
            return "lexical"

        punctuation_regex = r"^[.,!?;:()\"\'\-]+$"
        if re.match(punctuation_regex, corr) or (orig and not corr and re.match(punctuation_regex, orig)):
            return "punctuation"

        # TÜRKÇE KARAKTER KONTROLÜ (Artık kusursuz çalışacak)
        turkish_map = str.maketrans("çğıöşü", "cgiosu")
        if orig_l != corr_l and orig_l.translate(turkish_map) == corr_l.translate(turkish_map):
            return "deascii"

        # İNGİLİZCE ÇEKİM EKLERİ KONTROLÜ (grammar tespiti için)
        if len(orig_l) > 2 and len(corr_l) > 2:
            if corr_l == orig_l + "s" or corr_l == orig_l + "es" or corr_l == orig_l + "d" or corr_l == orig_l + "ed" or corr_l == orig_l + "ing" or orig_l == corr_l + "s":
                return "grammar"

        if orig_l == corr_l and orig != corr:
            return "capitalization" if is_start_of_sentence else "terminology"

        grammar_words = {
            "a", "an", "the", "in", "on", "at", "to", "for", "of", "with", "by", "from",
            "is", "are", "am", "was", "were", "has", "have", "had", "do", "does", "did",
            "their", "there", "they're", "its", "it's", "your", "you're", "whose", "who's",
            "than", "then"
        }
        if orig_l in grammar_words or corr_l in grammar_words:
            return "grammar"

        if corr and corr[0].isupper() and not is_start_of_sentence:
            return "terminology"

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
    
    def _align_replace_block(self, sub_orig, sub_corr):
        if len(sub_orig) <= 1 or len(sub_corr) <= 1:
            return [{"original": " ".join(sub_orig), "corrected": " ".join(sub_corr)}]
        
        best_ratio = 0
        best_pair = None
        
        for i, o in enumerate(sub_orig):
            for j, c in enumerate(sub_corr):
                ratio = SequenceMatcher(None, o.lower(), c.lower()).ratio()
                if ratio > 0.75 and ratio > best_ratio:
                    best_ratio = ratio
                    best_pair = (i, j)
        
        if best_pair:
            i, j = best_pair
            left = self._align_replace_block(sub_orig[:i], sub_corr[:j])
            pivot = [{"original": sub_orig[i], "corrected": sub_corr[j]}]
            right = self._align_replace_block(sub_orig[i+1:], sub_corr[j+1:])
            
            return [x for x in (left + pivot + right) if x["original"] or x["corrected"]]
        else:
            return [{"original": " ".join(sub_orig), "corrected": " ".join(sub_corr)}]
        
    def _extract_corrections(self, original_text, corrected_text):
        token_pattern = r"[\wüçşığöİÜÇŞĞÖ]+(?:['’][\wüçşığöİÜÇŞĞÖ]+)*|[^\w\s]"
        orig_tokens = re.findall(token_pattern, original_text)
        corr_tokens = re.findall(token_pattern, corrected_text)

        # BURASI ÇOK ÖNEMLİ: Token'ları da kendi türkçe lower fonksiyonumuzla küçültüyoruz
        orig_tokens_lower = [self._turkish_lower(t) for t in orig_tokens]
        corr_tokens_lower = [self._turkish_lower(t) for t in corr_tokens]

        matcher = SequenceMatcher(None, orig_tokens_lower, corr_tokens_lower)
        verified_corrections = []

        for tag, i1, i2, j1, j2 in matcher.get_opcodes():
            sub_orig = orig_tokens[i1:i2]
            sub_corr = corr_tokens[j1:j2]
            
            # CÜMLE BAŞI (Kısaltmaları atlayan) KONTROLÜ
            is_start = False
            if j1 == 0:
                is_start = True
            else:
                abbreviations = ['dr.', 'mr.', 'mrs.', 'prof.', 'vs.', 'st.']
                for prev_idx in range(j1 - 1, -1, -1):
                    prev_token = corr_tokens[prev_idx]
                    if prev_token in ['.', '!', '?']:
                        if prev_idx > 0:
                            combined = (corr_tokens[prev_idx-1] + prev_token).lower()
                            if combined in abbreviations:
                                is_start = False
                                break
                        is_start = True
                        break
                    elif re.match(r'^\w+$', prev_token): 
                        break

            if tag == 'equal':
                for k in range(len(sub_orig)):
                    o = sub_orig[k]
                    c = sub_corr[k]
                    if o != c:
                        err_type = self._determine_error_type(o, c, is_start and (k==0))
                        verified_corrections.append({
                            "original": o,
                            "corrected": c,
                            "type": err_type,
                            "explanation": self._get_explanation(err_type)
                        })

            elif tag == 'replace':
                aligned_blocks = self._align_replace_block(sub_orig, sub_corr)
                for block in aligned_blocks:
                    o = block["original"]
                    c = block["corrected"]
                    o = re.sub(r'\s+([.,!?;:])', r'\1', o)
                    c = re.sub(r'\s+([.,!?;:])', r'\1', c)
                    
                    if o != c:
                        err_type = self._determine_error_type(o, c, is_start)
                        verified_corrections.append({
                            "original": o,
                            "corrected": c,
                            "type": err_type,
                            "explanation": self._get_explanation(err_type)
                        })

            elif tag == 'insert':
                c = " ".join(sub_corr)
                c = re.sub(r'\s+([.,!?;:])', r'\1', c)
                err_type = self._determine_error_type("", c, is_start)
                verified_corrections.append({
                    "original": "",
                    "corrected": c,
                    "type": err_type,
                    "explanation": self._get_explanation(err_type)
                })

            elif tag == 'delete':
                o = " ".join(sub_orig)
                o = re.sub(r'\s+([.,!?;:])', r'\1', o)
                err_type = self._determine_error_type(o, "", False)
                verified_corrections.append({
                    "original": o,
                    "corrected": "",
                    "type": err_type,
                    "explanation": "Gereksiz karakter veya kelime temizlendi."
                })

        return verified_corrections

    def _merge_and_sort_corrections(self, regex_list, ai_list):
        regex_explanations = {c.get("corrected", "").lower(): c.get("explanation") for c in regex_list}
        for c in ai_list:
            corr_lower = c.get("corrected", "").lower()
            if corr_lower in regex_explanations:
                c["explanation"] = regex_explanations[corr_lower]
        return ai_list

    # =========================================================================
    # BÜYÜK METİNLERİ (10.000 Karakter) PARÇALAYIP İŞLEYEN FONKSİYON
    # =========================================================================
    def process_large_text(self, text):
        if len(text) < 2500:
            return self.process(text)

        print(f"📦 Devasa metin algılandı ({len(text)} karakter). Parçalama işlemi (Chunking) başlatılıyor...")

        # 1. Metni Paragraflara Böl (Çift Enter veya Nokta'dan)
        paragraphs = [p.strip() for p in text.split('\n\n') if p.strip()]
        
        # Eğer yazar hiç Enter'a basmamış, dümdüz 10.000 karakter yazmışsa; bu kez metni noktalardan bölüyoruz.
        if len(paragraphs) == 1:
            paragraphs = [p.strip() + '.' for p in text.split('. ') if p.strip()]

        combined_corrected_text = []
        combined_corrections = []
        total_time_ms = 0
        total_regex_count = 0
        total_neural_count = 0

        # 2. Her Bir Parçayı (Chunk) Sırayla LLM'e Gönder ve Yorulmadan İşlemesini Sağla
        for i, chunk in enumerate(paragraphs):
            print(f"⏳ İşleniyor: Parça {i+1}/{len(paragraphs)} ({len(chunk)} karakter)")
            
            # Parçayı asıl LLM motoruna gönder
            result = self.process(chunk)
            
            combined_corrected_text.append(result["correctedText"])
            combined_corrections.extend(result["corrections"])
            
            # Telemetri metriklerini (Geçen süre vb.) topla
            meta = result.get("metadata", {})
            total_time_ms += meta.get("processing_time_ms", 0)
            total_regex_count += meta.get("regex_count", 0)
            total_neural_count += meta.get("neural_count", 0)

        # 3. Tüm Parçalar Bittiğinde Hepsini Tek Bir Metin Olarak Yeniden Birleştir
        final_text = "\n\n".join(combined_corrected_text)
        
        print(f"✅ Büyük metin analizi tamamlandı! Toplam Süre: {total_time_ms}ms")

        # 4. React Arayüzüne Orijinal API Formatında Dön
        return {
            "originalText": text,
            "correctedText": final_text,
            "corrections": combined_corrections,
            "metadata": {
                "regex_count": total_regex_count,
                "neural_count": total_neural_count,
                "processing_time_ms": total_time_ms,
                "mode": "chunked_processing",
                "chunks_processed": len(paragraphs)
            }
        }

    # Asıl Llama 3.1 İşleme Fonksiyonu (Tekil Parçalar İçin)
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
        needed_space = int(prompt_token_count * 1.5) + 1500        
        safe_max_tokens = min(max_available_space, needed_space)

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