"use client"
import { ArrowBigLeft } from "lucide-react";
import Sidebar from "./sidebar";
import { useRouter } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    return (
        <div className="flex min-h-screen overflow-hidden">
            <Sidebar />
            <main className="flex-1 p-4 pb-12 h-screen overflow-y-auto">
                <span onClick={() => router.back()} className="flex cursor-pointer items-center gap-1 hover:text-gray-800 hover:scale-105 border rounded-full w-fit px-4 font-bold ">
                    <ArrowBigLeft  />
                    <p>Voltar</p>
                </span>
                {children}
            </main>
        </div>
    );
}