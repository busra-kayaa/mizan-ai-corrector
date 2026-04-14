import { Menu, Moon, Sun, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router";
import { NAV_LINKS } from "../../core/constants/navigation";
import { useTheme } from "../../core/contexts/ThemeContext";

export function Header() {
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const isDark = theme === "dark";

    const renderNavLink = (to: string, label: string, isMobile = false) => {
        const isActive = location.pathname === to;
        const baseClass = isMobile
            ? "py-2 px-3 rounded transition-colors"
            : "transition-colors";

        const activeClass = isActive
            ? "text-destructive font-semibold " + (isMobile ? "bg-destructive/10" : "")
            : "text-foreground hover:text-destructive " + (isMobile ? "hover:bg-muted" : "");

        return (
            <Link
                key={to}
                to={to}
                onClick={() => isMobile && setMobileMenuOpen(false)}
                className={`${baseClass} ${activeClass}`}
            >
                {label}
            </Link>
        );
    };

    return (
        <header className="app-header bg-card border-b border-border transition-colors duration-300 relative z-50">
            <div className="max-w-400 mx-auto w-full h-full flex items-center justify-between px-6 lg:px-8 py-3.5">

                {/* SOL KISIM: Sadece Logo */}
                <div className="flex items-center">
                    <Link to="/" className="text-3xl font-bold text-foreground hover:text-destructive transition-colors tracking-tight">
                        Mizan
                    </Link>
                </div>

                {/* SAĞ KISIM: Menüler + Tema Butonu + Mobil Menü */}
                <div className="flex items-center gap-6 lg:gap-8">
                    
                    <nav className="hidden md:flex gap-6 lg:gap-8 text-[15px] font-medium items-center">
                        {NAV_LINKS.map(link => renderNavLink(link.to, link.label))}
                    </nav>

                    <div className="hidden md:block w-px h-6 bg-border" />

                    <button
                        onClick={toggleTheme}
                        className="flex items-center gap-2 px-3 py-2 rounded-full bg-background border border-border hover:border-destructive transition-all duration-300 shadow-sm"
                    >
                        <Sun size={16} className={isDark ? 'text-muted-foreground' : 'text-destructive'} />
                        <div className="w-px h-4 bg-border" />
                        <Moon size={16} className={isDark ? 'text-destructive' : 'text-muted-foreground'} />
                    </button>

                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-secondary text-foreground"
                    >
                        {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>

            {mobileMenuOpen && (
                <div className="md:hidden border-t border-border bg-card absolute w-full shadow-lg">
                    <nav className="flex flex-col p-4 gap-3">
                        {NAV_LINKS.map(link => renderNavLink(link.to, link.label, true))}
                    </nav>
                </div>
            )}
        </header>
    );
}