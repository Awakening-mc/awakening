"use client"
import Sidebar from "./sidebar";
import { useRouter } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    return (
        <div className="flex min-h-screen overflow-hidden">
            <Sidebar />
            <main className="flex-1 p-4 pb-12 h-screen overflow-y-auto">
                <button
                    onClick={() => router.back()}
                    className="group inline-flex items-center gap-1.5 text-sm font-medium transition-all duration-150 hover:gap-2.5"
                >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
                        <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Voltar
                </button>
                {children}
            </main>
        </div>
    );
}