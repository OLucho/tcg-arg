"use client"

import Link from "next/link"
import { Plus, Star, Pencil, Trash2, ListChecks, AlertCircle, CheckCircle, Info, AlertTriangle, X } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { type ApiList, useLists } from "./useLists"


export function PageClient({ serverLists }: { serverLists: ApiList[] }) {
    const searchParams = useSearchParams()
    const newParam = searchParams.get("new")
    const { lists, notification, toggleFavorite, deleteList, showNotification } = useLists(serverLists)

    // Check if we just created a new list
    useEffect(() => {
        if (newParam === "true") {
            showNotification("Lista creada correctamente", "success")
        }
    }, [newParam, showNotification])

    // Function to get the appropriate icon for the notification
    const getNotificationIcon = (type: string) => {
        switch (type) {
            case "success":
                return <CheckCircle className="h-5 w-5" />
            case "error":
                return <AlertCircle className="h-5 w-5" />
            case "warning":
                return <AlertTriangle className="h-5 w-5" />
            default:
                return <Info className="h-5 w-5" />
        }
    }

    return (
        <div className="min-h-screen bg-[#1a1d24]">
            <div className="container mx-auto px-4 py-8">
                {/* Header Section */}
                <div className="mb-12">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-3">My Lists</h1>
                            <p className="text-gray-400 text-lg">
                                Create your own personalized lists of Pokémon cards like "All Pikachu" or "Cards for Sale"
                            </p>
                        </div>
                        <Link href="/lists/create" className="btn btn-primary">
                            <Plus size={20} />
                            Create New List
                        </Link>
                    </div>
                </div>

                {/* Lists Grid */}
                {lists.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-16 h-16 mb-6 text-gray-400">
                            <ListChecks size={64} />
                        </div>
                        <h2 className="text-2xl font-semibold text-white mb-2">No Lists Yet</h2>
                        <p className="text-gray-400 mb-8 max-w-md">
                            Start organizing your Pokémon card collection by creating your first list
                        </p>
                        <Link href="/lists/create" className="btn btn-primary btn-lg">
                            <Plus size={20} />
                            Create Your First List
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {lists.map((list) => (
                            <div
                                key={list.id}
                                className="card bg-[#242832] shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
                            >
                                <div className="card-body">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h2 className="card-title text-white">{list.name}</h2>
                                            <div className="flex gap-2 mt-1">
                                                <span className="badge badge-sm">{list.isPublic ? "Public" : "Private"}</span>
                                                <span className="badge badge-sm badge-outline">{list.cardCount} cards</span>
                                            </div>
                                        </div>
                                        <button
                                            className={`btn btn-ghost btn-sm btn-circle ${list.isFavorite ? "text-yellow-400" : "text-gray-500"}`}
                                            onClick={() => toggleFavorite(list.id)}
                                        >
                                            <Star size={20} />
                                        </button>
                                    </div>

                                    {list.description && <p className="text-gray-400 text-sm mt-2">{list.description}</p>}

                                    <div className="mt-4">
                                        <div className="flex justify-between items-center text-sm mb-2">
                                            <span className="text-gray-400">Completion</span>
                                            <span className="text-gray-400">{list.completionPercentage}%</span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                            <div
                                                className="bg-primary h-2 rounded-full"
                                                style={{ width: `${list.completionPercentage}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="card-actions justify-between items-center mt-6">
                                        <div className="text-xs text-gray-400">Updated {new Date(list.updatedAt).toLocaleDateString()}</div>
                                        <div className="flex gap-2">
                                            <button className="btn btn-ghost btn-sm btn-circle" onClick={() => deleteList(list.id)}>
                                                <Trash2 size={18} className="text-red-400" />
                                            </button>
                                            <Link href={`/lists/${list.id}`} className="btn btn-primary btn-sm">
                                                <Pencil size={16} />
                                                Edit
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Notification Toast */}
                {notification && (
                    <div className="toast toast-end z-50">
                        <div className={`alert alert-${notification.type} flex items-center`}>
                            <div className="flex items-center gap-2">
                                {getNotificationIcon(notification.type)}
                                <span>{notification.message}</span>
                            </div>
                            <button className="btn btn-ghost btn-xs btn-circle ml-2" onClick={() => showNotification("", "info")}>
                                <X size={14} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

