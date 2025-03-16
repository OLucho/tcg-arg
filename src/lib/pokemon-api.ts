

import { type PokemonSet, type PokemonCard } from "~/types";

const API_KEY = process.env.TCG_API_KEY ?? "";
const API_URL = "https://api.pokemontcg.io/v2";
const ONE_YEAR_ON_SECONDS = 60 * 60 * 24 * 365;

export async function getSetCards(setId: string) {
    const res = await fetch(`${API_URL}/cards?q=set.id:${setId}&orderBy=number`, {
        headers: { "X-Api-Key": API_KEY },
        next: { revalidate: ONE_YEAR_ON_SECONDS }
    });

    if (!res.ok) {
        throw new Error("Error al obtener las cartas del set");
    }

    const data = await res.json() as { data: PokemonCard[] };
    return data.data;
}

export async function getSetDetails(setId: string) {
    const res = await fetch(`${API_URL}/sets/${setId}`, {
        headers: { "X-Api-Key": API_KEY },
        next: { revalidate: ONE_YEAR_ON_SECONDS }
    });

    if (!res.ok) {
        throw new Error("Error al obtener los detalles del set");
    }

    const data = await res.json() as { data: PokemonSet };
    return data.data;
}

export async function getPokemonSetsGroupedBySeries() {
    const res = await fetch("https://api.pokemontcg.io/v2/sets", {
        headers: { "X-Api-Key": API_KEY },
        next: { revalidate: ONE_YEAR_ON_SECONDS },
    })
    const data = (await res.json()) as { data: PokemonSet[] }

    const sortedSets = data.data.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())

    return sortedSets.reduce((groups: Record<string, PokemonSet[]>, set) => {
        const series = set.series || "Otros"
        if (!groups[series]) {
            groups[series] = []
        }
        groups[series].push(set)
        return groups
    }, {})
}
export interface SearchCardsParams {
    name?: string
    setId?: string
    page: number
    pageSize: number
}

export interface SearchCardsResponse {
    cards: PokemonCard[]
    totalCount: number
    page: number
    pageSize: number
    totalPages: number
}

export async function getCardsById({
    name,
    setId,
    page = 1,
    pageSize = 20,
}: SearchCardsParams): Promise<SearchCardsResponse> {
    try {
        // Build the query string
        let query = ""

        if (name) {
            // Add name search (case insensitive)
            query += `name:"*${name}*"`
        }

        if (setId) {
            // Add set filter
            if (query) query += " "
            query += `set.id:${setId}`
        }

        // Calculate pagination parameters
        const offset = (page - 1) * pageSize

        // Build the URL with query parameters
        const url = new URL(`${API_URL}/cards`)
        if (query) url.searchParams.append("q", query)
        url.searchParams.append("page", page.toString())
        url.searchParams.append("pageSize", pageSize.toString())
        url.searchParams.append("orderBy", "number")

        const res = await fetch(url.toString())

        if (!res.ok) {
            throw new Error("Error searching cards")
        }

        const data = (await res.json()) as {
            data: PokemonCard[]
            totalCount: number
            page: number
            pageSize: number
            count: number
        }

        return {
            cards: data.data,
            totalCount: data.totalCount,
            page: data.page,
            pageSize: data.pageSize,
            totalPages: Math.ceil(data.totalCount / data.pageSize),
        }
    } catch (error) {
        console.error("Error searching cards:", error)
        return {
            cards: [],
            totalCount: 0,
            page: page,
            pageSize: pageSize,
            totalPages: 0,
        }
    }
}

export const getCardsByIds = async (ids: string[]): Promise<PokemonCard[]> => {
    if (ids.length === 0) return []

    try {
        const query = ids.map((id) => `id:${id}`).join(" OR ")
        const url = `https://api.pokemontcg.io/v2/cards?q=${encodeURIComponent(query)}`
        const response = await fetch(url)

        if (!response.ok) {
            throw new Error(`Error fetching cards: ${response.status} ${response.statusText}`)
        }

        const data = await response.json() as { data: PokemonCard[] }
        return data.data
    } catch (error) {
        console.error("Error fetching cards:", error)
        throw error
    }
}

