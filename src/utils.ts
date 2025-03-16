export const ONE_YEAR_ON_SECONDS = 31536000;

import type { PokemonCard, CardVariants } from "~/types"


export function getAvailableVariants(card: PokemonCard): (keyof CardVariants)[] {
    if (!card.tcgplayer?.prices) {
        return ["normal"] // Por defecto, asumimos que al menos la variante normal está disponible
    }

    const variants: (keyof CardVariants)[] = []

    if (card.tcgplayer.prices.normal) variants.push("normal")
    if (card.tcgplayer.prices.holofoil) variants.push("holofoil")
    if (card.tcgplayer.prices.reverseHolofoil) variants.push("reverseHolofoil")

    return variants.length > 0 ? variants : ["normal"]
}

export function isVariantAvailable(card: PokemonCard, variant: keyof CardVariants): boolean {
    if (!card.tcgplayer?.prices) {
        return variant === "normal" // Si no hay datos de precios, solo permitimos la variante normal
    }

    return !!card.tcgplayer.prices[variant]
}

export const energyIcons: Record<string, { src: string; alt: string }> = {
    Colorless: {
        src: "/images/Colorless.png",
        alt: "Colorless Energy",
    },
    Darkness: {
        src: "/images/Dark.png",
        alt: "Dark Energy",
    },
    Dragon: {
        src: "/images/Dragon.png",
        alt: "Dragon Energy",
    },
    Fairy: {
        src: "/images/Fairy.png",
        alt: "Fairy Energy",
    },
    Fighting: {
        src: "/images/Fighting.png",
        alt: "Fighting Energy",
    },
    Fire: {
        src: "/images/Fire.png",
        alt: "Fire Energy",
    },
    Grass: {
        src: "/images/Grass.png",
        alt: "Grass Energy",
    },
    Lightning: {
        src: "/images/Lightning.png",
        alt: "Lightning Energy",
    },
    Metal: {
        src: "/images/Steel.png",
        alt: "Metal Energy",
    },
    Psychic: {
        src: "/images/Psychic.png",
        alt: "Psychic Energy",
    },
    Water: {
        src: "/images/Water.png",
        alt: "Water Energy",
    },
}

export const ABILITY_BADGES = {
    Ability:
        "/images/Ability.png",
    "Poké-Body": "/images/pokeBodyBadge.png",
    "Poké-Power": "/images/pokePowerBadge.png",
} as const