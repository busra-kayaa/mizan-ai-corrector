import { ArrowRight, Cpu, FileJson, Globe, Layers, ShieldCheck } from "lucide-react";
import { Link } from "react-router";
import { MIZAN_BASE_URL } from "../../../core/constants/docs-content";

export function AboutSection() {
    
    const handleScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="w-full space-y-12 animate-in fade-in duration-700">
            
            {/* Hero / Giriş Alanı */}
            <div className="space-y-6">
                <h1 className="text-4xl font-extrabold text-foreground tracking-tight">
                    Mizan Servisi Hakkında
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed w-full">
                    Mizan, <strong>TRT Bilgi Teknolojileri Dairesi Başkanlığı</strong> tarafından geliştirilen; deterministik kural tabanlı algoritmalar ile <strong>Llama 3.1</strong> tabanlı nöral ağları birleştiren yüksek performanslı bir metin düzeltme ekosistemidir. Kurumsal terminolojiyi korurken, dilbilgisi ve yazım hatalarını sıfıra yakın hata payıyla analiz eder.
                </p>
            </div>

            {/* Özellik Kartları */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <div className="flex items-start gap-5 p-8 rounded-2xl border border-border bg-card shadow-sm hover:border-destructive/30 transition-all group">
                    <div className="p-3 bg-destructive/10 rounded-xl text-destructive shrink-0 group-hover:scale-110 transition-transform">
                        <Globe size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-foreground text-lg mb-1.5">Modern REST API</h3>
                        <p className="text-[14px] text-muted-foreground leading-relaxed">
                            Standart HTTP fiilleri ve öngörülebilir URL yapısı ile her türlü kurumsal yazılıma dakikalar içinde entegre edilebilir.
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-5 p-8 rounded-2xl border border-border bg-card shadow-sm hover:border-destructive/30 transition-all group">
                    <div className="p-3 bg-destructive/10 rounded-xl text-destructive shrink-0 group-hover:scale-110 transition-transform">
                        <ShieldCheck size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-foreground text-lg mb-1.5">Katı Güvenlik Mimarisi</h3>
                        <p className="text-[14px] text-muted-foreground leading-relaxed">
                            Veriler asla dış bulut servislerine çıkmaz. HTTPS protokolü ve domain tabanlı CORS koruması ile kurum ağında güvenle çalışır.
                        </p>
                    </div>
                </div>
            </div>

            {/* Gelişmiş Analiz Teknolojisi */}
            <div className="space-y-8">
                <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-bold text-foreground">Analiz Teknolojisi</h2>
                    <p className="text-muted-foreground text-sm">Mizan mimarisi iki ana koldan veri işlemektedir:</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Hibrit Motor & Chunking */}
                    <div className="lg:col-span-2 p-8 rounded-3xl border border-border bg-linear-to-br from-card to-muted/30 shadow-sm relative overflow-hidden group hover:border-destructive/30 transition-all">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Cpu size={120} />
                        </div>
                        <div className="relative z-10 space-y-4">
                            <div className="flex items-center gap-3 text-destructive">
                                <Cpu size={24} />
                                <h3 className="text-xl font-bold">Mizan Hibrit Engine</h3>
                            </div>
                            <p className="text-[15px] text-muted-foreground leading-relaxed max-w-md">
                                Regex katmanı ile ön temizlik yapar, ardından Llama-3.1-8B nöral motoru ile bağlamsal analiz gerçekleştirir. <strong>10.000 karaktere kadar olan devasa metinleri</strong> hafıza aşımı yaşatmadan otomatik parçalar (Chunking) ve birleştirir.
                            </p>
                            <div className="flex flex-wrap gap-2 mt-4">
                                <span className="text-[10px] font-mono bg-background border border-border px-2 py-1 rounded uppercase font-bold">Local LLM</span>
                                <span className="text-[10px] font-mono bg-background border border-border px-2 py-1 rounded uppercase font-bold">Regex</span>
                                <span className="text-[10px] font-mono bg-destructive/10 text-destructive border border-destructive/20 px-2 py-1 rounded uppercase font-bold">Auto-Chunking</span>
                            </div>
                        </div>
                    </div>

                    {/* Toplu İşlem (Batch) */}
                    <div className="p-8 rounded-3xl border border-border bg-card shadow-sm hover:border-destructive/30 transition-all space-y-4 flex flex-col">
                        <div className="flex items-center gap-3 text-destructive">
                            <Layers size={24} />
                            <h3 className="text-xl font-bold">Batch Processing</h3>
                        </div>
                        <p className="text-[14px] text-muted-foreground leading-relaxed grow">
                            Çoklu dosya analizi için optimize edilmiştir. Sistem sağlığı için <strong>aynı anda 5 dosya</strong> ve <strong>satır başı 500 karakter</strong> sınırı ile çalışır. İşlemler ağ seviyesinde anında iptal edilebilir.
                        </p>
                        <div className="pt-4 mt-auto">
                            <code className="text-[12px] font-mono bg-muted px-3 py-1.5 rounded-lg text-foreground font-bold border border-border/50">/analyze/batch</code>
                        </div>
                    </div>
                </div>
            </div>

            {/* Teknik Bilgi Paneli */}
            <div className="p-10 rounded-4xl border border-border bg-muted/20 relative overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                            <FileJson size={20} className="text-destructive" />
                            Veri Standardı
                        </h3>
                        <p className="text-muted-foreground leading-relaxed text-[15px]">
                            Mizan, tüm yanıtları standart <strong>RFC 7159</strong> uyumlu JSON formatında döndürür. Atomik tokenizasyon kuralı ile her bir hatayı <i>(dilbilgisi, terminoloji, deascii vb.)</i> ayrı bir metadata objesi olarak raporlar. Diff algoritması ile mükemmel kelime hizalaması (alignment) sağlar.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-foreground">Temel Endpoint</h3>
                        <div className="p-4 rounded-xl bg-background border border-border font-mono text-sm text-destructive font-bold break-all shadow-inner">
                            {MIZAN_BASE_URL}
                        </div>
                        <p className="text-[12px] text-muted-foreground italic text-center">
                            Sadece yetkili IP adreslerinden ve beyaz listeye eklenmiş alan adlarından gelen istekler kabul edilir.
                        </p>
                    </div>
                </div>
            </div>

            {/* Hızlı Bağlantılar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                    to="/how-to-use/authentication"
                    onClick={handleScrollToTop} 
                    className="flex items-center justify-between p-6 rounded-2xl border border-border bg-card hover:border-destructive transition-all group shadow-sm"
                >
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-foreground uppercase tracking-widest">Güvenlik & Erişim</span>
                        <span className="text-xs text-muted-foreground mt-1 italic">CORS ve Rate-Limit kuralları</span>
                    </div>
                    <ArrowRight size={20} className="text-muted-foreground group-hover:text-destructive group-hover:translate-x-1 transition-all" />
                </Link>
                <Link
                    to="/how-to-use/metadata"
                    onClick={handleScrollToTop} 
                    className="flex items-center justify-between p-6 rounded-2xl border border-border bg-card hover:border-destructive transition-all group shadow-sm"
                >
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-foreground uppercase tracking-widest">Meta-Veri Yapısı</span>
                        <span className="text-xs text-muted-foreground mt-1 italic">Atomik JSON analiz çıktıları</span>
                    </div>
                    <ArrowRight size={20} className="text-muted-foreground group-hover:text-destructive group-hover:translate-x-1 transition-all" />
                </Link>
            </div>
        </div>
    );
}