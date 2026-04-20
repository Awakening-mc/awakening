'use client'

import Link from "next/link"
import { useState } from "react"
import { cn } from '@/lib/utils'
import { MoveLeft } from "lucide-react"
export default function Sidebar() {
    const [expanded, setExpanded] = useState(true)
    return (
        <aside className={cn("relative bg-gray-800 text-white p-4 h-screen", expanded ? "w-64" : "w-10")}>
            {expanded &&
                <>
                    <h2 className="text-2xl font-bold mb-4">Awakening</h2>
                    <nav>
                        <ul>
                            <li className="mb-2">
                                <Link href="/dashboard" className="block py-2 px-4 rounded hover:bg-gray-700">Home</Link>
                            </li>
                            <li className="mb-2">
                                <Link href="/members" className="block py-2 px-4 rounded hover:bg-gray-700">Membros</Link>
                            </li>
                            <li className="mb-2">
                                <Link href="/events" className="block py-2 px-4 rounded hover:bg-gray-700">Eventos</Link>
                            </li>
                        </ul>
                    </nav>
                </>
            }
            <MoveLeft className={cn("absolute bottom-4 right-2 cursor-pointer transition-transform", !expanded ? "rotate-180" : "")} onClick={() => setExpanded(!expanded)} />
        </aside>
    )
}