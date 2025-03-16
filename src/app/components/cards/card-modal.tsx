"use client"

import { memo } from "react"
import { X, Plus, Minus, ExternalLink, Trash2 } from "lucide-react"
import Image from "next/image"
import type { PokemonCard, CardVariants, VariantQuantity } from "~/types"
import { ABILITY_BADGES, energyIcons } from "~/utils"

// Updated type colors with better contrast
const TYPE_COLORS = {
    Grass: {
        primary: "from-green-900/70 via-green-800/50 to-base-200",
        accent: "from-green-400/30",
        text: "text-white", // Consistent text color for readability
    },
    Fire: {
        primary: "from-red-900/70 via-red-800/50 to-base-200",
        accent: "from-orange-400/30",
        text: "text-white",
    },
    Water: {
        primary: "from-blue-900/70 via-blue-800/50 to-base-200",
        accent: "from-blue-400/30",
        text: "text-white",
    },
    Lightning: {
        primary: "from-yellow-900/70 via-yellow-800/50 to-base-200",
        accent: "from-yellow-400/30",
        text: "text-white",
    },
    Fighting: {
        primary: "from-orange-900/70 via-orange-800/50 to-base-200",
        accent: "from-orange-400/30",
        text: "text-white",
    },
    Psychic: {
        primary: "from-purple-900/70 via-purple-800/50 to-base-200",
        accent: "from-purple-400/30",
        text: "text-white",
    },
    Darkness: {
        primary: "from-gray-900/70 via-gray-800/50 to-base-200",
        accent: "from-gray-400/30",
        text: "text-white",
    },
    Metal: {
        primary: "from-slate-900/70 via-slate-800/50 to-base-200",
        accent: "from-slate-400/30",
        text: "text-white",
    },
    Fairy: {
        primary: "from-pink-900/70 via-pink-800/50 to-base-200",
        accent: "from-pink-400/30",
        text: "text-white",
    },
    Dragon: {
        primary: "from-amber-900/70 via-amber-800/50 to-base-200",
        accent: "from-amber-400/30",
        text: "text-white",
    },
    Colorless: {
        primary: "from-slate-900/70 via-slate-800/50 to-base-200",
        accent: "from-slate-400/30",
        text: "text-white",
    },
    // Añadir colores para cartas Trainer
    Trainer: {
        primary: "from-indigo-900/70 via-indigo-800/50 to-base-200",
        accent: "from-indigo-400/30",
        text: "text-white",
    },
    Energy: {
        primary: "from-gray-900/70 via-gray-800/50 to-base-200",
        accent: "from-gray-400/30",
        text: "text-white",
    },
} as const

interface CardModalProps {
    card: PokemonCard
    isOpen: boolean
    onClose: () => void
    cardVariants: Record<string, CardVariants>
    onToggleVariant: (cardId: string, variant: keyof CardVariants) => void
    quantities: Record<string, VariantQuantity>
    setQuantities: (quantities: Record<string, VariantQuantity>) => void
    showRemoveButton?: boolean // Nueva prop para mostrar/ocultar el botón de eliminar
    onRemoveCard?: (cardId: string) => void // Nueva prop para la función de eliminar
}

// Componente para renderizar los costes de energía (memoizado)
const EnergyCost = memo(({ cost }: { cost: string[] }) => {
    return (
        <div className="flex gap-1">
            {cost.map((type, index) => {
                const energy = energyIcons[type] || energyIcons.Colorless

                return (
                    <div
                        key={index}
                        className="relative w-6 h-6 rounded-full shadow-md hover:scale-110 transition-transform"
                        title={type}
                    >
                        <Image
                            src={energy.src || "/placeholder.svg"}
                            alt={energy.alt}
                            fill
                            className="rounded-full object-cover"
                            sizes="24px"
                        />
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
            <div className="flex items-center justify-between py-3 border-b border-base-300/50">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">{label}</span>
                    {price && (
                        <div className="flex items-center gap-1">
                            <span className="text-sm font-semibold text-green-300">${price.toFixed(2)}</span>
                            {tcgPlayerUrl && (
                                <a
                                    href={tcgPlayerUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-300 hover:text-blue-200"
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
                    <span className="w-8 text-center font-medium text-white">{quantity}</span>
                    <button className="btn btn-sm btn-circle btn-primary" onClick={() => onQuantityChange(variant, true)}>
                        <Plus size={16} />
                    </button>
                </div>
            </div>
        )
    },
)

VariantControl.displayName = "VariantControl"

// Update the CardModal component's return statement
const CardModal = memo(function CardModal({
    card,
    isOpen,
    onClose,
    cardVariants,
    onToggleVariant,
    quantities,
    setQuantities,
    showRemoveButton = false, // Por defecto, no mostrar el botón
    onRemoveCard,
}: CardModalProps) {
    if (!isOpen) return null

    // Get the card's primary type and corresponding colors
    // Use supertype for Trainer and Energy cards
    const cardType = card.supertype === "Pokémon" ? card.types?.[0] || "Colorless" : card.supertype || "Colorless"

    const typeColors = TYPE_COLORS[cardType as keyof typeof TYPE_COLORS] || TYPE_COLORS.Colorless

    // Agregar un manejador para el botón de eliminar
    const handleRemoveCard = () => {
        if (onRemoveCard) {
            onRemoveCard(card.id)
            onClose() // Cerrar el modal después de eliminar
        }
    }

    // Función para manejar cambios en la cantidad
    const handleQuantityChange = (variant: keyof VariantQuantity, increment: boolean) => {
        console.log(`Changing quantity for ${card.name}, variant ${variant}, increment: ${increment}`)

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

        console.log(`Current quantity: ${currentQuantity}, new quantity: ${newQuantity}`)

        // Actualizar cantidades
        const newQuantities = {
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
        }

        setQuantities(newQuantities)
        console.log(`Updated quantities for ${card.name}:`, newQuantities[card.id])

        // Sincronizar el estado de la variante con la cantidad
        const currentVariantState = cardVariants[card.id]?.[variant as keyof CardVariants] || false
        const shouldBeActive = newQuantity > 0

        if (currentVariantState !== shouldBeActive) {
            console.log(`Toggling variant ${variant} from ${currentVariantState} to ${shouldBeActive}`)
            onToggleVariant(card.id, variant as keyof CardVariants)
        }
    }

    // Determinar el subtipo de la carta Trainer para mostrar el badge correcto
    const getTrainerSubtypeBadge = () => {
        if (card.supertype !== "Trainer" || !card.subtypes || card.subtypes.length === 0) {
            return null
        }

        const subtype = card.subtypes[0]
        let bgColor = "bg-indigo-500"

        // Asignar colores según el subtipo
        if (subtype === "Item") bgColor = "bg-blue-500"
        if (subtype === "Supporter") bgColor = "bg-purple-500"
        if (subtype === "Stadium") bgColor = "bg-green-500"
        if (subtype === "Tool") bgColor = "bg-yellow-500"

        return <span className={`badge ${bgColor} text-white`}>{subtype}</span>
    }

    // Añadir este console.log justo antes del return del componente CardModal
    console.log("Card data:", {
        id: card.id,
        name: card.name,
        set: card.set.name,
        artist: card.artist,
        hasArtistProperty: "artist" in card,
    })

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div
                className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl bg-gradient-to-b ${typeColors.primary}`}
            >
                {/* Clean header with type-based gradient */}
                <div className="relative rounded-t-lg">
                    {/* Type-based gradient header with darker overlay for better text contrast */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${typeColors.accent} via-base-200/50 to-transparent`} />
                    <div className="absolute inset-0 bg-black/30"></div> {/* Additional overlay for text contrast */}
                    {/* Header content */}
                    <div className="relative p-6 flex items-start justify-between">
                        <div>
                            <h2 className="text-3xl font-bold text-white drop-shadow-sm">{card.name}</h2>
                            <div className="flex items-center gap-4 mt-1">
                                <span className="text-sm font-medium text-white">{card.set.name}</span>
                                <span className="text-sm font-medium text-white">#{card.number}</span>
                                {card.rarity && (
                                    <span className="badge badge-sm bg-black/40 text-white border-white/20">{card.rarity}</span>
                                )}
                                {card.supertype && (
                                    <span className="badge badge-sm bg-black/40 text-white border-white/20">{card.supertype}</span>
                                )}
                                {getTrainerSubtypeBadge()}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {showRemoveButton && (
                                <button
                                    onClick={handleRemoveCard}
                                    className="btn btn-sm btn-circle bg-red-500/40 hover:bg-red-500/60 text-white border-0"
                                    title="Remove from list"
                                >
                                    <Trash2 size={18} />
                                </button>
                            )}
                            <button
                                onClick={onClose}
                                className="btn btn-sm btn-circle bg-black/40 hover:bg-black/60 text-white border-0"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main content with improved organization and readability */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left column - Card image */}
                    <div>
                        <div className="relative aspect-[2.5/3.5] w-full">
                            <Image
                                src={card.images.large || "/placeholder.svg"}
                                alt={card.name}
                                fill
                                className="rounded-lg object-contain shadow-lg"
                                priority
                            />
                        </div>
                        {card.flavorText && (
                            <div className="mt-4 p-3 bg-black/50 backdrop-blur-sm rounded-lg border border-white/10">
                                <p className="text-sm italic text-white">{card.flavorText}</p>
                            </div>
                        )}
                    </div>

                    {/* Right column - Card details with improved organization and readability */}
                    <div className="space-y-6">
                        {/* REORGANIZADO: 1. Variants and quantities */}
                        <div className="card bg-black/50 backdrop-blur-sm border border-white/10">
                            <div className="card-body p-4">
                                <h3 className="text-lg font-bold text-white mb-2">Variants</h3>
                                {card.tcgplayer?.prices?.normal && (
                                    <VariantControl
                                        variant="normal"
                                        label="Normal"
                                        price={card.tcgplayer.prices.normal.market}
                                        quantity={quantities[card.id]?.normal || 0}
                                        onQuantityChange={handleQuantityChange}
                                        tcgPlayerUrl={card.tcgplayer.url}
                                    />
                                )}
                                {card.tcgplayer?.prices?.holofoil && (
                                    <VariantControl
                                        variant="holofoil"
                                        label="Holofoil"
                                        price={card.tcgplayer.prices.holofoil.market}
                                        quantity={quantities[card.id]?.holofoil || 0}
                                        onQuantityChange={handleQuantityChange}
                                        tcgPlayerUrl={card.tcgplayer.url}
                                    />
                                )}
                                {card.tcgplayer?.prices?.reverseHolofoil && (
                                    <VariantControl
                                        variant="reverseHolofoil"
                                        label="Reverse Holofoil"
                                        price={card.tcgplayer.prices.reverseHolofoil.market}
                                        quantity={quantities[card.id]?.reverseHolofoil || 0}
                                        onQuantityChange={handleQuantityChange}
                                        tcgPlayerUrl={card.tcgplayer.url}
                                    />
                                )}
                                {!card.tcgplayer?.prices && (
                                    <div className="text-center text-gray-400 py-2">No variant information available for this card</div>
                                )}
                            </div>
                        </div>

                        {/* REORGANIZADO: 2. Trainer Card Rules (solo para cartas Trainer) */}
                        {card.supertype === "Trainer" && card.rules && (
                            <div className="card bg-black/50 backdrop-blur-sm border border-white/10">
                                <div className="card-body p-4">
                                    <h3 className="text-lg font-bold text-white mb-2">Descripción</h3>
                                    <div className="space-y-2">
                                        {card.rules.map((rule, index) => (
                                            <p key={index} className="text-white">
                                                {rule}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* REORGANIZADO: 2. Energy Card Rules (solo para cartas Energy) */}
                        {card.supertype === "Energy" && card.rules && (
                            <div className="card bg-black/50 backdrop-blur-sm border border-white/10">
                                <div className="card-body p-4">
                                    <h3 className="text-lg font-bold text-white mb-2">Descripción</h3>
                                    <div className="space-y-2">
                                        {card.rules.map((rule, index) => (
                                            <p key={index} className="text-white">
                                                {rule}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* REORGANIZADO: 2. Abilities (solo para cartas Pokémon) */}
                        {card.abilities && card.abilities.length > 0 && (
                            <div className="card bg-black/50 backdrop-blur-sm border border-white/10">
                                <div className="card-body p-4">
                                    <div className="space-y-4">
                                        {card.abilities.map((ability, index) => (
                                            <div key={index} className="border-b border-white/10 pb-3 last:border-0 last:pb-0">
                                                <div className="flex items-center gap-2">
                                                    <Image
                                                        src={ABILITY_BADGES[ability.type as keyof typeof ABILITY_BADGES] || ABILITY_BADGES.Ability}
                                                        alt={ability.type}
                                                        width={60}
                                                        height={20}
                                                        className="object-contain"
                                                    />
                                                    <h3 className="font-bold text-white">{ability.name}</h3>
                                                </div>
                                                {ability.text && <p className="text-sm text-white mt-1">{ability.text}</p>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* REORGANIZADO: 3. Attacks (solo para cartas Pokémon) */}
                        {card.attacks && (
                            <div className="card bg-black/50 backdrop-blur-sm border border-white/10">
                                <div className="card-body p-4">
                                    <h3 className="text-lg font-bold text-white mb-2">Attacks</h3>
                                    <div className="space-y-4">
                                        {card.attacks.map((attack, index) => (
                                            <div key={index} className="border-b border-white/10 pb-3 last:border-0 last:pb-0">
                                                <div className="flex items-center gap-2">
                                                    <EnergyCost cost={attack.cost} />
                                                    <h3 className="font-bold text-white">{attack.name}</h3>
                                                    {attack.damage && <span className="ml-auto font-mono text-white">{attack.damage}</span>}
                                                </div>
                                                {attack.text && <p className="text-sm text-white mt-1">{attack.text}</p>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* REORGANIZADO: 4. Card type and basic info */}
                        <div className="grid grid-cols-2 gap-4 text-sm bg-black/50 backdrop-blur-sm p-4 rounded-lg border border-white/10">
                            <div>
                                <span className="text-gray-300 block mb-1 font-medium">Type</span>
                                <div className="flex items-center gap-1 font-medium text-white">
                                    {card.supertype === "Pokémon" ? card.types?.[0] || "-" : card.supertype}
                                </div>
                            </div>
                            {card.supertype === "Pokémon" ? (
                                <>
                                    <div>
                                        <span className="text-gray-300 block mb-1 font-medium">HP</span>
                                        <div className="font-medium text-white">{card.hp || "-"}</div>
                                    </div>
                                    <div>
                                        <span className="text-gray-300 block mb-1 font-medium">Weakness</span>
                                        <div className="font-medium text-white">{card.weaknesses?.[0]?.type || "-"}</div>
                                    </div>
                                    <div>
                                        <span className="text-gray-300 block mb-1 font-medium">Retreat Cost</span>
                                        <div className="flex gap-1">{card.retreatCost ? <EnergyCost cost={card.retreatCost} /> : "-"}</div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <span className="text-gray-300 block mb-1 font-medium">Subtype</span>
                                        <div className="font-medium text-white">{card.subtypes?.join(", ") || "-"}</div>
                                    </div>
                                    <div className="col-span-2">
                                        <span className="text-gray-300 block mb-1 font-medium">Set</span>
                                        <div className="font-medium text-white">{card.set.name}</div>
                                    </div>
                                </>
                            )}
                            <div>
                                <span className="text-gray-300 block mb-1 font-medium">Artist</span>
                                <div className="font-medium text-white">
                                    {card.artist ? (
                                        card.artist
                                    ) : (
                                        <span className="text-gray-400 italic">No artist information available</span>
                                    )}
                                </div>
                            </div>
                            <div>
                                <span className="text-gray-300 block mb-1 font-medium">Rarity</span>
                                <div className="font-medium text-white">{card.rarity || "-"}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
})

export default CardModal

