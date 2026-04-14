import { Activity, Ban, Clock, FileWarning, Globe, ServerCrash, ShieldAlert, Zap } from "lucide-react";
import { useState } from "react";
import { AUTH_CODE_SAMPLES } from "../../../core/constants/docs-content";
import { DocsCodeBlock } from "../../components/docs/DocsCodeBlock";

const TAB_ORDER = ["curl", "python", "typescript", "java", "php", "go", "ruby"] as const;

export function AuthenticationSection() {
    const [activeTab, setActiveTab] = useState<string>("curl");

    return (
        <div className="w-full space-y-12 animate-in fade-in duration-500">
            
            {/* Header Alanı */}
            <div className="space-y-4">
                <h1 className="text-4xl font-extrabold text-foreground tracking-tight">
                    Güvenlik, Erişim ve Hata Yönetimi
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed w-full">
                    Mizan API'si, sistem güvenliğini sağlamak ve entegrasyonu kolaylaştırmak amacıyla statik API anahtarları yerine modern <strong>Alan Adı Kısıtlaması (CORS)</strong> ve <strong>IP Bazlı Hız Sınırlandırması (Rate-Limit)</strong> kullanır.
                </p>
            </div>

            {/* CORS Bilgi Paneli */}
            <div className="space-y-4 w-full">
                <div className="flex items-start gap-6 p-8 rounded-3xl border border-border bg-card shadow-sm group hover:border-destructive/30 transition-all">
                    <div className="p-4 bg-destructive/10 rounded-2xl text-destructive shrink-0 transition-transform group-hover:scale-110">
                        <Globe size={28} />
                    </div>
                    <div className="space-y-4 w-full">
                        <p className="text-[16px] text-foreground leading-relaxed">
                            API'miz, yetkisiz kullanımı engellemek için yalnızca önceden onaylanmış kurumsal kök alan adlarından (Origin) gelen istekleri kabul eder. Başarılı bir bağlantı için istek başlıklarında herhangi bir özel 
                            <code className="mx-2 px-2 py-0.5 rounded bg-muted text-muted-foreground line-through font-mono text-[14px] border border-border">X-API-Key</code> 
                            parametresi göndermenize <strong>gerek yoktur.</strong>
                        </p>
                        <div className="p-5 bg-muted/50 border-l-4 border-destructive rounded-r-2xl">
                            <p className="text-[14px] text-muted-foreground leading-relaxed flex items-start gap-2">
                                <span className="mt-0.5">💡</span>
                                <span>
                                    <strong className="text-foreground">Domain İzinleri (Whitelist):</strong> Eğer uygulamanız yerel geliştirme ortamı (<code className="font-mono text-[12px]">localhost:5173</code>) dışında farklı bir domain üzerinden çalışacaksa, adresinizi yetkili listesine ekletmek için sistem yöneticisiyle iletişime geçmelisiniz.
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* HTTPS & Güvenlik Uyarısı */}
            <div className="flex items-start gap-5 p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 transition-all w-full">
                <ShieldAlert size={26} className="text-amber-500 shrink-0 mt-0.5" />
                <div className="text-[15px] text-foreground leading-relaxed space-y-1">
                    <p className="font-bold text-amber-500 uppercase tracking-widest text-xs">Uçtan Uca Güvenlik Zorunluluğu</p>
                    <p>Tüm API etkileşimleri <strong>HTTPS</strong> protokolü üzerinden gerçekleştirilmelidir. Standart HTTP üzerinden yapılan veri transferleri güvenlik sebebiyle ağ geçidinde (Gateway) reddedilir.</p>
                </div>
            </div>

            {/* Kod Örnekleri ve Tab Yapısı */}
            <div className="space-y-6 w-full">
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-foreground">API İstek Örnekleri</h2>
                    <p className="text-[15px] text-muted-foreground leading-relaxed">
                        API anahtarı yönetimine ihtiyaç duymadan, doğrudan standart HTTP POST metodunu kullanarak Mizan analiz motoruna metinlerinizi gönderebilirsiniz.
                    </p>
                </div>

                <div className="rounded-2xl overflow-hidden border border-border bg-card shadow-sm transition-colors duration-300 w-full">
                    <div className="flex border-b border-border bg-muted/50 transition-colors duration-300 overflow-x-auto custom-scrollbar">
                        {TAB_ORDER.map((key) => {
                            const sample = AUTH_CODE_SAMPLES[key];
                            const isActive = activeTab === key;
                            return (
                                <button
                                    key={key}
                                    type="button" 
                                    onClick={() => setActiveTab(key)}
                                    className={`
                                        px-8 py-4 text-[13px] font-bold uppercase tracking-widest transition-all relative whitespace-nowrap outline-none
                                        ${isActive
                                            ? "text-foreground bg-background"
                                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                                        }
                                    `}
                                >
                                    {sample.label}
                                    {isActive && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-destructive" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                    
                    <div className="border-none bg-white dark:bg-[#1e1e1e] transition-colors duration-300">
                        <DocsCodeBlock 
                            code={AUTH_CODE_SAMPLES[activeTab].code} 
                            language={AUTH_CODE_SAMPLES[activeTab].language}
                            isTabContent={true}
                        />
                    </div>
                </div>
            </div>

            {/* HTTP Durum Kodları (Status Codes) - YENİ EKLENENLER */}
            <div className="space-y-6 w-full pt-6">
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-foreground flex items-center gap-3 border-b border-border pb-4">
                        <Zap size={28} className="text-destructive" />
                        HTTP Durum Kodları (Status Codes)
                    </h2>
                    <p className="text-[15px] text-muted-foreground leading-relaxed pt-2">
                        API'nin sağlıklı çalışması ve sistemin korunması adına, istekleriniz aşağıdaki durumlarda spesifik hata kodlarıyla reddedilir:
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
                    
                    <div className="flex items-start gap-4 p-5 rounded-xl border border-border bg-card shadow-sm hover:border-red-500/30 transition-colors">
                        <Ban className="text-red-500 shrink-0 mt-0.5" size={22} />
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <span className="font-mono font-bold text-red-500 text-sm">403 Forbidden</span>
                            </div>
                            <p className="text-sm font-bold text-foreground mb-1">Erişim Reddedildi</p>
                            <p className="text-[13px] text-muted-foreground leading-relaxed">İstek yapılan Origin (alan adı) sunucunun izin listesinde (CORS) bulunmuyor.</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 p-5 rounded-xl border border-border bg-card shadow-sm hover:border-amber-500/30 transition-colors">
                        <FileWarning className="text-amber-500 shrink-0 mt-0.5" size={22} />
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <span className="font-mono font-bold text-amber-500 text-sm">422 Unprocessable Entity</span>
                            </div>
                            <p className="text-sm font-bold text-foreground mb-1">Geçersiz Format</p>
                            <p className="text-[13px] text-muted-foreground leading-relaxed">Gönderilen metin formatı hatalı veya belirlenen maksimum karakter sınırı (10.000) aşıldı.</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 p-5 rounded-xl border border-border bg-card shadow-sm hover:border-blue-500/30 transition-colors">
                        <Clock className="text-blue-500 shrink-0 mt-0.5" size={22} />
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <span className="font-mono font-bold text-blue-500 text-sm">429 Too Many Requests</span>
                            </div>
                            <p className="text-sm font-bold text-foreground mb-1">Rate Limit Aşıldı</p>
                            <p className="text-[13px] text-muted-foreground leading-relaxed">Tekil analiz için dakikada 20, toplu analiz için 5 istek sınırı aşıldı. Spam koruması aktif.</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 p-5 rounded-xl border border-border bg-card shadow-sm hover:border-slate-500/30 transition-colors">
                        <Activity className="text-slate-500 shrink-0 mt-0.5" size={22} />
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <span className="font-mono font-bold text-slate-500 text-sm">499 Client Closed Request</span>
                            </div>
                            <p className="text-sm font-bold text-foreground mb-1">İşlem İptali</p>
                            <p className="text-[13px] text-muted-foreground leading-relaxed">Kullanıcı ağ bağlantısını kopardığı veya sekmeyi kapattığı için sunucu işlemi tasarruf amacıyla durdurdu.</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 p-5 rounded-xl border border-border bg-card shadow-sm hover:border-purple-500/30 transition-colors md:col-span-2">
                        <ServerCrash className="text-purple-500 shrink-0 mt-0.5" size={22} />
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <span className="font-mono font-bold text-purple-500 text-sm">503 Service Unavailable</span>
                            </div>
                            <p className="text-sm font-bold text-foreground mb-1">Motor Başlatılıyor</p>
                            <p className="text-[13px] text-muted-foreground leading-relaxed">Mizan Hibrit Llama motoru ilk uyandırmada belleğe (RAM) yükleniyor. 10-15 saniye içinde sistem hazır olacaktır.</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}