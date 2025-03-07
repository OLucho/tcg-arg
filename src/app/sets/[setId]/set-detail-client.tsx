"use client"

import { useState, useMemo } from "react"
import { Grid, List, Search, X } from "lucide-react"
import type { PokemonSet, CardVariants, PokemonCard } from "~/types"
import Tabs from "./components/tabs"
import CardGrid from "./components/card-grid"
import CardVariantsButtons from "./components/card-variants-button"


interface SetDetailClientProps {
    setDetails: PokemonSet
    cards: PokemonCard[]
}

export default function SetDetailClient({ setDetails, cards }: SetDetailClientProps) {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
    const [searchTerm, setSearchTerm] = useState("")
    const [activeTab, setActiveTab] = useState("show-all")
    const [cardVariants, setCardVariants] = useState<Record<string, CardVariants>>({})

    // Filtrar cartas según el término de búsqueda
    const filteredBySearch = useMemo(() => {
        if (!searchTerm.trim()) return cards

        const lowercaseSearch = searchTerm.toLowerCase()
        return cards.filter(
            (card) => card.name.toLowerCase().includes(lowercaseSearch) || card.number.includes(lowercaseSearch),
        )
    }, [searchTerm, cards])

    // Filtrar cartas según la tab activa
    const displayedCards = useMemo(() => {
        switch (activeTab) {
            case "have":
                return filteredBySearch.filter((card) => {
                    const variants = cardVariants[card.id]
                    return variants && (variants.normal || variants.holofoil || variants.reverseHolofoil)
                })
            case "need":
                return filteredBySearch.filter((card) => {
                    const variants = cardVariants[card.id]
                    return !variants || (!variants.normal && !variants.holofoil && !variants.reverseHolofoil)
                })
            case "dupes":
                // Implementar lógica para duplicados si es necesario
                return []
            default:
                return filteredBySearch
        }
    }, [activeTab, filteredBySearch, cardVariants])

    // Calcular contadores para las tabs
    const counters = useMemo(() => {
        const have = cards.filter((card) => {
            const variants = cardVariants[card.id]
            return variants && (variants.normal || variants.holofoil || variants.reverseHolofoil)
        }).length

        return {
            have,
            need: cards.length - have,
            dupes: 0, // Implementar lógica para duplicados si es necesario
        }
    }, [cards, cardVariants])

    // Limpiar la búsqueda
    const clearSearch = () => {
        setSearchTerm("")
    }

    // Función para alternar las variantes de una carta
    const toggleVariant = (cardId: string, variant: keyof CardVariants) => {
        setCardVariants((prev) => ({
            ...prev,
            [cardId]: {
                ...(prev[cardId] ?? { normal: false, holofoil: false, reverseHolofoil: false }),
                [variant]: !prev[cardId]?.[variant],
            },
        }))
    }

    return (
        <div className="bg-base-300 min-h-screen pb-16">
            {/* Hero section usando el componente hero de daisyUI */}
            <div
                className="hero min-h-[20rem]"
                style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(${setDetails.images.logo})`,
                }}
            >
                <div className="hero-overlay bg-opacity-60 bg-gradient-to-b from-transparent to-base-300"></div>
                <div className="hero-content text-center text-neutral-content">
                    <div className="max-w-md">
                        {setDetails.images.symbol && (
                            <img
                                src={setDetails.images.symbol || "/placeholder.svg"}
                                alt={`${setDetails.name} Symbol`}
                                className="w-16 h-16 mx-auto mb-4"
                            />
                        )}
                        <h1 className="text-5xl font-bold">{setDetails.name}</h1>
                        <p className="py-2">{setDetails.series} Series</p>

                        <div className="flex flex-wrap justify-center gap-4 mt-4">
                            <div className="badge badge-lg badge-outline">
                                Released: {new Date(setDetails.releaseDate).toLocaleDateString()}
                            </div>
                            <div className="badge badge-lg badge-primary">{setDetails.printedTotal} Cards</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contenido principal */}
            <div className="container mx-auto px-4 pt-6 relative z-10">
                {/* Sección de cartas */}
                <div className="card bg-base-200 shadow-xl">
                    <div className="card-body">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h2 className="card-title text-2xl">Browse Cards</h2>
                                <p className="text-gray-400">
                                    {displayedCards.length === cards.length
                                        ? `${cards.length} cards in this set`
                                        : `Showing ${displayedCards.length} of ${cards.length} cards`}
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                                {/* Input de búsqueda */}
                                <div className="relative w-full sm:w-64">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <Search size={18} className="text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        className="input input-bordered w-full pl-10 pr-10"
                                        placeholder="Search by name or number..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    {searchTerm && (
                                        <button className="absolute inset-y-0 right-0 flex items-center pr-3" onClick={clearSearch}>
                                            <X size={18} className="text-gray-400 hover:text-gray-600" />
                                        </button>
                                    )}
                                </div>

                                {/* Botones de vista */}
                                <div className="btn-group self-end">
                                    <button
                                        className={`btn btn-sm ${viewMode === "grid" ? "btn-active" : ""}`}
                                        onClick={() => setViewMode("grid")}
                                    >
                                        <Grid size={16} />
                                    </button>
                                    <button
                                        className={`btn btn-sm ${viewMode === "list" ? "btn-active" : ""}`}
                                        onClick={() => setViewMode("list")}
                                    >
                                        <List size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Leyenda de variantes */}
                        <div className="flex flex-wrap gap-4 mt-4 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                                <span>=Normal</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-purple-500 rounded"></div>
                                <span>=Holofoil</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-blue-400 rounded"></div>
                                <span>=Reverse Holofoil</span>
                            </div>
                        </div>

                        {/* Tabs de navegación */}
                        <div className="mt-6">
                            <Tabs
                                activeTab={activeTab}
                                haveCount={counters.have}
                                needCount={counters.need}
                                dupesCount={counters.dupes}
                                onTabChange={setActiveTab}
                            />
                        </div>

                        <div className="divider"></div>

                        {/* Mensaje cuando no hay resultados de búsqueda */}
                        {displayedCards.length === 0 && (
                            <div className="alert alert-info">
                                <div>
                                    {searchTerm ? (
                                        <>
                                            <span>No cards found matching &quot;{searchTerm}&quot;. Try a different search term.</span>
                                            <button className="btn btn-sm ml-4" onClick={clearSearch}>
                                                Clear Search
                                            </button>
                                        </>
                                    ) : (
                                        <span>No cards found in this category.</span>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Grid de cartas */}
                        {displayedCards.length > 0 &&
                            (viewMode === "grid" ? (
                                <CardGrid
                                    cards={displayedCards}
                                    setDetails={setDetails}
                                    cardVariants={cardVariants}
                                    onToggleVariant={toggleVariant}
                                />
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="table table-zebra">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Card</th>
                                                <th>Name</th>
                                                <th>Type</th>
                                                <th>Rarity</th>
                                                <th>Variants</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {displayedCards.map((card) => (
                                                <tr key={card.id} className="hover">
                                                    <td>{card.number}</td>
                                                    <td>
                                                        <div className="relative w-16 h-24">
                                                            <img
                                                                src={card.images.small || "/placeholder.svg"}
                                                                alt={card.name}
                                                                className="w-full h-full object-contain rounded"
                                                            />
                                                        </div>
                                                    </td>
                                                    <td>{card.name}</td>
                                                    <td>{card.types?.join(", ") ?? "-"}</td>
                                                    <td>
                                                        <span className="badge">{card.rarity}</span>
                                                    </td>
                                                    <td>
                                                        <div className="flex gap-2">
                                                            {/* Usar el componente CardVariantsButtons con tamaño grande */}
                                                            <CardVariantsButtons
                                                                cardId={card.id}
                                                                availableVariants={
                                                                    card.tcgplayer?.prices
                                                                        ? (Object.keys(card.tcgplayer.prices).filter((key) =>
                                                                            ["normal", "holofoil", "reverseHolofoil"].includes(key),
                                                                        ) as ("normal" | "holofoil" | "reverseHolofoil")[])
                                                                        : ["normal"]
                                                                }
                                                                selectedVariants={
                                                                    cardVariants[card.id] ?? { normal: false, holofoil: false, reverseHolofoil: false }
                                                                }
                                                                onToggleVariant={toggleVariant}
                                                                size="lg"
                                                            />
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

