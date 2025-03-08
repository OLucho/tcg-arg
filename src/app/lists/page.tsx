"use client"

import Link from "next/link"
import { Plus } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

type List = {
    id: string
    name: string
    isPublic: boolean
    cardCount: number
    completionPercentage: number
    lastUpdated: number
}

export default function ListsPage() {
    const [lists, setLists] = useState<List[]>([])
    const [loading, setLoading] = useState(true)
    const searchParams = useSearchParams()

    const newParam = searchParams.get("new")

    useEffect(() => {
        const loadLists = () => {
            setLoading(true)

            try {
                const listsJSON = localStorage.getItem("pokemonTCGLists")
                console.log("Listas en localStorage:", listsJSON)

                if (listsJSON) {
                    const parsedLists = JSON.parse(listsJSON) as List[]
                    console.log("Listas parseadas:", parsedLists)

                    if (Array.isArray(parsedLists)) {
                        setLists(parsedLists)
                    } else {
                        console.error("Las listas no son un array:", parsedLists)
                        setLists([])
                    }
                } else {
                    console.log("No hay listas en localStorage")
                    setLists([])
                }
            } catch (error) {
                console.error("Error cargando listas:", error)
                setLists([])
            } finally {
                setLoading(false)
            }
        }

        loadLists()
    }, [newParam])

    if (loading) {
        return (
            <div className="container mx-auto p-4 bg-base-300 min-h-screen flex justify-center items-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        )
    }

    if (lists.length === 0) {
        return (
            <div className="container mx-auto p-4 bg-base-300 min-h-screen">
                <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] text-center">
                    <h1 className="text-2xl font-bold text-white mb-2">No Lists Yet</h1>
                    <p className="text-gray-400 mb-6">Create your first Pokémon TCG list.</p>
                    <Link href="/lists/create" className="btn btn-primary btn-lg">
                        <Plus size={20} />
                        Create New List
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-4 bg-base-300 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white">Mis Listas</h1>
                <Link href="/lists/create" className="btn btn-primary">
                    <Plus size={16} />
                    Crear Nueva Lista
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lists.map((list) => (
                    <div key={list.id} className="card bg-base-300 shadow-xl border border-base-200/20">
                        <div className="card-body">
                            <div className="flex justify-between items-start">
                                <h2 className="card-title text-white">{list.name}</h2>
                                <div className="badge badge-sm">{list.isPublic ? "Pública" : "Privada"}</div>
                            </div>
                            <p className="text-white">{list.cardCount} cartas</p>
                            <div className="w-full bg-base-200/20 rounded-full h-2.5 mt-2">
                                <div className="bg-primary h-2.5 rounded-full" style={{ width: `${list.completionPercentage}%` }}></div>
                            </div>
                            <div className="flex justify-between items-center text-sm mt-1">
                                <p className="text-right text-white">{list.completionPercentage}% completado</p>
                                <p className="text-gray-400">Actualizado: {new Date(list.lastUpdated).toLocaleDateString()}</p>
                            </div>
                            <div className="card-actions justify-end mt-4">
                                <Link href={`/lists/${list.id}`} className="btn btn-primary">
                                    Ver Lista
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

