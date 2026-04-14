import { ApiService } from "../../infrastructure/services/ApiService";
import { AnalysisResponse } from "../entities/Analysis";

export class AnalyzeTextUseCase {
    /**
     * @param text Analiz edilecek metin
     */
    async execute(text: string): Promise<AnalysisResponse> {
        if (!text.trim()) {
            throw new Error("Metin boş olamaz.");
        }

        try {
            const apiData = await ApiService.analyzeText(text);

            return {
                originalText: apiData.originalText, 
                correctedText: apiData.correctedText,              
                corrections: apiData.corrections,
                
                metadata: apiData.metadata, 
                
                score: 1.0, 
                timestamp: new Date().toISOString(),
                feedback: null
            };
            
        } catch (error: any) {
            console.error("API'ye ulaşılamadı:", error);
            throw new Error(error.message || "Sunucu bağlantı hatası! Lütfen backend'in çalıştığından emin olun.");
        }
    }
}