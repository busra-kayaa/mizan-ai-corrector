# ⚖️ Mizan

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Python](https://img.shields.io/badge/python-3.10+-blue.svg)
![React](https://img.shields.io/badge/react-18.x-61dafb.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688.svg)
![Llama](https://img.shields.io/badge/AI_Engine-Llama_3.1_8B-FF4500.svg)

**Mizan**, İngilizce metinler için geliştirilmiş, deterministik kural tabanlı algoritmalar ile **Llama 3.1** nöral ağlarını birleştiren yüksek performanslı hibrit bir metin normalizasyon ve düzeltme ekosistemidir. 

**TRT Bilgi Teknolojileri Dairesi Başkanlığı** standartları çerçevesinde prototiplenen bu sistem; kurumsal terminolojiyi korurken, dilbilgisi ve yazım hatalarını sıfıra yakın hata payıyla atomik düzeyde analiz eder.

---

## ✨ Öne Çıkan Özellikler

* **🚀 Hibrit Motor (Regex + LLM):** Kural tabanlı katman ile milisaniyelik ön temizlik yapar, ardından Llama-3.1-8B modeli ile derin bağlamsal analiz gerçekleştirir.
* **🧩 Atomik Düzeltme & Sınıflandırma:** Hataları bütünsel olarak değil; *Dilbilgisi, Terminoloji, Tipografi, Türkçe Karakter (Deascii)* gibi farklı kategorilerde atomik olarak parçalar ve raporlar.
* **🔒 %100 Yerel & Güvenli:** Veriler hiçbir bulut servisine çıkmaz. Model tamamen yerel (Local) sunucuda koşar.
* **📂 Toplu Dosya Analizi (Batch Processing):** `.txt`, `.md`, `.docx`, `.pdf`, `.csv` ve `.srt` dosyalarını sürükle-bırak yöntemiyle asenkron olarak işler.
* **🛡️ Enterprise-Grade Güvenlik:** Katı CORS politikaları, IP tabanlı Rate-Limiting ve detaylı HTTP Hata Yönetimi.

### 🎯 7 Katmanlı Hata Sınıflandırması
Sistem, tespit ettiği hataları sadece "düzeltildi" deyip geçmez, atomik olarak sınıflandırır:
1. **Deascii:** Türkçe karakter eksiklikleri (örn: *Turkiye* ➔ *Türkiye*)
2. **Punctuation:** Noktalama işareti eksiklikleri veya fazlalıkları
3. **Capitalization:** Cümle başı veya özel isim büyük/küçük harf hataları
4. **Grammar:** Edat (in, on, at) veya yapısal dilbilgisi hataları
5. **Terminology:** Kurumsal dil veya özel isim (CEO, Google) hataları
6. **Typographic:** Harf atlamaları ve klavye sürçmeleri (örn: *taked* ➔ *taken*)
7. **Lexical:** Bağlama uymayan yanlış kelime seçimleri

---

## 🛠️ Teknoloji Yığını (Tech Stack)

### Backend (Core Engine)
* **Dil:** Python 3.10+
* **Framework:** FastAPI (Asenkron REST API)
* **Yapay Zeka:** `llama-cpp-python` (GGUF desteği ile CPU/GPU optimizasyonu)
* **Model:** Meta-Llama-3.1-8B-Instruct (Q4_K_M Quantized)

### Frontend (Client)
* **Kütüphane:** React (TypeScript)
* **Derleyici:** Vite
* **Stilleme:** Tailwind CSS (Özel Light/Dark Mode pastel tema)
* **İkonlar:** Lucide React

---

## 🚀 Kurulum ve Çalıştırma (Local Setup)

Proje `backend` ve `frontend` olmak üzere iki ana modülden oluşmaktadır. Çalıştırmak için aşağıdaki adımları sırasıyla izleyin.

### 1. Repoyu Klonlayın

Aşağıdaki komutu terminalinize yapıştırarak projeyi bilgisayarınıza indirin:

```bash
git clone https://github.com/busra-kayaa/mizan-ai-corrector.git
cd mizan-ai-corrector
```

### 2. Yapay Zeka Modelini İndirin (Zorunlu)

GitHub dosya boyutu sınırları nedeniyle devasa LLM modeli repoya dahil edilmemiştir. Sistemi çalıştırmak için modeli indirmeniz gerekmektedir:

1. Mizan için özel olarak hazırlanan modeli indirmek üzere aşağıdaki Hugging Face reposuna gidin:
   🔗 **[📥 Busra06/Mizan-V4-Llama3.1-GGUF](https://huggingface.co/Busra06/Mizan-V4-Llama3.1-GGUF)**
2. Açılan sayfada **"Files and versions"** sekmesine tıklayın ve oradaki `.gguf` uzantılı modeli bilgisayarınıza indirin.
3. İndirdiğiniz dosyayı projedeki `backend/models/` klasörünün içine yerleştirin.
4. Dosya adının tam olarak `Meta-Llama-3.1-8B.Q4_K_M.gguf` olduğundan emin olun.

### 3. Backend'i Başlatın

Terminalinizde sırasıyla aşağıdaki komutları çalıştırarak sunucuyu ayağa kaldırın:

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py
```

*(Not: Windows kullanıcıları sanal ortamı aktifleştirmek için `source venv/bin/activate` yerine `venv\Scripts\activate` komutunu kullanmalıdır.)*

### 4. Frontend'i Başlatın

Yeni bir terminal sekmesi açın ve arayüzü başlatmak için şu komutları girin:

```bash
cd frontend
npm install
npm run dev
```

---

## 📡 API Referansı

Mizan, diğer sistemlerin entegre olabilmesi için standart RESTful API sunar.

### Tekil Analiz Modeli

**cURL İsteği (Request):**

Aşağıdaki komut ile sisteme doğrudan analiz edilmesini istediğiniz metni gönderebilirsiniz:

```bash
curl -X POST "http://localhost:8000/analyze" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "The goverment in Turkiye has taked a new decision yesterday."
  }'
```

**Başarılı Yanıt (Response):**

İşlem tamamlandığında dönen, düzeltmeleri ve sistem metriklerini barındıran JSON objesi:

```json
{
  "originalText": "The goverment in Turkiye has taked a new decision yesterday.",
  "correctedText": "The government in Türkiye has taken a new decision yesterday.",
  "corrections": [
    {
      "original": "goverment",
      "corrected": "government",
      "type": "typographic",
      "explanation": "Tipografik harf veya klavye hatası düzeltildi."
    },
    {
      "original": "Turkiye",
      "corrected": "Türkiye",
      "type": "deascii",
      "explanation": "Türkçe karakter eksikliği veya hatası düzeltildi."
    },
    {
      "original": "taked",
      "corrected": "taken",
      "type": "typographic",
      "explanation": "Tipografik harf veya klavye hatası düzeltildi."
    }
  ],
  "metadata": {
    "regex_count": 1,
    "neural_count": 2,
    "processing_time_ms": 1845.12,
    "char_count": 60
  }
}
```

---

## 🧠 Akıllı Pipeline (İşlem Hattı) Mimarisi

* **Thread-Safe Model Engine:** Çoklu API isteklerinde (Concurrency) modelin çökmesini engellemek için `threading.Lock()` ile güvenli kuyruk yönetimi.
* **Geniş Bağlam Penceresi:** `n_ctx=8192` token desteği ile tek seferde uzun paragrafların hafıza kaybı yaşamadan işlenmesi.
* **Smart Token Allocation:** Gelen metnin uzunluğuna göre modelin yanıt alanını (`safe_max_tokens`) dinamik hesaplayan anti-overflow sistemi.
* **Graceful Fallback (Güvenli Düşüş):** Metin LLM'in sınırlarını aşarsa API çökmez, sistem otomatik olarak "Regex Fallback" moduna geçerek temel düzeltmeleri garanti eder.
* **Sequence Matcher Tokenization:** Orijinal metin ile düzeltilmiş metin arasındaki farkı `difflib.SequenceMatcher` ile kelime ve noktalama bazında atomik olarak eşleştirir.

---

## 🏗️ Proje Mimarisi

Sistemin klasör yapısı ve modüllerin (Clean Architecture) dağılımı aşağıdaki gibidir:

```text
MIZAN-AI-CORRECTOR/
├── backend/
│   ├── core/              # Regex kural motorları ve NLP mantığı
│   ├── models/            # .gguf formatındaki yerel LLM modelleri
│   ├── main.py            # FastAPI sunucusu ve Endpoint rotaları
│   ├── pipeline.py        # Hibrit işlem hattı (Orkestrasyon)
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── core/          # Sabitler (Constants), Context'ler ve Stiller
│   │   ├── domain/        # Varlıklar (Entities) ve Kullanım Senaryoları (Usecases)
│   │   ├── infrastructure/# Dış servis bağlantıları (ApiService.ts)
│   │   ├── presentation/  # UI Bileşenleri, Sayfalar, Hook'lar ve Rotalar
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env               # Ortam değişkenleri
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── .gitignore
└── README.md
```

---
*Bu proje, modern doğal dil işleme mimarileri ve kullanıcı dostu arayüz tasarımı üzerine bir AR-GE çalışmasıdır.*
