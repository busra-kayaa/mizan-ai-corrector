import { ArrowRight, CheckCircle2, ChevronDown, ChevronUp, Clock, Copy, List, ThumbsDown, ThumbsUp, X, Zap } from "lucide-react";
import { useState } from "react";
import { AnalysisResponse, Correction } from "../../domain/entities/Analysis";

export interface AnalysisResultProps {
  originalText?: string;
  correctedText: string;
  corrections?: Correction[];
  timestamp?: string;
  metadata?: AnalysisResponse["metadata"] & {
      total_processed?: number;
      regex_count?: number;
      neural_count?: number;
      processing_time_ms?: number;
  };
  hideDetails?: boolean; 
}

const BADGE_CONFIG: Record<string, { label: string, colorClass: string }> = {
  "typographic": { label: "YAZIM / DİZGİ", colorClass: "bg-destructive/10 text-destructive border-destructive/20" },
  "punctuation": { label: "NOKTALAMA", colorClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" },
  "grammar": { label: "DİLBİLGİSİ", colorClass: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20" },
  "lexical": { label: "KELİME SEÇİMİ", colorClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" },
  "deascii": { label: "TÜRKÇE KARAKTER", colorClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" },
  "terminology": { label: "TERMİNOLOJİ", colorClass: "bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-500/20" },
  "capitalization": { label: "BÜYÜK/KÜÇÜK HARF", colorClass: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20" },
};

const formatTime = (ms: number) => {
  const totalSeconds = ms / 1000;
  if (totalSeconds < 60) return `${totalSeconds.toFixed(1)} sn`;
  
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes} dk ${seconds} sn`;
};

export function AnalysisResult({ correctedText, corrections = [], timestamp, metadata, hideDetails = false }: AnalysisResultProps) {
  const [copied, setCopied] = useState(false);
  const [userFeedback, setUserFeedback] = useState<'up' | 'down' | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);

  const [reportedIssues, setReportedIssues] = useState([{ word: "", reason: "" }]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(correctedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Kopyalama başarısız:", err);
    }
  };

  const handleFeedbackClick = (type: 'up' | 'down') => {
    setUserFeedback(type);
    
    if (type === 'down') {
      setReportedIssues([{ word: "", reason: "" }]);
      setIsModalOpen(true);
    } else {
      console.log("Kullanıcı sonucu beğendi, olumlu geri bildirim gönderiliyor...");
    }
  };

  const handleIssueChange = (index: number, field: 'word' | 'reason', value: string) => {
    const newIssues = [...reportedIssues];
    newIssues[index][field] = value;
    setReportedIssues(newIssues);
  };

  const addAnotherIssue = () => {
    setReportedIssues([...reportedIssues, { word: "", reason: "" }]);
  };

  const handleSubmit = async () => {
    console.log("Gönderilen Sorunlar:", reportedIssues);
    setIsModalOpen(false);
  };

  const renderHighlightedText = () => {
    if (!corrections || corrections.length === 0) return <span>{correctedText}</span>;

    const elements: React.ReactNode[] = [];
    let remainingText = correctedText;
    let elementKey = 0;

    const activeCorrections = corrections.filter(
      (c) => c.corrected && c.corrected.trim() !== "" && !c.corrected.includes("[Silindi]")
    );

    activeCorrections.forEach((correction) => {
      const target = correction.corrected;
      const targetLower = target.toLowerCase();
      const remainingLower = remainingText.toLowerCase();
      const targetIndex = remainingLower.indexOf(targetLower);

      if (targetIndex !== -1) {
        if (targetIndex > 0) {
          elements.push(<span key={elementKey++}>{remainingText.substring(0, targetIndex)}</span>);
        }

        const matchedText = remainingText.substring(targetIndex, targetIndex + target.length);

        elements.push(
          <span key={elementKey++} className="text-destructive font-bold bg-destructive/10 px-0.5 rounded-sm transition-colors">
            {matchedText}
          </span>
        );

        remainingText = remainingText.substring(targetIndex + target.length);
      }
    });

    if (remainingText) {
      elements.push(<span key={elementKey++}>{remainingText}</span>);
    }

    return elements;
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500 pb-4">
      
      {/* 1. KART: ÇIKTI METNİ */}
      <div className="flex flex-col bg-background border border-border rounded-2xl shadow-sm overflow-hidden transition-colors duration-300">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2">
                <h3 className="font-bold text-foreground text-[15px]">Analiz Edilmiş Metin</h3>
            </div>
            <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-secondary transition-colors text-xs font-semibold text-muted-foreground hover:text-foreground border border-transparent hover:border-border"
            >
                {copied ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Copy size={14} />}
                {copied ? <span className="text-emerald-500">Kopyalandı</span> : "Kopyala"}
            </button>
        </div>
        
        <div className="p-6 text-[15px] leading-relaxed text-foreground selection:bg-destructive/20 whitespace-pre-wrap">
          {renderHighlightedText()}
        </div>
      </div>

      {/* 2. KART: YAPILAN DÜZELTMELER LİSTESİ */}
      {!hideDetails && corrections && corrections.length > 0 && (
        <div className="flex flex-col bg-background border border-border rounded-2xl shadow-sm overflow-hidden transition-colors duration-300">
          <button 
            onClick={() => setIsDetailsOpen(!isDetailsOpen)}
            className="flex items-center justify-between px-5 py-4 bg-muted/30 hover:bg-muted/50 transition-colors focus:outline-none group"
          >
            <div className="flex items-center gap-3">
              <List size={18} className="text-destructive" />
              <h3 className="text-foreground font-bold text-[15px]">
                Yapılan Düzeltmeler
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-destructive/10 text-destructive text-[11px] font-bold px-2.5 py-1 rounded-full border border-destructive/20">
                  {corrections.length} Tespit
              </span>
              <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                {isDetailsOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </span>
            </div>
          </button>

          {isDetailsOpen && (
            <div className="p-4 bg-background">
              <ul className="flex flex-col gap-3">
                {corrections.map((item: Correction, idx: number) => {
                  const config = BADGE_CONFIG[item.type] || { label: "GENEL", colorClass: "bg-secondary text-secondary-foreground border-border" };
                  const isDeleted = item.corrected.includes("[Silindi]") || item.corrected === "";
                  
                  return (
                    <li 
                      key={idx} 
                      className={`bg-card border border-border rounded-xl p-4 flex flex-col gap-2 shadow-sm transition-colors
                          hover:border-destructive/30 hover:shadow-md relative overflow-hidden 
                          before:absolute before:left-0 before:top-0 before:h-full before:w-0 
                          hover:before:w-1.5 ${isDeleted ? 'opacity-70' : ''}`
                        }
                      >
                      <div className="flex justify-between items-start gap-4">
                        
                        <div className="flex items-center gap-3 flex-wrap">
                          {item.original && (
                            <span className="line-through text-muted-foreground font-mono text-[13px] px-2 py-0.5 rounded bg-muted">
                              {item.original}
                            </span>
                          )}
                          
                          <ArrowRight size={16} className="text-muted-foreground opacity-50" />
                          
                          <span className={`font-mono text-[13px] px-2 py-0.5 rounded ${isDeleted ? 'text-muted-foreground italic bg-muted' : 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 font-bold'}`}>
                            {isDeleted ? "[Fazlalık Silindi]" : item.corrected}
                          </span>
                        </div>
                        
                        <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${config.colorClass}`}>
                          {config.label}
                        </div>
                      </div>
                      
                      {item.explanation && (
                        <p className="text-muted-foreground text-[13px] mt-1 pl-1 border-l-2 border-border">
                          {item.explanation}
                        </p>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* FOOTER BİLGİSİ VE GERİ BİLDİRİM (METADATA ROZETLERİ) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-1 mt-2 gap-4">
          
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            {/* Zaman Damgası */}
            {timestamp && (
              <span className="flex items-center gap-1.5 text-muted-foreground bg-muted px-2.5 py-1 rounded-md border border-border">
                <Clock size={12} /> {new Date(timestamp).toLocaleTimeString()}
              </span>
            )}

            {/* ✅ YENİ: Analiz Süresi Rozeti */}
            {metadata?.processing_time_ms && (
              <span className="flex items-center gap-1.5 text-muted-foreground bg-muted px-2.5 py-1 rounded-md border border-border">
                <Zap size={12} className="text-amber-500" /> {formatTime(metadata.processing_time_ms)}
              </span>
            )}
            
            {/* Dosya (Batch) Analizi Bilgisi */}
            {metadata?.total_processed && (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border font-bold tracking-wide uppercase bg-blue-500/10 text-blue-600 border-blue-500/20">
                <List size={12} />
                Toplu Analiz ({metadata.total_processed} Satır)
              </span>
            )}
          </div>
          
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground font-medium">Bu analiz başarılı mıydı?</span>
          <div className="flex gap-2">
            <button onClick={() => handleFeedbackClick('up')} className={`p-1.5 rounded-lg border transition-all ${userFeedback === 'up' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400' : 'bg-transparent border-transparent text-muted-foreground hover:bg-secondary hover:border-border'}`}>
              <ThumbsUp size={16} />
            </button>
            <button onClick={() => handleFeedbackClick('down')} className={`p-1.5 rounded-lg border transition-all ${userFeedback === 'down' ? 'bg-destructive/10 border-destructive/30 text-destructive' : 'bg-transparent border-transparent text-muted-foreground hover:bg-secondary hover:border-border'}`}>
              <ThumbsDown size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* SORUN BİLDİR (FEEDBACK) MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg relative overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b border-border bg-muted/30">
              <h3 className="text-lg font-bold text-foreground">Hatalı Düzeltme Bildirimi</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:bg-secondary p-1.5 rounded-md transition-colors">
                <X size={20} />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <p className="text-sm text-muted-foreground mb-6">
                Modelimizi geliştirmemize yardımcı olmak için hatalı bulduğunuz kısımları bize iletebilirsiniz.
              </p>

              <div className="space-y-4">
                {reportedIssues.map((issue, index) => (
                  <div key={index} className="bg-background border border-border rounded-xl p-5 relative group">
                    {reportedIssues.length > 1 && (
                      <button 
                        onClick={() => {
                          const newIssues = [...reportedIssues];
                          newIssues.splice(index, 1);
                          setReportedIssues(newIssues);
                        }}
                        className="absolute -top-3 -right-3 bg-card border border-border text-muted-foreground hover:text-destructive p-1 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    )}

                    <div className="grid gap-4">
                      <div>
                        <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Hatalı Kelime/Bölüm</label>
                        <select
                          value={issue.word}
                          onChange={(e) => handleIssueChange(index, 'word', e.target.value)}
                          className="w-full bg-card border border-border text-foreground rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-destructive transition-colors cursor-pointer"
                        >
                          <option value="" disabled>Seçiniz...</option>
                          {corrections.map((c, i) => {
                            const displayStr = c.original ? `${c.original} ➔ ${c.corrected}` : c.corrected;
                            return <option key={i} value={c.corrected || c.original}>{displayStr}</option>;
                          })}
                          <option value="Genel Anlam Bozukluğu">Genel Anlam Bozukluğu</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Sorun Nedir?</label>
                        <select
                          value={issue.reason}
                          onChange={(e) => handleIssueChange(index, 'reason', e.target.value)}
                          className="w-full bg-card border border-border text-foreground rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-destructive transition-colors cursor-pointer"
                        >
                          <option value="" disabled>Seçiniz...</option>
                          <option value="Yanlış kelime düzeltmesi">Yanlış kelime (Örn: Hatalı çekim)</option>
                          <option value="Gereksiz düzeltme yapılmış">Bu düzeltmeye gerek yoktu</option>
                          <option value="Cümlenin anlamı bozulmuş">Orijinal anlamı kaybetmiş</option>
                          <option value="Terminolojik hata">Kurumsal terminolojiye aykırı</option>
                          <option value="Diğer">Diğer</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={addAnotherIssue}
                className="mt-6 flex items-center justify-center w-full gap-2 text-sm font-bold text-destructive hover:bg-destructive/5 py-3 rounded-xl border border-dashed border-destructive/30 transition-colors"
              >
                <span>+ Başka bir hata ekle</span>
              </button>
            </div>
            
            {/* Modal Footer */}
            <div className="p-5 border-t border-border flex justify-end gap-3 bg-muted/30">
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="px-5 py-2.5 text-sm font-semibold text-foreground bg-card border border-border hover:bg-secondary rounded-xl transition-colors"
              >
                Vazgeç
              </button>
              <button 
                onClick={handleSubmit} 
                disabled={reportedIssues.some(issue => !issue.word || !issue.reason)}
                className="px-5 py-2.5 text-sm font-bold bg-destructive text-destructive-foreground hover:opacity-90 disabled:opacity-50 rounded-xl transition-all shadow-sm"
              >
                Geri Bildirimi Gönder
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  ); 
}