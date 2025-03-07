"use client"

import type { CardVariants } from "~/types"

interface CardVariantsButtonsProps {
    cardId: string
    availableVariants: ("normal" | "holofoil" | "reverseHolofoil")[]
    selectedVariants: CardVariants
    onToggleVariant: (cardId: string, variant: keyof CardVariants) => void
    size?: "sm" | "md" | "lg"
}

export default function CardVariantsButtons({
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

    return (
        <div className="flex gap-2">
            {availableVariants.includes("normal") && (
                <button
                    className={`${buttonSize} rounded-full transition-all ${selectedVariants.normal
                            ? "bg-yellow-400 ring-2 ring-yellow-200 shadow-inner"
                            : "bg-yellow-400/70 hover:bg-yellow-400/90 border border-yellow-500/50"
                        }`}
                    onClick={() => onToggleVariant(cardId, "normal")}
                    title="Normal"
                />
            )}
            {availableVariants.includes("holofoil") && (
                <button
                    className={`${buttonSize} rounded-full transition-all ${selectedVariants.holofoil
                            ? "bg-purple-500 ring-2 ring-purple-300 shadow-inner"
                            : "bg-purple-500/70 hover:bg-purple-500/90 border border-purple-600/50"
                        }`}
                    onClick={() => onToggleVariant(cardId, "holofoil")}
                    title="Holofoil"
                />
            )}
            {availableVariants.includes("reverseHolofoil") && (
                <button
                    className={`${buttonSize} rounded-full transition-all ${selectedVariants.reverseHolofoil
                            ? "bg-blue-400 ring-2 ring-blue-200 shadow-inner"
                            : "bg-blue-400/70 hover:bg-blue-400/90 border border-blue-500/50"
                        }`}
                    onClick={() => onToggleVariant(cardId, "reverseHolofoil")}
                    title="Reverse Holofoil"
                />
            )}
        </div>
    )
}

