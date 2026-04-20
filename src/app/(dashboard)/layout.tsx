"use server"
import Sidebar from "./sidebar";


export default async function Layout({children}: {children: React.ReactNode}) {
    
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 px-4 pb-4 h-screen overflow-hidden">
                {children}
            </main>
        </div>
    );
}