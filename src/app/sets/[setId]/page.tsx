import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { type PokemonCard, type PokemonSet } from "~/types"
import { ONE_YEAR_ON_SECONDS } from "~/common"

async function getCards(setId: string) {
    const res = await fetch(`https://api.pokemontcg.io/v2/cards?q=set.id:${setId}`, {
        next: { revalidate: ONE_YEAR_ON_SECONDS }
    })
    const data = await res.json() as { data: PokemonCard[] }
    return data.data
}

async function getSet(setId: string) {
    const res = await fetch(`https://api.pokemontcg.io/v2/sets/${setId}`, {
        next: { revalidate: ONE_YEAR_ON_SECONDS }
    })
    const data = await res.json() as { data: PokemonSet }
    return data.data
}

export default async function SetPage({ params }: { params: { setId: string } }) {
    const [cards, set] = await Promise.all([getCards(params.setId), getSet(params.setId)])

    return (
        <main className="min-h-screen bg-base-200">
            <div className="container mx-auto px-4 py-8">
                <Link href="/" className="btn btn-ghost mb-6 gap-2">
                    <ArrowLeft className="w-4 h-4" /> Volver
                </Link>

                <header className="mb-8 flex flex-col md:flex-row items-center gap-6">
                    <img src={set.images.logo || "/placeholder.svg"} alt={`${set.name} logo`} className="h-24 object-contain" />
                    <div className="text-center md:text-left">
                        <h1 className="text-3xl font-bold text-primary">{set.name}</h1>
                        <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-2">
                            <span className="badge badge-primary">{set.releaseDate}</span>
                            <span className="badge badge-secondary">{set.total} cards</span>
                            <span className="badge badge-accent">{set.series} Series</span>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {cards.map((card: PokemonCard) => (
                        <div
                            key={card.id}
                            className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                        >
                            <figure className="px-3 pt-3">
                                <img src={card.images.small || "/placeholder.svg"} alt={card.name} className="rounded-lg w-full" />
                            </figure>
                            <div className="card-body p-4">
                                <h3 className="text-sm font-medium line-clamp-1">{card.name}</h3>
                                <div className="flex justify-between items-center text-xs mt-1">
                                    <span className="badge badge-sm">{card.rarity}</span>
                                    <span>#{card.number}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    )
}

