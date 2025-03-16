"use client"

import { Grid, BookOpen } from "lucide-react"

interface ListToolbarProps {
    searchTerm: string
    onSearchChange: (value: string) => void
    currentSort: string
    sortDirection: "asc" | "desc"
    onSortChange: (sort: string) => void
    onDirectionChange: () => void
    viewMode: "grid" | "binder"
    onViewModeChange: (mode: "grid" | "binder") => void
}

export default function ListToolbar({
    searchTerm,
    onSearchChange,
    currentSort,
    sortDirection,
    onSortChange,
    onDirectionChange,
    viewMode,
    onViewModeChange,
}: ListToolbarProps) {
    const sortOptions = [
        { id: "number", label: "Number" },
        { id: "name", label: "Name" },
        { id: "rarity", label: "Rarity" },
        { id: "artist", label: "Artist" },
        { id: "released", label: "Released" },
    ]

    return (
        <div className="bg-base-200 border-t border-base-300">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between gap-4">
                    {/* Búsqueda y ordenamiento */}
                    <div className="flex-1 flex items-center gap-4">
                        <input
                            type="text"
                            placeholder="Name or Number..."
                            className="input input-bordered w-full max-w-xs"
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />

                        <div className="flex gap-2">
                            {sortOptions.map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => onSortChange(option.id)}
                                    className={`btn btn-sm ${currentSort === option.id ? "btn-primary" : "btn-ghost"}`}
                                >
                                    {option.label}
                                    {currentSort === option.id && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Controles de vista */}
                    <div className="flex gap-2">
                        <button
                            className={`btn btn-sm ${viewMode === "grid" ? "btn-primary" : "btn-ghost"}`}
                            onClick={() => onViewModeChange("grid")}
                        >
                            <Grid size={16} />
                        </button>
                        <button
                            className={`btn btn-sm ${viewMode === "binder" ? "btn-primary" : "btn-ghost"}`}
                            onClick={() => onViewModeChange("binder")}
                        >
                            <BookOpen size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

