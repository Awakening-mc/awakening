"use server"
import {redirect} from "next/navigation";
import Sidebar from "./sidebar";


export default async function Layout({children}: {children: React.ReactNode}) {
    
    return (
        <div className="flex min-h-screen overflow-y-auto">
            <Sidebar />
            <main className="flex-1 p-4 h-screen overflow-auto">
                {children}
            </main>
        </div>
    );
}