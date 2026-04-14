import { AlertTriangle, BookOpen, Braces, ChevronDown, GitBranch, Menu, ShieldCheck } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { DOCS_MENU } from "../../../core/constants/docs-content";

const iconComponents: Record<string, React.ElementType> = {
    BookOpen,
    KeyRound: ShieldCheck, 
    ShieldCheck, 
    AlertTriangle,
    Braces,
    GitBranch,
};

export function DocsSidebar() {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const scrollTimer = setTimeout(() => {
            window.scrollTo(0, 0);
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;

            const mainContainer = document.querySelector('main');
            if (mainContainer) {
                mainContainer.scrollTo(0, 0);
                mainContainer.scrollTop = 0;
            }

            const scrollableDivs = document.querySelectorAll('[class*="overflow-y-auto"]');
            scrollableDivs.forEach((div) => {
                if (!div.classList.contains('w-64')) { 
                    div.scrollTop = 0;
                }
            });
        }, 10); 

        return () => clearTimeout(scrollTimer);
    }, [location.pathname]);

    const isActive = (path: string) => {
        if (path === "/how-to-use") {
            return location.pathname === "/how-to-use" || location.pathname === "/how-to-use/";
        }
        return location.pathname === path;
    };

    return (
        <>
            {/* 🖥️ MASAÜSTÜ SIDEBAR */}
            <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-border bg-transparent transition-colors duration-300 fixed top-20 left-auto h-[calc(100vh-5rem)] overflow-y-auto no-scrollbar px-0">
                <div className="pt-2 pb-4">
                    <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground/70 pl-2.5">
                        API Referansı
                    </h2>
                </div>
                <nav className="flex-1 space-y-1 pb-10">
                    {DOCS_MENU.map((item) => {
                        const Icon = iconComponents[item.iconName] || BookOpen;
                        const active = isActive(item.path);
                        return (
                            <Link
                                key={item.id}
                                to={item.path}
                                className={`
                                    flex items-center gap-3 px-4 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-200
                                    ${active
                                        ? "bg-red-500/10 text-red-600 dark:text-rose-400 border-l-[3px] border-red-600 dark:border-rose-500 pl-3.25" 
                                        : "text-muted-foreground hover:bg-red-500/5 hover:text-red-600 dark:hover:text-rose-400"
                                    }
                                `}
                            >
                                <Icon 
                                    size={18} 
                                    className={active ? "text-red-600 dark:text-rose-400" : "text-muted-foreground/60 group-hover:text-red-600"} 
                                />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* 📱 MOBİL AÇILIR MENÜ */}
            <div className="lg:hidden w-full relative z-40 mb-6">
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="w-full flex items-center justify-between px-5 py-4 rounded-xl border border-border bg-muted/30 hover:bg-muted/50 transition-colors duration-300 shadow-sm"
                >
                    <div className="flex items-center gap-3">
                        <Menu size={20} className="text-muted-foreground" />
                        <span className="font-bold text-foreground text-[15px]">Bölüme git</span>
                    </div>
                    <ChevronDown 
                        size={20} 
                        className={`text-muted-foreground transition-transform duration-300 ${isMobileMenuOpen ? "rotate-180" : ""}`} 
                    />
                </button>

                {isMobileMenuOpen && (
                    <>
                        <div className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
                        <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-40 animate-in fade-in slide-in-from-top-2 duration-200">
                            <nav className="flex flex-col py-2">
                                {DOCS_MENU.map((item) => {
                                    const active = isActive(item.path);
                                    return (
                                        <Link
                                            key={item.id}
                                            to={item.path}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={`
                                                px-5 py-3.5 text-[14px] font-medium transition-all duration-200
                                                ${active
                                                    ? "bg-red-500/10 text-red-600 dark:text-rose-400 border-l-[3px] border-red-600 dark:border-rose-500 pl-4.25 font-bold" 
                                                    : "text-muted-foreground hover:bg-red-500/5"
                                                }
                                            `}
                                        >
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}