import { ArrowRight, Braces, Cpu, Terminal } from "lucide-react";
import {
    METADATA_REQUEST,
    METADATA_RESPONSE,
    MIZAN_BASE_URL,
    REQUEST_PARAMS,
    RESPONSE_PARAMS,
} from "../../../core/constants/docs-content";
import { DocsCodeBlock } from "../../components/docs/DocsCodeBlock";

interface Param {
    name: string;
    type: string;
    description: string;
    required?: boolean;
}

function ParamsTable({ params, showRequired = false }: { params: Param[]; showRequired?: boolean }) {
    return (
        <div className="w-full overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-colors duration-300">
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-[14px] text-left border-collapse">
                    <thead>
                        <tr className="bg-muted/50 border-b border-border text-foreground">
                            <th className="px-6 py-4 font-bold uppercase tracking-widest text-[11px] w-40 text-muted-foreground">Parametre</th>
                            <th className="px-6 py-4 font-bold uppercase tracking-widest text-[11px] w-32 text-muted-foreground">Tür</th>
                            {showRequired && (
                                <th className="px-6 py-4 font-bold uppercase tracking-widest text-[11px] w-28 text-center text-muted-foreground">Zorunlu</th>
                            )}
                            <th className="px-6 py-4 font-bold uppercase tracking-widest text-[11px] text-muted-foreground">Açıklama</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {params.map((p) => (
                            <tr key={p.name} className="hover:bg-muted/40 transition-colors group">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <code className="text-[13px] font-mono font-bold text-destructive bg-destructive/10 px-2 py-1 rounded border border-destructive/20 transition-colors group-hover:bg-destructive/20">
                                        {p.name}
                                    </code>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-[11px] font-mono font-bold px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 uppercase tracking-widest">
                                        {p.type}
                                    </span>
                                </td>
                                {showRequired && (
                                    <td className="px-6 py-4 text-center">
                                        {p.required ? (
                                            <span className="text-[10px] font-bold text-destructive bg-destructive/10 px-2 py-1 rounded-md border border-destructive/20">EVET</span>
                                        ) : (
                                            <span className="text-[10px] font-bold text-muted-foreground/50 bg-muted border border-border px-2 py-1 rounded-md">HAYIR</span>
                                        )}
                                    </td>
                                )}
                                <td className="px-6 py-4 text-[14px] text-muted-foreground leading-relaxed">
                                    {p.description}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export function MetadataSection() {
    return (
        <div className="w-full space-y-12 animate-in fade-in duration-500">
            
            {/* Header Alanı */}
            <div className="space-y-4">
                <h1 className="text-4xl font-extrabold text-foreground tracking-tight">
                    Meta Veriler ve Şemalar
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed w-full">
                    Mizan API ile analiz süreci başlatmak için kullanılan <strong>Request (İstek)</strong> ve <strong>Response (Yanıt)</strong> şemaları aşağıda teknik detaylarıyla tanımlanmıştır. Sistem, atomik tokenizasyon kuralına uygun olarak detaylı metadata döner.
                </p>
            </div>

            {/* Endpoint Alanı */}
            <div className="space-y-4 w-full">
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                    <Terminal size={28} className="text-destructive" />
                    Temel Endpoint
                </h2>
                <div className="inline-flex items-center gap-4 px-6 py-5 rounded-3xl bg-card border border-border shadow-sm group hover:border-destructive/30 transition-all">
                    <span className="text-[12px] font-bold px-3 py-1.5 rounded-lg bg-emerald-500 text-white shadow-sm transition-transform group-hover:scale-105 tracking-widest uppercase">POST</span>
                    <span className="text-[16px] font-mono font-bold text-foreground tracking-tight select-all">
                        {MIZAN_BASE_URL}/analyze
                    </span>
                </div>
            </div>

            {/* İstek ve Yanıt Yan Yana (Side by Side) */}
            <div className="space-y-6 w-full pt-4">
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-3 border-b border-border pb-4">
                    <Braces size={28} className="text-destructive" />
                    İstek ve Yanıt Yapısı
                </h2>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 w-full">
                    {/* İstek */}
                    <div className="space-y-3 h-full flex flex-col group">
                        <div className="flex items-center gap-2 px-1 mb-2">
                            <span className="text-[12px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-destructive transition-colors">İstek (Request)</span>
                            <ArrowRight size={14} className="text-muted-foreground/50 group-hover:text-destructive transition-colors group-hover:translate-x-1" />
                        </div>
                        {/* Dış sarmalayıcıya bg-[#1e1e1e] eklendi */}
                        <div className="w-full rounded-2xl overflow-hidden bg-[#1e1e1e] border border-border shadow-inner">
                            <DocsCodeBlock
                                code={JSON.stringify(METADATA_REQUEST, null, 2)}
                                language="json"
                            />
                        </div>
                    </div>
                    {/* Yanıt */}
                    <div className="space-y-3 h-full flex flex-col group">
                        <div className="flex items-center gap-2 px-1 mb-2">
                            <span className="text-[12px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-500">Yanıt (Response)</span>
                        </div>
                        <div className="w-full rounded-2xl overflow-hidden bg-[#1e1e1e] border border-border shadow-inner">
                            <DocsCodeBlock
                                code={JSON.stringify(METADATA_RESPONSE, null, 2)}
                                language="json" 
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* İstek Parametreleri Tablosu */}
            <div className="space-y-5 w-full pt-4">
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-foreground">İstek Parametreleri (Payload)</h2>
                    <p className="text-[15px] text-muted-foreground leading-relaxed">
                        Analiz motorunu yapılandırmak için JSON gövdesinde (body) aşağıdaki alanları göndermelisiniz.
                    </p>
                </div>
                <ParamsTable params={REQUEST_PARAMS} showRequired />
            </div>

            {/* Yanıt Parametreleri Tablosu */}
            <div className="space-y-5 w-full pt-4">
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-foreground">Yanıt Alanları</h2>
                    <p className="text-[15px] text-muted-foreground leading-relaxed">
                        Analiz işlemi başarıyla sonuçlandığında dönen JSON objesinin anatomisi:
                    </p>
                </div>
                <ParamsTable params={RESPONSE_PARAMS} />
            </div>

            {/* Performans Metrikleri Paneli */}
            <div className="flex items-start gap-5 p-8 rounded-3xl bg-destructive/5 border border-destructive/20 transition-all hover:bg-destructive/10 group w-full">
                <Cpu size={28} className="text-destructive shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <div className="text-[15px] text-foreground leading-relaxed space-y-2 w-full">
                    <p className="font-bold text-destructive uppercase tracking-widest text-[11px]">Sistem Metrikleri ve Telemetri</p>
                    <p className="text-muted-foreground leading-relaxed">
                        Yanıttaki <code className="mx-1 px-1.5 py-0.5 rounded bg-destructive/10 text-destructive font-mono text-[13px] border border-destructive/20">metadata</code> alanı, 
                        yapay zeka modelinin çalışmasını şeffaf bir şekilde raporlar. <code className="mx-1 font-mono text-[13px] font-bold text-foreground">regex_count</code> Kural Tabanlı (Rule-based) motorun milisaniyeler içinde yakaladığı hataları gösterirken, <code className="mx-1 font-mono text-[13px] font-bold text-foreground">neural_count</code> Llama 3.1 LLM motorunun düzelttiği derin bağlamsal hataları belirtir. Bu metriklerle Mizan hibrit mimarisinin iş yükü dağılımını izleyebilirsiniz.
                    </p>
                </div>
            </div>
        </div>
    );
}