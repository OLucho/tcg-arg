"use client"

import { memo } from "react"
import { X, Plus, Minus, ExternalLink } from "lucide-react"
import Image from "next/image"
import type { PokemonCard, CardVariants, VariantQuantity } from "~/types"

interface CardModalProps {
    card: PokemonCard
    isOpen: boolean
    onClose: () => void
    cardVariants: Record<string, CardVariants>
    onToggleVariant: (cardId: string, variant: keyof CardVariants) => void
    quantities: Record<string, VariantQuantity>
    setQuantities: (quantities: Record<string, VariantQuantity>) => void
}

// Componente para renderizar los costes de energía (memoizado)
const EnergyCost = memo(({ cost }: { cost: string[] }) => {
    // Mapeo de tipos de energía a sus colores y símbolos
    const energyIcons: Record<string, { bg: string; symbol: string; text: string }> = {
        Colorless: { bg: "bg-gray-300", symbol: "C", text: "text-gray-700" },
        Darkness: { bg: "bg-purple-900", symbol: "D", text: "text-white" },
        Dragon: { bg: "bg-yellow-600", symbol: "N", text: "text-white" },
        Fairy: { bg: "bg-pink-400", symbol: "Y", text: "text-white" },
        Fighting: { bg: "bg-orange-700", symbol: "F", text: "text-white" },
        Fire: { bg: "bg-red-600", symbol: "R", text: "text-white" },
        Grass: { bg: "bg-green-600", symbol: "G", text: "text-white" },
        Lightning: { bg: "bg-yellow-400", symbol: "L", text: "text-gray-800" },
        Metal: { bg: "bg-gray-400", symbol: "M", text: "text-gray-800" },
        Psychic: { bg: "bg-purple-600", symbol: "P", text: "text-white" },
        Water: { bg: "bg-blue-500", symbol: "W", text: "text-white" },
    }

    return (
        <div className="flex gap-1">
            {cost.map((type, index) => {
                const energy = energyIcons[type] || { bg: "bg-gray-700", symbol: "?", text: "text-white" }

                return (
                    <div
                        key={index}
                        className={`w-6 h-6 rounded-full ${energy.bg} flex items-center justify-center text-xs font-bold ${energy.text} shadow-md border border-white/20`}
                        title={type}
                    >
                        {energy.symbol}
                    </div>
                )
            })}
        </div>
    )
})

EnergyCost.displayName = "EnergyCost"

// Componente para renderizar una variante con sus controles (memoizado)
const VariantControl = memo(
    ({
        variant,
        label,
        price,
        quantity,
        onQuantityChange,
        tcgPlayerUrl,
    }: {
        variant: keyof VariantQuantity
        label: string
        price?: number
        quantity: number
        onQuantityChange: (variant: keyof VariantQuantity, increment: boolean) => void
        tcgPlayerUrl?: string
    }) => {
        return (
            <div className="flex items-center justify-between py-3 border-b border-base-300">
                <div className="flex items-center gap-2">
                    <span className="text-sm">{label}</span>
                    {price && (
                        <div className="flex items-center gap-1">
                            <span className="text-sm text-green-400">${price.toFixed(2)}</span>
                            {tcgPlayerUrl && (
                                <a
                                    href={tcgPlayerUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300"
                                >
                                    <ExternalLink size={14} />
                                </a>
                            )}
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <button
                        className="btn btn-sm btn-circle btn-ghost"
                        onClick={() => onQuantityChange(variant, false)}
                        disabled={quantity === 0}
                    >
                        <Minus size={16} />
                    </button>
                    <span className="w-8 text-center">{quantity}</span>
                    <button className="btn btn-sm btn-circle btn-primary" onClick={() => onQuantityChange(variant, true)}>
                        <Plus size={16} />
                    </button>
                </div>
            </div>
        )
    },
)

VariantControl.displayName = "VariantControl"

// Componente principal del modal (memoizado)
const CardModal = memo(function CardModal({
    card,
    isOpen,
    onClose,
    cardVariants,
    onToggleVariant,
    quantities,
    setQuantities,
}: CardModalProps) {
    if (!isOpen) return null

    // Función para manejar cambios en la cantidad
    const handleQuantityChange = (variant: keyof VariantQuantity, increment: boolean) => {
        // Obtener la cantidad actual
        const currentQuantity = quantities[card.id]?.[variant] || 0

        // Calcular la nueva cantidad (no permitir valores negativos)
        let newQuantity = currentQuantity

        if (increment) {
            // Incrementar siempre es posible
            newQuantity = currentQuantity + 1
        } else {
            // Decrementar solo si es mayor que 0
            newQuantity = Math.max(0, currentQuantity - 1)
        }

        // Actualizar cantidades
        setQuantities({
            ...quantities,
            [card.id]: {
                ...(quantities[card.id] || {
                    normal: 0,
                    holofoil: 0,
                    reverseHolofoil: 0,
                    pokeballPattern: 0,
                    masterBallPattern: 0,
                }),
                [variant]: newQuantity,
            },
        })

        // Si la cantidad es mayor que 0, marcar la variante como seleccionada
        if (newQuantity > 0 && !cardVariants[card.id]?.[variant]) {
            onToggleVariant(card.id, variant as keyof CardVariants)
        }
        // Si la cantidad es 0 y la variante está seleccionada, desmarcarla
        else if (newQuantity === 0 && cardVariants[card.id]?.[variant]) {
            onToggleVariant(card.id, variant as keyof CardVariants)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-base-200 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-start p-4 border-b border-base-300">
                    <div>
                        <h2 className="text-2xl font-bold">{card.name}</h2>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <span>{card.set.name}</span>
                            <span>#{card.number}</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                    {/* Left column - Card image */}
                    <div>
                        <div className="relative aspect-[2.5/3.5] w-full">
                            <Image
                                src={card.images.large || "/placeholder.svg"}
                                alt={card.name}
                                fill
                                className="rounded-lg object-contain"
                                priority
                            />
                        </div>
                        {card.flavorText && <p className="mt-4 text-sm italic text-gray-400">{card.flavorText}</p>}
                    </div>

                    {/* Right column - Card details */}
                    <div>
                        {/* Card Details Header */}
                        <h3 className="text-lg font-bold mb-4 px-2 py-1 bg-base-300 rounded-md inline-block">Card Details</h3>

                        {/* Card content */}
                        <div className="space-y-6">
                            {/* Variants and quantities */}
                            <div className="card bg-base-300">
                                <div className="card-body p-4">
                                    {card.tcgplayer?.prices.normal && (
                                        <VariantControl
                                            variant="normal"
                                            label="Normal"
                                            price={card.tcgplayer.prices.normal.market}
                                            quantity={quantities[card.id]?.normal || 0}
                                            onQuantityChange={handleQuantityChange}
                                            tcgPlayerUrl={card.tcgplayer.url}
                                        />
                                    )}
                                    {card.tcgplayer?.prices.holofoil && (
                                        <VariantControl
                                            variant="holofoil"
                                            label="Holofoil"
                                            price={card.tcgplayer.prices.holofoil.market}
                                            quantity={quantities[card.id]?.holofoil || 0}
                                            onQuantityChange={handleQuantityChange}
                                            tcgPlayerUrl={card.tcgplayer.url}
                                        />
                                    )}
                                    {card.tcgplayer?.prices.reverseHolofoil && (
                                        <VariantControl
                                            variant="reverseHolofoil"
                                            label="Reverse Holofoil"
                                            price={card.tcgplayer.prices.reverseHolofoil.market}
                                            quantity={quantities[card.id]?.reverseHolofoil || 0}
                                            onQuantityChange={handleQuantityChange}
                                            tcgPlayerUrl={card.tcgplayer.url}
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Attacks */}
                            {card.attacks && (
                                <div className="space-y-4">
                                    {card.attacks.map((attack, index) => (
                                        <div key={index} className="card bg-base-300">
                                            <div className="card-body p-4">
                                                <div className="flex items-center gap-2">
                                                    <EnergyCost cost={attack.cost} />
                                                    <h3 className="font-bold">{attack.name}</h3>
                                                    {attack.damage && <span className="ml-auto">{attack.damage}</span>}
                                                </div>
                                                {attack.text && <p className="text-sm text-gray-400">{attack.text}</p>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Card details grid */}
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-400">Type</span>
                                    <div className="flex items-center gap-1">{card.types?.[0] || "-"}</div>
                                </div>
                                <div>
                                    <span className="text-gray-400">HP</span>
                                    <div>{card.hp || "-"}</div>
                                </div>
                                <div>
                                    <span className="text-gray-400">Weakness</span>
                                    <div>{card.weaknesses?.[0]?.type || "-"}</div>
                                </div>
                                <div>
                                    <span className="text-gray-400">Retreat Cost</span>
                                    <div className="flex gap-1">{card.retreatCost ? <EnergyCost cost={card.retreatCost} /> : "-"}</div>
                                </div>
                                <div>
                                    <span className="text-gray-400">Artist</span>
                                    <div>{card.artist || "-"}</div>
                                </div>
                                <div>
                                    <span className="text-gray-400">Rarity</span>
                                    <div>{card.rarity || "-"}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
})

export default CardModal

