"use client"

import { useState, useCallback } from "react"
import { useQuery } from "@tanstack/react-query"
import type { PokemonCard } from "~/types"
import { getCardsById } from "~/lib/pokemon-api"

export function useAddCardsModal(onAddCard: (card: PokemonCard) => void) {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedSet, setSelectedSet] = useState<{ id: string; name: string } | null>(null)

    // Use react-query to fetch and cache search results
    const { data, isLoading, refetch } = useQuery({
        queryKey: ["searchCards", searchTerm, selectedSet?.id],
        queryFn: () =>
            getCardsById({
                name: searchTerm || undefined,
                setId: selectedSet?.id,
                page: 1,
                pageSize: 20,
            }),
        enabled: false, // Don't auto-fetch, we'll trigger manually
    })

    // Safely access cards array with fallback to empty array
    const cards = data?.cards || []
    const hasCards = cards.length > 0

    // Function to handle search
    const handleSearch = useCallback(() => {
        refetch().catch((error) => console.error("Error searching cards:", error))
    }, [refetch])

    // Function to handle card click
    const handleCardClick = useCallback(
        (card: PokemonCard) => {
            onAddCard(card)
        },
        [onAddCard],
    )

    return {
        searchTerm,
        setSearchTerm,
        selectedSet,
        setSelectedSet,
        cards,
        hasCards,
        isLoading,
        handleSearch,
        handleCardClick,
    }
}

