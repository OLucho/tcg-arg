"use client"

import { Search, Plus, Archive, CheckCircle, AlertCircle, Copy } from "lucide-react"

interface EmptyStateProps {
    searchTerm: string
    onClearSearch: () => void
    activeTab?: string // Add this prop
}

export default function EmptyState({ searchTerm, onClearSearch, activeTab = "show-all" }: EmptyStateProps) {
    // If there's a search term, show search-specific empty state
    if (searchTerm) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 mb-6 bg-base-300 rounded-full flex items-center justify-center">
                    <Search size={32} className="text-gray-400" />
                </div>
                <h2 className="text-2xl font-semibold text-white mb-2">No Cards Found</h2>
                <p className="text-gray-400 mb-8 max-w-md">
                    No cards matching &quot;{searchTerm}&quot; were found in your list.
                </p>
                <button onClick={onClearSearch} className="btn btn-primary">
                    Clear Search
                </button>
            </div>
        )
    }

    // Tab-specific empty states
    switch (activeTab) {
        case "have":
            return (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-20 h-20 mb-6 bg-base-300 rounded-full flex items-center justify-center">
                        <CheckCircle size={40} className="text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-semibold text-white mb-2">No Cards Owned Yet</h2>
                    <p className="text-gray-400 mb-8 max-w-md">
                        You don't own any cards from this list yet. Mark cards as owned by toggling their variants.
                    </p>
                </div>
            )

        case "need":
            return (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-20 h-20 mb-6 bg-base-300 rounded-full flex items-center justify-center">
                        <AlertCircle size={40} className="text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-semibold text-white mb-2">Collection Complete!</h2>
                    <p className="text-gray-400 mb-8 max-w-md">Congratulations! You own all the cards in this list.</p>
                </div>
            )

        case "dupes":
            return (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-20 h-20 mb-6 bg-base-300 rounded-full flex items-center justify-center">
                        <Copy size={40} className="text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-semibold text-white mb-2">No Duplicate Cards</h2>
                    <p className="text-gray-400 mb-8 max-w-md">
                        You don't have any duplicate cards in this list. Cards with quantity greater than 1 will appear here.
                    </p>
                </div>
            )

        default:
            // Default empty state for "show-all" tab
            return (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-20 h-20 mb-6 bg-base-300 rounded-full flex items-center justify-center">
                        <Archive size={40} className="text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-semibold text-white mb-2">Your List is Empty</h2>
                    <p className="text-gray-400 mb-8 max-w-md">
                        Start building your collection by adding Pokémon cards to this list.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button className="btn btn-primary btn-lg gap-2">
                            <Plus size={20} />
                            Add Cards
                        </button>
                    </div>
                </div>
            )
    }
}

