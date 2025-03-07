"use client"

import { useState, useMemo, useCallback } from "react"
import type { PokemonSet, PokemonCard, CardVariants } from "~/types"

export function useSetDetail(setDetails: PokemonSet, cards: PokemonCard[]) {
    // Estados
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
    const [searchTerm, setSearchTerm] = useState("")
    const [activeTab, setActiveTab] = useState("show-all")
    const [cardVariants, setCardVariants] = useState<Record<string, CardVariants>>({})
    const [selectedCard, setSelectedCard] = useState<PokemonCard | null>(null)
    const [selectedVariantFilters, setSelectedVariantFilters] = useState<string[]>([])
    const [currentSort, setCurrentSort] = useState("number")
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
    const [quantities, setQuantities] = useState<
        Record<
            string,
            {
                normal: number
                holofoil: number
                reverseHolofoil: number
                pokeballPattern: number
                masterBallPattern: number
            }
        >
    >({})

    // Filtrar cartas según el término de búsqueda
    const filteredBySearch = useMemo(() => {
        if (!searchTerm.trim()) return cards

        const lowercaseSearch = searchTerm.toLowerCase()
        return cards.filter(
            (card) =>
                card.name.toLowerCase().includes(lowercaseSearch) || card.number.toLowerCase().includes(lowercaseSearch),
        )
    }, [searchTerm, cards])

    // Filtrar cartas según variantes seleccionadas
    const filteredByVariants = useMemo(() => {
        if (selectedVariantFilters.length === 0) return filteredBySearch

        return filteredBySearch.filter((card) => {
            return selectedVariantFilters.some(
                (variant) => card.tcgplayer?.prices?.[variant as keyof typeof card.tcgplayer.prices],
            )
        })
    }, [filteredBySearch, selectedVariantFilters])

    // Ordenar cartas
    const sortedCards = useMemo(() => {
        return [...filteredByVariants].sort((a, b) => {
            let comparison = 0

            switch (currentSort) {
                case "number":
                    // Extraer solo los números para comparación
                    const aNum = Number.parseInt((/^\d+/.exec(a.number))?.[0] ?? "0")
                    const bNum = Number.parseInt((/^\d+/.exec(b.number))?.[0] ?? "0")
                    comparison = aNum - bNum
                    break

                case "name":
                    comparison = a.name.localeCompare(b.name)
                    break

                case "price":
                    const aPrice =
                        (a.tcgplayer?.prices?.normal?.market ??
                            (a.tcgplayer?.prices?.holofoil?.market) ??
                            a.tcgplayer?.prices?.reverseHolofoil?.market) ??
                        0
                    const bPrice =
                        (b.tcgplayer?.prices?.normal?.market ??
                            (b.tcgplayer?.prices?.holofoil?.market) ??
                            b.tcgplayer?.prices?.reverseHolofoil?.market) ??
                        0
                    comparison = aPrice - bPrice
                    break
            }

            return sortDirection === "asc" ? comparison : -comparison
        })
    }, [filteredByVariants, currentSort, sortDirection])

    // Filtrar cartas según la tab activa
    const displayedCards = useMemo(() => {
        switch (activeTab) {
            case "have":
                return sortedCards.filter((card) => {
                    const variants = cardVariants[card.id]
                    return variants && (variants.normal || variants.holofoil || variants.reverseHolofoil)
                })
            case "need":
                return sortedCards.filter((card) => {
                    const variants = cardVariants[card.id]
                    return !variants || (!variants.normal && !variants.holofoil && !variants.reverseHolofoil)
                })
            case "dupes":
                return sortedCards.filter((card) => {
                    const cardQuantities = quantities[card.id]
                    if (!cardQuantities) return false

                    // Verificar si alguna variante tiene cantidad > 1
                    return Object.values(cardQuantities).some((qty) => qty > 1)
                })
            default:
                return sortedCards
        }
    }, [activeTab, sortedCards, cardVariants, quantities])

    // Calcular contadores para las tabs
    const counters = useMemo(() => {
        const have = cards.filter((card) => {
            const variants = cardVariants[card.id]
            return variants && (variants.normal || variants.holofoil || variants.reverseHolofoil)
        }).length

        const dupes = Object.entries(quantities).reduce((total, [_cardId, cardQuantities]) => {
            const totalQuantity = Object.values(cardQuantities).reduce((sum, qty) => sum + qty, 0)
            return total + (totalQuantity > 1 ? 1 : 0)
        }, 0)

        return {
            have,
            need: cards.length - have,
            dupes,
        }
    }, [cards, cardVariants, quantities])

    // Función para alternar filtros de variante (optimizada con useCallback)
    const handleVariantToggle = useCallback((variant: string) => {
        setSelectedVariantFilters((prev) => {
            if (prev.includes(variant)) {
                return prev.filter((v) => v !== variant)
            }
            return [...prev, variant]
        })
    }, [])

    // Limpiar la búsqueda (optimizada con useCallback)
    const clearSearch = useCallback(() => {
        setSearchTerm("")
    }, [])

    // Función para manejar el cambio de ordenamiento (optimizada con useCallback)
    const handleSortChange = useCallback((sort: string) => {
        setCurrentSort((prevSort) => {
            if (prevSort === sort) {
                // Si se hace clic en el mismo criterio, cambiar la dirección
                setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
                return prevSort
            } else {
                // Si se cambia el criterio, establecer la dirección en ascendente
                setSortDirection("asc")
                return sort
            }
        })
    }, [])

    // Función para cambiar la dirección del ordenamiento (optimizada con useCallback)
    const handleDirectionChange = useCallback(() => {
        setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
    }, [])

    // Función para alternar las variantes de una carta (optimizada con useCallback)
    const toggleVariant = useCallback((cardId: string, variant: keyof CardVariants) => {
        // Actualizar el estado de las variantes
        setCardVariants((prev) => {
            const currentVariants = prev[cardId] || { normal: false, holofoil: false, reverseHolofoil: false }
            const newVariantState = !currentVariants[variant]

            // Nuevo objeto de variantes
            const newVariants = {
                ...prev,
                [cardId]: {
                    ...currentVariants,
                    [variant]: newVariantState,
                },
            }

            // También actualizar cantidades
            setQuantities((prevQuantities) => {
                const currentQuantities = prevQuantities[cardId] || {
                    normal: 0,
                    holofoil: 0,
                    reverseHolofoil: 0,
                    pokeballPattern: 0,
                    masterBallPattern: 0,
                }

                return {
                    ...prevQuantities,
                    [cardId]: {
                        ...currentQuantities,
                        [variant]: newVariantState ? 1 : 0,
                    },
                }
            })

            return newVariants
        })
    }, [])

    // Función para manejar el clic en una carta (optimizada con useCallback)
    const handleCardClick = useCallback((card: PokemonCard) => {
        setSelectedCard(card)
    }, [])

    // Función para cerrar el modal (optimizada con useCallback)
    const handleCloseModal = useCallback(() => {
        setSelectedCard(null)
    }, [])

    // Función para actualizar cantidades (optimizada con useCallback)
    const updateQuantities = useCallback((newQuantities: typeof quantities) => {
        setQuantities(newQuantities)
    }, [])

    return {
        // Estados
        viewMode,
        searchTerm,
        activeTab,
        cardVariants,
        selectedCard,
        selectedVariantFilters,
        currentSort,
        sortDirection,
        quantities,

        // Datos calculados
        displayedCards,
        counters,

        // Acciones
        setViewMode,
        setSearchTerm,
        setActiveTab,
        handleVariantToggle,
        clearSearch,
        handleSortChange,
        handleDirectionChange,
        toggleVariant,
        handleCardClick,
        handleCloseModal,
        updateQuantities,
    }
}

