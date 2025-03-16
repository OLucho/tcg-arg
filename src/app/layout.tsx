import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { Header } from "./components/header";
import { ReactQueryProvider } from "./components/react-query-provider";
import { getPokemonSetsGroupedBySeries } from "~/lib/pokemon-api";

export const metadata: Metadata = {
  title: "TCG Argentina",
  description: "TCG Argentina",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const seriesGroups = await getPokemonSetsGroupedBySeries()

  return (
    <html lang="en" className={`${GeistSans.variable}`} data-theme="abyss">
      <body>
        <ReactQueryProvider>
          <Header seriesGroups={seriesGroups} />
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  )
}