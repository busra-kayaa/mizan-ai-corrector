import re

class RuleBasedCorrector:
    def __init__(self):
        # 8 Kategorili Akademik Sözlük
        self.strict_map = {
            'Burma': ('Myanmar', 'terminology', "Resmi ülke adı 'Myanmar' olarak güncellendi."),
            'Swaziland': ('Eswatini', 'terminology', "Resmi ülke adı 'Eswatini' olarak güncellendi."),
            'Czech Republic': ('Czechia', 'terminology', "Ülkenin kısa resmi adı 'Czechia' olarak güncellendi."),
            'Macedonia': ('North Macedonia', 'terminology', "Resmi isim 'North Macedonia' olarak güncellendi."),
            'Istanbul': ('İstanbul', 'deascii', "Özel isimdeki Türkçe karakter hatası düzeltildi."),
            'Izmir': ('İzmir', 'deascii', "Özel isimdeki Türkçe karakter hatası düzeltildi."),
            'Erdogan': ('Erdoğan', 'deascii', "Özel isimdeki Türkçe karakter hatası düzeltildi."),
            'Besiktas': ('Beşiktaş', 'deascii', "Özel isimdeki Türkçe karakter hatası düzeltildi.")
        }

        self.patterns = {
            re.compile(r'\b' + re.escape(wrong) + r'\b', re.IGNORECASE): data
            for wrong, data in self.strict_map.items()
        }

    def process(self, text):
        corrected_text = text
        corrections_list = []

        # 1. SÖZLÜK BAZLI DEĞİŞİMLER (Myanmar, Eswatini vb.)
        for pattern, (correct_form, error_label, explanation) in self.patterns.items():
            matches = list(pattern.finditer(corrected_text))
            if matches:
                for match in matches:
                    original_word = match.group()
                    if not any(c.get('original') == original_word for c in corrections_list):
                        corrections_list.append({
                            "original": original_word,
                            "corrected": correct_form,
                            "type": error_label,
                            "explanation": explanation
                        })
                corrected_text = pattern.sub(correct_form, corrected_text)

        # 2. FAZLALIK BOŞLUKLARI TEMİZLEME
        corrected_text = re.sub(r'\s+', ' ', corrected_text)
        corrected_text = re.sub(r'\s+([.,!?;:])', r'\1', corrected_text)

        # 3. YENİ EKLENEN: NOKTADAN/VİRGÜLDEN SONRA UNUTULAN BOŞLUKLARI EKLEME
        missing_space_pattern = r'([.?!,;:])([A-Za-zÇĞİÖŞÜçğıöşü])'
        
        matches = list(re.finditer(missing_space_pattern, corrected_text))
        if matches:
            for match in matches:
                orig_str = match.group(0)  # Örn: ".In" veya ",the"
                corr_str = f"{match.group(1)} {match.group(2)}"  # Örn: ". In" veya ", the"
                
                # Listede daha önce yoksa ekle (Duplicate olmasın diye)
                if not any(c.get('original') == orig_str for c in corrections_list):
                    corrections_list.append({
                        "original": orig_str,
                        "corrected": corr_str,
                        "type": "punctuation",
                        "explanation": "Noktalama işaretinden sonra unutulan boşluk eklendi."
                    })
            
            # Bulunan tüm hataları metin üzerinde tek seferde düzelt
            corrected_text = re.sub(missing_space_pattern, r'\1 \2', corrected_text)

        return corrected_text.strip(), corrections_list