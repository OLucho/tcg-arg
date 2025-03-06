import { type PokemonSet } from "../types"
import { ONE_YEAR_ON_SECONDS } from "~/common"
import { Sidebar } from "./sidebar"
import { Menu } from "lucide-react"

async function getPokemonSetsGroupedBySeries() {
  const res = await fetch("https://api.pokemontcg.io/v2/sets", {
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

export default async function Home() {
  const seriesGroups = await getPokemonSetsGroupedBySeries()

  return (
    <div className="drawer">
      <input id="drawer-toggle" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <header className="navbar bg-base-200 shadow">
          <div className="flex-none">
            <label htmlFor="drawer-toggle" className="btn btn-square btn-ghost">
              <Menu />
            </label>
          </div>
        </header>

        <main className="p-4">
          <h1 className="text-2xl font-bold">Bienvenido a PokéTCG</h1>
        </main>
      </div>

      <div className="drawer-side">
        <label htmlFor="drawer-toggle" className="drawer-overlay"></label>

        <Sidebar seriesGroups={seriesGroups} />
      </div>
    </div>
  )
}
