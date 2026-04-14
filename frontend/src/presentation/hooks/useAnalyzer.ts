import * as mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist";
import { useMemo, useRef, useState } from "react";
import { AnalysisResponse } from "../../domain/entities/Analysis";
import { AnalyzeTextUseCase } from "../../domain/usecases/AnalyzeText";

import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.mjs?url";
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

export function useAnalyzer() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState<AnalysisResponse | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const abortControllerRef = useRef<AbortController | null>(null);
    const analyzeUseCase = useMemo(() => new AnalyzeTextUseCase(), []);

    const handleAnalyze = async () => {
        if (!input.trim() || isAnalyzing) return;

        const maxLength = 10000;
        if (input.length > maxLength) {
            setError(`Karakter sınırı aşıldı! En fazla ${maxLength} karakter girebilirsiniz. (Şu an: ${input.length})`);
            return;
        }

        abortControllerRef.current?.abort();
        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        setIsAnalyzing(true);
        setOutput(null); 
        setError(null);
        
        try {

            const response = await analyzeUseCase.execute(input); 
            
            if (abortController.signal.aborted) return;
            setOutput({ ...response, timestamp: new Date().toISOString() });
        } catch (err: any) {
            if (abortController.signal.aborted) return;
            const errorMessage = err instanceof Error ? err.message : "Metin analiz edilirken beklenmeyen bir sorun oluştu.";
            setError(errorMessage);
        } finally {
            if (!abortController.signal.aborted) {
                setIsAnalyzing(false);
            }
        }
    };

    const handleFileUpload = async (file: File) => {
        const allowedExtensions = ['.txt', '.md', '.csv', '.srt', '.docx', '.pdf'];
        const fileExtension = file.name.slice((file.name.lastIndexOf(".") - 1 >>> 0) + 2).toLowerCase();
        const isAllowed = allowedExtensions.includes(`.${fileExtension}`);

        if (!isAllowed) {
            setError("Lütfen sadece .txt, .md, .csv, .srt, .docx veya .pdf yükleyin.");
            return;
        }

        setError(null);
        setOutput(null);

        try {
            let content = "";

            if (fileExtension === 'pdf') {
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
                let fullText = "";
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    const pageText = textContent.items.map((item: any) => item.str).join(" ");
                    fullText += pageText + "\n";
                }
                content = fullText;
            } else if (fileExtension === 'docx') {
                const arrayBuffer = await file.arrayBuffer();
                const result = await mammoth.extractRawText({ arrayBuffer });
                content = result.value;
            } else {
                content = await file.text();
            }

            const combinedText = content.trim();
            
            if (!combinedText) {
                setError("Dosya içi boş veya okunabilir metin bulunamadı.");
                return;
            }

            const maxLength = 10000;
            
            if (combinedText.length > maxLength) {
                setInput(combinedText);
                setError(`Dosya boyutu sınırı aşıldı! Dosyadaki metin en fazla ${maxLength} karakter olabilir. (Okunan: ${combinedText.length})`);
                return;
            }

            setInput(combinedText);
        } catch (err: any) {
            console.error("Dosya Okuma Hatası:", err);
            const errorMessage = err instanceof Error ? err.message : "Dosya okunurken bir hata oluştu.";
            setError(errorMessage);
        }
    };

    const clearOutput = () => {
        if (abortControllerRef.current) abortControllerRef.current.abort();
        setIsAnalyzing(false);
        setOutput(null);
        setInput("");
        setError(null);
    };

    return { input, setInput, output, isAnalyzing, error, handleAnalyze, handleFileUpload, clearOutput };
}