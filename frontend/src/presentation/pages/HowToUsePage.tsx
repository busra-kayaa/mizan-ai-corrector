import {
    AlertCircle,
    CheckCircle,
    Code,
    Database,
    FileText,
    Layers,
    Server,
    ShieldAlert,
    ShieldCheck,
    Zap
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { API_EXAMPLES, CODE_SAMPLES, SYSTEM_PROMPT_EXAMPLE, USAGE_STEPS } from "../../core/constants/api-docs";
import { CodeExampleTabs } from "../components/docs/CodeExampleTabs";
import { DocsCodeBlock } from "../components/docs/DocsCodeBlock";
import { RequestResponseExample } from "../components/docs/RequestResponseExample";

const iconMap = { FileText, Zap, CheckCircle };

export function HowToUsePage() {
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState<keyof typeof CODE_SAMPLES>("shell");
    
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    const copyToClipboard = (text: string) => {
        const textToCopy = typeof text === 'string' ? text : JSON.stringify(text, null, 2);
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="w-full py-10 space-y-12 font-sans transition-colors duration-300">

            {/* BAŞLIK ALANI */}
            <div className="space-y-4">
                <h1 className="text-4xl font-bold text-foreground tracking-tight">Nasıl Kullanılır?</h1>
                <p className="text-lg text-muted-foreground leading-relaxed w-full">
                    Mizan analiz platformunu hem kullanıcı dostu web arayüzümüz üzerinden hem de REST API entegrasyonu ile kendi kurumsal sistemlerinize bağlayarak kullanabilirsiniz. Gelişmiş <strong>Hibrit Yapay Zeka (Kural + LLM)</strong> motorumuzla metin düzeltme süreçlerinizi anında otomatize edin.
                </p>
            </div>

            {/* ADIMLAR (KARTLAR) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                {USAGE_STEPS.map((step, idx) => {
                    const Icon = iconMap[step.iconName as keyof typeof iconMap] || Code;
                    return (
                        <div key={idx} className="bg-card border border-border rounded-2xl p-8 shadow-sm hover:border-red-600/30 dark:hover:border-rose-400/30 transition-all group flex flex-col h-full">
                            <div className="w-14 h-14 bg-red-500/10 dark:bg-rose-500/10 rounded-xl flex items-center justify-center mb-6 text-red-600 dark:text-rose-400 group-hover:scale-110 transition-transform shrink-0">
                                <Icon size={28} />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-foreground">{step.title}</h3>
                            <p className="text-[15px] text-muted-foreground leading-relaxed">{step.description}</p>
                        </div>
                    );
                })}
            </div>

            {/* API ENTEGRASYONU ANA KART */}
            <div className="bg-card w-full p-8 md:p-10 rounded-3xl border border-border shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-border pb-6">
                    <div className="flex items-center gap-5">
                        <div className="p-4 bg-red-500/10 dark:bg-rose-500/10 rounded-2xl text-red-600 dark:text-rose-400">
                            <Server size={28} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-foreground">API Entegrasyonu</h2>
                            <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mt-1">
                                Hybrid Engine — Endpoint: <span className="text-foreground lowercase tracking-normal bg-muted px-2 py-0.5 rounded">{API_EXAMPLES.main.endpoint}</span>
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 bg-emerald-500/10 px-5 py-2.5 rounded-full border border-emerald-500/20">
                        <ShieldCheck size={16} className="text-emerald-500" />
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 tracking-widest uppercase">Güvenlik: CORS Korumalı</span>
                    </div>
                </div>

                <RequestResponseExample />
                
                <div className="mt-10 w-full space-y-4">
                    <h4 className="text-lg font-bold flex items-center gap-3 text-foreground">
                        <Database size={20} className="text-red-600 dark:text-rose-400" />
                        İstek Yapısı (Request)
                    </h4>
                    <p className="text-[15px] text-muted-foreground leading-relaxed">
                        Analiz isteklerinizi <strong>POST</strong> metodu ile iletebilirsiniz. Algoritmamız cümlenizi önce kural tabanlı (Regex) katmandan, ardından yapay zeka (LLM) katmanından geçirir. Sistem, güvenlik amacıyla yalnızca yetkilendirilmiş kurumsal alan adlarından (Domain/CORS) gelen istekleri kabul eder; ek bir API anahtarına ihtiyaç duyulmaz.
                    </p>
                    <div className="p-4 bg-red-500/5 dark:bg-rose-500/10 border border-red-500/20 dark:border-rose-500/20 rounded-xl w-full">
                        <p className="text-sm text-red-600 dark:text-rose-400">
                            <strong>Response Format:</strong> Başarılı analiz istekleri her zaman <code className="bg-red-500/10 dark:bg-rose-500/10 px-1.5 py-0.5 rounded font-bold">{API_EXAMPLES.main.response.status} OK</code> koduyla ve JSON formatında döner.
                        </p>
                    </div>
                </div>
            </div>
            
             {/*GELİŞMİŞ ANALİZ MODLARI */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                <div className="p-8 rounded-3xl border border-border bg-card shadow-sm hover:border-amber-500/30 transition-all group space-y-4">
                    <div className="flex items-center gap-3 text-amber-500 group-hover:scale-105 transition-transform">
                        <Zap size={26} />
                        <h3 className="text-xl font-bold">Hızlı Kontrol (Quick Check)</h3>
                    </div>
                    <p className="text-muted-foreground text-[15px] leading-relaxed">
                        Düşük gecikme süresi gerektiren anlık kontrol işlemleri için optimize edilmiştir. Sadece temel yazım ve noktalama hatalarına odaklanarak en hızlı yanıtı döner.
                    </p>
                    <div className="flex items-center gap-2 pt-2">
                        <code className="bg-muted px-2 py-1 rounded text-xs font-mono">POST /quick-check</code>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Max 1.000 Karakter</span>
                    </div>
                </div>

                <div className="p-8 rounded-3xl border border-border bg-card shadow-sm hover:border-red-600/30 dark:hover:border-rose-400/30 transition-all group space-y-4">
                    <div className="flex items-center gap-3 text-red-600 dark:text-rose-400 group-hover:scale-105 transition-transform">
                        <Layers size={26} />
                        <h3 className="text-xl font-bold">Toplu Analiz (Batch Process)</h3>
                    </div>
                    <p className="text-muted-foreground text-[15px] leading-relaxed">
                        Aynı anda birden fazla bağımsız cümleyi analiz etmek için kullanılır. Kurumsal raporlamalar ve uzun metin bloklarını parçalı işlemek için idealdir.
                    </p>
                    <div className="flex items-center gap-2 pt-2">
                        <code className="bg-muted px-2 py-1 rounded text-xs font-mono">POST /batch</code>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Max 20 Cümle</span>
                    </div>
                </div>
            </div>   
            {/* SİSTEM PROMPT ALANI */}
            <div className="w-full p-8 md:p-10 border border-border bg-card rounded-3xl shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-red-500/10 dark:bg-rose-500/10 rounded-xl text-red-600 dark:text-rose-400">
                        <Layers size={26} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">{SYSTEM_PROMPT_EXAMPLE.title}</h2>
                        <p className="text-sm text-muted-foreground font-medium mt-1">Bağlamsal Analiz Modu (Contextual Analysis)</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 items-start w-full">
                    <p className="text-[16px] text-muted-foreground leading-relaxed">
                        {SYSTEM_PROMPT_EXAMPLE.description} <code>system_instructions</code> parametresini kullanarak Mizan'a özel bir uzmanlık (örneğin; Hukuk, Tıp veya Akademik Editör) atayabilir, terminolojik düzeltmeleri bu bağlama göre yapmasını sağlayabilirsiniz.
                    </p>
                    <div className="w-full">
                        <DocsCodeBlock 
                            code={JSON.stringify(SYSTEM_PROMPT_EXAMPLE.payload, null, 2)}
                            title="// System Role Payload"
                            language="json"
                        />
                    </div>
                </div>
            </div>

            {/* KOD ÖRNEKLERİ TABLARI */}
            <div className="w-full">
                <CodeExampleTabs />
            </div>

            {/* HIZLI KONTROL & BATCH KARTLARI */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                <div className="bg-card p-8 rounded-2xl border border-border shadow-sm flex flex-col h-full">
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-3 mb-5">
                        <Zap size={22} className="text-amber-500" /> Hızlı Doğrulama (Quick Check)
                    </h3>
                    <div className="flex-1 w-full h-auto overflow-hidden">
                        <DocsCodeBlock 
                            code={JSON.stringify(API_EXAMPLES.quickCheck.response, null, 2)}
                            title="RESPONSE FORMAT"
                            language="json"
                        />
                    </div>
                </div>

                <div className="bg-card p-8 rounded-2xl border border-border shadow-sm flex flex-col h-full">
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-3 mb-5">
                        <Layers size={22} className="text-red-600 dark:text-rose-400" /> Toplu Analiz (Batch Process)
                    </h3>
                    <div className="flex-1 w-full h-auto overflow-hidden">
                        <DocsCodeBlock 
                            code={JSON.stringify(API_EXAMPLES.batch.payload, null, 2)}
                            title="REQUEST PAYLOAD"
                            language="json"
                        />
                    </div>
                </div>
            </div>

            {/* HATA YANITLARI */}
            <div className="p-8 md:p-10 border border-destructive/20 bg-destructive/5 rounded-3xl w-full">
                <div className="flex items-center gap-3 mb-8">
                    <ShieldAlert size={28} className="text-destructive" />
                    <h3 className="text-xl font-bold text-foreground">Hata Yanıt Formatları</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                    <div className="w-full">
                        <DocsCodeBlock 
                            code={JSON.stringify(API_EXAMPLES.error401, null, 2)}
                            title="// 401 Unauthorized (CORS / Yetkisiz Domain)"
                            language="json"
                        />
                    </div>
                    <div className="w-full">
                        <DocsCodeBlock 
                            code={JSON.stringify(API_EXAMPLES.error429, null, 2)}
                            title="// 429 Rate Limit Exceeded"
                            language="json"
                        />
                    </div>
                </div>
            </div>

            {/* BİLGİLENDİRME BANNERI */}
            <div className="flex items-start md:items-center gap-5 p-6 md:p-8 bg-amber-500/10 border border-amber-500/20 rounded-2xl w-full">
                <AlertCircle className="text-amber-600 dark:text-amber-500 shrink-0 mt-1 md:mt-0" size={32} />
                <p className="text-[16px] text-foreground leading-relaxed">
                    <strong className="text-amber-700 dark:text-amber-500">Önemli Hatırlatma:</strong> Sistem kararlılığını korumak için API erişimi IP bazlı olarak <strong>dakikada 20 istek (20 req/min)</strong> ile sınırlandırılmıştır. Daha yüksek limit talepleri ve kurumsal ağ (On-Premise) izinleri için TRT Bilgi Teknolojileri Dairesi ile iletişime geçebilirsiniz.
                </p>
            </div>

        </div>
    );
}