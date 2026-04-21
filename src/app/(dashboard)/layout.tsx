"use server"
import Sidebar from "./sidebar";


export default async function Layout({children}: {children: React.ReactNode}) {
    
    return (
        <div className="flex min-h-screen overflow-hidden">
            <Sidebar />
            <main className="flex-1 p-4 pb-12 h-screen overflow-y-auto">
                {children}
            </main>
        </div>
    );
}