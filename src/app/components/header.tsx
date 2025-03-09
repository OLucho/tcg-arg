"use client"
import { useState } from "react"
import { Menu, LogOut } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import type { PokemonSet } from "~/types"
import { Sidebar } from "./sidebar"
import { signOut } from "~/lib/auth-client"
import { useSession } from "../(auth)/(hooks)/useSession"

interface HeaderProps {
    seriesGroups: Record<string, PokemonSet[]>
}

export function Header({ seriesGroups = {} }: HeaderProps) {
    const [isOpen, setIsOpen] = useState(false)
    const { isLoggedIn, isFetching, refetchSession } = useSession()

    return (
        <div className="relative">
            {/* Header con botones de autenticación */}
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
                {!isFetching && <div className="flex flex-none gap-4">
                    {isLoggedIn ? (
                        <button type="submit" className="btn btn-secondary" onClick={() => signOut({
                            fetchOptions: {
                                onSuccess: async () => {
                                    await refetchSession()
                                    redirect("/sign-in")
                                }
                            }
                        })}>
                            <LogOut size={16} className="mr-2" />
                            Cerrar sesión
                        </button>
                    ) : (
                        <>
                            <button onClick={() => redirect("/sign-in")} className="btn btn-outline btn-primary">
                                Iniciar sesión
                            </button>
                            <button onClick={() => redirect("sign-up")} className="btn btn-primary">
                                Registrarse
                            </button>
                        </>
                    )}
                </div>}
            </header>

            {/* Sidebar con Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 z-40 transition-opacity ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
                onClick={() => setIsOpen(false)}
            ></div>

            <div
                className={`fixed top-0 left-0 w-80 h-full bg-base-200 z-50 shadow-lg transform transition-transform ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                <Sidebar seriesGroups={seriesGroups} />
            </div>
        </div>
    )
}

