import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { ONE_YEAR_ON_SECONDS } from "~/common";
import { type PokemonSet } from "~/types";
import { Header } from "./components/header";

export const metadata: Metadata = {
  title: "TCG Argentina",
  description: "TCG Argentina",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const seriesGroups = await getPokemonSetsGroupedBySeries()

  return (
    <html lang="en" className={`${GeistSans.variable}`} data-theme="abyss">
      <body>
        <Header seriesGroups={seriesGroups} />
        {children}</body>
    </html>
  )
}