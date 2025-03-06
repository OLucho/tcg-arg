"use client"

import { useState } from "react"
import { Menu } from "lucide-react"
import Link from "next/link"
import type { PokemonSet } from "~/types"
import { Sidebar } from "./sidebar"

interface HeaderProps {
    seriesGroups: Record<string, PokemonSet[]>
}

export function Header({ seriesGroups }: HeaderProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="relative">
            {/* Botón de apertura */}
            <header className="navbar bg-base-200 shadow">
                <div className="flex-none">
                    <button onClick={() => setIsOpen(true)} className="btn btn-square btn-ghost">
                        <Menu />
                    </button>
                </div>
                <div className="flex-1">
                    <Link href="/" className="text-xl font-bold text-white hover:text-primary transition-colors">
                        TCG-Arg
                    </Link>
                </div>
            </header>

            {/* Sidebar con Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 z-40 transition-opacity ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
                onClick={() => setIsOpen(false)}
            ></div>

            <div
                className={`fixed top-0 left-0 w-64 h-full bg-base-200 z-50 shadow-lg transform transition-transform ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                <Sidebar seriesGroups={seriesGroups} onClose={() => setIsOpen(false)} />
            </div>
        </div>
    )
}

