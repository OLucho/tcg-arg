import CardItem from "./card-item"
import type { Card, CardVariants } from "~/types"

interface CardGridProps {
    cards: Card[]
    setDetails: {
        printedTotal: number
    }
    cardVariants: Record<string, CardVariants>
    onToggleVariant: (cardId: string, variant: keyof CardVariants) => void
}

export default function CardGrid({ cards, setDetails, cardVariants, onToggleVariant }: CardGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {cards.map((card) => (
                <CardItem
                    key={card.id}
                    card={card}
                    setDetails={setDetails}
                    cardVariants={cardVariants}
                    onToggleVariant={onToggleVariant}
                />
            ))}
        </div>
    )
}

