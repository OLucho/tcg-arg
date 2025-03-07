import Image from "next/image"
import type { CardVariants, PokemonCard } from "~/types"
import CardVariantsButtons from "./card-variants-button"

interface CardItemProps {
    card: PokemonCard
    setDetails: {
        printedTotal: number
    }
    cardVariants: Record<string, CardVariants>
    onToggleVariant: (cardId: string, variant: keyof CardVariants) => void
}

export default function CardItem({ card, setDetails, cardVariants, onToggleVariant }: CardItemProps) {
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

    const availableVariants = getAvailableVariants(card)

    return (
        <div className="card bg-base-300 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
            <figure className="px-4 pt-4 pb-0">
                <div className="relative w-full aspect-[2/3]">
                    <Image
                        src={card.images.small || "/placeholder.svg"}
                        alt={card.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                        style={{ objectFit: "contain" }}
                        className="rounded-lg"
                        priority={false}
                    />

                    {/* Botones de variantes superpuestos */}
                    {availableVariants.length > 0 && (
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2 bg-base-300/80 backdrop-blur-sm p-1.5 rounded-full shadow-md border border-base-100/30">
                            <CardVariantsButtons
                                cardId={card.id}
                                availableVariants={availableVariants}
                                selectedVariants={cardVariants[card.id] ?? { normal: false, holofoil: false, reverseHolofoil: false }}
                                onToggleVariant={onToggleVariant}
                            />
                        </div>
                    )}
                </div>
            </figure>
            <div className="card-body p-4 pt-2">
                <h3 className="card-title text-base justify-center">{card.name}</h3>
                <div className="flex items-center justify-between">
                    <span className="text-sm opacity-80">
                        {card.number}/{setDetails.printedTotal}
                    </span>
                    <span className="badge">{card.rarity}</span>
                </div>
            </div>
        </div>
    )
}

