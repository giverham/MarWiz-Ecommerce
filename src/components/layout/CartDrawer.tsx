import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { useStore } from "../../store/StoreContext";
import { useRouter } from "../../lib/router";
import { formatNaira } from "../../lib/utils";

export function CartDrawer() {
  const { cart, cartOpen, setCartOpen, updateQuantity, removeFromCart, cartTotal, cartCount } =
    useStore();
  const { navigate } = useRouter();

  if (!cartOpen) return null;

  return (
    <div className="fixed inset-0 z-[70]">
      <div
        className="absolute inset-0 bg-ink-950/70 backdrop-blur-sm animate-fade-in"
        onClick={() => setCartOpen(false)}
      />
      <div className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-ink-900 animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-ink-700 px-6 py-5">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-gold-400" />
            <span className="text-sm font-medium uppercase tracking-[0.15em] text-ink-50">
              Shopping Bag ({cartCount})
            </span>
          </div>
          <button onClick={() => setCartOpen(false)} className="text-ink-400 hover:text-ink-50">
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6">
            <ShoppingBag size={48} className="mb-4 text-ink-700" />
            <p className="text-sm text-ink-400">Your shopping bag is empty.</p>
            <button
              onClick={() => {
                setCartOpen(false);
                navigate("/shop");
              }}
              className="btn-outline mt-6"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {cart.map((item) => {
                const vKey = `${item.variant.color || ""}-${item.variant.size || ""}`;
                return (
                  <div
                    key={item.product.id + vKey}
                    className="flex gap-4 border-b border-ink-800 py-5"
                  >
                    <div className="h-28 w-24 shrink-0 overflow-hidden bg-ink-800">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <h4 className="text-sm font-medium text-ink-50">{item.product.name}</h4>
                      {(item.variant.color || item.variant.size) && (
                        <p className="mt-0.5 text-xs text-ink-500">
                          {[item.variant.color, item.variant.size].filter(Boolean).join(" / ")}
                        </p>
                      )}
                      <p className="mt-1 text-sm text-gold-400">
                        {formatNaira(item.product.price)}
                      </p>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center border border-ink-700">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, vKey, item.quantity - 1)
                            }
                            className="flex h-8 w-8 items-center justify-center text-ink-400 hover:text-gold-400"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-sm text-ink-100">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, vKey, item.quantity + 1)
                            }
                            className="flex h-8 w-8 items-center justify-center text-ink-400 hover:text-gold-400"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id, vKey)}
                          className="text-xs text-ink-500 hover:text-red-400"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="border-t border-ink-700 px-6 py-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-ink-300">Subtotal</span>
                <span className="text-lg font-medium text-ink-50">{formatNaira(cartTotal)}</span>
              </div>
              <p className="mb-4 text-xs text-ink-500">
                Shipping and taxes calculated at checkout.
              </p>
              <button
                onClick={() => {
                  setCartOpen(false);
                  navigate("/checkout");
                }}
                className="btn-primary w-full"
              >
                Proceed to Checkout
              </button>
              <button
                onClick={() => {
                  setCartOpen(false);
                  navigate("/shop");
                }}
                className="btn-ghost mt-2 w-full"
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
