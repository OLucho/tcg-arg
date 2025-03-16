import { redirect } from "next/navigation"
import ListDetailClient from "./list-detail-client"
import { getListById } from "../listsServerActions"
import { getCardsByIds, getPokemonSetsGroupedBySeries } from "~/lib/pokemon-api"



export default async function ListDetailPage({ params }: { params: { listId: string } }) {
    const list = await getListById(params.listId)
    if (!list) {
        redirect("/lists")
    }

    const cards = await getCardsByIds(list.cards.map((card) => card.cardId))
    const seriesGrouped = await getPokemonSetsGroupedBySeries()

    return <ListDetailClient list={list} cards={cards} seriesGroups={seriesGrouped} />
}

