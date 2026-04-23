'use client'

import Link from "next/link"
import { useState } from "react"
import { cn } from '@/lib/utils'
import { ArrowLeft, LayoutDashboard, Users, CalendarDays } from "lucide-react"
import { usePathname } from "next/navigation"

const navItems = [
  { href: "/dashboard", label: "Home",    Icon: LayoutDashboard },
  { href: "/members",   label: "Membros", Icon: Users },
  { href: "/events",    label: "Eventos", Icon: CalendarDays },
]

export default function Sidebar() {
  const [expanded, setExpanded] = useState(true)
  const pathname = usePathname()

  return (
    <>
      {/* ── Desktop: sidebar colapsável ── */}
      <aside className={cn(
        "hidden md:flex flex-col bg-gray-800 text-white p-4 h-dvh sticky left-0 top-0 transition-all duration-500",
        expanded ? "w-64" : "w-14"
      )}>
        {expanded && (
          <>
            <h2 className="text-2xl font-bold mb-4">Awakening</h2>
            <nav>
              <ul>
                {navItems.map(({ href, label, Icon }) => (
                  <li key={href} className="mb-2">
                    <Link
                      href={href}
                      className={cn(
                        "flex items-center gap-3 py-2 px-4 rounded hover:bg-gray-700 transition-colors",
                        pathname === href && "bg-gray-700"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </>
        )}

        {!expanded && (
          <nav className="mt-2">
            <ul>
              {navItems.map(({ href, label, Icon }) => (
                <li key={href} className="mb-2">
                  <Link
                    href={href}
                    title={label}
                    className={cn(
                      "flex justify-center py-2 px-2 rounded hover:bg-gray-700 transition-colors",
                      pathname === href && "bg-gray-700"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <ArrowLeft
          className={cn(
            "mt-auto cursor-pointer transition-transform self-end mr-1",
            !expanded ? "rotate-180" : ""
          )}
          onClick={() => setExpanded(!expanded)}
        />
      </aside>

      {/* ── Mobile: bottom nav ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-gray-800 border-t border-gray-700">
        <ul className="flex">
          {navItems.map(({ href, label, Icon }) => (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={cn(
                  "flex flex-col items-center gap-1 py-3 text-gray-400 hover:text-white transition-colors",
                  pathname === href && "text-white"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{label}</span>
                {pathname === href && (
                  <span className="absolute bottom-0 w-8 h-0.5 bg-white rounded-full" />
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Espaço para o conteúdo não ficar atrás do bottom nav */}
      <div className="md:hidden h-16" />
    </>
  )
}