
export function Footer() {
    return (
        <footer className="app-footer border-t border-border bg-background transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-center gap-3 text-sm">
                
                <div className="bg-destructive px-3 py-1 rounded transition-colors duration-300">
                    <span className="text-destructive-foreground font-bold tracking-wide">TRT</span>
                </div>
                
                <span className="text-muted-foreground font-medium transition-colors duration-300">
                    Bilgi Teknolojileri Dairesi Başkanlığı
                </span>
                
                <span className="text-muted-foreground opacity-70 transition-colors duration-300">
                    © 2026
                </span>
                
            </div>
        </footer>
    );
}