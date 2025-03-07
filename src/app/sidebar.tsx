"use client"

import { ChevronDown, ChevronUp } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { type PokemonSet } from "~/types"

interface SidebarProps {
    seriesGroups: Record<string, PokemonSet[]>;
    onClose: () => void;
}

export function Sidebar({ seriesGroups, onClose }: SidebarProps) {
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({})
    const toggleGroup = (series: string) => {
        setExpandedGroups((prev) => ({
            ...prev,
            [series]: !prev[series],
        }))
    }

    return (
        <div className="w-64 h-full bg-base-200 text-base-content overflow-y-auto overflow-x-hidden">
            <div className="flex justify-end lg:hidden p-2">
                <label htmlFor="drawer-toggle" className="btn btn-square btn-ghost">
                    ❌
                </label>
            </div>

            <ul className="menu p-2 w-full max-w-full">
                <li className="menu-title">
                    <span>Sets & Expansiones</span>
                </li>

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
                            <ul className="pl-2 w-full">
                                {seriesSets.map((set) => (
                                    <li key={set.id} className="w-full">
                                        <Link
                                            href={`/sets/${set.id}`}
                                            className="flex items-start gap-2 px-2 py-1 hover:bg-base-300 rounded-lg w-full"
                                            onClick={onClose}
                                        >
                                            {set.images.symbol && (
                                                <Image
                                                    src={set.images.symbol || "/placeholder.svg"}
                                                    alt={set.name}
                                                    className="w-5 h-5 flex-shrink-0 mt-1"
                                                    width={5}
                                                    height={5}
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
        </div>
    )
}

