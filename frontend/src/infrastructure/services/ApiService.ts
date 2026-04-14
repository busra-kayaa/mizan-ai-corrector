import { AnalysisResponse } from "../../domain/entities/Analysis";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const ApiService = {
    /**
     * Tekil Analiz (Derinlemesine Yapay Zeka Analizi)
     * @param text Analiz edilecek metin
     */
    async analyzeText(text: string): Promise<AnalysisResponse> {
        
        const response = await fetch(`${API_BASE_URL}/analyze`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text })
        });

        if (!response.ok) {
            if (response.status === 403) throw new Error("Erişim Reddedildi: Alan adınız (Domain) izinli listesinde değil (CORS).");
            if (response.status === 429) throw new Error("Çok fazla istek gönderildi. Lütfen bir süre bekleyin.");
            if (response.status === 422) throw new Error("Geçersiz metin formatı veya karakter sınırı aşıldı.");
            if (response.status === 499) throw new Error("İşlem kullanıcı tarafından iptal edildi."); // İsteğe bağlı eklendi
            if (response.status === 503) throw new Error("Mizan motoru şu an başlatılıyor, lütfen birkaç saniye sonra tekrar deneyin.");
            throw new Error(`Mizan API Hatası: ${response.status}`);
        }

        const data = await response.json();
        return data as AnalysisResponse; 
    },

    /**
     * Toplu Analiz (Büyük dosyaları sunucuda işlemek için)
     * @param texts Analiz edilecek metin blokları/satırları dizisi
     */
    async batchAnalyze(texts: string[]): Promise<any> {
        const response = await fetch(`${API_BASE_URL}/batch`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ texts }) 
        });

        if (!response.ok) {
            if (response.status === 429) throw new Error("Çok fazla istek gönderildi. Lütfen bir süre bekleyin.");
            throw new Error(`Toplu analiz başarısız oldu: HTTP ${response.status}`);
        }

        return await response.json();
    }
};