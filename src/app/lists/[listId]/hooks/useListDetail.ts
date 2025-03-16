"use client"

import { useState, useMemo, useCallback } from "react"
import type { ApiList } from "../../useLists"
import type { PokemonCard, CardVariants, VariantQuantity } from "~/types"
import { useToast } from "./useToast"
import { getAvailableVariants, isVariantAvailable } from "~/utils"

export function useListDetail(list: ApiList & { cards: ListCard[] }, initialCards: PokemonCard[]) {
    // Toast notifications
    const { showToast } = useToast()

    // Basic states
    const [isLoading, setIsLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCard, setSelectedCard] = useState<PokemonCard | null>(null)
    const [currentSort, setCurrentSort] = useState("number")
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
    const [viewMode, setViewMode] = useState<"grid" | "binder">("grid")
    // Add activeTab state and tab filtering logic
    const [activeTab, setActiveTab] = useState("show-all")

    // Cards state (including newly added cards)
    const [cards, setCards] = useState<PokemonCard[]>(initialCards)
    const [removedCardIds, setRemovedCardIds] = useState<string[]>([])
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    // Initialize cardVariants and quantities
    const [cardVariants, setCardVariants] = useState<Record<string, CardVariants>>(() => {
        const variants: Record<string, CardVariants> = {}
        list.cards.forEach((card) => {
            variants[card.cardId] = card.variants
        })
        return variants
    })

    const [quantities, setQuantities] = useState<Record<string, VariantQuantity>>(() => {
        const quantities: Record<string, VariantQuantity> = {}
        list.cards.forEach((card) => {
            quantities[card.cardId] = {
                ...card.quantity,
                pokeballPattern: 0,
                masterBallPattern: 0,
            }
        })
        return quantities
    })

    // Filter and sort cards
    const displayedCards = useMemo(() => {
        // Start with all cards except removed ones
        let filtered = cards.filter((card) => !removedCardIds.includes(card.id))

        // Apply tab filtering
        switch (activeTab) {
            case "have":
                filtered = filtered.filter((card) => {
                    const variants = cardVariants[card.id]
                    const cardQuantities = quantities[card.id]

                    // Una carta está "obtenida" solo si tiene al menos una variante con cantidad > 0
                    const isOwned =
                        variants &&
                        cardQuantities &&
                        ((variants.normal && cardQuantities.normal > 0) ||
                            (variants.holofoil && cardQuantities.holofoil > 0) ||
                            (variants.reverseHolofoil && cardQuantities.reverseHolofoil > 0))

                    if (card.name.includes("Celebi")) {
                        console.log(`Filtering Celebi for "have" tab: ${isOwned}`)
                    }

                    return isOwned
                })
                break
            case "need":
                filtered = filtered.filter((card) => {
                    const variants = cardVariants[card.id]
                    // Una carta se "necesita" si no tiene variantes o todas las variantes están desactivadas o tienen cantidad 0
                    return (
                        !variants ||
                        ((!variants.normal || quantities[card.id]?.normal === 0) &&
                            (!variants.holofoil || quantities[card.id]?.holofoil === 0) &&
                            (!variants.reverseHolofoil || quantities[card.id]?.reverseHolofoil === 0))
                    )
                })
                break
            case "dupes":
                filtered = filtered.filter((card) => {
                    const cardQuantities = quantities[card.id]
                    if (!cardQuantities) return false
                    // Check if any variant has quantity > 1
                    return Object.values(cardQuantities).some((qty) => qty > 1)
                })
                break
            // "show-all" doesn't need additional filtering
        }

        // Apply search
        if (searchTerm.trim()) {
            const lowercaseSearch = searchTerm.toLowerCase()
            filtered = filtered.filter(
                (card) =>
                    card.name.toLowerCase().includes(lowercaseSearch) || card.number.toLowerCase().includes(lowercaseSearch),
            )
        }

        // Sort cards
        return [...filtered].sort((a, b) => {
            let comparison = 0

            switch (currentSort) {
                case "number":
                    const aNum = Number.parseInt(a.number.replace(/\D/g, "") || "0")
                    const bNum = Number.parseInt(b.number.replace(/\D/g, "") || "0")
                    comparison = aNum - bNum
                    break
                case "name":
                    comparison = a.name.localeCompare(b.name)
                    break
                case "rarity":
                    comparison = (a.rarity || "").localeCompare(b.rarity || "")
                    break
                case "artist":
                    comparison = (a.artist || "").localeCompare(b.artist || "")
                    break
                case "released":
                    comparison = new Date(a.set.releaseDate).getTime() - new Date(b.set.releaseDate).getTime()
                    break
            }

            return sortDirection === "asc" ? comparison : -comparison
        })
    }, [cards, removedCardIds, activeTab, cardVariants, quantities, searchTerm, currentSort, sortDirection])

    // Depuración para Celebi
    const celebiCard = cards.find((card) => card.name.includes("Celebi"))
    if (celebiCard) {
        console.log("Celebi card:", {
            id: celebiCard.id,
            name: celebiCard.name,
            variants: cardVariants[celebiCard.id],
            quantities: quantities[celebiCard.id],
            isInHaveTab:
                cardVariants[celebiCard.id] &&
                ((cardVariants[celebiCard.id].normal && quantities[celebiCard.id]?.normal > 0) ||
                    (cardVariants[celebiCard.id].holofoil && quantities[celebiCard.id]?.holofoil > 0) ||
                    (cardVariants[celebiCard.id].reverseHolofoil && quantities[celebiCard.id]?.reverseHolofoil > 0)),
        })
    }

    // Add tab counters
    const tabCounters = useMemo(() => {
        // Count cards that have at least one variant with quantity > 0
        const have = cards.filter((card) => {
            const variants = cardVariants[card.id]
            const cardQuantities = quantities[card.id]

            const isOwned =
                variants &&
                cardQuantities &&
                ((variants.normal && cardQuantities.normal > 0) ||
                    (variants.holofoil && cardQuantities.holofoil > 0) ||
                    (variants.reverseHolofoil && cardQuantities.reverseHolofoil > 0))

            if (card.name.includes("Celebi")) {
                console.log(`Counting Celebi for "have" counter: ${isOwned}`)
            }

            return isOwned
        }).length

        // Count cards with duplicates (quantity > 1 for any variant)
        const dupes = cards.filter((card) => {
            const cardQuantities = quantities[card.id]
            if (!cardQuantities) return false
            return Object.values(cardQuantities).some((qty) => qty > 1)
        }).length

        return {
            have,
            need: cards.length - have,
            dupes,
        }
    }, [cards, cardVariants, quantities])

    // Add handleTabChange function
    const handleTabChange = useCallback((tab: string) => {
        setActiveTab(tab)
    }, [])

    // Add a card to the list
    const addCard = useCallback(
        (card: PokemonCard) => {
            // Check if card is already in the list and not removed
            const isCardAlreadyInList = cards.some((c) => c.id === card.id) && !removedCardIds.includes(card.id)

            if (isCardAlreadyInList) {
                showToast({
                    type: "error",
                    message: `${card.name} is already in your list`,
                })
                return
            }

            // If card was previously removed, just remove it from removedCardIds
            if (removedCardIds.includes(card.id)) {
                setRemovedCardIds((prev) => prev.filter((id) => id !== card.id))
                showToast({
                    type: "success",
                    message: `Added ${card.name} to list`,
                })
            } else {
                // Otherwise add it to cards if it's not already there
                setCards((prev) => {
                    if (!prev.some((c) => c.id === card.id)) {
                        return [...prev, card]
                    }
                    return prev
                })
                showToast({
                    type: "success",
                    message: `Added ${card.name} to list`,
                })
            }

            // Obtener las variantes disponibles para esta carta
            const availableVariants = getAvailableVariants(card)

            // Crear un objeto de variantes con solo las disponibles activadas
            const initialVariants: CardVariants = {
                normal: false,
                holofoil: false,
                reverseHolofoil: false,
            }

            // Activar la primera variante disponible por defecto
            if (availableVariants.length > 0) {
                initialVariants[availableVariants[0]] = true
            }

            // Set default variants and quantities
            setCardVariants((prev) => ({
                ...prev,
                [card.id]: initialVariants,
            }))

            // Inicializar cantidades
            const initialQuantities = {
                normal: 0,
                holofoil: 0,
                reverseHolofoil: 0,
                pokeballPattern: 0,
                masterBallPattern: 0,
            }

            // Establecer cantidad 1 para la primera variante disponible
            if (availableVariants.length > 0) {
                initialQuantities[availableVariants[0]] = 1
            }

            setQuantities((prev) => ({
                ...prev,
                [card.id]: initialQuantities,
            }))

            setHasUnsavedChanges(true)
        },
        [cards, removedCardIds, showToast],
    )

    // Remove a card from the list
    const removeCard = useCallback(
        (cardId: string) => {
            const cardToRemove = cards.find((card) => card.id === cardId)

            if (cardToRemove) {
                setRemovedCardIds((prev) => [...prev, cardId])
                setHasUnsavedChanges(true)

                showToast({
                    type: "success",
                    message: `Removed ${cardToRemove.name} from list`,
                })
            }
        },
        [cards, showToast],
    )

    // Modificar la función toggleVariant para verificar si la variante está disponible
    const toggleVariant = useCallback(
        (cardId: string, variant: keyof CardVariants) => {
            console.log(`Toggling variant ${variant} for card ${cardId}`)

            // Encontrar la carta correspondiente
            const card = cards.find((c) => c.id === cardId)
            if (!card) {
                console.error(`Card with ID ${cardId} not found`)
                return
            }

            // Verificar si la variante está disponible para esta carta
            if (!isVariantAvailable(card, variant)) {
                console.warn(`Variant ${variant} is not available for card ${card.name}`)
                showToast({
                    type: "warning",
                    message: `La variante ${variant} no está disponible para ${card.name}`,
                })
                return
            }

            setCardVariants((prev) => {
                const currentVariants = prev[cardId] || { normal: false, holofoil: false, reverseHolofoil: false }
                const newVariantState = !currentVariants[variant]

                console.log(`Current variant state: ${currentVariants[variant]}, new state: ${newVariantState}`)

                // Actualizar cantidades para que coincidan con el estado de la variante
                setQuantities((prevQuantities) => {
                    const currentQuantities = prevQuantities[cardId] || {
                        normal: 0,
                        holofoil: 0,
                        reverseHolofoil: 0,
                        pokeballPattern: 0,
                        masterBallPattern: 0,
                    }

                    const newQuantities = {
                        ...prevQuantities,
                        [cardId]: {
                            ...currentQuantities,
                            [variant]: newVariantState ? 1 : 0,
                        },
                    }

                    console.log(`Updated quantities:`, newQuantities[cardId])
                    return newQuantities
                })

                setHasUnsavedChanges(true)

                const newVariants = {
                    ...prev,
                    [cardId]: {
                        ...currentVariants,
                        [variant]: newVariantState,
                    },
                }

                console.log(`Updated variants:`, newVariants[cardId])
                return newVariants
            })
        },
        [cards, showToast],
    )

    // Update quantities
    const updateQuantities = useCallback((newQuantities: Record<string, VariantQuantity>) => {
        setQuantities(newQuantities)
        setHasUnsavedChanges(true)
    }, [])

    // Save changes
    const saveChanges = useCallback(async () => {
        if (!hasUnsavedChanges) return

        setIsSaving(true)
        try {
            // Prepare data to save - only include cards that haven't been removed
            const updatedCardsList = cards
                .filter((card) => !removedCardIds.includes(card.id))
                .map((card) => ({
                    cardId: card.id,
                    variants: cardVariants[card.id] || { normal: true, holofoil: false, reverseHolofoil: false },
                    quantity: {
                        normal: quantities[card.id]?.normal || 0,
                        holofoil: quantities[card.id]?.holofoil || 0,
                        reverseHolofoil: quantities[card.id]?.reverseHolofoil || 0,
                    },
                    addedAt: new Date().toISOString(),
                }))

            // Call mock save function
            const result = { message: 1 }

            // Show success toast
            showToast({
                type: "success",
                message: result.message,
            })

            // Reset states
            setHasUnsavedChanges(false)
            setRemovedCardIds([])
        } catch (error) {
            // Show error toast
            showToast({
                type: "error",
                message: error instanceof Error ? error.message : "An error occurred while saving",
            })
        } finally {
            setIsSaving(false)
        }
    }, [hasUnsavedChanges, cards, removedCardIds, cardVariants, quantities, list.id, showToast])

    // Card modal handlers
    const handleCardClick = useCallback((card: PokemonCard) => {
        setSelectedCard(card)
    }, [])

    const handleCloseModal = useCallback(() => {
        setSelectedCard(null)
    }, [])

    // Sort handlers
    const handleSortChange = useCallback(
        (sort: string) => {
            if (currentSort === sort) {
                setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
            } else {
                setCurrentSort(sort)
                setSortDirection("asc")
            }
        },
        [currentSort],
    )

    const handleDirectionChange = useCallback(() => {
        setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
    }, [])

    const handleViewModeChange = useCallback((mode: "grid" | "binder") => {
        setViewMode(mode)
    }, [])

    return {
        // States
        isLoading,
        searchTerm,
        setSearchTerm,
        displayedCards,
        cardVariants,
        selectedCard,
        quantities,
        currentSort,
        sortDirection,
        viewMode,
        hasUnsavedChanges,
        isSaving,
        activeTab,
        tabCounters,
        handleTabChange,

        // Card management
        addCard,
        removeCard,
        toggleVariant,
        updateQuantities,
        saveChanges,

        // UI handlers
        handleCardClick,
        handleCloseModal,
        handleSortChange,
        handleDirectionChange,
        handleViewModeChange,
    }
}

