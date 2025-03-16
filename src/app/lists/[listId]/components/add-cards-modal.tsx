"use client"

import { X, Search, ChevronDown, RefreshCw } from "lucide-react"
import type { PokemonSet, PokemonCard, CardVariants } from "~/types"
import CardItem from "~/app/components/cards/card-item"
import { useAddCardsModal } from "../hooks/useAddCardsModal"

interface AddCardsModalProps {
    isOpen: boolean
    onClose: () => void
    seriesGroups?: Record<string, PokemonSet[]>
    onAddCard: (card: PokemonCard) => void
}

export default function AddCardsModal({ isOpen, onClose, seriesGroups = {}, onAddCard }: AddCardsModalProps) {
    const {
        searchTerm,
        setSearchTerm,
        selectedSet,
        setSelectedSet,
        cards,
        hasCards,
        isLoading,
        handleSearch,
        handleCardClick,
    } = useAddCardsModal(onAddCard)

    // Create empty cardVariants for the search results
    const emptyCardVariants: Record<string, CardVariants> = {}

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 overflow-y-auto">
            <div className="my-8 w-full max-w-4xl bg-[#1a1d24] rounded-lg shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-800">
                    <h2 className="text-xl font-semibold text-white">Add Cards to List</h2>
                    <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
                        <X size={20} />
                    </button>
                </div>

                {/* Search Area */}
                <div className="p-4 space-y-4">
                    {/* Search Bar */}
                    <div className="flex gap-4">
                        <div className="relative flex-1">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Search size={18} className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="input input-bordered w-full pl-10 bg-[#12151c]"
                                placeholder="Search Cards by Name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleSearch()
                                    }
                                }}
                            />
                        </div>

                        {/* Set Selection Dropdown */}
                        <div className="dropdown">
                            <div
                                tabIndex={0}
                                role="button"
                                className="input input-bordered bg-[#12151c] px-4 min-w-[200px] flex items-center justify-between"
                            >
                                <span className="text-gray-400">{selectedSet?.name || "Select Set"}</span>
                                <ChevronDown size={16} className="text-gray-400" />
                            </div>
                            <div tabIndex={0} className="dropdown-content z-[1] w-[300px]">
                                <ul className="menu menu-sm p-2 bg-[#12151c] rounded-lg shadow-xl max-h-96 overflow-y-auto">
                                    {Object.entries(seriesGroups || {}).map(([series, sets]) => (
                                        <li key={series}>
                                            <div className="font-bold text-gray-400 px-2 py-1">{series}</div>
                                            <ul>
                                                {sets.map((set) => (
                                                    <li key={set.id}>
                                                        <button
                                                            className={`px-4 py-2 text-left hover:bg-base-300 ${selectedSet?.id === set.id ? "bg-primary text-primary-content" : ""}`}
                                                            onClick={() => setSelectedSet({ id: set.id, name: set.name })}
                                                        >
                                                            {set.name}
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Search Button */}
                        <button className="btn btn-primary" onClick={handleSearch} disabled={isLoading}>
                            {isLoading ? (
                                <span className="loading loading-spinner loading-sm"></span>
                            ) : (
                                <>
                                    <RefreshCw size={16} />
                                    Search
                                </>
                            )}
                        </button>
                    </div>

                    {/* Results Grid */}
                    <div className="mt-4">
                        {isLoading ? (
                            <div className="flex justify-center py-12">
                                <span className="loading loading-spinner loading-lg"></span>
                            </div>
                        ) : !hasCards ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="w-16 h-16 bg-[#12151c] rounded-lg flex items-center justify-center mb-4">
                                    <Search size={32} className="text-gray-400" />
                                </div>
                                <h3 className="font-semibold mb-1">No Cards Found</h3>
                                <p className="text-sm text-gray-400 max-w-md">
                                    Search for cards by name or select a set, then click the Search button
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {cards.map((card) => (
                                    <div key={card.id} onClick={() => handleCardClick(card)} className="cursor-pointer">
                                        <CardItem
                                            card={card}
                                            cardVariants={emptyCardVariants}
                                            onToggleVariant={() => { }}
                                            onCardClick={handleCardClick}
                                            showVariantButtons={false}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

