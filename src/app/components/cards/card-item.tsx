// Actualizar el componente CardItem para soportar la opción de ocultar botones de variantes
"use client"

import { memo } from "react"
import Image from "next/image"
import CardVariantsButtons from "./card-variants-buttons"
import type { CardVariants, PokemonCard } from "~/types"

interface CardItemProps {
    card: PokemonCard
    setDetails?: {
        printedTotal: number
    }
    cardVariants: Record<string, CardVariants>
    onToggleVariant: (cardId: string, variant: keyof CardVariants) => void
    onCardClick: (card: PokemonCard) => void
    showVariantButtons?: boolean // Nueva prop para controlar la visibilidad de los botones de variantes
}

const CardItem = memo(function CardItem({
    card,
    setDetails,
    cardVariants,
    onToggleVariant,
    onCardClick,
    showVariantButtons = true, // Por defecto, mostrar los botones
}: CardItemProps) {
    // Función para obtener las variantes disponibles para una carta
    const getAvailableVariants = (card: PokemonCard): (keyof CardVariants)[] => {
        if (!card.tcgplayer?.prices) {
            return ["normal"]
        }

        const variants: (keyof CardVariants)[] = []

        if (card.tcgplayer.prices.normal) variants.push("normal")
        if (card.tcgplayer.prices.holofoil) variants.push("holofoil")
        if (card.tcgplayer.prices.reverseHolofoil) variants.push("reverseHolofoil")

        return variants.length > 0 ? variants : ["normal"]
    }

    // Obtener las variantes disponibles para esta carta
    const availableVariants = getAvailableVariants(card)

    // Verificar si el usuario tiene TODAS las variantes disponibles
    const hasAllVariants =
        availableVariants.length > 0 &&
        availableVariants.every((variant) => {
            const hasVariant = cardVariants[card.id]?.[variant] === true
            return hasVariant
        })

    // Función para obtener el precio base de la carta (el más bajo disponible)
    const getBasePrice = (card: PokemonCard): number | null => {
        if (!card.tcgplayer?.prices) return null

        // Orden de prioridad: normal > reverseHolofoil > holofoil
        const priceOrder = ["normal", "reverseHolofoil", "holofoil"] as const

        for (const variant of priceOrder) {
            const price = card.tcgplayer.prices[variant]?.market
            if (price) return price
        }

        return null
    }

    const basePrice = getBasePrice(card)

    return (
        <div
            className="card bg-base-300 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 cursor-pointer"
            onClick={() => onCardClick(card)}
        >
            <figure className="px-4 pt-4 pb-0">
                <div className="relative w-full aspect-[2/3] group">
                    <Image
                        src={card.images.small || "/placeholder.svg"}
                        alt={card.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                        style={{ objectFit: "contain" }}
                        className="rounded-lg"
                        priority={false}
                    />

                    {/* Checkmark overlay for selected cards */}
                    {hasAllVariants && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-primary rounded-full p-2 shadow-lg">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-white"
                                >
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            </div>
                        </div>
                    )}

                    {/* Botones de variantes superpuestos */}
                    {showVariantButtons && availableVariants.length > 0 && (
                        <div
                            className="absolute bottom-2 right-2 flex gap-2 bg-base-200/90 backdrop-blur-sm p-1.5 rounded-lg shadow-md border border-base-100/30 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => e.stopPropagation()} // Prevenir que el clic en los botones abra el modal
                        >
                            <CardVariantsButtons
                                cardId={card.id}
                                availableVariants={availableVariants}
                                selectedVariants={cardVariants[card.id] || { normal: false, holofoil: false, reverseHolofoil: false }}
                                onToggleVariant={onToggleVariant}
                            />
                        </div>
                    )}
                </div>
            </figure>
            <div className="card-body p-4 pt-2">
                <h3 className="card-title text-base justify-center">{card.name}</h3>
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-sm opacity-80">
                            {card.number}
                            {setDetails ? `/${setDetails.printedTotal}` : ""}
                        </span>
                        <span className="badge badge-sm">{card.rarity}</span>
                    </div>
                    {basePrice !== null && <span className="text-green-400 font-medium">${basePrice.toFixed(2)}</span>}
                </div>
            </div>
        </div>
    )
})

export default CardItem

