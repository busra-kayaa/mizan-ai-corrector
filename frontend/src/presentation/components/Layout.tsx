import { Outlet } from "react-router";
import { Footer } from "./Footer";
import { Header } from "./Header";

export function Layout() {
    return (
        <div className="h-screen flex flex-col bg-background text-foreground transition-colors duration-300 overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto">
                <div className="page-container">
                    <Outlet />
                </div>
            </main>
            
            <Footer />
        </div>
    );
}