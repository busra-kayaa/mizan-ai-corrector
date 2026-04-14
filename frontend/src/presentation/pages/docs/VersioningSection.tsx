import { ArrowUpRight, CheckCircle2, Milestone } from "lucide-react";
import { MIZAN_BASE_URL, VERSION_COMPARISON } from "../../../core/constants/docs-content";
import { DocsCodeBlock } from "../../components/docs/DocsCodeBlock";

export function VersioningSection() {
    const { v3, v4 } = VERSION_COMPARISON;

    return (
        <div className="w-full space-y-12 animate-in fade-in duration-500">
            
            {/* Header Alanı */}
            <div className="space-y-4">
                <h1 className="text-4xl font-extrabold text-foreground tracking-tight">
                    API Sürümleme (Versioning)
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed w-full">
                    Mizan API, kurumsal entegrasyonların kırılmasını önlemek amacıyla geriye dönük uyumlu sürümler sunar. Aşağıda aktif olarak desteklenen <strong>V4 (Hibrit)</strong> ve legacy (eski) olarak tutulan <strong>V3 (Sadece Regex)</strong> sürümleri arasındaki mimari farklar açıklanmıştır.
                </p>
            </div>

            {/* Versiyon Kartları */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
                
                {/* V3 Kartı (Legacy) */}
                <div className="p-8 rounded-3xl border border-border bg-card space-y-6 shadow-sm transition-all hover:border-muted-foreground/30 flex flex-col h-full group opacity-90 hover:opacity-100">
                    <div className="flex items-center justify-between border-b border-border pb-6">
                        <div className="flex items-center gap-4">
                            <span className="text-3xl font-bold text-foreground tracking-tighter">V3</span>
                            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-500 border border-amber-500/20 uppercase tracking-widest">
                                {v3.status}
                            </span>
                        </div>
                    </div>
                    <p className="text-[15px] text-muted-foreground leading-relaxed flex-1">
                        {v3.description}
                    </p>
                    <div className="space-y-4 bg-muted/30 p-6 rounded-2xl border border-border/50 w-full">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-muted-foreground">Endpoint</span>
                            <code className="text-[13px] font-mono font-bold text-foreground bg-background px-2.5 py-1 rounded border border-border">/api/v3/analyze</code>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-muted-foreground">Maks. Kapasite</span>
                            <span className="text-[16px] font-bold text-foreground">{v3.maxChars.toLocaleString("tr-TR")} Karakter</span>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-border/50">
                            <span className="text-sm font-semibold text-muted-foreground">Tam URL</span>
                            <code className="text-[11px] font-mono text-muted-foreground/80 break-all">{v3.baseUrl}</code>
                        </div>
                    </div>
                </div>

                {/* V4 Kartı (Önerilen) */}
                <div className="p-8 rounded-3xl border-2 border-destructive bg-card space-y-6 shadow-lg relative transform transition-all hover:-translate-y-1 flex flex-col h-full">
                    <div className="absolute -top-4 right-8">
                        <span className="text-[11px] font-bold px-5 py-2 rounded-full bg-destructive text-destructive-foreground uppercase tracking-widest shadow-xl">
                            ⭐ Önerilen Sürüm
                        </span>
                    </div>
                    <div className="flex items-center justify-between border-b border-border pb-6">
                        <div className="flex items-center gap-4">
                            <span className="text-3xl font-bold text-foreground tracking-tighter">V4</span>
                            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 uppercase tracking-widest">
                                {v4.status}
                            </span>
                        </div>
                    </div>
                    <p className="text-[15px] text-muted-foreground leading-relaxed flex-1">
                        {v4.description}
                    </p>
                    <div className="space-y-4 bg-destructive/5 p-6 rounded-2xl border border-destructive/20 w-full overflow-hidden">
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-semibold text-muted-foreground whitespace-nowrap">Endpoint</span>
                            <code className="text-[13px] font-mono font-bold text-destructive bg-destructive/10 px-2.5 py-1 rounded border border-destructive/20 break-all">/analyze</code>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-muted-foreground">Maks. Kapasite</span>
                            <span className="text-[16px] font-bold text-destructive">{v4.maxChars.toLocaleString("tr-TR")} Karakter</span>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-destructive/20">
                            <span className="text-sm font-semibold text-muted-foreground">Tam URL</span>
                            <code className="text-[11px] font-mono text-muted-foreground/80 break-all">{v4.baseUrl}</code>
                        </div>
                    </div>
                </div>

            </div>

            {/* Teknik Karşılaştırma Tablosu */}
            <div className="space-y-6 w-full pt-4">
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-3 border-b border-border pb-4">
                    <Milestone size={28} className="text-muted-foreground" />
                    Teknik Karşılaştırma
                </h2>
                <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-colors duration-300 w-full">
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-[15px] text-left border-collapse">
                            <thead>
                                <tr className="bg-muted/50 border-b border-border">
                                    <th className="px-8 py-5 font-bold text-muted-foreground uppercase tracking-widest text-[11px]">Özellik</th>
                                    <th className="px-8 py-5 font-bold text-muted-foreground uppercase tracking-widest text-[11px] text-center w-56">V3 (Legacy)</th>
                                    <th className="px-8 py-5 font-bold text-destructive uppercase tracking-widest text-[11px] text-center w-56">V4 (Hibrit)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                <tr className="hover:bg-muted/40 transition-colors group">
                                    <td className="px-8 py-5 font-semibold text-foreground">Endpoint Adresi</td>
                                    <td className="px-8 py-5 text-center font-mono text-[13px] text-muted-foreground">/api/v3/analyze</td>
                                    <td className="px-8 py-5 text-center font-mono text-[13px] font-bold text-destructive group-hover:bg-destructive/5 transition-colors">/analyze</td>
                                </tr>
                                <tr className="hover:bg-muted/40 transition-colors bg-muted/10 group">
                                    <td className="px-8 py-5 font-semibold text-foreground">Karakter Limiti</td>
                                    <td className="px-8 py-5 text-center font-semibold text-muted-foreground">5.000</td>
                                    <td className="px-8 py-5 text-center font-bold text-destructive group-hover:bg-destructive/5 transition-colors">10.000</td>
                                </tr>
                                <tr className="hover:bg-muted/40 transition-colors group">
                                    <td className="px-8 py-5 font-semibold text-foreground">Destek Durumu</td>
                                    <td className="px-8 py-5 text-center">
                                        <span className="text-[10px] font-bold px-3 py-1.5 rounded border bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-500/20 uppercase tracking-widest">Kaldırıldı</span>
                                    </td>
                                    <td className="px-8 py-5 text-center group-hover:bg-destructive/5 transition-colors">
                                        <span className="text-[10px] font-bold px-3 py-1.5 rounded border bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 uppercase tracking-widest">Aktif</span>
                                    </td>
                                </tr>
                                <tr className="hover:bg-muted/40 transition-colors bg-muted/10 group">
                                    <td className="px-8 py-5 font-semibold text-foreground">Motor Tipi</td>
                                    <td className="px-8 py-5 text-center font-semibold text-muted-foreground text-[14px]">Sadece Kural (Regex)</td>
                                    <td className="px-8 py-5 text-center font-bold text-destructive text-[14px] group-hover:bg-destructive/5 transition-colors">LLM + Kural (Hibrit)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Kullanım Örnekleri */}
            <div className="space-y-6 w-full pt-4">
                <h2 className="text-2xl font-bold text-foreground">cURL İstek Örnekleri</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
                    
                    {/* V3 Örneği */}
                    <div className="space-y-3 flex flex-col h-full group">
                        <div className="flex items-center gap-2 px-1 mb-2">
                            <span className="text-[12px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">V3 Legacy</span>
                        </div>
                        <div className="w-full rounded-2xl overflow-hidden bg-[#1e1e1e] border border-border shadow-inner">
                            <DocsCodeBlock
                                code={`curl -X POST "${MIZAN_BASE_URL}/api/v3/analyze" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "text": "The goverment in Turkiye has taked a new decision yesterday."\n  }'`}
                                title="V3 — Sadece Regex"
                                language="bash"
                            />
                        </div>
                    </div>

                    {/* V4 Örneği */}
                    <div className="space-y-3 flex flex-col h-full group">
                        <div className="flex items-center gap-2 px-1 mb-2">
                            <span className="text-[12px] font-bold uppercase tracking-widest text-destructive flex items-center gap-1.5">
                                <CheckCircle2 size={16} /> V4 Güncel
                            </span>
                        </div>
                        <div className="w-full rounded-2xl overflow-hidden bg-[#1e1e1e] border border-border shadow-inner">
                            <DocsCodeBlock
                                code={`curl -X POST "${MIZAN_BASE_URL}/analyze" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "text": "The goverment in Turkiye has taked a new decision yesterday."\n  }'`}
                                title="V4 — Hibrit (LLM + Regex)"
                                language="bash"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Migration İpucu Paneli */}
            <div className="flex items-start gap-5 p-8 rounded-3xl bg-destructive/5 border border-destructive/20 transition-all hover:bg-destructive/10 group w-full">
                <ArrowUpRight size={32} className="text-destructive shrink-0 mt-0.5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                <div className="text-[15px] text-foreground leading-relaxed space-y-2 w-full">
                    <p className="font-bold text-destructive uppercase tracking-widest text-[11px]">Sürüm Yükseltme (Migration) Kılavuzu</p>
                    <p className="text-muted-foreground leading-relaxed">
                        Mevcut V3 (Sadece Regex) entegrasyonunuzu yapay zeka destekli V4'e geçirmek son derece kolaydır. İstek yapısı aynı kalmakla birlikte, V4 size dönen sonuçlarda <strong>derin bağlamsal analizler</strong> ve 2 kat daha yüksek karakter limiti sunar. Kodunuzdaki endpoint adresini 
                        <code className="mx-1.5 px-2 py-0.5 rounded bg-muted text-muted-foreground font-mono text-[13px] border border-border line-through">/api/v3/analyze</code> yerine doğrudan 
                        <code className="mx-1.5 px-2 py-0.5 rounded bg-destructive/10 text-destructive font-bold font-mono text-[13px] border border-destructive/20">/analyze</code> 
                        olarak güncellemeniz yeterlidir. Sistem sizi otomatik olarak yeni nesil hibrit motora bağlayacaktır.
                    </p>
                </div>
            </div>
        </div>
    );
}