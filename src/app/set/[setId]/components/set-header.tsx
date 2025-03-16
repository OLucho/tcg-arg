"use client"

import { useMemo } from "react"
import Image from "next/image"
import type { PokemonSet, PokemonCard, CardVariants } from "~/types"

interface SetHeaderProps {
    setDetails: PokemonSet
    cards: PokemonCard[]
    cardVariants: Record<string, CardVariants>
}

export default function SetHeader({ setDetails, cards, cardVariants }: SetHeaderProps) {
    // Calcular el progreso total incluyendo variantes y el progreso de cartas únicas
    const { totalPossible, totalCollected, progressPercentage, uniqueProgress } = useMemo(() => {
        let possible = 0
        let collected = 0
        const uniqueCardsTotal = cards.length
        let uniqueCardsCollected = 0

        // Contar todas las variantes posibles y coleccionadas
        cards.forEach((card) => {
            // Contar variantes disponibles
            const availableVariants = card.tcgplayer?.prices
                ? Object.keys(card.tcgplayer.prices).filter((key) => ["normal", "holofoil", "reverseHolofoil"].includes(key))
                    .length
                : 1 // Si no hay precios, asumimos al menos la versión normal

            possible += availableVariants

            // Contar variantes coleccionadas
            const variants = cardVariants[card.id]
            if (variants) {
                let cardVariantsCollected = 0
                if (variants.normal) cardVariantsCollected++
                if (variants.holofoil) cardVariantsCollected++
                if (variants.reverseHolofoil) cardVariantsCollected++
                collected += cardVariantsCollected

                // Si tiene al menos una variante, contar como carta única coleccionada
                if (cardVariantsCollected > 0) {
                    uniqueCardsCollected++
                }
            }
        })

        const masterSetPercentage = (collected / possible) * 100
        const uniquePercentage = (uniqueCardsCollected / uniqueCardsTotal) * 100

        return {
            totalPossible: possible,
            totalCollected: collected,
            progressPercentage: Math.round(masterSetPercentage * 100) / 100,
            uniqueProgress: Math.round(uniquePercentage * 100) / 100,
        }
    }, [cards, cardVariants])

    return (
        <div className="bg-base-200">
            {/* Hero section con el logo grande */}
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-between gap-8">
                    {/* Logo del set */}
                    <div className="flex-1">
                        {setDetails.images.logo && (
                            <div className="relative w-full max-w-md h-32">
                                <Image
                                    src={setDetails.images.logo || "/placeholder.svg"}
                                    alt={setDetails.name}
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                        )}
                    </div>

                    {/* Símbolo del set y barra de progreso en horizontal */}
                    <div className="flex items-center gap-4">
                        {setDetails.images.symbol && (
                            <div className="relative w-12 h-12 flex-shrink-0">
                                <Image
                                    src={setDetails.images.symbol || "/placeholder.svg"}
                                    alt={`${setDetails.name} Symbol`}
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                        )}

                        {/* Barra de progreso */}
                        <div className="w-full max-w-md space-y-2">
                            {/* Barra principal - Progreso de cartas únicas */}
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm text-gray-400">Set Progress ({uniqueProgress}%)</span>
                                    <span className="text-sm text-gray-400">
                                        {Math.round((uniqueProgress * cards.length) / 100)}/{cards.length} Cards
                                    </span>
                                </div>
                                <div className="w-full bg-base-300 rounded-full h-3">
                                    <div className="bg-primary h-3 rounded-full transition-all" style={{ width: `${uniqueProgress}%` }} />
                                </div>
                            </div>

                            {/* Barra secundaria - Progreso del master set */}
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm text-gray-400">Master Set ({progressPercentage}%)</span>
                                    <span className="text-sm text-gray-400">
                                        {totalCollected}/{totalPossible} Variants
                                    </span>
                                </div>
                                <div className="w-full bg-base-300 rounded-full h-2">
                                    <div
                                        className="bg-yellow-400 h-2 rounded-full transition-all"
                                        style={{ width: `${progressPercentage}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid de información */}
            <div className="border-t border-base-300">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4 py-4">
                        <div className="space-y-1">
                            <div className="text-sm text-gray-400">Set Name</div>
                            <div className="font-medium">{setDetails.name}</div>
                        </div>

                        <div className="space-y-1">
                            <div className="text-sm text-gray-400">Series</div>
                            <div className="font-medium text-blue-400">{setDetails.series}</div>
                        </div>

                        <div className="space-y-1">
                            <div className="text-sm text-gray-400">Release Date</div>
                            <div className="font-medium">{new Date(setDetails.releaseDate).toLocaleDateString()}</div>
                        </div>

                        <div className="space-y-1">
                            <div className="text-sm text-gray-400">Cartas totales</div>
                            <div className="font-medium">{cards.length}</div>
                        </div>

                        <div className="space-y-1">
                            <div className="text-sm text-gray-400">Most Expensive Card</div>
                            <div className="font-medium">
                                {
                                    cards.reduce(
                                        (max, card) => {
                                            const price = Math.max(
                                                card.tcgplayer?.prices?.normal?.market ?? 0,
                                                card.tcgplayer?.prices?.holofoil?.market ?? 0,
                                                card.tcgplayer?.prices?.reverseHolofoil?.market ?? 0,
                                            )
                                            return price > max.price ? { name: card.name, price } : max
                                        },
                                        { name: "-", price: 0 },
                                    ).name
                                }
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="text-sm text-gray-400">Full Set Market Value</div>
                            <div className="font-medium text-green-400">
                                $
                                {cards
                                    .reduce((total, card) => {
                                        const price = Math.min(
                                            card.tcgplayer?.prices?.normal?.market ?? Number.POSITIVE_INFINITY,
                                            card.tcgplayer?.prices?.holofoil?.market ?? Number.POSITIVE_INFINITY,
                                            card.tcgplayer?.prices?.reverseHolofoil?.market ?? Number.POSITIVE_INFINITY,
                                        )
                                        return total + (price === Number.POSITIVE_INFINITY ? 0 : price)
                                    }, 0)
                                    .toFixed(2)}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="text-sm text-gray-400">Your Set Value</div>
                            <div className="font-medium text-green-400">
                                $
                                {cards
                                    .reduce((total, card) => {
                                        const variants = cardVariants[card.id]
                                        if (!variants) return total

                                        let variantTotal = 0
                                        if (variants.normal) variantTotal += card.tcgplayer?.prices?.normal?.market ?? 0
                                        if (variants.holofoil) variantTotal += card.tcgplayer?.prices?.holofoil?.market ?? 0
                                        if (variants.reverseHolofoil) variantTotal += card.tcgplayer?.prices?.reverseHolofoil?.market ?? 0

                                        return total + variantTotal
                                    }, 0)
                                    .toFixed(2)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

