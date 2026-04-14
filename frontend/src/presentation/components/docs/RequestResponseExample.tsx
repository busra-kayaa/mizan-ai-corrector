import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { DOCS_STRUCTURE } from "../../../core/constants/docs-structure";

export function RequestResponseExample() {
    const [copied, setCopied] = useState("");

    const copy = (text: any, key: string) => {
        navigator.clipboard.writeText(JSON.stringify(text, null, 2));
        setCopied(key);
        setTimeout(() => setCopied(""), 1500);
    };

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

            <div className="rounded-2xl overflow-hidden border border-border bg-card shadow-sm transition-colors duration-300">
                
                <div className="flex justify-between items-center px-5 py-3 border-b border-border bg-muted/50 transition-colors duration-300">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.15em]">
                        İstek (Request)
                    </span>

                    <button
                        onClick={() => copy(DOCS_STRUCTURE.endpoint.request.body, "req")}
                        className="p-1.5 rounded-md hover:bg-secondary transition-colors flex items-center gap-2 group/btn"
                        title="Kopyala"
                    >
                        {copied === "req" ? (
                            <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 transition-all">
                                <Check size={14} /> KOPYALANDI
                            </span>
                        ) : (
                            <Copy size={14} className="text-muted-foreground group-hover/btn:text-foreground transition-colors" />
                        )}
                    </button>
                </div>

                {/* Kod Metni */}
                <pre className="p-6 text-[13.5px] font-mono leading-relaxed overflow-x-auto text-blue-700 dark:text-blue-300 selection:bg-destructive/20 transition-colors duration-300">
                    {JSON.stringify(DOCS_STRUCTURE.endpoint.request.body, null, 2)}
                </pre>
            </div>


            {/* YANIT (RESPONSE) KARTI */}
            <div className="rounded-2xl overflow-hidden border border-border bg-card shadow-sm transition-colors duration-300">
                
                <div className="flex justify-between items-center px-5 py-3 border-b border-border bg-muted/50 transition-colors duration-300">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.15em]">
                        Yanıt (Response)
                    </span>

                    <button
                        onClick={() => copy(DOCS_STRUCTURE.endpoint.response, "res")}
                        className="p-1.5 rounded-md hover:bg-secondary transition-colors flex items-center gap-2 group/btn"
                        title="Kopyala"
                    >
                        {copied === "res" ? (
                            <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 transition-all">
                                <Check size={14} /> KOPYALANDI
                            </span>
                        ) : (
                            <Copy size={14} className="text-muted-foreground group-hover/btn:text-foreground transition-colors" />
                        )}
                    </button>
                </div>

                <pre className="p-6 text-[13.5px] font-mono leading-relaxed overflow-x-auto text-emerald-700 dark:text-emerald-400 selection:bg-destructive/20 transition-colors duration-300">
                    {JSON.stringify(DOCS_STRUCTURE.endpoint.response, null, 2)}
                </pre>
            </div>

        </div>
    );
}