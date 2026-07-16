import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { useStore } from "../../store/StoreContext";
import { useRouter } from "../../lib/router";
import { formatNaira } from "../../lib/utils";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { cart, updateQuantity, removeFromCart, cartTotal, cartCount } = useStore();
  const { navigate } = useRouter();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70]" style={{ overscrollBehavior: "contain" }}>
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="absolute right-0 top-0 flex h-[65vh] max-h-[65vh] w-full max-w-md flex-col bg-ink-950 border-l border-ink-800 shadow-2xl"
        style={{ overscrollBehavior: "contain" }}
      >
        <div className="flex items-center justify-between border-b border-ink-800 px-4 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag size={16} className="text-gold-400" />
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-ink-400">Your Bag</p>
              <p className="text-sm font-semibold text-ink-50">{cartCount} item{cartCount === 1 ? "" : "s"}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-ink-400 transition hover:text-ink-100"
            aria-label="Close cart"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4 pt-3">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <ShoppingBag size={32} className="text-ink-700" />
              <p className="text-sm text-ink-400">Your shopping bag is empty.</p>
              <button
                onClick={() => {
                  onClose();
                  navigate("/shop");
                }}
                className="btn-outline mt-2 px-3 py-2 text-[11px] uppercase tracking-[0.2em]"
              >
                Shop All
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => {
                const vKey = `${item.variant.color || ""}-${item.variant.size || ""}`;
                return (
                  <div key={item.product.id + vKey} className="rounded-xl border border-ink-800 bg-ink-900 p-3">
                    <div className="flex gap-3">
                      <div className="h-16 w-16 overflow-hidden rounded-lg bg-ink-800">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-ink-50 leading-tight">{item.product.name}</p>
                        {(item.variant.color || item.variant.size) && (
                          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-ink-500">
                            {[item.variant.color, item.variant.size].filter(Boolean).join(" / ")}
                          </p>
                        )}
                        <p className="mt-2 text-sm font-semibold text-gold-400">{formatNaira(item.product.price)}</p>
                        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center rounded-full border border-ink-800 bg-ink-950 px-1">
                            <button
                              onClick={() => updateQuantity(item.product.id, vKey, item.quantity - 1)}
                              className="h-8 w-8 text-ink-300 transition hover:text-gold-400"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="mx-2 min-w-[24px] text-center text-[11px] text-ink-50">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, vKey, item.quantity + 1)}
                              className="h-8 w-8 text-ink-300 transition hover:text-gold-400"
                              aria-label="Increase quantity"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.product.id, vKey)}
                            className="text-[10px] uppercase tracking-[0.2em] text-ink-400 transition hover:text-red-400"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-ink-800 bg-ink-950 px-4 py-4">
            <div className="flex items-center justify-between text-sm text-ink-400">
              <span>Subtotal</span>
              <span className="font-semibold text-ink-50">{formatNaira(cartTotal)}</span>
            </div>
            <button
              onClick={() => {
                onClose();
                navigate("/checkout");
              }}
              className="btn-primary mt-3 w-full rounded-full py-3 text-[11px] uppercase tracking-[0.2em]"
            >
              Checkout
            </button>
            <button
              onClick={() => {
                onClose();
                navigate("/shop");
              }}
              className="btn-ghost mt-2 w-full rounded-full border border-ink-800 py-3 text-[11px] uppercase tracking-[0.2em] text-ink-300 hover:text-ink-100"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
