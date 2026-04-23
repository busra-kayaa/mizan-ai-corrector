import { AlertCircle, CheckCircle2, ChevronDown, ChevronUp, Files, FileUp, LayoutGrid, Loader2, Square, X } from "lucide-react";
import { useRef, useState } from "react";
import { AnalysisResult } from "./AnalysisResult";

export function BatchAnalyzer() {
  const [inputText, setInputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [batchResults, setBatchResults] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [fileQueue, setFileQueue] = useState<File[]>([]);
  const [expandedFiles, setExpandedFiles] = useState<Record<number, boolean>>({});
  const [isDragging, setIsDragging] = useState(false); // 🖱️ Drag state

  const abortControllerRef = useRef<AbortController | null>(null);

  // 🛡️ GÜVENLİK SINIRLARI
  const MAX_FILES = 5;
  const MAX_LINE_CHARACTERS = 500;
  const ALLOWED_EXTENSIONS = ['.txt', '.csv', '.md', '.srt', '.docx', '.pdf'];

  // Ortak Dosya İşleme Mantığı
  const processFiles = (files: File[]) => {
    if (files.length === 0) return;

    if (fileQueue.length + files.length > MAX_FILES) {
      setError(`Aynı anda en fazla ${MAX_FILES} dosya analiz edebilirsiniz.`);
      return;
    }

    const validFiles = files.filter(f => 
      ALLOWED_EXTENSIONS.some(ext => f.name.toLowerCase().endsWith(ext))
    );
    
    if (validFiles.length !== files.length) {
      setError("Bazı dosyalar desteklenmeyen formatta olduğu için atlandı.");
    }

    setFileQueue(prev => [...prev, ...validFiles]);
    setError(""); // Yeni dosya eklenince eski hatayı temizle
  };

  const handleFilesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    processFiles(selectedFiles);
    e.target.value = ''; 
  };

  // 🎯 SÜRÜKLE-BIRAK YÖNETİMİ
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isProcessing) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (isProcessing) return;

    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  };

  const removeFromFileQueue = (index: number) => {
    setFileQueue(prev => prev.filter((_, i) => i !== index));
  };

  const toggleFileSection = (index: number) => {
    setExpandedFiles(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleAbort = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsProcessing(false);
      setError("İşlem kullanıcı tarafından durduruldu.");
    }
  };

  const handleBatchSubmit = async () => {
    setBatchResults([]);
    setExpandedFiles({});
    setError("");
    
    let tasks: { name: string, content: string }[] = [];
    setIsProcessing(true);
    abortControllerRef.current = new AbortController();

    for (const file of fileQueue) {
      try {
        const text = await file.text();
        tasks.push({ name: file.name, content: text });
      } catch (err) {
        console.error(`${file.name} okunamadı:`, err);
      }
    }

    if (inputText.trim()) {
      tasks.push({ name: "Manuel Giriş", content: inputText });
    }

    if (tasks.length === 0) {
      setError("Lütfen analiz için en az bir dosya veya metin ekleyin.");
      setIsProcessing(false);
      return;
    }

    // ÖN KONTROL
    for (const task of tasks) {
      const lines = task.content.split("\n").map(t => t.trim()).filter(t => t.length > 0);
      const hasOversizedLine = lines.some(line => line.length > MAX_LINE_CHARACTERS);
      if (hasOversizedLine) {
        setError(`HATA: "${task.name}" içerisinde ${MAX_LINE_CHARACTERS} karakter sınırını aşan satırlar var. Lütfen metni kısaltarak tekrar deneyin.`);
        setIsProcessing(false);
        return;
      }
    }

    try {
      for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        if (abortControllerRef.current.signal.aborted) break;

        const lines = task.content.split("\n").map(t => t.trim()).filter(t => t.length > 0);
        const processableLines = lines.slice(0, 50);

        if (processableLines.length === 0) continue;

        const response = await fetch("http://localhost:8000/batch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ texts: processableLines }),
          signal: abortControllerRef.current.signal
        });

        if (!response.ok) throw new Error(`${task.name} sunucuda işlenirken hata oluştu.`);
        
        const data = await response.json();
        const resultsWithOriginals = data.results.map((res: any, idx: number) => ({
          ...res,
          originalText: processableLines[idx]
        }));

        setBatchResults(prev => [...prev, { ...data, fileName: task.name, results: resultsWithOriginals }]);        
        setExpandedFiles(prev => ({ ...prev, [i]: true }));
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log("Ağ isteği iptal edildi.");
      } else {
        setError("Analiz durduruldu: " + err.message);
      }
    } finally {
      setIsProcessing(false);
      setFileQueue([]);
      setInputText("");
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-500 pb-10">
      
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`bg-card border-2 rounded-2xl shadow-sm overflow-hidden transition-all duration-300 relative ${isDragging ? 'border-destructive border-dashed bg-destructive/5 scale-[1.01]' : 'border-border'}`}
      >
        {/* Drag Overlay */}
        {isDragging && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm pointer-events-none">
            <div className="p-4 rounded-full bg-destructive/10 text-destructive animate-bounce">
              <FileUp size={40} />
            </div>
            <p className="mt-4 font-black text-destructive uppercase tracking-widest text-lg">Dosyaları Buraya Bırakın</p>
            <p className="text-xs text-muted-foreground mt-1">Maksimum {MAX_FILES} dosya ve desteklenen formatlar</p>
          </div>
        )}

        <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-muted/30">
          <LayoutGrid size={18} className="text-destructive" />
          <h3 className="font-bold text-foreground text-[15px]">Toplu Analiz Masası</h3>
          <div className="ml-auto flex flex-wrap items-center gap-2">
             <span className="text-[10px] font-bold text-muted-foreground border border-border px-2 py-0.5 rounded uppercase hidden sm:inline-block">
                Max: {MAX_LINE_CHARACTERS} Karakter/Satır
             </span>
             <span className="text-[10px] font-bold text-secondary-foreground bg-secondary px-2 py-0.5 rounded border border-border/50 uppercase tracking-tighter">
                {ALLOWED_EXTENSIONS.join(', ')}
             </span>
          </div>
        </div>

        <div className="p-5">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isProcessing}
            placeholder={`Metinleri buraya yapıştırın veya dosyaları bu alana sürükleyip bırakın...`}
            className="w-full min-h-32 bg-background text-foreground border border-border rounded-xl p-4 text-[15px] focus:outline-none focus:border-destructive focus:ring-1 focus:ring-destructive transition-all shadow-inner mb-4 disabled:opacity-50"
          />

          {fileQueue.length > 0 && (
            <div className="mb-5 flex flex-wrap gap-2 animate-in slide-in-from-top-1">
              {fileQueue.map((file, idx) => (
                <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-secondary/50 border border-border rounded-lg text-[13px] font-semibold text-foreground group">
                  <Files size={14} className="text-muted-foreground" />
                  <span className="max-w-37.5 truncate">{file.name}</span>
                  {!isProcessing && (
                    <button onClick={() => removeFromFileQueue(idx)} className="hover:text-destructive transition-colors ml-1">
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {error && (
            <div className="mb-4 p-3.5 rounded-xl bg-destructive/10 text-destructive text-[13px] font-bold flex items-center gap-3 border border-destructive/20 animate-in slide-in-from-top-2">
              <AlertCircle size={18} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <input 
                type="file" 
                id="batch-file-upload" 
                multiple 
                accept={ALLOWED_EXTENSIONS.join(',')} 
                className="hidden" 
                onChange={handleFilesUpload} 
                disabled={isProcessing || fileQueue.length >= MAX_FILES} 
              />
              <label 
                htmlFor="batch-file-upload" 
                className={`flex items-center gap-2 px-5 py-2.5 bg-secondary text-secondary-foreground rounded-xl cursor-pointer transition-colors text-sm font-bold border border-border/50 shadow-sm ${(isProcessing || fileQueue.length >= MAX_FILES) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-muted'}`}
              >
                <FileUp size={18} />
                <span>Dosyaları Ekle ({fileQueue.length}/{MAX_FILES})</span>
              </label>
            </div>

            <div className="flex gap-3">
              {isProcessing && (
                <button
                  onClick={handleAbort}
                  className="px-6 py-2.5 bg-background border-2 border-destructive text-destructive hover:bg-destructive hover:text-white font-bold rounded-xl transition-all flex items-center gap-2 shadow-sm"
                >
                  <Square size={16} fill="currentColor" />
                  İşlemi Durdur
                </button>
              )}

              <button
                onClick={handleBatchSubmit}
                disabled={isProcessing || (!inputText.trim() && fileQueue.length === 0)}
                className="px-8 py-2.5 bg-destructive hover:opacity-90 text-white font-bold rounded-xl transition-all shadow-md disabled:opacity-50 flex items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Analiz Ediliyor...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={18} />
                    Analizi Başlat
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SONUÇ ALANI (ACCORDION) */}
      {batchResults.length > 0 && (
        <div className="flex flex-col gap-4 mt-2">
          {batchResults.map((batch, batchIdx) => {
            const isExpanded = expandedFiles[batchIdx];
            return (
              <div key={batchIdx} className="border border-border rounded-2xl overflow-hidden bg-card/50 transition-all duration-300 shadow-sm animate-in slide-in-from-bottom-4">
                <button 
                  onClick={() => toggleFileSection(batchIdx)}
                  className="w-full flex items-center justify-between px-6 py-4 bg-muted/20 hover:bg-muted/40 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center text-destructive">
                       <Files size={20} />
                    </div>
                    <div className="flex flex-col items-start">
                      <h2 className="text-[15px] font-black text-foreground tracking-tight uppercase italic">{batch.fileName}</h2>
                      <span className="text-[10px] text-muted-foreground font-mono uppercase">
                        {batch.metadata?.total_processed || batch.results?.length || 0} Satır İşlendi
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-bold text-muted-foreground bg-background border border-border px-2 py-1 rounded-md">
                        {isExpanded ? 'Gizle' : 'Göster'}
                    </span>
                    {isExpanded ? <ChevronUp size={20} className="text-muted-foreground" /> : <ChevronDown size={20} className="text-muted-foreground" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="p-6 grid grid-cols-1 gap-8 border-t border-border/50">
                    {batch.results.map((resultItem: any, index: number) => (
                      <div key={index} className="relative pl-10">
                        <div className="absolute left-0 top-8 -translate-y-1/2 w-7 h-7 bg-secondary border border-border text-foreground font-black rounded-full flex items-center justify-center z-10 text-[11px] shadow-sm">
                          {index + 1}
                        </div>
                        <div className="bg-background border border-border rounded-2xl shadow-sm overflow-hidden">
                           <AnalysisResult
                              originalText={resultItem.originalText || ""} 
                              correctedText={resultItem.correctedText}
                              corrections={resultItem.corrections}
                              metadata={{
                                total_processed: 1, 
                                processing_time_ms: (batch.metadata?.processing_time_ms || 0) / (batch.metadata?.total_processed || 1), 
                              }}
                            />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}