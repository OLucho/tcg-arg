"use client"

import { useState } from "react"
import { Grid, List } from "lucide-react"
import type { PokemonCard, PokemonSet } from "~/types"
import Image from "next/image"

interface SetDetailClientProps {
    setDetails: PokemonSet
    cards: PokemonCard[]
}

export default function SetDetailClient({ setDetails, cards }: SetDetailClientProps) {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

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
                            <Image
                                width={20}
                                height={20}
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
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="card-title text-2xl">Browse Cards</h2>
                                <p className="text-gray-400">{cards.length} cards in this set</p>
                            </div>

                            <div className="btn-group">
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

                        <div className="divider"></div>

                        {/* Grid de cartas usando card-compact de daisyUI */}
                        {viewMode === "grid" ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                                {cards.map((card) => (
                                    <div
                                        key={card.id}
                                        className="card card-compact bg-base-300 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
                                    >
                                        <figure>
                                            <Image
                                                width={200}
                                                height={200}
                                                src={card.images.small || "/placeholder.svg"} alt={card.name} loading="lazy" />
                                        </figure>
                                        <div className="card-body p-2">
                                            <h3 className="card-title text-sm justify-center">{card.name}</h3>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs opacity-80">
                                                    {card.number}/{setDetails.printedTotal}
                                                </span>
                                                <span className="badge badge-xs">{card.rarity}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
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
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cards.map((card) => (
                                            <tr key={card.id} className="hover">
                                                <td>{card.number}</td>
                                                <td>
                                                    <Image
                                                        width={20}
                                                        height={20}
                                                        src={card.images.small || "/placeholder.svg"}
                                                        alt={card.name}
                                                        className="w-12 h-auto"
                                                        loading="lazy"
                                                    />
                                                </td>
                                                <td>{card.name}</td>
                                                <td>{card.types?.join(", ") || "-"}</td>
                                                <td>
                                                    <span className="badge">{card.rarity}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Mensaje si no hay cartas */}
                        {cards.length === 0 && (
                            <div className="alert alert-warning">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="stroke-current shrink-0 h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    />
                                </svg>
                                <div>
                                    <h3 className="font-bold">No cards found!</h3>
                                    <div className="text-xs">This set doesn't have any cards available.</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

