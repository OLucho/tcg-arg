"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, X, Plus } from "lucide-react"

type SelectedCard = {
    id: string
    name: string
    images: { small: string }
    number: string
    rarity: string
}

type SearchResult = {
    id: string
    name: string
    images: { small: string }
    number: string
    rarity: string
}

export default function CreateListPage() {
    const router = useRouter()
    const [listName, setListName] = useState("")
    const [description, setDescription] = useState("")
    const [isPublic, setIsPublic] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCards, setSelectedCards] = useState<SelectedCard[]>([])

    // Estado para los resultados de búsqueda y carga
    const [searchResults, setSearchResults] = useState<SearchResult[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [searchError, setSearchError] = useState<string | null>(null)

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!searchTerm.trim()) {
            setSearchResults([])
            return
        }

        setIsSearching(true)
        setSearchError(null)

        try {
            // Hacer una petición real a la API de Pokémon TCG
            const response = await fetch(`https://api.pokemontcg.io/v2/cards?q=name:"${searchTerm}"&pageSize=20`)

            if (!response.ok) {
                throw new Error(`Error en la búsqueda: ${response.status} ${response.statusText}`)
            }

            const data = await response.json() as { data: SearchResult[] }

            if (data.data && Array.isArray(data.data)) {
                setSearchResults(data.data)
                console.log(`Se encontraron ${data.data.length} cartas para "${searchTerm}"`)
            } else {
                setSearchResults([])
                console.log(`No se encontraron cartas para "${searchTerm}"`)
            }
        } catch (error) {
            console.error("Error buscando cartas:", error)
            setSearchError("Ocurrió un error al buscar cartas. Por favor, intenta de nuevo.")
            setSearchResults([])
        } finally {
            setIsSearching(false)
        }
    }

    const addCardToList = (card: SelectedCard) => {
        if (!selectedCards.some((c) => c.id === card.id)) {
            setSelectedCards([...selectedCards, card])
        }
    }

    const removeCardFromList = (cardId: string) => {
        setSelectedCards(selectedCards.filter((card) => card.id !== cardId))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!listName.trim() || selectedCards.length === 0) {
            alert("Por favor, ingresa un nombre para la lista y selecciona al menos una carta.")
            return
        }

        setIsSubmitting(true)

        try {
            // Crear un objeto con los datos de la lista
            const newList = {
                id: `list_${Date.now()}`, // Generar un ID único basado en la fecha actual
                name: listName,
                description,
                isPublic,
                cards: selectedCards,
                cardCount: selectedCards.length,
                completionPercentage: 0, // Inicialmente 0% completado
                createdAt: new Date().toISOString(),
                lastUpdated: new Date().toISOString(),
            }

            // Guardar directamente en sessionStorage para pruebas
            sessionStorage.setItem("currentCreatedList", JSON.stringify(newList))

            // Obtener las listas existentes del localStorage (si hay alguna)
            let existingLists = []
            try {
                const existingListsJSON = localStorage.getItem("pokemonTCGLists")
                if (existingListsJSON) {
                    existingLists = JSON.parse(existingListsJSON)
                    if (!Array.isArray(existingLists)) {
                        existingLists = []
                    }
                }
            } catch (error) {
                console.error("Error parsing existing lists:", error)
                existingLists = []
            }

            // Añadir la nueva lista
            existingLists.push(newList)

            // Guardar en localStorage
            localStorage.setItem("pokemonTCGLists", JSON.stringify(existingLists))

            console.log("Lista creada y guardada:", newList)
            console.log("Todas las listas:", existingLists)

            // Simular un pequeño retraso para mostrar el estado de carga
            await new Promise((resolve) => setTimeout(resolve, 500))

            // Redirigir a la página de listas con un parámetro para forzar recarga
            window.location.href = "/lists?new=" + Date.now()
        } catch (error) {
            console.error("Error creating list:", error)
            alert("Ocurrió un error al crear la lista. Por favor, intenta de nuevo.")
            setIsSubmitting(false)
        }
    }

    return (
        <div className="container mx-auto p-4 bg-base-300 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-white">Crear Nueva Lista</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Formulario de la lista */}
                <div className="lg:col-span-1">
                    <div className="card bg-base-300 shadow-xl border border-base-200/20">
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="form-control mb-4">
                                    <label className="label">
                                        <span className="label-text text-white">Nombre de la Lista</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="input input-bordered bg-base-200/20 text-white"
                                        value={listName}
                                        onChange={(e) => setListName(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-control mb-4">
                                    <label className="label">
                                        <span className="label-text text-white">Descripción (opcional)</span>
                                    </label>
                                    <textarea
                                        className="textarea textarea-bordered bg-base-200/20 text-white"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    ></textarea>
                                </div>

                                <div className="form-control mb-6">
                                    <label className="label cursor-pointer">
                                        <span className="label-text text-white">Hacer esta lista pública</span>
                                        <input
                                            type="checkbox"
                                            className="toggle toggle-primary"
                                            checked={isPublic}
                                            onChange={(e) => setIsPublic(e.target.checked)}
                                        />
                                    </label>
                                    <p className="text-sm text-white/70">
                                        Las listas públicas pueden ser vistas por cualquier persona con el enlace.
                                    </p>
                                </div>

                                <div className="card-actions justify-end">
                                    <button
                                        type="button"
                                        className="btn btn-ghost text-white"
                                        onClick={() => router.push("/lists")}
                                        disabled={isSubmitting}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={isSubmitting || !listName.trim() || selectedCards.length === 0}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span className="loading loading-spinner loading-sm"></span>
                                                Creando...
                                            </>
                                        ) : (
                                            "Crear Lista"
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Sección de búsqueda y selección de cartas */}
                <div className="lg:col-span-2">
                    <div className="card bg-base-300 shadow-xl border border-base-200/20 mb-6">
                        <div className="card-body">
                            <h2 className="card-title text-white">Buscar Cartas</h2>

                            <form onSubmit={handleSearch} className="relative w-full max-w-md mb-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Buscar por nombre de carta (ej: Pikachu, Charizard)..."
                                        className="input input-bordered w-full pl-10 pr-10"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    {searchTerm && (
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                            onClick={() => setSearchTerm("")}
                                        >
                                            <X size={18} />
                                        </button>
                                    )}
                                </div>
                                <button type="submit" className="btn btn-primary mt-2" disabled={isSearching || !searchTerm.trim()}>
                                    {isSearching ? (
                                        <>
                                            <span className="loading loading-spinner loading-sm"></span>
                                            Buscando...
                                        </>
                                    ) : (
                                        "Buscar"
                                    )}
                                </button>
                            </form>

                            {searchError && (
                                <div className="alert alert-error mb-4">
                                    <div>{searchError}</div>
                                </div>
                            )}

                            {isSearching ? (
                                <div className="flex justify-center items-center py-8">
                                    <span className="loading loading-spinner loading-lg"></span>
                                </div>
                            ) : searchResults.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                                    {searchResults.map((card) => (
                                        <div key={card.id} className="card bg-base-200 shadow-md">
                                            <figure className="px-4 pt-4">
                                                <img src={card.images.small || "/placeholder.svg"} alt={card.name} className="rounded-lg" />
                                            </figure>
                                            <div className="card-body p-4 pt-2">
                                                <h3 className="card-title text-sm">{card.name}</h3>
                                                <div className="flex justify-between items-center text-xs">
                                                    <span>{card.number}</span>
                                                    <span className="badge badge-sm">{card.rarity}</span>
                                                </div>
                                                <button
                                                    className="btn btn-primary btn-sm mt-2"
                                                    onClick={() => addCardToList(card)}
                                                    disabled={selectedCards.some((c) => c.id === card.id)}
                                                >
                                                    <Plus size={16} />
                                                    {selectedCards.some((c) => c.id === card.id) ? "Agregada" : "Agregar"}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : searchTerm && !isSearching ? (
                                <div className="alert alert-info">
                                    <div>No se encontraron cartas que coincidan con "{searchTerm}". Intenta con otro término.</div>
                                </div>
                            ) : null}
                        </div>
                    </div>

                    {/* Cartas seleccionadas */}
                    <div className="card bg-base-300 shadow-xl border border-base-200/20">
                        <div className="card-body">
                            <h2 className="card-title text-white">Cartas Seleccionadas ({selectedCards.length})</h2>

                            {selectedCards.length === 0 ? (
                                <div className="alert alert-info">
                                    <div>Busca y agrega cartas a tu lista.</div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                                    {selectedCards.map((card) => (
                                        <div key={card.id} className="card bg-base-200 shadow-md">
                                            <figure className="px-4 pt-4">
                                                <img src={card.images.small || "/placeholder.svg"} alt={card.name} className="rounded-lg" />
                                            </figure>
                                            <div className="card-body p-4 pt-2">
                                                <h3 className="card-title text-sm">{card.name}</h3>
                                                <button className="btn btn-error btn-sm mt-2" onClick={() => removeCardFromList(card.id)}>
                                                    <X size={16} />
                                                    Quitar
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

