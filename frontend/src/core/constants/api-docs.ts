export const USAGE_STEPS = [
    {
        iconName: "FileText",
        title: "1. Metin Girin",
        description: "Analiz etmek istediğiniz metni giriş alanına yazın veya yapıştırın.",
    },
    {
        iconName: "Zap",
        title: "2. Analiz Et",
        description: '"Analiz Et" butonuna tıklayarak işlemi başlatın.',
    },
    {
        iconName: "CheckCircle",
        title: "3. Sonucu Görün",
        description: "Hibrit motorumuz (Kural + LLM) sonucu saniyeler içinde size iletecektir.",
    },
];

export const CODE_SAMPLES = {
    shell: {
        language: "bash",
        label: "cURL",
        code: `curl -X POST "http://localhost:8000/analyze" \\
  -H "Content-Type: application/json" \\
  -d '{
    "text": "Prezident Barrack Obamma met with Chancelor Angela Merkal in Berln to discuss the Europeen Union's econimic policies."
  }'`
    },
    python: {
        language: "python",
        label: "Python",
        code: `import requests

url = "http://localhost:8000/analyze"
headers = {
    "Content-Type": "application/json"
    # CORS koruması devrede olduğu için API Anahtarına gerek yoktur.
}
data = {
    "text": "Prezident Barrack Obamma met with Chancelor Angela Merkal in Berln to discuss the Europeen Union's econimic policies."
}

response = requests.post(url, json=data, headers=headers)
print(response.json())`
    },
    typescript: {
        language: "typescript",
        label: "TypeScript",
        code: `import axios from 'axios';

const analyzeText = async (text: string) => {
  const { data } = await axios.post('http://localhost:8000/analyze', {
    text: text
  }, {
    headers: { 'Content-Type': 'application/json' }
  });
  
  return data;
};`
    }
};

export const SYSTEM_PROMPT_EXAMPLE = {
    title: "Bağlamsal Analiz Modu",
    description: "Analiz motoruna özel bir rol tanımlayarak (örn: Hukuki Çeviri Denetmeni) daha spesifik sonuçlar alabilirsiniz.",
    payload: {
        system_instructions: "You are a professional TRT World news editor. Ensure grammatical accuracy and formal tone.",
        text: "The diplomatic relations has reached a turning point.",
    },
    response: {
        originalText: "The diplomatic relations has reached a turning point.",
        correctedText: "Diplomatic relations have reached a turning point.",
        corrections: [
            {
                original: "The diplomatic",
                corrected: "Diplomatic",
                type: "grammar",
                explanation: "Genel kavramlardan bahsederken 'The' makalesi kullanılmaz."
            },
            {
                original: "has",
                corrected: "have",
                type: "grammar",
                explanation: "Çoğul özneler (relations) 'have' yardımcı fiilini alır."
            }
        ],
        metadata: {
            processing_time_ms: 1240,
            regex_count: 0,
            neural_count: 2
        }
    }
};

export const API_EXAMPLES = {
    main: {
        endpoint: "/analyze",
        payload: {
            text: "Prezident Barrack Barrack Obamma met with Chancelor Angela Merkal in Berln to discuss the Europeen Union's econimic policies.",
        },
        response: {
            status: "200",
            data: {
                originalText: "Prezident Barrack Obamma met with Chancelor Angela Merkal in Berln to discuss the Europeen Union's econimic policies.",
                correctedText: "President Barack Obama met with Chancellor Angela Merkel in Berlin to discuss the European Union's economic policies.",
                corrections: [
                    { original: "Prezident", corrected: "President", type: "typographic", explanation: "Tipografik harf veya klavye hatası düzeltildi." },
                    { original: "Barrack", corrected: "Barack", type: "terminology", explanation: "Özel isim veya terminoloji hatası düzeltildi." },
                    { original: "Obamma", corrected: "Obama", type: "terminology", explanation: "Özel isim veya terminoloji hatası düzeltildi." },
                    { original: "Chancelor", corrected: "Chancellor", type: "terminology", explanation: "Özel isim veya terminoloji hatası düzeltildi." },
                    { original: "Merkal", corrected: "Merkel", type: "terminology", explanation: "Özel isim veya terminoloji hatası düzeltildi." },
                    { original: "Berln", corrected: "Berlin", type: "terminology", explanation: "Özel isim veya terminoloji hatası düzeltildi." },
                    { original: "Europeen", corrected: "European", type: "terminology", explanation: "Özel isim veya terminoloji hatası düzeltildi." },
                    { original: "econimic", corrected: "economic", type: "typographic", explanation: "Tipografik harf veya klavye hatası düzeltildi." }
                ],
                metadata: {
                    regex_count: 0,
                    neural_count: 8
                }
            },
        },
    },
    quickCheck: {
        endpoint: "/quick-check",
        payload: {
            text: "The meeting was postponned indefinitly."
        },
        response: {
            originalText: "The meeting was postponned indefinitly.",
            correctedText: "The meeting was postponed indefinitely.",
            corrections: [
                {
                    original: "postponned indefinitly",
                    corrected: "postponed indefinitely",
                    type: "typographic",
                    explanation: "Tipografik harf veya klavye hatası düzeltildi."
                }
            ],
            metadata: {
                regex_count: 1,
                neural_count: 0
            }
        },
    },
    batch: {
        endpoint: "/batch",
        payload: {
            texts: [
                "Success is not final, failure is not fatal.",
                "The early bird catch the worm."
            ]
        },
        response: {
            results: [
                { status: "success", correctedText: "Success is not final; failure is not fatal." },
                { status: "success", correctedText: "The early bird catches the worm." },
            ],
            metadata: { 
                total_processed: 2, 
                processing_time_ms: 2100,
                regex_count: 0,
                neural_count: 2
            }
        },
    },
    error401: { 
        detail: "CORS policy violation: Origin 'http://localhost:5173' is not allowed." 
    },
    error429: { 
        detail: "Too many requests. Please try again later." 
    },
};