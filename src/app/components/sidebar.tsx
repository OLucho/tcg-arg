"use client"

import { ChevronDown, ChevronUp, ListChecks } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import type { PokemonSet } from "~/types"

interface SidebarProps {
    seriesGroups: Record<string, PokemonSet[]>
}

export function Sidebar({ seriesGroups }: SidebarProps) {
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({})
    const [expandedSets, setExpandedSets] = useState<boolean>(false)

    const toggleGroup = (series: string) => {
        setExpandedGroups((prev) => ({
            ...prev,
            [series]: !prev[series],
        }))
    }

    const toggleSets = () => {
        setExpandedSets((prev) => !prev)
    }

    return (
        <div className="w-72 h-full bg-base-200 text-base-content overflow-y-auto overflow-x-hidden">
            <ul className="menu p-2 w-full max-w-full">
                {/* Sección de Mis Listas */}
                <li className="mb-2 w-full">
                    <Link
                        href="/lists"
                        className="flex items-center gap-2 w-full px-2 py-2 hover:bg-base-300 rounded-lg font-medium"
                    >
                        <ListChecks size={16} />
                        <span>Mis Listas</span>
                    </Link>
                </li>

                {/* Sección de Sets & Expansiones */}
                <li className="mb-2 w-full">
                    <div
                        className="flex justify-between items-center cursor-pointer w-full px-2 py-2 hover:bg-base-300 rounded-lg font-medium"
                        onClick={toggleSets}
                    >
                        <span>Sets & Expansiones</span>
                        {expandedSets ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>

                    {expandedSets && (
                        <ul className="pl-3 w-full">
                            {Object.entries(seriesGroups).map(([series, seriesSets]) => (
                                <li key={series} className="mb-2 w-full">
                                    <div
                                        className="flex justify-between items-center cursor-pointer w-full px-2 py-2 hover:bg-base-300 rounded-lg"
                                        onClick={() => toggleGroup(series)}
                                    >
                                        <span className="font-medium truncate">{series}</span>
                                        {expandedGroups[series] ? (
                                            <ChevronUp size={16} className="flex-shrink-0" />
                                        ) : (
                                            <ChevronDown size={16} className="flex-shrink-0" />
                                        )}
                                    </div>

                                    {expandedGroups[series] && (
                                        <ul className="pl-3 w-full">
                                            {seriesSets.map((set) => (
                                                <li key={set.id} className="w-full">
                                                    <Link
                                                        href={`/set/${set.id}`}
                                                        className="flex items-start gap-2 px-2 py-1 hover:bg-base-300 rounded-lg w-full"
                                                    >
                                                        {set.images.symbol && (
                                                            <Image
                                                                width={5}
                                                                height={5}
                                                                src={set.images.symbol || "/placeholder.svg"}
                                                                alt={set.name}
                                                                className="w-5 h-5 flex-shrink-0 mt-1"
                                                            />
                                                        )}
                                                        <span className="break-words w-[calc(100%-28px)]">{set.name}</span>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </li>
            </ul>
        </div>
    )
}

