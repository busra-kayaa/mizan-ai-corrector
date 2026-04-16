# ⚖️ Mizan

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Python](https://img.shields.io/badge/python-3.10+-blue.svg)
![React](https://img.shields.io/badge/react-18.x-61dafb.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688.svg)
![Llama](https://img.shields.io/badge/AI_Engine-Llama_3.1_8B-FF4500.svg)

**Mizan**, İngilizce metinler için geliştirilmiş, deterministik kural tabanlı algoritmalar ile **Llama 3.1** nöral ağlarını birleştiren yüksek performanslı hibrit bir metin normalizasyon ve düzeltme ekosistemidir. 

**TRT Bilgi Teknolojileri Dairesi Başkanlığı** standartları çerçevesinde prototiplenen bu sistem; kurumsal terminolojiyi korurken, dilbilgisi ve yazım hatalarını sıfıra yakın hata payıyla atomik düzeyde analiz eder.

---

## 📸 Arayüz & Dokümantasyon

### 1. Detaylı ve Atomik Analiz (Dark Mode)
![Mizan Analiz Sonucu](<img width="1912" height="866" alt="analyze_result_dark" src="https://github.com/user-attachments/assets/7d3ed13c-e286-45f5-b033-0468990478c4" />)
> *Llama 3.1 ve Regex motorunun tespit ettiği hataların kategorize edilmiş, detaylı görünümü.*

### 2. Gömülü API Referansı (Light Mode)
![Mizan API Dokümantasyonu](<img width="1912" height="867" alt="how-to-use_page_light" src="https://github.com/user-attachments/assets/cd6b16cc-63c9-4c38-a4e5-2f06576a3482" />
)
> *Geliştiriciler için doğrudan arayüze entegre edilmiş, modern REST API ve HTTP Durum Kodları dokümantasyonu.*

### 3. Kullanıcı Geri Bildirim Sistemi
![Mizan Geri Bildirim](<img width="1912" height="866" alt="dislike_page" src="https://github.com/user-attachments/assets/914a2b66-7500-48a7-be5a-b72236c23e70" />)
> *Yapay zeka modelini sürekli iyileştirmek (RLHF) için tasarlanmış detaylı geri bildirim mekanizması.*
---

## ✨ Öne Çıkan Özellikler

* **🚀 Hibrit Motor (Regex + LLM):** Kural tabanlı katman ile milisaniyelik ön temizlik yapar, ardından Llama-3.1-8B modeli ile derin bağlamsal analiz gerçekleştirir.
* **🧩 Atomik Düzeltme & Sınıflandırma:** Hataları bütünsel olarak değil; *Dilbilgisi, Terminoloji, Tipografi, Türkçe Karakter (Deascii)* gibi farklı kategorilerde atomik olarak parçalar ve raporlar.
* **📖 Gömülü (Built-in) API Dokümantasyonu:** Harici bir araca gerek kalmadan, doğrudan React arayüzü üzerinden erişilebilen kapsamlı geliştirici dokümantasyonu.
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

## 💡 Nasıl Kullanılır?

Mizan, hem son kullanıcılar hem de geliştiriciler için iki farklı kullanım katmanı sunar:

**1. Web Arayüzü (Son Kullanıcılar İçin):**
* Sistemi başlattıktan sonra tarayıcınızdan `http://localhost:5173` adresine gidin.
* **Metin Analizi:** Editöre metninizi yapıştırın ve "Analiz Et" butonuna basın. Hatalar atomik düzeyde (Tipografik, Deascii vb.) sınıflandırılarak renklendirilir.
* **Toplu Dosya İşleme (Batch):** Desteklenen formatlardaki dosyalarınızı sürükle-bırak yöntemiyle tek seferde işleyebilirsiniz.

**2. Gömülü API Referansı (Geliştiriciler İçin):**
* Arayüzdeki **"Nasıl Kullanılır"** sekmesine tıklayarak, harici bir araca ihtiyaç duymadan Mizan'ın detaylı API dokümantasyonuna ulaşabilirsiniz. Gömülü dokümantasyon şu başlıkları içerir:
  * 📖 **Mizan Servisi Hakkında:** Modern REST API standartları ve katı güvenlik mimarisi.
  * 🛡️ **Güvenlik & Erişim:** CORS politikaları ve kurum ağı entegrasyon süreçleri.
  * ⚠️ **Hatalar:** Detaylı HTTP durum kodları ve öngörülebilir hata nesneleri.
  * 📊 **Meta Veriler:** İstek (Request) / Yanıt (Response) şemaları ve telemetri parametreleri.
  * 📌 **Sürümleme:** Geleceğe dönük API versiyon kontrol stratejileri.

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
│   │   ├── core/          # Sabitler, global stiller ve context'ler
│   │   │   ├── constants/
│   │   │   ├── contexts/
│   │   │   └── styles/
│   │   ├── domain/        # İş mantığı (Usecases) ve Veri Modelleri (Entities)
│   │   │   ├── entities/
│   │   │   └── usecases/
│   │   ├── infrastructure/# Dış entegrasyonlar ve API servisleri
│   │   │   └── services/
│   │   │       └── ApiService.ts
│   │   ├── presentation/  # UI katmanı (Görünümler, bileşenler ve rotalar)
│   │   │   ├── components/
│   │   │   │   ├── docs/
│   │   │   │   ├── AnalysisResult.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── Header.tsx
│   │   │   │   └── Layout.tsx
│   │   │   ├── hooks/
│   │   │   ├── pages/
│   │   │   └── routes.tsx
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

## 👥 Geliştirici & Lisans

**Büşra Kaya** | *Software Developer*
* 💻 [GitHub Profilim](https://github.com/busra-kayaa)

📄 **Lisans:** Bu proje [MIT Lisansı](https://opensource.org/licenses/MIT) altında açık kaynak olarak paylaşılmıştır.

---
*Bu proje, modern doğal dil işleme mimarileri ve kullanıcı dostu arayüz tasarımı üzerine bir AR-GE çalışmasıdır.*
