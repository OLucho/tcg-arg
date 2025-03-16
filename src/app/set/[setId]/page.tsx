import SetDetailClient from "./set-detail-client"
import { getSetCards, getSetDetails } from "~/lib/pokemon-api"

export default async function SetPage({ params }: { params: { setId: string } }) {
    const { setId } = params
    const [setDetails, cards] = await Promise.all([getSetDetails(setId), getSetCards(setId)])

    return <SetDetailClient setDetails={setDetails} cards={cards} />
}
