import Link from "next/link"
import { ArrowRight, Star } from "lucide-react"
import { type PokemonSet } from "../types"

async function getPokemonSets() {
  const res = await fetch("https://api.pokemontcg.io/v2/sets", {
    next: { revalidate: 86400 },
  })
  const data = (await res.json()) as { data: PokemonSet[] }
  return data.data
}

export default async function Home() {
  const sets = await getPokemonSets()
  const lastSet = sets[sets.length - 1]
  return (
    <main className="min-h-screen bg-base-200">
      {/* Hero Section */}
      <div className="hero bg-base-100 py-12 shadow-lg">
        <div className="hero-content text-center">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold text-base-content mb-4">Pokémon TCG Argentina</h1>
            <p className="text-xl mb-8 text-base-content">
              Descubre y explora todos los sets de cartas del juego de cartas coleccionables Pokémon.
            </p>
          </div>
        </div>
      </div>

      {/* Featured Set */}
      {sets.length > 0 && (
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row gap-8 items-center bg-base-100 rounded-box p-6 shadow-xl">
            <div className="md:w-1/3">
              <img
                src={lastSet?.images.logo || "/placeholder.svg"}
                alt={`${lastSet?.name} logo`}
                className="max-h-48 mx-auto md:mx-0"
              />
            </div>
            <div className="md:w-2/3">
              <div className="badge badge-accent mb-2">Set Destacado</div>
              <h2 className="text-3xl font-bold text-base-content mb-3">{lastSet?.name}</h2>
              <p className="mb-4 text-base-content">
                Explora el último set de la serie {lastSet?.series}. Este set contiene {lastSet?.total} cartas únicas con
                nuevos Pokémon y mecánicas de juego. Lanzado el {lastSet?.releaseDate}.
              </p>
              <Link href={`/sets/${lastSet?.id}`} className="btn btn-secondary gap-2">
                Ver Cartas <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Sets Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-base-content">Todos los Sets</h2>
        </div>

        <div className="divider"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sets.map((set: PokemonSet) => (
            <Link
              href={`/sets/${set.id}`}
              key={set.id}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group"
            >
              <div className="absolute top-2 right-2 z-10">
                <div className="badge badge-secondary">{set.releaseDate}</div>
              </div>
              <figure className="px-6 pt-6 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-base-100/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                  <div className="badge badge-outline">{set.series} Series</div>
                </div>
                <img
                  src={set.images.logo || "/placeholder.svg"}
                  alt={`${set.name} logo`}
                  className="h-32 object-contain group-hover:scale-110 transition-transform duration-300"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title text-base-content">
                  {set.name}
                  {set.legalities.standard && <div className="badge badge-accent badge-sm">Standard</div>}
                </h2>
                <div className="flex items-center gap-2 text-sm text-base-content">
                  <Star className="w-4 h-4 text-warning" />
                  <span>{set.total} cartas</span>
                </div>
                <p className="text-sm text-base-content/80 mt-2">
                  Parte de la serie {set.series}, este set incluye cartas de Pokémon icónicos y nuevas mecánicas.
                </p>
                <div className="card-actions justify-end mt-4">
                  <button className="btn btn-secondary btn-sm">
                    Ver Cartas <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>[]
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="footer p-10 bg-base-100 text-base-content mt-12 flex justify-between gap-8">
        <aside>
          <svg
            width="50"
            height="50"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            fillRule="evenodd"
            clipRule="evenodd"
            className="fill-current"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7v-2z"></path>
          </svg>
          <p className="font-bold text-base-content">
            Pokémon TCG Explorer
            <br />
            Tu guía para coleccionar
          </p>
          <p className="text-base-content">© 2023 - Todos los derechos reservados</p>
        </aside>
        <nav>
          <header className="footer-title text-base-content opacity-90">Categorías</header>
          <a className="link link-hover text-base-content">Sets Recientes</a>
          <a className="link link-hover text-base-content">Sets Clásicos</a>
          <a className="link link-hover text-base-content">Cartas Raras</a>
          <a className="link link-hover text-base-content">Promociones</a>
        </nav>
        <nav>
          <header className="footer-title text-base-content opacity-90">Información</header>
          <a className="link link-hover text-base-content">Sobre Nosotros</a>
          <a className="link link-hover text-base-content">Contacto</a>
          <a className="link link-hover text-base-content">Política de Privacidad</a>
          <a className="link link-hover text-base-content">Términos de Uso</a>
        </nav>
        <nav>
          <header className="footer-title text-base-content opacity-90">Social</header>
          <div className="grid grid-flow-col gap-4">
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
              </svg>
            </a>
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
              </svg>
            </a>
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
              </svg>
            </a>
          </div>
        </nav>
      </footer>
    </main>
  )
}

