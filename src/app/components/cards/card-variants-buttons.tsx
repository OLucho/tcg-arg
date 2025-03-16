// Moved from set/[setId]/components/card-variants-buttons.tsx
"use client"

import type React from "react"
import { memo } from "react"
import type { CardVariants } from "~/types"

interface CardVariantsButtonsProps {
    cardId: string
    availableVariants: ("normal" | "holofoil" | "reverseHolofoil")[]
    selectedVariants: CardVariants
    onToggleVariant: (cardId: string, variant: keyof CardVariants) => void
    size?: "sm" | "md" | "lg"
}

const CardVariantsButtons = memo(function CardVariantsButtons({
    cardId,
    availableVariants,
    selectedVariants,
    onToggleVariant,
    size = "md",
}: CardVariantsButtonsProps) {
    const buttonSize = {
        sm: "w-5 h-5",
        md: "w-6 h-6",
        lg: "w-7 h-7",
    }[size]

    // Crear funciones de manejo de clics específicas para cada variante
    const handleNormalClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        onToggleVariant(cardId, "normal")
    }

    const handleHolofoilClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        onToggleVariant(cardId, "holofoil")
    }

    const handleReverseHolofoilClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        onToggleVariant(cardId, "reverseHolofoil")
    }

    return (
        <div className="flex gap-2">
            {availableVariants.includes("normal") && (
                <button
                    className={`${buttonSize} rounded-lg transition-all ${selectedVariants.normal
                            ? "bg-yellow-400 ring-2 ring-yellow-200 shadow-inner"
                            : "bg-transparent border-2 border-yellow-400 hover:bg-yellow-400/20"
                        }`}
                    onClick={handleNormalClick}
                    title="Normal"
                />
            )}
            {availableVariants.includes("holofoil") && (
                <button
                    className={`${buttonSize} rounded-lg transition-all ${selectedVariants.holofoil
                            ? "bg-purple-500 ring-2 ring-purple-300 shadow-inner"
                            : "bg-transparent border-2 border-purple-500 hover:bg-purple-500/20"
                        }`}
                    onClick={handleHolofoilClick}
                    title="Holofoil"
                />
            )}
            {availableVariants.includes("reverseHolofoil") && (
                <button
                    className={`${buttonSize} rounded-lg transition-all ${selectedVariants.reverseHolofoil
                            ? "bg-blue-400 ring-2 ring-blue-200 shadow-inner"
                            : "bg-transparent border-2 border-blue-400 hover:bg-blue-400/20"
                        }`}
                    onClick={handleReverseHolofoilClick}
                    title="Reverse Holofoil"
                />
            )}
        </div>
    )
})

export default CardVariantsButtons

