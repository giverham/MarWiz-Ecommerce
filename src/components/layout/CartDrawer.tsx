import React from 'react';
import { X, ShoppingBag } from 'lucide-react';
import { useStore } from '../../store/StoreContext';
import { formatNaira } from '../../lib/utils';
import { useRouter } from '../../lib/router';

const getVariantKey = (variant: { color?: string; size?: string }) =>
  `${variant.color || ""}-${variant.size || ""}`;

export const CartDrawer = () => {
  const { cart, cartOpen, setCartOpen, removeFromCart, updateQuantity, cartTotal } = useStore();
  const { navigate } = useRouter();

  if (!cartOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-end bg-black/60 backdrop-blur-sm webkit-gpu-fix"
      onClick={() => setCartOpen(false)}
    >
      {/* 
        THE FIX: 
        - m-4 and rounded-lg: Makes it float cleanly instead of touching the screen edges.
        - max-w-[260px] md:max-w-[300px]: Strictly cuts the width down so it is no longer massive.
        - max-h-[60vh]: Caps the height at 60% of the screen so it doesn't take over the page.
      */}
      <div
        className="relative m-4 rounded-lg bg-[#0c0a09] border border-white/10 text-white shadow-2xl w-[85vw] max-w-[260px] md:max-w-[300px] max-h-[60vh] flex flex-col overscroll-contain"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 p-4 shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-[#C5A880]" />
            <span className="font-semibold text-xs tracking-widest uppercase">Your Bag ({cart.length})</span>
          </div>
          <button 
            onClick={() => setCartOpen(false)}
            className="rounded-full p-1 hover:bg-white/10 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {cart.map((item) => {
            const vKey = getVariantKey(item.variant);
            return (
              <div key={`${item.product.id}-${vKey}`} className="flex gap-3 border-b border-white/5 pb-3">
                <img src={item.product.images[0]} className="h-12 w-12 object-cover rounded bg-white/5 shrink-0" alt={item.product.name} />
                <div className="flex-1 min-w-0">
                  <h4 className="text-[11px] font-medium truncate text-white/90">{item.product.name}</h4>
                  <p className="text-[#C5A880] text-[11px] mt-0.5">{formatNaira(item.product.price)}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-white/10 rounded bg-black/30">
                      <button onClick={() => updateQuantity(item.product.id, vKey, item.quantity - 1)} className="px-2 py-0.5 text-xs text-white/60 hover:text-white hover:bg-white/5">-</button>
                      <span className="px-1 text-xs font-mono">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, vKey, item.quantity + 1)} className="px-2 py-0.5 text-xs text-white/60 hover:text-white hover:bg-white/5">+</button>
                    </div>
                    <button onClick={() => removeFromCart(item.product.id, vKey)} className="text-[9px] text-red-400 uppercase tracking-wider hover:underline">Remove</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 p-4 bg-black/40 rounded-b-lg shrink-0">
          <div className="flex justify-between items-center mb-3 text-xs font-semibold tracking-wider">
            <span className="uppercase text-white/70">Subtotal</span>
            <span className="text-[#C5A880]">{formatNaira(cartTotal)}</span>
          </div>
          <button
            onClick={() => {
              setCartOpen(false);
              navigate('/checkout'); 
            }}
            className="w-full bg-[#C5A880] text-black py-2 rounded text-[10px] font-bold uppercase tracking-widest hover:bg-[#b09670]"
          >
            Checkout
          </button>
          <button
            onClick={() => setCartOpen(false)}
            className="w-full border border-white/20 py-2 mt-2 rounded text-[9px] uppercase tracking-widest hover:bg-white/10"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};