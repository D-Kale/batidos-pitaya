import { useState, useMemo } from "react";
import type { Branch } from "../data/site";

interface Props {
  branches: Branch[];
}

export default function BranchesDirectory({ branches }: Props) {
  const cities = useMemo(() => ["Todas", ...new Set(branches.map((b) => b.city))], [branches]);
  const [activeCity, setActiveCity] = useState("Todas");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return branches.filter((b) => {
      const matchCity = activeCity === "Todas" || b.city === activeCity;
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        b.name.toLowerCase().includes(q) ||
        b.address.toLowerCase().includes(q) ||
        b.city.toLowerCase().includes(q);
      return matchCity && matchSearch;
    });
  }, [branches, activeCity, search]);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      {/* FILTER & SEARCH BAR */}
      <div className="mb-10 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* City Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setActiveCity(city)}
              className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-200 ${
                activeCity === city
                  ? "bg-leaf text-white shadow-md scale-105"
                  : "bg-white text-leaf ring-1 ring-leaf/15 hover:ring-pitaya/40 hover:bg-leaf-soft/40"
              }`}
            >
              {city}
              <span className={`ml-2 text-xs ${activeCity === city ? "text-white/80" : "text-ink/40"}`}>
                {city === "Todas" ? branches.length : branches.filter((b) => b.city === city).length}
              </span>
            </button>
          ))}
        </div>

        {/* Live Search */}
        <div className="relative min-w-[260px]">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar sucursal o zona…"
            className="w-full rounded-full border border-leaf/15 bg-white px-5 py-2.5 text-sm shadow-sm outline-none transition focus:border-pitaya focus:ring-2 focus:ring-pitaya/20 pr-10"
          />
          {search ? (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink text-xs font-bold"
            >
              ✕
            </button>
          ) : (
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink/30 text-sm">
              🔍
            </span>
          )}
        </div>
      </div>

      {/* BRANCHES GRID */}
      {filtered.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((b) => {
            const hasRealPhoto =
              b.photo &&
              !b.photo.toLowerCase().includes("mapa") &&
              !b.photo.toLowerCase().includes("maps");
            const photoUrl = hasRealPhoto ? b.photo : "/images/site/store-kiosk.jpg";

            return (
              <article
                key={b.id}
                className="group flex flex-col justify-between overflow-hidden rounded-[2rem] border border-leaf/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-pitaya/30"
              >
                <div>
                  <div className="relative h-44 w-full overflow-hidden bg-leaf-soft">
                    <img
                      src={photoUrl}
                      alt={b.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <span className="absolute top-3 left-3 rounded-full bg-leaf/90 backdrop-blur-md px-3 py-1 text-xs font-bold text-white shadow-sm">
                      {b.city}
                    </span>
                    <span className="absolute bottom-3 left-4 text-white font-display text-xl font-black drop-shadow">
                      {b.name}
                    </span>
                  </div>

                  <div className="p-5">
                    <p className="text-sm text-ink/75 leading-relaxed min-h-[44px]">
                      {b.address}
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-leaf bg-leaf-soft/60 px-3 py-1.5 rounded-xl w-fit">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>{b.hours}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-leaf/5 flex items-center gap-2 mt-2">
                  <a
                    href={b.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center rounded-full bg-leaf px-4 py-2.5 text-xs font-bold text-white transition-all hover:bg-leaf-deep hover:scale-[1.02] shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <span>Google Maps</span>
                    <span className="text-[10px]">↗</span>
                  </a>
                  {b.pedidosUrl ? (
                    <a
                      href={b.pedidosUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center rounded-full bg-sun/90 px-4 py-2.5 text-xs font-bold text-leaf-deep transition-all hover:bg-sun hover:scale-[1.02] shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <span>PedidosYa</span>
                      <span className="text-[10px]">↗</span>
                    </a>
                  ) : (
                    <span className="flex-1 text-center rounded-full bg-leaf-soft px-4 py-2.5 text-xs font-semibold text-ink/40">
                      Take-away
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="text-lg font-bold text-leaf">No encontramos sucursales para esa búsqueda</p>
          <p className="mt-2 text-sm text-ink/60">Probá buscando por nombre de plaza, centro comercial o ciudad.</p>
        </div>
      )}
    </div>
  );
}
