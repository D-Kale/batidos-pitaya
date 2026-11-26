import { useEffect, useMemo, useState } from "react";
import type { MenuCategory, MenuItem } from "../data";
import { formatPrice, site } from "../data";

interface Props {
  categories: MenuCategory[];
}

const productImages: Record<string, string> = {
  // Waffles
  "waffle-clasico": "/images/products/waffle-clasico.jpg",
  "waffle-especial": "/images/products/waffle-especial.jpg",
  "waffle-proteina": "/images/products/waffle-proteina.jpg",
  // Bowls
  "bowl-pitaya": "/images/products/pitaya-bowl.jpg",
  "bowl-acai": "/images/products/acai-bowl.jpg",
  "bowl-verde": "/images/products/green-clean.jpg",
  // Limonadas
  "limonada-natural": "/images/products/lemonade.jpg",
  "limonada-fresa": "/images/products/limonada-fresa.jpg",
  "limonada-hierbabuena": "/images/products/green-clean.jpg",
  // Super Verdes
  "detox": "/images/site/5.webp",
  "detox-especial": "/images/site/4.webp",
  "catarina": "/images/products/green-clean.jpg",
  "energygreen": "/images/products/green-detox.jpg",
  "fit": "/images/products/green-clean.jpg",
  // Clásicos
  "caribeno": "/images/site/1.webp",
  "chavalo": "/images/site/2.webp",
  "curioso": "/images/site/3.webp",
  "tropical": "/images/site/6.webp",
  "poneloya": "/images/site/7.webp",
  "chele": "/images/products/banana-smoothie.jpg",
  "dinamita": "/images/products/banana-smoothie.jpg",
  "penitas": "/images/products/mango-tropical.jpg",
  "leon": "/images/products/strawberry-smoothie.jpg",
  "nicoya": "/images/site/1.webp",
  "pina-colada": "/images/products/banana-smoothie.jpg",
  "guardabarranco": "/images/products/mango-tropical.jpg",
  // Premium
  "masaya": "/images/products/mango-tropical.jpg",
  "gigantona": "/images/products/pitaya-bowl.jpg",
  "tisey": "/images/products/berry-smoothie.jpg",
  "diacachimba": "/images/products/strawberry-smoothie.jpg",
  "mombacho": "/images/products/mango-tropical.jpg",
  "matagalpa": "/images/products/strawberry-smoothie.jpg",
  "tuani": "/images/products/strawberry-smoothie.jpg",
  "managua": "/images/products/strawberry-smoothie.jpg",
  "tripleberry": "/images/products/berry-smoothie.jpg",
  "guasacate": "/images/products/banana-smoothie.jpg",
  "fresa-pasion": "/images/products/strawberry-smoothie.jpg",
  "matizon": "/images/products/berry-smoothie.jpg",
  "fresona": "/images/products/strawberry-smoothie.jpg",
  // Proteína
  "pompeado": "/images/products/protein-shake.jpg",
  "proteico": "/images/products/protein-shake.jpg",
};

const categoryFallbacks: Record<string, string> = {
  waffles: "/images/products/waffle-clasico.jpg",
  bowls: "/images/products/pitaya-bowl.jpg",
  limonadas: "/images/products/lemonade.jpg",
  verdes: "/images/products/green-detox.jpg",
  premium: "/images/products/berry-smoothie.jpg",
  clasicos: "/images/site/1.webp",
  proteina: "/images/products/protein-shake.jpg",
};

function ItemRow({ item, cat }: { item: MenuItem; cat: MenuCategory }) {
  const [added, setAdded] = useState(false);
  const img = item.image || "/images/products/berry-smoothie.jpg";
  const itemPrice = item.prices
    ? item.prices.normal
    : cat.prices
      ? cat.prices.normal
      : item.priceVariants
        ? item.priceVariants[0].price
        : item.price || 130;

  const handleOrder = () => {
    const event = new CustomEvent("add-to-cart", {
      detail: {
        id: item.id,
        name: item.name,
        price: itemPrice,
        category: cat.name,
        image: img,
      },
    });
    window.dispatchEvent(event);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] border border-leaf/10 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-pitaya/40">
      <div>
        <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-leaf-soft">
          <img
            src={img}
            alt={item.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
          
          {item.star && (
            <span className="absolute top-3 left-3 rounded-full bg-sun px-3 py-1 text-xs font-black text-leaf-deep shadow-md flex items-center gap-1">
              ★ Favorito
            </span>
          )}

          <span className="absolute bottom-3 right-3 rounded-full bg-white/95 backdrop-blur-md px-3 py-1 font-bold text-pitaya text-sm shadow-sm">
            {item.prices || cat.prices
              ? `${formatPrice((item.prices ?? cat.prices)!.normal)}`
              : item.priceVariants
                ? formatPrice(item.priceVariants[0].price)
                : item.price != null
                  ? formatPrice(item.price)
                  : ""}
          </span>
        </div>

        <div className="mt-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-xl font-bold text-leaf group-hover:text-pitaya transition-colors">
              {item.name}
            </h3>
            {cat.prices && (
              <span className="text-xs text-ink/40 font-medium">
                20 oz / 16 oz
              </span>
            )}
          </div>

          {item.ingredients && (
            <p className="mt-2 text-sm text-ink/70 leading-relaxed min-h-[40px]">
              {item.ingredients}
            </p>
          )}

          {item.base && (
            <p className="mt-2 text-xs text-ink/60 bg-leaf-soft/50 p-2 rounded-xl">
              <strong className="text-leaf">Base:</strong> {item.base}
            </p>
          )}
          {item.toppings && (
            <p className="mt-1 text-xs text-ink/60 bg-leaf-soft/50 p-2 rounded-xl">
              <strong className="text-leaf">Toppings:</strong> {item.toppings}
            </p>
          )}
          {item.options && (
            <p className="mt-1 text-xs text-ink/50 italic">
              {item.options}
            </p>
          )}
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-leaf/5 flex items-center justify-between gap-3">
        <span className="text-[11px] font-bold text-leaf/60 uppercase tracking-wider bg-leaf-soft px-2.5 py-1 rounded-lg truncate">
          {cat.name}
        </span>
        <button
          onClick={handleOrder}
          className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-xs font-bold transition-all shadow-md duration-200 ${
            added
              ? "bg-emerald-600 text-white scale-105"
              : "bg-pitaya text-white hover:bg-pitaya-deep hover:scale-105 active:scale-95"
          }`}
        >
          <span>{added ? "✓ Añadido a tu orden" : "Pedir ahora"}</span>
          <span className="text-[11px] font-normal">→</span>
        </button>
      </div>
    </article>
  );
}

export default function MenuBrowser({ categories }: Props) {
  const [active, setActive] = useState<string>("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("cat");
    if (cat && (cat === "all" || categories.some((c) => c.id === cat))) setActive(cat);
    const item = params.get("item");
    if (item) setQuery(item.replace(/-/g, " "));
  }, [categories]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return categories
      .map((cat) =>
        q
          ? { ...cat, items: cat.items.filter((i) => `${i.name} ${i.ingredients ?? ""} ${i.base ?? ""}`.toLowerCase().includes(q)) }
          : cat
      )
      .filter((cat) => active === "all" || cat.id === active || q)
      .filter((cat) => cat.items.length > 0);
  }, [categories, active, query]);

  const totalItems = categories.reduce((n, c) => n + c.items.length, 0);

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      {/* search */}
      <div className="mb-6 relative">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Buscar batido o ingrediente entre ${totalItems} productos…`}
          className="w-full rounded-full border border-leaf/15 bg-white px-6 py-4 text-base shadow-sm outline-none transition focus:border-pitaya focus:ring-2 focus:ring-pitaya/20 pr-12"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink text-sm font-bold bg-cream px-2.5 py-1 rounded-full"
          >
            ✕
          </button>
        )}
      </div>

      {/* category tabs */}
      {!query && (
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            onClick={() => setActive("all")}
            className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-bold transition-all ${
              active === "all"
                ? "bg-pitaya text-white shadow-md scale-105"
                : "bg-white text-leaf ring-1 ring-leaf/15 hover:ring-pitaya/40"
            }`}
          >
            ★ Ver todos
            <span className={`ml-2 text-xs ${active === "all" ? "text-white/80" : "text-ink/40"}`}>{totalItems}</span>
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-bold transition-all ${
                active === c.id
                  ? "bg-pitaya text-white shadow-md scale-105"
                  : "bg-white text-leaf ring-1 ring-leaf/15 hover:ring-pitaya/40"
              }`}
            >
              {c.name}
              <span className={`ml-2 text-xs ${active === c.id ? "text-white/80" : "text-ink/40"}`}>{c.items.length}</span>
            </button>
          ))}
        </div>
      )}

      {/* sections */}
      <div className="space-y-10">
        {filtered.map((cat) => (
          <section key={cat.id} id={cat.id}>
            <div className="mb-4 flex items-baseline gap-4">
              <h2 className="font-display text-2xl font-black text-leaf">{cat.name}</h2>
              <span className="leader"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-pitaya">
                {cat.items.length} opciones
              </span>
            </div>
            {cat.note && <p className="mb-4 text-sm text-ink/55">{cat.note}</p>}
            {cat.sizeNote && <p className="mb-4 text-sm font-semibold text-leaf/80">{cat.sizeNote}</p>}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {cat.items.map((item) => (
                <ItemRow key={item.id} item={item} cat={cat} />
              ))}
            </div>
          </section>
        ))}
        {filtered.length === 0 && (
          <p className="py-16 text-center text-ink/50">No encontramos productos con esa búsqueda.</p>
        )}
      </div>
    </div>
  );
}
