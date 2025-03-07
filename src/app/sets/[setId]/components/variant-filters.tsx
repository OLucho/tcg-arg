"use client"

interface VariantFiltersProps {
    selectedVariants: string[]
    onVariantToggle: (variant: string) => void
}

export default function VariantFilters({ selectedVariants, onVariantToggle }: VariantFiltersProps) {
    const variants = [
        { id: "normal", label: "Normal", color: "border-yellow-400" },
        { id: "holofoil", label: "Holofoil", color: "border-purple-500" },
        { id: "reverseHolofoil", label: "Reverse Holofoil", color: "border-blue-400" },
    ]

    return (
        <div className="flex flex-wrap gap-4 my-4 justify-end">
            {variants.map((variant) => (
                <button
                    key={variant.id}
                    onClick={() => onVariantToggle(variant.id)}
                    className={`
            flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all
            ${variant.color}
            ${selectedVariants.includes(variant.id) ? `bg-base-200 text-white` : `bg-transparent hover:bg-base-200/50`}
          `}
                >
                    <div
                        className={`w-4 h-4 rounded-full ${selectedVariants.includes(variant.id) ? variant.color.replace("border", "bg") : ""}`}
                    />
                    <span>{variant.label}</span>
                </button>
            ))}
        </div>
    )
}

