"use client"

import { ArrowLeft, Plus, Save, AlertTriangle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useMemo, useState } from "react"
import type { ApiList } from "../../useLists"
import type { PokemonCard, PokemonSet } from "~/types"
import AddCardsModal from "./add-cards-modal"

interface ListHeaderProps {
    list: ApiList & { cards: any[] }
    totalCards: number
    cards: PokemonCard[]
    seriesGroups?: Record<string, PokemonSet[]>
    hasUnsavedChanges?: boolean
    isSaving?: boolean
    onSaveChanges?: () => void
    onAddCard?: (card: PokemonCard) => void
}

export default function ListHeader({
    list,
    totalCards,
    cards,
    seriesGroups = {},
    hasUnsavedChanges = false,
    isSaving = false,
    onSaveChanges,
    onAddCard,
}: ListHeaderProps) {
    const [isAddCardsModalOpen, setIsAddCardsModalOpen] = useState(false)

    // Find the most valuable card for the background
    const mostValuableCard = useMemo(() => {
        return cards.reduce((maxCard, card) => {
            const currentPrice = Math.max(
                card.tcgplayer?.prices?.normal?.market ?? 0,
                card.tcgplayer?.prices?.holofoil?.market ?? 0,
                card.tcgplayer?.prices?.reverseHolofoil?.market ?? 0,
            )
            const maxPrice = Math.max(
                maxCard?.tcgplayer?.prices?.normal?.market ?? 0,
                maxCard?.tcgplayer?.prices?.holofoil?.market ?? 0,
                maxCard?.tcgplayer?.prices?.reverseHolofoil?.market ?? 0,
            )
            return currentPrice > maxPrice ? card : maxCard
        }, cards[0])
    }, [cards])

    // Calculate total list value
    const totalValue = useMemo(() => {
        return cards.reduce((total, card) => {
            const price = Math.max(
                card.tcgplayer?.prices?.normal?.market ?? 0,
                card.tcgplayer?.prices?.holofoil?.market ?? 0,
                card.tcgplayer?.prices?.reverseHolofoil?.market ?? 0,
            )
            return total + price
        }, 0)
    }, [cards])

    // Handle adding a card from the modal
    const handleAddCard = (card: PokemonCard) => {
        if (onAddCard) {
            onAddCard(card)
            // We don't close the modal anymore to allow adding multiple cards
        }
    }

    return (
        <div className="relative bg-base-200 overflow-hidden">
            {/* Background Image */}
            {mostValuableCard && (
                <div className="absolute inset-0 opacity-10">
                    <Image
                        src={mostValuableCard.images.large || "/placeholder.svg"}
                        alt={mostValuableCard.name}
                        fill
                        className="object-cover blur-md"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-base-200/80 to-base-200"></div>
                </div>
            )}

            {/* Content */}
            <div className="relative">
                {/* Navigation */}
                <div className="container mx-auto px-4 py-3">
                    <Link href="/lists" className="btn btn-ghost btn-sm gap-2">
                        <ArrowLeft size={16} />
                        My Lists
                    </Link>
                </div>

                {/* Main Content */}
                <div className="container mx-auto px-4 pb-4">
                    <div className="flex flex-col gap-6">
                        {/* Title and Description - Textos más grandes */}
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2">{list.name}</h1>
                            {list.description && <p className="text-lg text-gray-400">{list.description}</p>}
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div className="bg-base-300/50 backdrop-blur-sm rounded-lg p-3">
                                <div className="text-sm text-gray-400 mb-1">Created By</div>
                                <div className="font-semibold text-white text-lg">{list.user.name}</div>
                            </div>

                            <div className="bg-base-300/50 backdrop-blur-sm rounded-lg p-3">
                                <div className="text-sm text-gray-400 mb-1">Created On</div>
                                <div className="font-semibold text-white text-lg">{new Date(list.createdAt).toLocaleDateString()}</div>
                            </div>

                            <div className="bg-base-300/50 backdrop-blur-sm rounded-lg p-3">
                                <div className="text-sm text-gray-400 mb-1"># of Cards</div>
                                <div className="font-semibold text-white text-lg">
                                    {totalCards}/{list.cardCount || "∞"}
                                </div>
                            </div>

                            <div className="bg-base-300/50 backdrop-blur-sm rounded-lg p-3">
                                <div className="text-sm text-gray-400 mb-1">List Value</div>
                                <div className="font-semibold text-green-400 text-lg">${totalValue.toFixed(2)}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons and Notifications - Moved to a separate section */}
            <div className="bg-base-300 py-4 border-b border-base-content/10">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* Unsaved Changes Warning */}
                        {hasUnsavedChanges && (
                            <div className="alert alert-warning max-w-lg">
                                <AlertTriangle className="h-5 w-5" />
                                <span>You have unsaved changes. Don't forget to save your list!</span>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-2 ml-auto">
                            {hasUnsavedChanges && (
                                <button onClick={onSaveChanges} className="btn btn-success gap-2" disabled={isSaving}>
                                    {isSaving ? (
                                        <>
                                            <span className="loading loading-spinner loading-sm"></span>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={20} />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            )}
                            <button
                                onClick={() => setIsAddCardsModalOpen(true)}
                                className="btn btn-primary gap-2"
                                disabled={isSaving}
                            >
                                <Plus size={20} />
                                Add Cards
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Cards Modal */}
            <AddCardsModal
                isOpen={isAddCardsModalOpen}
                onClose={() => setIsAddCardsModalOpen(false)}
                seriesGroups={seriesGroups}
                onAddCard={handleAddCard}
            />
        </div>
    )
}

