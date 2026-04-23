import { ArrowUpRight, CheckCircle2, Layers, Milestone, Zap } from "lucide-react";
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
                    Mizan API, kurumsal entegrasyonların kırılmasını önlemek amacıyla geriye dönük uyumlu sürümler sunar. Mevcut <strong>V4 (Hibrit)</strong> mimarisi, eski sürümlere göre daha yüksek kapasite ve toplu işlem yetenekleri sunar.
                </p>
            </div>

            {/* Versiyon Kartları */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
                
                {/* V3 Kartı (Legacy) */}
                <div className="p-8 rounded-3xl border border-border bg-card space-y-6 shadow-sm transition-all hover:border-muted-foreground/30 flex flex-col h-full group opacity-80 hover:opacity-100">
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
                            <span className="text-sm font-semibold text-muted-foreground">Ana Endpoint</span>
                            <code className="text-[13px] font-mono font-bold text-foreground bg-background px-2.5 py-1 rounded border border-border">/api/v3/analyze</code>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-muted-foreground">Kapasite</span>
                            <span className="text-[16px] font-bold text-foreground">{v3.maxChars.toLocaleString("tr-TR")} Karakter</span>
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
                            <span className="text-sm font-semibold text-muted-foreground whitespace-nowrap">Endpointler</span>
                            <div className="flex gap-2">
                                <code className="text-[12px] font-mono font-bold text-destructive bg-destructive/10 px-2 py-1 rounded border border-destructive/20">/analyze</code>
                                <code className="text-[12px] font-mono font-bold text-destructive bg-destructive/10 px-2 py-1 rounded border border-destructive/20">/batch</code>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-muted-foreground">Kapasite (Chunking)</span>
                            <span className="text-[16px] font-bold text-destructive">{v4.maxChars.toLocaleString("tr-TR")} Karakter</span>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-destructive/20">
                            <span className="text-sm font-semibold text-muted-foreground">Mimari</span>
                            <span className="text-[12px] font-bold text-foreground uppercase tracking-tighter flex items-center gap-1">
                                <Layers size={14} className="text-destructive" /> Hybrid Nöral Motor
                            </span>
                        </div>
                    </div>
                </div>

            </div>

            {/* Teknik Karşılaştırma Tablosu */}
            <div className="space-y-6 w-full pt-4">
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-3 border-b border-border pb-4">
                    <Milestone size={28} className="text-muted-foreground" />
                    Mimari Karşılaştırma
                </h2>
                <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-colors duration-300 w-full">
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-[15px] text-left border-collapse">
                            <thead>
                                <tr className="bg-muted/50 border-b border-border">
                                    <th className="px-8 py-5 font-bold text-muted-foreground uppercase tracking-widest text-[11px]">Özellik</th>
                                    <th className="px-8 py-5 font-bold text-muted-foreground uppercase tracking-widest text-[11px] text-center w-56">V3 (Legacy)</th>
                                    <th className="px-8 py-5 font-bold text-destructive uppercase tracking-widest text-[11px] text-center w-56">V4 (Güncel)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                <tr className="hover:bg-muted/40 transition-colors group">
                                    <td className="px-8 py-5 font-semibold text-foreground">Motor Tipi</td>
                                    <td className="px-8 py-5 text-center text-muted-foreground">Kural Tabanlı (Deterministic)</td>
                                    <td className="px-8 py-5 text-center font-bold text-destructive">Hibrit (Regex + LLM)</td>
                                </tr>
                                <tr className="hover:bg-muted/40 transition-colors bg-muted/10 group">
                                    <td className="px-8 py-5 font-semibold text-foreground">Karakter Limiti</td>
                                    <td className="px-8 py-5 text-center text-muted-foreground">5.000 (Sabit)</td>
                                    <td className="px-8 py-5 text-center font-bold text-destructive">10.000 (Dinamik Chunking)</td>
                                </tr>
                                <tr className="hover:bg-muted/40 transition-colors group">
                                    <td className="px-8 py-5 font-semibold text-foreground">Toplu İşlem (Batch)</td>
                                    <td className="px-8 py-5 text-center text-muted-foreground text-xs uppercase opacity-50 italic">Desteklenmiyor</td>
                                    <td className="px-8 py-5 text-center font-bold text-emerald-500 uppercase text-xs flex items-center justify-center gap-1">
                                        <CheckCircle2 size={14} /> Aktif (/batch)
                                    </td>
                                </tr>
                                <tr className="hover:bg-muted/40 transition-colors bg-muted/10 group">
                                    <td className="px-8 py-5 font-semibold text-foreground">Hizalama (Alignment)</td>
                                    <td className="px-8 py-5 text-center text-muted-foreground">Sözdizimsel</td>
                                    <td className="px-8 py-5 text-center font-bold text-destructive">Diff Algoritması</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Kullanım Örnekleri */}
            <div className="space-y-6 w-full pt-4">
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                    <Zap size={24} className="text-destructive" />
                    Endpoint Güncelleme
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
                    
                    {/* V3 Örneği */}
                    <div className="space-y-3 flex flex-col h-full group">
                        <div className="flex items-center gap-2 px-1 mb-2">
                            <span className="text-[12px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">V3 Legacy Endpoint</span>
                        </div>
                        <div className="w-full rounded-2xl overflow-hidden bg-[#1e1e1e] border border-border shadow-inner opacity-70">
                            <DocsCodeBlock
                                code={`POST ${MIZAN_BASE_URL}/api/v3/analyze`}
                                language="bash"
                            />
                        </div>
                    </div>

                    {/* V4 Örneği */}
                    <div className="space-y-3 flex flex-col h-full group">
                        <div className="flex items-center gap-2 px-1 mb-2">
                            <span className="text-[12px] font-bold uppercase tracking-widest text-destructive">V4 Modern Endpoint (Önerilen)</span>
                        </div>
                        <div className="w-full rounded-2xl overflow-hidden bg-[#1e1e1e] border border-border shadow-inner">
                            <DocsCodeBlock
                                code={`POST ${MIZAN_BASE_URL}/analyze`}
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
                    <p className="font-bold text-destructive uppercase tracking-widest text-[11px]">Sürüm Yükseltme Kılavuzu</p>
                    <p className="text-muted-foreground leading-relaxed">
                        V4 sürümü, V3'ün sunduğu tüm Regex kurallarını barındırırken üzerine <strong>Llama 3.1</strong> zekasını ekler. Entegrasyonunuzu taşırken sadece URL adresini güncellemeniz yeterlidir; JSON çıktı şeması geriye dönük uyumludur ancak V4'te çok daha zengin metadata verisi sunulur.
                    </p>
                </div>
            </div>
        </div>
    );
}