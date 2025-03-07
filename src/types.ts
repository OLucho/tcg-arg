export interface PokemonSet {
    id: string
    name: string
    series: string
    printedTotal: number
    total: number
    releaseDate: string
    images: {
        symbol: string
        logo: string
    }
    legalities?: {
        standard?: string
        expanded?: string
        unlimited?: string
    }
    ptcgoCode?: string
}

export interface CardVariants {
    normal: boolean
    holofoil: boolean
    reverseHolofoil: boolean
}

export interface CardPrice {
    low: number
    mid: number
    high: number
    market: number
    directLow?: number
}

export interface Attack {
    name: string
    cost: string[]
    convertedEnergyCost: number
    damage: string
    text: string
}

export interface Weakness {
    type: string
    value: string
}

export interface PokemonCard {
    id: string
    name: string
    number: string
    images: {
        small: string
        large: string
    }
    rarity: string
    flavorText?: string
    types?: string[]
    hp?: string
    attacks?: Attack[]
    weaknesses?: Weakness[]
    retreatCost?: string[]
    artist?: string
    supertype: string
    subtypes?: string[]
    set: {
        id: string
        name: string
        series: string
    }
    tcgplayer?: {
        url: string
        updatedAt: string
        prices: {
            normal?: CardPrice
            holofoil?: CardPrice
            reverseHolofoil?: CardPrice
            [key: string]: CardPrice | undefined
        }
    }
}

