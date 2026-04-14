import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

interface DocsCodeBlockProps {
    code: string;
    title?: string;
    language?: string;
    isTabContent?: boolean; 
}

const mizanSyntaxTheme: { [key: string]: React.CSSProperties } = {
    'code[class*="language-"]': {
        color: 'var(--foreground)',
        fontFamily: '"JetBrains Mono", "Fira Code", "Cascadia Code", Consolas, Monaco, monospace',
        direction: 'ltr',
        textAlign: 'left',
        whiteSpace: 'pre',
        wordSpacing: 'normal',
        wordBreak: 'normal',
        tabSize: 4,
        hyphens: 'none',
        fontSize: '13px',
    },
    'pre[class*="language-"]': {
        margin: 0,
        background: 'transparent',
        overflow: 'auto',
    },
    'comment': { color: 'var(--muted-foreground)', fontStyle: 'italic' },
    'punctuation': { color: 'var(--muted-foreground)', opacity: 0.8 },
    'string': { color: 'var(--chart-2)' }, 
    'char': { color: 'var(--chart-2)' },
    'number': { color: 'var(--chart-3)' }, 
    'boolean': { color: 'var(--chart-3)' }, 
    'keyword': { color: 'var(--chart-1)', fontWeight: 'bold' }, 
    'builtin': { color: 'var(--chart-1)' },
    'function': { color: 'var(--chart-4)', fontWeight: 'bold' }, 
    'class-name': { color: 'var(--chart-4)', fontWeight: 'bold' },
    'property': { color: 'var(--chart-5)' }, 
    'variable': { color: 'var(--foreground)' },
    'operator': { color: 'var(--muted-foreground)' },
    'entity': { color: 'var(--foreground)' },
    'url': { color: 'var(--chart-2)' },
    'regex': { color: 'var(--chart-3)' },
};

export function DocsCodeBlock({ code, title, language = "json", isTabContent = false }: DocsCodeBlockProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={`relative group transition-colors duration-300 w-full overflow-hidden
            ${isTabContent 
                ? "bg-zinc-50 dark:bg-[#18181b]" 
                : "rounded-2xl border border-border bg-zinc-50 dark:bg-[#18181b] shadow-sm"
            }`}
        >
            {title && (
                <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-muted/50 dark:bg-black/20 transition-colors duration-300">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.15em]">{title}</span>
                    <button
                        onClick={handleCopy}
                        className="p-1.5 rounded-md hover:bg-secondary transition-colors flex items-center gap-2 group/btn"
                        title="Kopyala"
                    >
                        {copied ? (
                            <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 transition-all">
                                <Check size={14} /> KOPYALANDI
                            </span>
                        ) : (
                            <Copy size={14} className="text-muted-foreground group-hover/btn:text-foreground transition-colors" />
                        )}
                    </button>
                </div>
            )}
            
            {!title && (
                <button
                    onClick={handleCopy}
                    className="absolute top-4 right-4 p-2 rounded-lg bg-card/80 hover:bg-secondary border border-border backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 z-10 shadow-sm"
                    title="Kopyala"
                >
                    {copied
                        ? <Check size={16} className="text-emerald-600 dark:text-emerald-400" />
                        : <Copy size={16} className="text-muted-foreground" />
                    }
                </button>
            )}

            <div className="selection:bg-red-500/20 dark:selection:bg-rose-500/20 w-full overflow-x-auto">
                <SyntaxHighlighter 
                    language={language} 
                    style={mizanSyntaxTheme}
                    customStyle={{ padding: '1.5rem', margin: 0, background: 'transparent', minWidth: '100%' }}
                    showLineNumbers={true} 
                    lineNumberStyle={{ 
                        minWidth: '2.5em', 
                        paddingRight: '1em', 
                        color: 'var(--muted-foreground)', 
                        opacity: 0.4, 
                        textAlign: 'right',
                        userSelect: 'none'
                    }}
                    wrapLongLines={false}
                >
                    {code.trim()}
                </SyntaxHighlighter>
            </div>
        </div>
    );
}