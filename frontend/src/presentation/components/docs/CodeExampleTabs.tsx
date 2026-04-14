import { useState } from "react";
import { DOCS_STRUCTURE } from "../../../core/constants/docs-structure";
import { DocsCodeBlock } from "./DocsCodeBlock";

export function CodeExampleTabs() {
    const [tab, setTab] = useState("shell");
    
    const examples: any = DOCS_STRUCTURE.examples;

    return (
        <div className="rounded-2xl overflow-hidden border border-border shadow-sm flex flex-col transition-colors duration-300 w-full">

            {/* Sekmeler (Tabs) Alanı  */}
            <div className="flex gap-2 px-4 pt-4 border-b border-border bg-card transition-colors duration-300 overflow-x-auto">
                {Object.entries(examples).map(([key, value]: [string, any]) => {
                    const isActive = tab === key;
                    
                    return (
                        <button
                            key={key}
                            onClick={() => setTab(key)}
                            className={`px-6 py-3 text-[13px] uppercase tracking-widest transition-all relative whitespace-nowrap
                                ${isActive
                                    ? "font-bold text-foreground bg-muted/30 dark:bg-black/20 rounded-t-xl border-t border-l border-r border-border shadow-sm"
                                    : "font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-t-xl"
                                }
                            `}
                        >
                            {value.label}
                            
                            {/* Aktif Sekme Alt Çizgisi */}
                            {isActive && (
                                <div className="absolute -bottom 1px left-0 right-0 h-0.75 bg-red-600 dark:bg-rose-500 rounded-t-md z-10" />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Kod Gösterim Alanı */}
            <div>
                <DocsCodeBlock 
                    code={examples[tab]?.code || "// Kod yükleniyor..."} 
                    language={examples[tab]?.language || "typescript"}
                    isTabContent={true} 
                />
            </div>

        </div>
    );
}