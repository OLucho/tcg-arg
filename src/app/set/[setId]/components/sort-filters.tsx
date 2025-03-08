"use client"

import { ChevronUp, ChevronDown } from "lucide-react"

interface SortFiltersProps {
    currentSort: string
    sortDirection: "asc" | "desc"
    onSortChange: (sort: string) => void
    onDirectionChange: () => void
}

export default function SortFilters({ currentSort, sortDirection, onSortChange, onDirectionChange }: SortFiltersProps) {
    const sortOptions = [
        { id: "number", label: "Number" },
        { id: "name", label: "Name" },
        { id: "price", label: "Price" },
    ]

    return (
        <div className="flex gap-2 items-center">
            {sortOptions.map((option) => (
                <button
                    key={option.id}
                    onClick={() => onSortChange(option.id)}
                    className={`btn btn-sm ${currentSort === option.id ? "btn-primary" : "btn-ghost"}`}
                >
                    {option.label}
                    {currentSort === option.id && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                onDirectionChange()
                            }}
                            className="ml-1"
                        >
                            {sortDirection === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                    )}
                </button>
            ))}
        </div>
    )
}

