import { useState, useEffect } from "react";
import { formatPrice, site } from "../data";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  image?: string;
}

export function CartDrawer() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState<CartItem | null>(null);
  const [sucursal, setSucursal] = useState("Multicentro Las Américas");

  // Load from session or event listener
  useEffect(() => {
    const handleAdd = (e: CustomEvent<CartItem>) => {
      setItems((prev) => {
        const exist = prev.find((i) => i.id === e.detail.id);
        if (exist) {
          return prev.map((i) =>
            i.id === e.detail.id ? { ...i, quantity: i.quantity + 1 } : i
          );
        }
        return [...prev, { ...e.detail, quantity: 1 }];
      });
      // Show elegant non-blocking notification toast instead of opening sidebar
      setLastAdded(e.detail);
      setTimeout(() => setLastAdded(null), 3000);
    };

    window.addEventListener("add-to-cart" as any, handleAdd);
    return () => window.removeEventListener("add-to-cart" as any, handleAdd);
  }, []);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  const generateWhatsAppMessage = () => {
    const itemsList = items
      .map((i) => `• ${i.quantity}x ${i.name} (${formatPrice(i.price * i.quantity)})`)
      .join("\n");
    const msg = `¡Hola Batidos Pitaya! 🥤 Deseo realizar el siguiente pedido:\n\n${itemsList}\n\n*Total a pagar: ${formatPrice(total)}*\n*Sucursal preferida:* ${sucursal}\n\n¿Me confirman disponibilidad y tiempo estimado por favor?`;
    return `https://wa.me/50576859041/?text=${encodeURIComponent(msg)}`;
  };

  return (
    <>
      {/* Toast Notification (Discreet & Non-blocking) */}
      {lastAdded && !isOpen && (
        <div className="fixed bottom-24 right-6 z-50 flex items-center gap-3 rounded-2xl bg-leaf-deep px-5 py-3 text-white shadow-2xl ring-1 ring-white/20 backdrop-blur-md animate-[fade-slide-in_0.25s_ease-out]">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">
            ✓
          </span>
          <div className="text-xs">
            <p className="font-bold">{lastAdded.name} agregado</p>
            <p className="text-cream/70">{formatPrice(lastAdded.price)}</p>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="ml-2 rounded-full bg-pitaya px-3 py-1 text-xs font-bold text-white hover:bg-pitaya-deep transition"
          >
            Ver orden
          </button>
        </div>
      )}

      {/* Floating Cart Trigger Pill */}
      {totalCount > 0 && !isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full bg-pitaya px-6 py-4 font-bold text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-pitaya-deep hover:shadow-pitaya/40"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-black text-pitaya">
            {totalCount}
          </span>
          <span>Ver mi orden</span>
          <span className="text-sun">✦</span>
          <span>{formatPrice(total)}</span>
        </button>
      )}

      {/* Cart Drawer Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-sm transition-opacity">
          <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
              {/* Header */}
              <div className="border-b border-leaf/10 p-6 flex items-center justify-between bg-leaf text-white">
                <div>
                  <h2 className="font-display text-2xl font-bold flex items-center gap-2">
                    <span>Tu Pedido</span>
                    <span className="text-sun text-sm">({totalCount} items)</span>
                  </h2>
                  <p className="text-xs text-cream/75 mt-0.5">Listo para enviar directo por WhatsApp</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20 text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {items.length === 0 ? (
                  <div className="py-16 text-center text-ink/50">
                    <p className="text-4xl">🥤</p>
                    <p className="mt-3 font-bold text-leaf text-base">Tu carrito está vacío</p>
                    <p className="text-xs mt-1">Elegí tus batidos y waffles favoritos del menú.</p>
                  </div>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-4 p-3 rounded-2xl bg-leaf-soft/40 border border-leaf/10"
                    >
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-14 w-14 rounded-xl object-cover"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-leaf text-sm truncate">{item.name}</h4>
                        <p className="text-xs font-semibold text-pitaya">{formatPrice(item.price)} c/u</p>
                      </div>
                      <div className="flex items-center gap-2 bg-white rounded-full border border-leaf/15 px-2 py-1">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="text-xs font-bold text-leaf hover:text-pitaya px-1"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold text-ink min-w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="text-xs font-bold text-leaf hover:text-pitaya px-1"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))
                )}

                {items.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-leaf/10">
                    <label className="block text-xs font-bold uppercase tracking-wider text-leaf mb-2">
                      Retirar o enviar desde:
                    </label>
                    <select
                      value={sucursal}
                      onChange={(e) => setSucursal(e.target.value)}
                      className="w-full rounded-xl border border-leaf/20 bg-cream p-3 text-xs font-medium text-ink outline-none"
                    >
                      <option>Multicentro Las Américas</option>
                      <option>Plaza Calli (Km 10 Nueva a León)</option>
                      <option>Plaza Eiffel (Ticuantepe)</option>
                      <option>UNICA (Carretera a Masaya)</option>
                      <option>Las Brisas (Linda Vista)</option>
                      <option>Altamira</option>
                      <option>Las Colinas</option>
                      <option>Villa Fontana</option>
                      <option>Plaza Natura</option>
                      <option>Granada (La Calzada)</option>
                      <option>Masaya (Plaza 2000)</option>
                      <option>Estelí (Catedral)</option>
                      <option>Matagalpa (Darío)</option>
                      <option>León (La Merced)</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Checkout Footer */}
              {items.length > 0 && (
                <div className="border-t border-leaf/10 p-6 bg-leaf-soft">
                  <div className="flex justify-between items-baseline mb-4">
                    <span className="text-sm font-semibold text-ink/70">Subtotal estimado:</span>
                    <span className="font-display text-2xl font-black text-leaf">{formatPrice(total)}</span>
                  </div>
                  <a
                    href={generateWhatsAppMessage()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-pitaya py-4 font-bold text-white shadow-xl transition hover:bg-pitaya-deep hover:scale-[1.02]"
                  >
                    <span>Enviar orden por WhatsApp</span>
                    <span>→</span>
                  </a>
                  <p className="text-[11px] text-center text-ink/50 mt-2">
                    Te atenderá un barista oficial para confirmar tu pedido en segundos.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
