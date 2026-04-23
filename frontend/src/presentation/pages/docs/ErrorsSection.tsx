import { Activity, FileWarning, Info, ShieldAlert, Terminal } from "lucide-react";
import {
    ERROR_RESPONSE_EXAMPLE,
    HTTP_STATUS_CODES,
    VALIDATION_ERROR_EXAMPLE
} from "../../../core/constants/docs-content";
import { DocsCodeBlock } from "../../components/docs/DocsCodeBlock";

function StatusBadge({ code }: { code: number }) {
    let color = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"; 
    
    if (code >= 500) {
        color = "bg-destructive/10 text-destructive border-destructive/20";
    } else if (code >= 400) {
        color = "bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-500/20";
    } 
    
    return (
        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[12px] font-mono font-bold border ${color}`}>
            {code}
        </span>
    );
}

export function ErrorsSection() {
    return (
        <div className="w-full space-y-12 animate-in fade-in duration-500">
            
            {/* Header Alanı */}
            <div className="space-y-4">
                <h1 className="text-4xl font-extrabold text-foreground tracking-tight">
                    Hata Yönetimi (Errors)
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed w-full">
                    Mizan API, entegrasyon sürecinizde karşılaştığınız sorunları tanımlamak için standart <strong>HTTP yanıt kodlarını</strong> kullanır. Hatalar, sistem standartlarına uygun olarak öngörülebilir ve detaylı bir JSON formatında döndürülür.
                </p>
            </div>

            {/* Hata Yanıt Formatı Kartları */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-3 border-b border-border pb-4">
                    <ShieldAlert size={28} className="text-destructive" />
                    Hata Yanıt Formatları
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
                    
                    {/* Standart Hata Kartı */}
                    <div className="bg-card border border-border rounded-3xl p-8 flex flex-col h-full space-y-5 shadow-sm hover:border-destructive/30 transition-all group">
                        <div className="flex items-center gap-3">
                            <Terminal size={22} className="text-muted-foreground group-hover:text-destructive transition-colors" />
                            <h3 className="text-lg font-bold text-foreground">Sistem Hataları (403, 429, 499, 503)</h3>
                        </div>
                        <p className="text-[14px] text-muted-foreground leading-relaxed mb-4">
                            Güvenlik engelleri, hız sınırları veya motor yükleme durumlarında dönen standart hata mesajı formatıdır.
                        </p>
                        <div className="w-full rounded-xl overflow-hidden bg-[#1e1e1e] border border-border shadow-inner">
                            <DocsCodeBlock
                                code={JSON.stringify(ERROR_RESPONSE_EXAMPLE, null, 2)}
                                language="json"
                            />
                        </div>
                    </div>

                    {/* 422 Doğrulama Hatası Kartı */}
                    <div className="bg-card border border-border rounded-3xl p-8 flex flex-col h-full space-y-5 shadow-sm hover:border-amber-500/30 transition-all group">
                        <div className="flex items-center gap-3">
                            <FileWarning size={22} className="text-muted-foreground group-hover:text-amber-500 transition-colors" />
                            <h3 className="text-lg font-bold text-foreground">Doğrulama Hatası (422)</h3>
                        </div>
                        <p className="text-[14px] text-muted-foreground leading-relaxed mb-4">
                            Payload yapısı bozuk olduğunda veya <strong>10.000 karakter</strong> sınırı aşıldığında Pydantic motorundan dönen detaylı hata raporudur.
                        </p>

                        <div className="w-full rounded-xl overflow-hidden bg-[#1e1e1e] border border-border shadow-inner">
                            <DocsCodeBlock
                                code={JSON.stringify(VALIDATION_ERROR_EXAMPLE, null, 2)}
                                language="json" 
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Toplu İşlem Hata Mantığı (YENİ) */}
            <div className="flex items-start gap-6 p-8 rounded-3xl border border-border bg-linear-to-r from-card to-muted/20 shadow-sm">
                <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-500 shrink-0">
                    <Activity size={28} />
                </div>
                <div className="space-y-3">
                    <h3 className="text-lg font-bold text-foreground italic uppercase tracking-tight">Toplu İşlem Hata Yaklaşımı (Batch)</h3>
                    <p className="text-[14px] text-muted-foreground leading-relaxed">
                        Toplu analiz (<code>/batch</code>) modunda sunucu, satırları atomik olarak işler. Bir satırda motor hatası oluşması tüm süreci durdurmaz; ilgili satır için <code>"status": "error"</code> dönerken, diğer başarılı satırlar işlenmeye devam eder (Kısmi Başarı).
                    </p>
                </div>
            </div>

            {/* HTTP Status Codes Tablosu */}
            <div className="space-y-5 w-full pt-4">
                <h2 className="text-2xl font-bold text-foreground">HTTP Durum Kodları Referansı</h2>
                <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm w-full transition-colors">
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead>
                                <tr className="bg-muted/50 border-b border-border">
                                    <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-widest text-[11px] w-24">Kod</th>
                                    <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-widest text-[11px] w-56">Durum</th>
                                    <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-widest text-[11px]">Açıklama</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {HTTP_STATUS_CODES.map((item) => (
                                    <tr key={item.code} className="hover:bg-muted/40 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <StatusBadge code={item.code} />
                                        </td>
                                        <td className="px-6 py-4 font-mono text-[13px] font-bold text-foreground group-hover:text-destructive transition-colors">
                                            {item.label}
                                        </td>
                                        <td className="px-6 py-4 text-[14px] text-muted-foreground leading-relaxed">
                                            {item.description}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Programatik İpucu Paneli */}
            <div className="flex items-start gap-5 p-8 rounded-2xl bg-destructive/5 border border-destructive/20 transition-all hover:bg-destructive/10 group w-full">
                <Info size={28} className="text-destructive shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <div className="text-[15px] text-foreground leading-relaxed space-y-2">
                    <p className="font-bold text-destructive uppercase tracking-widest text-[11px]">Entegrasyon İpucu</p>
                    <p className="text-muted-foreground leading-relaxed">
                        API yanıtlarında <strong>499 (Client Closed Request)</strong> kodu alıyorsanız, bu genellikle istemci tarafındaki <code>AbortController</code>'ın ağ isteğini kestiğini gösterir. Bu bir hata değil, kaynak tasarrufu için tasarlanmış bir kontrol mekanizmasıdır.
                    </p>
                </div>
            </div>
        </div>
    );
}