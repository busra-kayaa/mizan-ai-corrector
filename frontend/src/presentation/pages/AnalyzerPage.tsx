import { AlertCircle, AlertTriangle, FileUp, Send, Trash2, X } from "lucide-react";
import { useState } from "react";
import { AnalysisResult } from "../components/AnalysisResult";
import { useAnalyzer } from "../hooks/useAnalyzer";

const EXAMPLE_SENTENCES = [
    "dr john went to the hospitel in newyork yestarday to meet with the goverment officials",
    "Goverment officials in london decided to cancel the big ben tour due to heavy rain?",
    "I am looking forword to hearing from you're team about the new procect.",
    "wall street suffers heavy losses as the stock market plummet due to intrest rate concerns.",
    "the unesco comittee added the ancient city of sanliurfa to the world heritage list this mounth.",
    "many toursts prefer visiting istanbul and dıyarbakır to see the historical land marks.",
    "during his trip to nevsehir, the ceo of micro soft anounced a new investmant."
];

export function AnalyzerPage() {
    const [isDragging, setIsDragging] = useState(false);
    
    const { input, setInput, output, isAnalyzing, error, handleAnalyze, handleFileUpload, clearOutput } = useAnalyzer();

    const onAnalyzeClick = () => {
        handleAnalyze(); 
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFileUpload(e.target.files[0]);
            e.target.value = ''; 
        }
    };

    const onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isDragging) setIsDragging(true);
    };

    const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileUpload(e.dataTransfer.files[0]);
            e.dataTransfer.clearData();
        }
    };

    const handleTryExample = () => {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * EXAMPLE_SENTENCES.length);
        } while (EXAMPLE_SENTENCES[randomIndex] === input && EXAMPLE_SENTENCES.length > 1);
        
        setInput(EXAMPLE_SENTENCES[randomIndex]);
    };

    const wordCount = input.trim() ? input.trim().split(/\s+/).length : 0;
    const isOverLimit = input.length > 10000;

    return (
        <div className="w-full max-w-400 mx-auto px-6 lg:px-8 py-6 h-[calc(100vh-140px)] min-h-150 flex flex-col transition-colors duration-300">
            
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* SOL PANEL: Metin Girişi & Sürükle-Bırak Alanı */}
                {/* SOL PANEL: Metin Girişi & Sürükle-Bırak Alanı */}
                <div 
                    onDragEnter={onDragEnter}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                    className={`flex flex-col h-full bg-card border-2 rounded-2xl shadow-sm p-4 sm:p-6 transition-all duration-300 relative ${
                        isDragging 
                        ? "border-dashed border-destructive bg-destructive/5 scale-[1.01]" 
                        : isOverLimit ? "border-solid border-destructive/50" : "border-solid border-border"
                    }`}
                >
                    {isDragging && (
                        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm rounded-2xl animate-in fade-in duration-200 pointer-events-none">
                            <FileUp size={56} className="mb-4 animate-bounce text-destructive" />
                            <h3 className="text-xl font-bold text-foreground tracking-tight text-center px-4">Dosyayı Buraya Bırakın</h3>
                            <p className="text-sm text-muted-foreground mt-2 font-medium text-center px-4">.txt, .md, .docx, .pdf, .csv, .srt desteklenir</p>
                        </div>
                    )}

                    {/* Üst Başlık ve Örnek Dene Butonu */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-2">
                        <label className="text-lg font-bold text-foreground tracking-tight">Metin Girişi</label>
                        
                        <button
                            onClick={handleTryExample}
                            disabled={isAnalyzing}
                            className="flex items-center gap-1.5 text-sm font-semibold text-destructive hover:text-destructive/80 transition-colors disabled:opacity-50 self-start sm:self-auto"
                        >
                            Bir örnek dene
                        </button>
                    </div>
                    
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className={`w-full flex-1 bg-background text-foreground border rounded-xl p-4 sm:p-5 resize-none focus:outline-none transition-all text-[15px] leading-relaxed shadow-inner ${
                            isOverLimit 
                            ? "border-destructive/50 focus:border-destructive focus:ring-1 focus:ring-destructive/50" 
                            : "border-border focus:border-destructive focus:ring-1 focus:ring-destructive"
                        }`}
                        placeholder="Derinlemesine analiz için metninizi buraya yazın veya dosya sürükleyin..."
                        onKeyDown={(e) => e.key === 'Enter' && e.ctrlKey && !isOverLimit && onAnalyzeClick()}
                    />
                    
                    {/* YENİ: Karakter Sınırı Uyarısı */}
                    {isOverLimit && (
                        <div className="mt-4 p-3.5 rounded-xl bg-destructive/10 text-destructive text-[13px] sm:text-[14px] font-bold flex items-start gap-3 border border-destructive/20 relative z-10 animate-in slide-in-from-top-2 fade-in duration-300 shadow-sm">
                            <AlertTriangle size={20} className="mt-0.5 shrink-0 animate-pulse" />
                            <div className="flex-1 leading-relaxed tracking-wide">
                                10.000 karakter sınırını aştınız. Analiz yapabilmek için lütfen metni kısaltın veya daha uzun metinler için parçalara bölerek ilerleyin.
                            </div>
                        </div>
                    )}

                    {/* API Error Gösterimi */}
                    {error && !isOverLimit && (
                        <div className="mt-4 p-3.5 sm:p-4 rounded-xl bg-destructive/10 text-destructive text-[13px] sm:text-[14px] font-bold flex items-start gap-3 border border-destructive/20 relative z-10 animate-in slide-in-from-top-2 fade-in duration-300 shadow-sm">
                            <AlertCircle size={20} className="mt-0.5 shrink-0 animate-pulse" />
                            <div className="flex-1 leading-relaxed tracking-wide">
                                {error}
                            </div>
                            <button 
                                onClick={() => clearOutput()} 
                                className="text-destructive/60 hover:text-destructive hover:bg-destructive/10 p-1 rounded-lg transition-colors shrink-0"
                                title="Uyarıyı Kapat"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    )}

                    {/* DÜZELTİLEN RESPONSIVE ALT BAR */}
                    <div className="mt-4 sm:mt-5 flex flex-wrap-reverse sm:flex-nowrap justify-between items-center gap-y-4 gap-x-2 relative z-10">
                        
                        {/* Kelime ve Karakter Sayacı */}
                        <div className="text-xs sm:text-sm text-muted-foreground font-semibold tracking-wide flex items-center gap-1.5 sm:gap-2 whitespace-nowrap">
                            <span>
                                <span className={isOverLimit ? "text-destructive font-extrabold" : (input.length > 0 ? "text-foreground" : "")}>
                                    {input.length}
                                </span> / 10.000
                            </span>
                            <span className="text-muted-foreground/30">•</span>
                            <span>
                                <span className={wordCount > 0 ? "text-foreground" : ""}>{wordCount}</span> kelime
                            </span>
                        </div>

                        {/* Buton Grubu */}
                        <div className="flex gap-2 sm:gap-3 items-center w-full sm:w-auto justify-end">
                            <input 
                                type="file" 
                                id="txt-upload" 
                                className="hidden" 
                                accept=".txt,.md,.csv,.srt,.docx,.pdf" 
                                onChange={onFileChange} 
                                disabled={isAnalyzing}
                            />
                            <label
                                htmlFor="txt-upload"
                                className="p-2.5 sm:p-3 rounded-xl bg-secondary text-secondary-foreground hover:bg-muted cursor-pointer disabled:opacity-50 transition-all duration-200 flex items-center justify-center border border-border/50 shadow-sm shrink-0"
                                title="Toplu Analiz İçin Dosya Yükle"
                            >
                                <FileUp size={18} className="sm:w-5 sm:h-5" />
                            </label>

                            <button
                                onClick={clearOutput}
                                disabled={!input && !output && !error}
                                className="p-2.5 sm:p-3 rounded-xl bg-secondary text-secondary-foreground hover:bg-muted disabled:opacity-50 transition-all duration-200 shrink-0"
                                title="Temizle"
                            >
                                <Trash2 size={18} className="sm:w-5 sm:h-5" />
                            </button>

                            <button
                                onClick={onAnalyzeClick}
                                disabled={!input.trim() || isAnalyzing || isOverLimit}
                                className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-white transition-all duration-200 flex items-center justify-center gap-2 font-bold tracking-wide shadow-md flex-1 sm:flex-none whitespace-nowrap ${
                                    isOverLimit 
                                    ? "bg-muted text-muted-foreground opacity-50 cursor-not-allowed" 
                                    : "bg-destructive hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                                }`}
                                title="Analiz Et (Ctrl + Enter)"
                            >
                                <span>{isAnalyzing ? "İşleniyor..." : "Analiz Et"}</span>
                                <Send size={16} className={`sm:w-4.5 sm:h-4.5 ${isAnalyzing ? "animate-pulse" : ""}`} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* SAĞ PANEL: Analiz Sonucu */}
                <div className="flex flex-col h-full bg-card border border-border rounded-2xl shadow-sm p-6 transition-colors duration-300 relative">
                    <div className="flex items-center justify-between mb-4">
                        <label className="text-lg font-bold text-foreground tracking-tight">Analiz Sonucu</label>
                        {output && !error && (
                            <span className="text-xs font-bold px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-500/20">
                                Başarılı
                            </span>
                        )}
                    </div>

                    <div className="flex-1 w-full bg-background rounded-xl border border-border overflow-hidden relative shadow-inner">
                        {isAnalyzing ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-10 transition-all">
                                <div className="w-14 h-14 border-4 rounded-full animate-spin shadow-lg border-destructive/30 border-t-destructive" />
                                <p className="mt-5 text-sm text-foreground font-bold tracking-widest animate-pulse">
                                    MİZAN ANALİZ EDİYOR
                                </p>
                            </div>
                        ) : !output ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground p-8 text-center transition-all">
                                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                                    <Send size={24} className="text-muted-foreground/50 ml-1" />
                                </div>
                                <p className="text-[15px] font-medium leading-relaxed">
                                    Henüz bir analiz bulunmuyor. <br />Sol taraftan metin girişi yaparak veya dosya yükleyerek süreci başlatabilirsiniz.
                                </p>
                            </div>
                        ) : (
                            <div className="absolute inset-0 overflow-y-auto">
                                <AnalysisResult 
                                    correctedText={output.correctedText} 
                                    corrections={output.corrections} 
                                    timestamp={output.timestamp}
                                    metadata={output.metadata} 
                                />
                            </div>
                        )}
                    </div>

                    <div className="mt-5 text-sm text-muted-foreground flex justify-between items-center px-1">
                        <span className="font-semibold flex items-center gap-2">
                            {isAnalyzing ? (
                                <>
                                    <span className="w-2 h-2 rounded-full animate-pulse bg-destructive"></span>
                                    Hibrit Motor İşliyor...
                                </>
                            ) : output ? (
                                <>
                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                    Analiz Tamamlandı
                                </>
                            ) : (
                                <>
                                    <span className="w-2 h-2 rounded-full bg-muted-foreground/40"></span>
                                    Sistem Hazır
                                </>
                            )}
                        </span>
                    </div>
                </div>

            </div>
        </div>
    );
}