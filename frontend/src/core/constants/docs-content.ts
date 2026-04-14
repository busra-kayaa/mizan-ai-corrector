// Docs navigation menu structure
export const DOCS_MENU = [
    { id: "about", label: "Mizan Servisi Hakkında", path: "/how-to-use", iconName: "BookOpen" },
    { id: "authentication", label: "Güvenlik & Erişim", path: "/how-to-use/authentication", iconName: "ShieldCheck" },
    { id: "errors", label: "Hatalar", path: "/how-to-use/errors", iconName: "AlertTriangle" },
    { id: "metadata", label: "Meta Veriler", path: "/how-to-use/metadata", iconName: "Braces" },
    { id: "versioning", label: "Sürümleme", path: "/how-to-use/versioning", iconName: "GitBranch" },
];

export const MIZAN_BASE_URL = "http://localhost:8000";

export const AUTH_CODE_SAMPLES: Record<string, { label: string; language: string; code: string }> = {
    curl: {
        label: "cURL",
        language: "bash",
        code: `curl -X POST "${MIZAN_BASE_URL}/analyze" \\
     -H "Content-Type: application/json" \\
     -d '{
        "text": "The goverment in Turkiye has taked a new decision yesterday."
     }'`,
    },
    python: {
        label: "Python",
        language: "python",
        code: `import requests

url = "${MIZAN_BASE_URL}/analyze"
headers = {
    "Content-Type": "application/json"
    # Not: İstekler yetkilendirilmiş kök alan adlarından (CORS) gelmelidir.
}
payload = {
    "text": "The goverment in Turkiye has taked a new decision yesterday."
}

response = requests.post(url, headers=headers, json=payload)
print(response.json())`,
    },
    typescript: {
        label: "TypeScript",
        language: "typescript",
        code: `const analyzeText = async () => {
  const response = await fetch("${MIZAN_BASE_URL}/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: "The goverment in Turkiye has taked a new decision yesterday.",
    }),
  });

  if (!response.ok) throw new Error(\`HTTP Error: \${response.status}\`);
  
  const data = await response.json();
  console.log(data);
};`,
    },
    java: {
        label: "Java",
        language: "java",
        code: `import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class Main {
    public static void main(String[] args) throws Exception {
        HttpClient client = HttpClient.newHttpClient();

        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create("${MIZAN_BASE_URL}/analyze"))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString("""
                {
                    "text": "The goverment in Turkiye has taked a new decision yesterday."
                }
                """))
            .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        System.out.println(response.body());
    }
}`,
    },
    php: {
        label: "PHP",
        language: "php",
        code: `<?php
$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, "${MIZAN_BASE_URL}/analyze");
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "text" => "The goverment in Turkiye has taked a new decision yesterday."
]));
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
curl_close($ch);

echo $response;
?>`,
    },
    go: {
        label: "Go",
        language: "go",
        code: `package main

import (
    "bytes"
    "fmt"
    "net/http"
    "io/ioutil"
)

func main() {
    url := "${MIZAN_BASE_URL}/analyze"
    payload := []byte(\`{"text": "The goverment in Turkiye has taked a new decision yesterday."}\`)

    req, _ := http.NewRequest("POST", url, bytes.NewBuffer(payload))
    req.Header.Set("Content-Type", "application/json")

    client := &http.Client{}
    resp, _ := client.Do(req)
    defer resp.Body.Close()

    body, _ := ioutil.ReadAll(resp.Body)
    fmt.Println(string(body))
}`,
    },
    ruby: {
        label: "Ruby",
        language: "ruby",
        code: `require 'uri'
require 'net/http'
require 'json'

uri = URI('${MIZAN_BASE_URL}/analyze')
http = Net::HTTP.new(uri.host, uri.port)

request = Net::HTTP::Post.new(uri.path, {'Content-Type' => 'application/json'})
request.body = {
  text: "The goverment in Turkiye has taked a new decision yesterday."
}.to_json

response = http.request(request)
puts response.body`,
    }
};

export const HTTP_STATUS_CODES = [
    { code: 200, label: "OK", description: "Metin başarıyla analiz edildi ve düzeltildi." },
    { code: 400, label: "Bad Request", description: "Geçersiz istek. Metin alanı boş veya limitlerin dışında (1-10000 karakter)." },
    { code: 403, label: "Forbidden", description: "CORS Hatası. İstek atılan alan adı (Domain) izinli listesinde değil." },
    { code: 422, label: "Unprocessable Entity", description: "Gönderilen veri Pydantic şema doğrulamalarından geçemedi." },
    { code: 429, label: "Too Many Requests", description: "Rate limit aşıldı. Lütfen bekleyin (Limit: 20 istek/dakika)." },
    { code: 500, label: "Internal Server Error", description: "Model işleme sırasında beklenmedik bir motor hatası oluştu." },
    { code: 503, label: "Service Unavailable", description: "Yapay zeka modeli henüz belleğe yüklenmedi, lütfen bekleyip tekrar deneyin." },
];

// Error types with descriptions
export const API_ERROR_TYPES = [
    { type: "validation_error", statusCodes: "400, 422", description: "Gönderilen istek payload'u hatalı. 'text' parametresi eksik veya çok uzun olabilir." },
    { type: "cors_policy_error", statusCodes: "403", description: "Güvenlik ihlali. Tarayıcı üzerinden yapılan istek, yetkilendirilmemiş bir web sitesinden geliyor." },
    { type: "rate_limit_error", statusCodes: "429", description: "IP adresiniz için belirlenen 'dakikada 20 istek' limiti aşıldı." },
    { type: "model_loading_error", statusCodes: "503", description: "Mizan Hibrit Motoru henüz hazır değil (Lifespan yükleniyor)." },
    { type: "inference_error", statusCodes: "500", description: "Metin analiz edilirken LLM katmanında beklenmedik bir çökme meydana geldi." },
];

// Error response example (FastAPI standartlarına göre)
export const ERROR_RESPONSE_EXAMPLE = {
    detail: "Too many requests. Please try again later."
};

// 422 Validation Error example (Pydantic formatı)
export const VALIDATION_ERROR_EXAMPLE = {
    detail: [
        {
            loc: ["body", "text"],
            msg: "ensure this value has at most 10000 characters",
            type: "value_error.any_str.max_length"
        }
    ]
};

export const METADATA_REQUEST = {
    text: "The goverment in Turkiye has taked a new decision yesterday."
};

export const METADATA_RESPONSE = {
    originalText: "The goverment in Turkiye has taked a new decision yesterday.",
    correctedText: "The government in Türkiye has taken a new decision yesterday.",
    corrections: [
        {
            original: "goverment",
            corrected: "government",
            type: "typographic",
            explanation: "Tipografik harf veya klavye hatası düzeltildi."
        },
        {
            original: "Turkiye",
            corrected: "Türkiye",
            type: "deascii",
            explanation: "Türkçe karakter eksikliği veya hatası düzeltildi."
        },
        {
            original: "taked",
            corrected: "taken",
            type: "typographic",
            explanation: "Tipografik harf veya klavye hatası düzeltildi."
        },
    ],
    metadata: {
        regex_count: 1,
        neural_count: 2,
        processing_time_ms: 1845.12,
        char_count: 60
    }
};

// Request body parameters documentation
export const REQUEST_PARAMS = [
    { name: "text", type: "string", required: true, description: "Analiz edilecek ve düzeltilecek kaynak metin (Min 1, Max 10.000 karakter)." },
];

// Response body parameters documentation
export const RESPONSE_PARAMS = [
    { name: "originalText", type: "string", description: "API'ye gönderdiğiniz dokunulmamış kaynak metin." },
    { name: "correctedText", type: "string", description: "Mizan tarafından kural ve LLM bazlı düzeltilmiş nihai metin." },
    { name: "corrections", type: "array", description: "Yapılan tüm düzeltmelerin detaylarını içeren liste." },
    { name: "corrections[].original", type: "string", description: "Metindeki hatalı parça (Kelime eklenmişse boş string '' döner)." },
    { name: "corrections[].corrected", type: "string", description: "Hatalı parçanın düzeltilmiş hali (Kelime silinmişse boş string '' döner)." },
    { name: "corrections[].type", type: "string", description: 'Hatanın sınıfı (Örn: "grammar", "punctuation", "terminology", "lexical", "typographic").' },
    { name: "corrections[].explanation", type: "string", description: "Düzeltmenin neden yapıldığını açıklayan geri bildirim." },
    { name: "metadata", type: "object", description: "İşlem ile ilgili performans ve hibrit motor verileri." },
    { name: "metadata.regex_count", type: "integer", description: "Hızlı kural tabanlı (Regex) katmanı tarafından yapılan düzeltme sayısı." },
    { name: "metadata.neural_count", type: "integer", description: "Yapay zeka (LLM) katmanı tarafından yapılan düzeltme sayısı." },
    { name: "metadata.processing_time_ms", type: "float", description: "Metnin API tarafından analiz edilme süresi (Milisaniye)." },
    { name: "metadata.char_count", type: "integer", description: "Analiz edilen metnin toplam karakter sayısı." },
];

// Versioning info
export const VERSION_COMPARISON = {
    v3: {
        version: "V3 (Legacy)",
        baseUrl: `${MIZAN_BASE_URL}/api/v3/analyze`,
        maxChars: 5000,
        status: "Kullanımdan Kaldırıldı",
        description: "Sadece Regex ve basit kural tabanlı düzeltmeler yapan eski nesil analiz motoru.",
    },
    v4: {
        version: "V4 (Current Hybrid)",
        baseUrl: `${MIZAN_BASE_URL}/analyze`,
        maxChars: 10000,
        status: "Aktif",
        description: "Regex kuralları ile Llama 3.1 LLM modelini birleştiren gelişmiş, bağlama duyarlı güncel motor.",
    },
};