"use client"

import { useListDetail } from "./hooks/useListDetail"
import { useToast } from "./hooks/useToast"
import type { ApiList } from "../useLists"
import type { PokemonCard, PokemonSet } from "~/types"
import CardGrid from "~/app/components/cards/card-grid"
import CardModal from "~/app/components/cards/card-modal"
import ListHeader from "./components/list-header"
import ListToolbar from "./components/list-toolbar"
import EmptyState from "./components/empty-state"
import Toast from "./components/toast"
import ListTabs from "./components/list-tabs"

interface ListDetailClientProps {
    list: ApiList & { cards: any[] }
    cards: PokemonCard[]
    seriesGroups?: Record<string, PokemonSet[]>
}

export default function ListDetailClient({ list, cards, seriesGroups = {} }: ListDetailClientProps) {
    // Update the destructuring to include the new tab-related properties
    const {
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
        addCard,
        removeCard,
        toggleVariant,
        updateQuantities,
        saveChanges,
        handleCardClick,
        handleCloseModal,
        handleSortChange,
        handleDirectionChange,
        handleViewModeChange,
        handleTabChange,
    } = useListDetail(list, cards)

    const { toast, hideToast } = useToast()

    return (
        <div className="min-h-screen bg-base-300">
            {/* Header with list information */}
            <ListHeader
                list={list}
                totalCards={displayedCards.length}
                cards={displayedCards}
                seriesGroups={seriesGroups}
                hasUnsavedChanges={hasUnsavedChanges}
                isSaving={isSaving}
                onSaveChanges={saveChanges}
                onAddCard={addCard}
            />

            {/* Toolbar */}
            <div className="container mx-auto px-4 pt-2 pb-4">
                <ListToolbar
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    currentSort={currentSort}
                    sortDirection={sortDirection}
                    onSortChange={handleSortChange}
                    onDirectionChange={handleDirectionChange}
                    viewMode={viewMode}
                    onViewModeChange={handleViewModeChange}
                />
            </div>

            {/* Main content */}
            <div className="container mx-auto px-4 py-6">
                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <span className="loading loading-spinner loading-lg"></span>
                    </div>
                ) : (
                    <div className="card bg-base-200 shadow-xl">
                        <div className="card-body">
                            {/* Add the ListTabs component inside the card-body div, just before the EmptyState component */}
                            {/* Add the tabs here */}
                            <div className="flex justify-between items-center gap-4 mb-4">
                                <ListTabs
                                    activeTab={activeTab}
                                    haveCount={tabCounters.have}
                                    needCount={tabCounters.need}
                                    dupesCount={tabCounters.dupes}
                                    onTabChange={handleTabChange}
                                />
                            </div>

                            <div className="divider"></div>

                            {/* Empty state when no cards */}
                            {displayedCards.length === 0 && (
                                <EmptyState searchTerm={searchTerm} onClearSearch={() => setSearchTerm("")} activeTab={activeTab} />
                            )}

                            {/* Card grid */}
                            {displayedCards.length > 0 && (
                                <CardGrid
                                    cards={displayedCards}
                                    cardVariants={cardVariants}
                                    onToggleVariant={toggleVariant}
                                    onCardClick={handleCardClick}
                                    showVariantButtons={true}
                                />
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Card details modal */}
            {selectedCard && (
                <CardModal
                    card={selectedCard}
                    isOpen={!!selectedCard}
                    onClose={handleCloseModal}
                    cardVariants={cardVariants}
                    onToggleVariant={toggleVariant}
                    quantities={quantities}
                    setQuantities={updateQuantities}
                    showRemoveButton={true}
                    onRemoveCard={removeCard}
                />
            )}

            {/* Toast notification */}
            {toast && <Toast toast={toast} onClose={hideToast} />}
        </div>
    )
}

