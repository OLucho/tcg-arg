"use client"

import { useState } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Grid, Table, BookOpen } from "lucide-react"
import Image from "next/image"
import type { PokemonCard, CardVariants } from "~/types"

type PocketSize = "9-Pocket" | "12-Pocket" | "4-Pocket" | "16-Pocket"

interface CardBinderViewProps {
    cards: PokemonCard[]
    cardVariants: Record<string, CardVariants>
    onToggleVariant: (cardId: string, variant: keyof CardVariants) => void
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}

export default function CardBinderView({
    cards,
    cardVariants,
    onToggleVariant,
    currentPage,
    totalPages,
    onPageChange,
}: CardBinderViewProps) {
    const [pocketSize, setPocketSize] = useState<PocketSize>("9-Pocket")
    const [stackVariants, setStackVariants] = useState(false)

    // Calculate cards per page based on pocket size
    const cardsPerPage = {
        "4-Pocket": 4,
        "9-Pocket": 9,
        "12-Pocket": 12,
        "16-Pocket": 16,
    }[pocketSize]

    // Calculate grid layout based on pocket size
    const gridLayout = {
        "4-Pocket": "grid-cols-2",
        "9-Pocket": "grid-cols-3",
        "12-Pocket": "grid-cols-3",
        "16-Pocket": "grid-cols-4",
    }[pocketSize]

    // Get current page cards
    const startIndex = (currentPage - 1) * cardsPerPage
    const currentPageCards = cards.slice(startIndex, startIndex + cardsPerPage)

    // Handle drag and drop reordering
    const onDragEnd = (result: any) => {
        if (!result.destination) return

        const items = Array.from(cards)
        const [reorderedItem] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderedItem)

        // Here you would update the parent component with the new order
        // onReorder(items)
    }

    return (
        <div className="space-y-4">
            {/* View Controls */}
            <div className="flex justify-between items-center">
                <div className="flex gap-2">
                    {(["9-Pocket", "12-Pocket", "4-Pocket", "16-Pocket"] as const).map((size) => (
                        <button
                            key={size}
                            onClick={() => setPocketSize(size)}
                            className={`btn btn-sm ${pocketSize === size ? "btn-primary" : "btn-ghost"}`}
                        >
                            {size}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    {/* View Mode Toggles */}
                    <div className="flex gap-2">
                        <button className="btn btn-ghost btn-sm">
                            <Grid size={16} />
                        </button>
                        <button className="btn btn-ghost btn-sm">
                            <Table size={16} />
                        </button>
                        <button className="btn btn-primary btn-sm">
                            <BookOpen size={16} />
                        </button>
                    </div>

                    {/* Stack Variants Toggle */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm">Stack Variants:</span>
                        <input
                            type="checkbox"
                            className="toggle toggle-primary toggle-sm"
                            checked={stackVariants}
                            onChange={(e) => setStackVariants(e.target.checked)}
                        />
                    </div>
                </div>
            </div>

            {/* Binder Grid */}
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="binder" direction="horizontal">
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className={`grid ${gridLayout} gap-4 p-4 bg-base-300 rounded-lg min-h-[600px]`}
                        >
                            {currentPageCards.map((card, index) => {
                                const hasCard = cardVariants[card.id] && Object.values(cardVariants[card.id]).some((v) => v)

                                return (
                                    <Draggable key={card.id} draggableId={card.id} index={index}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className="relative aspect-[2.5/3.5] bg-base-200 rounded-lg overflow-hidden group"
                                                onClick={() => onToggleVariant(card.id, "normal")}
                                            >
                                                {/* Slot Number */}
                                                <div className="absolute top-2 right-2 z-10 bg-base-300/80 backdrop-blur-sm rounded px-2 py-1">
                                                    #{startIndex + index + 1}
                                                </div>

                                                {/* Card Image */}
                                                <div className="relative w-full h-full">
                                                    <Image
                                                        src={card.images.small || "/placeholder.svg"}
                                                        alt={card.name}
                                                        fill
                                                        className="object-contain rounded-lg transition-all"
                                                        style={{
                                                            filter: hasCard ? "none" : "grayscale(100%) opacity(70%)",
                                                        }}
                                                    />
                                                </div>

                                                {/* Checkmark for owned cards */}
                                                {hasCard && (
                                                    <div className="absolute bottom-2 right-2 bg-primary rounded-full p-1">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="16"
                                                            height="16"
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
                                                )}
                                            </div>
                                        )}
                                    </Draggable>
                                )
                            })}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            {/* Pagination */}
            <div className="flex justify-center gap-2">
                <button className="btn btn-sm" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
                    Previous
                </button>
                <span className="flex items-center px-4">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    className="btn btn-sm"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    )
}

