import { Outlet } from "react-router";
import { DocsSidebar } from "../../components/docs/DocsSidebar";

export function DocsLayout() {
    return (
        <div className="w-full max-w-400 mx-auto px-6 lg:px-8 py-10 transition-colors duration-300">
            
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                
                <aside className="w-full lg:w-64 shrink-0">
                    <DocsSidebar />
                </aside>

                <main className="flex-1 min-w-0">
                    <Outlet />
                </main>
                
            </div>
            
        </div>
    );
}