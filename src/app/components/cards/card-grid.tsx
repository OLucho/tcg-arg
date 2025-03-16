// Moved from set/[setId]/components/card-grid.tsx
import CardItem from "./card-item"
import type { PokemonCard, CardVariants } from "~/types"

interface CardGridProps {
    cards: PokemonCard[]
    setDetails?: {
        printedTotal: number
    }
    cardVariants: Record<string, CardVariants>
    onToggleVariant: (cardId: string, variant: keyof CardVariants) => void
    onCardClick: (card: PokemonCard) => void
    showVariantButtons?: boolean // Nueva prop para controlar la visibilidad de los botones de variantes
}

export default function CardGrid({
    cards,
    setDetails,
    cardVariants,
    onToggleVariant,
    onCardClick,
    showVariantButtons = true, // Por defecto, mostrar los botones
}: CardGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {cards.map((card) => (
                <CardItem
                    key={card.id}
                    card={card}
                    setDetails={setDetails}
                    cardVariants={cardVariants}
                    onToggleVariant={onToggleVariant}
                    onCardClick={onCardClick}
                    showVariantButtons={showVariantButtons}
                />
            ))}
        </div>
    )
}

