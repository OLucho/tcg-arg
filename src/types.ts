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

export interface PokemonCard {
    id: string
    name: string
    number: string
    images: {
        small: string
        large: string
    }
    rarity: string
    types?: string[]
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

