import { useEffect, useState } from "react";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { useStore, useCartUI } from "../../store/StoreContext";
import { useRouter } from "../../lib/router";
import { formatNaira } from "../../lib/utils";

export function CartDrawer() {
  const { cart, updateQuantity, removeFromCart, cartTotal, cartCount } = useStore();
  const { cartOpen, setCartOpen } = useCartUI();
  const { navigate } = useRouter();

  // Local state to track mounting and transition state
  const [shouldRender, setShouldRender] = useState(cartOpen);
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);

  useEffect(() => {
    let animTimer: ReturnType<typeof setTimeout>;
    let unmountTimer: ReturnType<typeof setTimeout>;

    if (cartOpen) {
      setShouldRender(true);
      animTimer = setTimeout(() => {
        setIsAnimatingIn(true);
      }, 10);
    } else {
      setIsAnimatingIn(false);
      unmountTimer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
    }

    return () => {
      clearTimeout(animTimer);
      clearTimeout(unmountTimer);
    };
  }, [cartOpen]);

  useEffect(() => {
    if (!shouldRender || typeof window === "undefined") return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [shouldRender]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-[70] ${
        cartOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
      style={{ overscrollBehavior: "contain" }}
    >
      <div
        className={`absolute inset-0 cart-drawer-backdrop transition-opacity duration-300 ${
          isAnimatingIn && cartOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={() => setCartOpen(false)}
      />
      <div
        className={`absolute right-0 top-0 flex flex-col bg-ink-900 border-l border-b border-ink-800/80 cart-drawer-container transition-transform duration-300 ${
          isAnimatingIn && cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ height: "65vh", maxHeight: "65vh", overscrollBehavior: "contain" }}
=======
          isClosing ? "opacity-0" : "animate-fade-in opacity-100"
        }`}
        onClick={handleBackdropClick}
      />
      <div 
        className={`absolute right-0 top-0 flex flex-col bg-ink-900 border-l border-b border-ink-800/80 cart-drawer-container transition-transform duration-300 ${
          isClosing ? "translate-x-full" : "animate-slide-in-right translate-x-0"
        }`}
        style={{ height: "65vh", maxHeight: "65vh" }}
>>>>>>> c2fc3a5 (Fix cart drawer close rendering crash on iOS WebKit)
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-ink-700 px-3 py-3 cart-drawer-header">
          <div className="flex items-center gap-1">
            <ShoppingBag size={14} className="text-gold-400" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-50">
              Bag ({cartCount})
            </span>
          </div>
          <button onClick={() => setCartOpen(false)} className="text-ink-400 hover:text-ink-50">
            <X size={16} />
          </button>
        </div>

        {/* Items */}
        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-3">
            <ShoppingBag size={28} className="mb-2.5 text-ink-700" />
            <p className="text-[11px] text-ink-400 text-center leading-normal">Your shopping bag is empty.</p>
            <button
              onClick={() => {
                setCartOpen(false);
                navigate("/shop");
              }}
              className="btn-outline h-8 px-3 text-[10px] uppercase tracking-wider mt-3 w-full flex items-center justify-center py-0"
            >
              Shop All
            </button>
          </div>
        ) : (
          <>
            <div 
              className="flex-1 overflow-y-auto px-3 py-2.5 cart-drawer-items"
              style={{ overscrollBehavior: "contain" }}
            >
              {cart.map((item) => {
                const vKey = `${item.variant.color || ""}-${item.variant.size || ""}`;
                return (
                  <div
                    key={item.product.id + vKey}
                    className="flex gap-2.5 border-b border-ink-800 py-3 items-start"
                  >
                    <div className="h-16 w-12 shrink-0 overflow-hidden bg-ink-800">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col min-w-0">
                      <h4 className="text-[11px] font-medium text-ink-50 leading-tight break-words">
                        {item.product.name}
                      </h4>
                      {(item.variant.color || item.variant.size) && (
                        <p className="mt-0.5 text-[9px] text-ink-500 truncate">
                          {[item.variant.color, item.variant.size].filter(Boolean).join(" / ")}
                        </p>
                      )}
                      <p className="mt-1 text-[11px] font-medium text-gold-400">
                        {formatNaira(item.product.price)}
                      </p>
                      <div className="mt-2 flex items-center justify-between gap-1 flex-wrap">
                        <div className="flex items-center border border-ink-700 h-5">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, vKey, item.quantity - 1)
                            }
                            className="flex h-5 w-5 items-center justify-center text-ink-400 hover:text-gold-400"
                          >
                            <Minus size={8} />
                          </button>
                          <span className="w-5 text-center text-[10px] text-ink-100 leading-none">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, vKey, item.quantity + 1)
                            }
                            className="flex h-5 w-5 items-center justify-center text-ink-400 hover:text-gold-400"
                          >
                            <Plus size={8} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id, vKey)}
                          className="text-[9px] text-ink-500 hover:text-red-400 uppercase tracking-wider"
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
            <div className="border-t border-ink-700 px-3 py-3 bg-ink-950/20 cart-drawer-footer">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] text-ink-300">Subtotal</span>
                <span className="text-xs font-semibold text-ink-50">{formatNaira(cartTotal)}</span>
              </div>
              <p className="mb-2 text-[9px] text-ink-500 leading-tight">
                Taxes calculated at checkout.
              </p>
              <button
                onClick={() => {
                  setCartOpen(false);
                  navigate("/checkout");
                }}
                className="btn-primary w-full h-8 text-[10px] py-0 flex items-center justify-center uppercase tracking-wider"
              >
                Checkout
              </button>
              <button
                onClick={() => {
                  setCartOpen(false);
                  navigate("/shop");
                }}
                className="btn-ghost mt-1.5 w-full h-8 text-[10px] uppercase tracking-wider py-0 flex items-center justify-center text-ink-400 hover:text-ink-200"
              >
                Continue Shop
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
