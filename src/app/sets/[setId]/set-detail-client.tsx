"use client"

import { Grid, List, Search, X } from "lucide-react"
import type { PokemonSet, PokemonCard } from "~/types"
import CardGrid from "./components/card-grid"
import SetTabs from "./components/set-tabs"
import CardModal from "./components/card-modal"
import SetHeader from "./components/set-header"
import VariantFilters from "./components/variant-filters"
import SortFilters from "./components/sort-filters"
import { useSetDetail } from "./hooks/useSetDetail"
import CardVariantsButtons from "./components/card-variants-buttons"

interface SetDetailClientProps {
    setDetails: PokemonSet
    cards: PokemonCard[]
}

export default function SetDetailClient({ setDetails, cards }: SetDetailClientProps) {
    const {
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
    } = useSetDetail(setDetails, cards)

    return (
        <div className="bg-base-300 min-h-screen pb-16">
            {/* Header con información del set */}
            <SetHeader setDetails={setDetails} cards={cards} cardVariants={cardVariants} />

            {/* Contenido principal */}
            <div className="container mx-auto px-4 pt-6">
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

                                {/* Filtros de ordenamiento */}
                                <SortFilters
                                    currentSort={currentSort}
                                    sortDirection={sortDirection}
                                    onSortChange={handleSortChange}
                                    onDirectionChange={handleDirectionChange}
                                />

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

                        {/* Filtros de variante */}
                        <VariantFilters selectedVariants={selectedVariantFilters} onVariantToggle={handleVariantToggle} />

                        {/* Tabs de navegación */}
                        <div className="mt-6">
                            <SetTabs
                                activeTab={activeTab}
                                haveCount={counters.have}
                                needCount={counters.need}
                                dupesCount={counters.dupes}
                                onTabChange={setActiveTab}
                            />
                        </div>

                        <div className="divider"></div>

                        {/* Mensaje cuando no hay resultados */}
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
                                    onCardClick={handleCardClick}
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
                                                <tr key={card.id} className="hover cursor-pointer" onClick={() => handleCardClick(card)}>
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
                                                    <td>{card.types?.join(", ") || "-"}</td>
                                                    <td>
                                                        <span className="badge">{card.rarity}</span>
                                                    </td>
                                                    <td onClick={(e) => e.stopPropagation()}>
                                                        <div className="flex gap-2">
                                                            {card.tcgplayer?.prices && (
                                                                <CardVariantsButtons // Using the imported component
                                                                    cardId={card.id}
                                                                    availableVariants={Object.keys(card.tcgplayer.prices)
                                                                        .filter((key) => ["normal", "holofoil", "reverseHolofoil"].includes(key))
                                                                        .map((key) => key as "normal" | "holofoil" | "reverseHolofoil")}
                                                                    selectedVariants={
                                                                        cardVariants[card.id] || { normal: false, holofoil: false, reverseHolofoil: false }
                                                                    }
                                                                    onToggleVariant={toggleVariant}
                                                                    size="lg"
                                                                />
                                                            )}
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

            {/* Modal de detalles de la carta */}
            {selectedCard && (
                <CardModal
                    card={selectedCard}
                    isOpen={!!selectedCard}
                    onClose={handleCloseModal}
                    cardVariants={cardVariants}
                    onToggleVariant={toggleVariant}
                    quantities={quantities}
                    setQuantities={updateQuantities}
                />
            )}
        </div>
    )
}

