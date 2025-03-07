import type { PokemonCard, PokemonSet } from "~/types"
import { ONE_YEAR_ON_SECONDS } from "~/common"
import SetDetailClient from "./set-detail-client"

async function getSetCards(setId: string) {
    const res = await fetch(`https://api.pokemontcg.io/v2/cards?q=set.id:${setId}&orderBy=number`, {
        next: { revalidate: ONE_YEAR_ON_SECONDS }
    })
    const data = await res.json() as { data: PokemonCard[] }
    return data.data
}

async function getSetDetails(setId: string) {
    const res = await fetch(`https://api.pokemontcg.io/v2/sets/${setId}`, {
        next: { revalidate: ONE_YEAR_ON_SECONDS }
    })
    const data = await res.json() as { data: PokemonSet }
    return data.data
}


export default async function SetPage({ params }: { params: { setId: string } }) {
    const { setId } = params
    const [setDetails, cards] = await Promise.all([getSetDetails(setId), getSetCards(setId)])

    return <SetDetailClient setDetails={setDetails} cards={cards} />
}
