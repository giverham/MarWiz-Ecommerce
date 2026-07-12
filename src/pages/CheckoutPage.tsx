import { useState } from "react";
import { Check, MessageCircle, ChevronLeft, CreditCard } from "lucide-react";
import { useStore } from "../store/StoreContext";
import { useRouter } from "../lib/router";
import { formatNaira, generateOrderNumber } from "../lib/utils";
import { supabase } from "../lib/supabase";

const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT (Abuja)", "Gombe",
  "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos",
  "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto",
  "Taraba", "Yobe", "Zamfara",
];

export function CheckoutPage() {
  const { cart, cartTotal, clearCart, settings } = useStore();
  const { navigate } = useRouter();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    state: "",
    city: "",
    notes: "",
  });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (cart.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <p className="text-lg text-ink-300">Your shopping bag is empty.</p>
          <button onClick={() => navigate("/shop")} className="btn-outline mt-4">
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const ordNum = generateOrderNumber();
    setOrderNumber(ordNum);

    const items = cart.map((item) => ({
      id: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.images[0],
      variant: item.variant,
    }));

    await supabase.from("orders").insert({
      order_number: ordNum,
      customer_name: form.name,
      phone: form.phone,
      email: form.email || null,
      address: form.address,
      state: form.state,
      city: form.city,
      notes: form.notes || null,
      payment_method: "bank_transfer",
      items,
      subtotal: cartTotal,
      total: cartTotal,
      status: "pending",
    });

    setOrderPlaced(true);
    setSubmitting(false);
  };

  const sendWhatsApp = () => {
    const waNumber = settings?.whatsapp_number || "";
    let msg = `*NEW ORDER — ${orderNumber}*\n\n`;
    msg += `*Customer Information*\n`;
    msg += `Name: ${form.name}\n`;
    msg += `Phone: ${form.phone}\n`;
    if (form.email) msg += `Email: ${form.email}\n`;
    msg += `\n*Products Ordered*\n`;
    cart.forEach((item, i) => {
      msg += `${i + 1}. ${item.product.name}\n`;
      if (item.variant.color) msg += `   Color: ${item.variant.color}\n`;
      if (item.variant.size) msg += `   Size: ${item.variant.size}\n`;
      msg += `   Qty: ${item.quantity} x ${formatNaira(item.product.price)} = ${formatNaira(item.product.price * item.quantity)}\n`;
    });
    msg += `\n*Order Total: ${formatNaira(cartTotal)}*\n\n`;
    msg += `*Delivery Address*\n`;
    msg += `${form.address}\n`;
    msg += `${form.city}, ${form.state}\n`;
    if (form.notes) msg += `\n*Notes:* ${form.notes}\n`;
    msg += `\n*Payment Method:* Bank Transfer\n`;
    msg += `I will transfer to:\n`;
    msg += `Bank: ${settings?.bank_name}\n`;
    msg += `Account Name: ${settings?.account_name}\n`;
    msg += `Account Number: ${settings?.account_number}\n`;

    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`, "_blank");
    clearCart();
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen pt-32 pb-20">
        <div className="container-luxury">
          <div className="mx-auto max-w-2xl">
            <div className="text-center mb-10">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 border-gold-400">
                <Check size={36} className="text-gold-400" />
              </div>
              <h1 className="font-display text-3xl text-ink-50">Order Received</h1>
              <p className="mt-3 text-sm text-ink-400">
                Your order number is <span className="text-gold-400 font-medium">{orderNumber}</span>
              </p>
            </div>

            {/* Bank transfer instructions */}
            <div className="border border-ink-700 bg-ink-900 p-8">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard size={20} className="text-gold-400" />
                <h2 className="text-sm font-medium uppercase tracking-[0.15em] text-ink-100">
                  Bank Transfer Instructions
                </h2>
              </div>
              <p className="text-sm font-light text-ink-300 mb-6">
                Please transfer the total amount to the bank account below, then click
                "Send Order to WhatsApp" to confirm your order.
              </p>
              <div className="space-y-4">
                <div className="flex justify-between border-b border-ink-800 pb-3">
                  <span className="text-sm text-ink-400">Bank</span>
                  <span className="text-sm text-ink-100">{settings?.bank_name}</span>
                </div>
                <div className="flex justify-between border-b border-ink-800 pb-3">
                  <span className="text-sm text-ink-400">Account Name</span>
                  <span className="text-sm text-ink-100">{settings?.account_name}</span>
                </div>
                <div className="flex justify-between border-b border-ink-800 pb-3">
                  <span className="text-sm text-ink-400">Account Number</span>
                  <span className="text-sm text-ink-100 font-mono">{settings?.account_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-ink-400">Order Total</span>
                  <span className="text-lg text-gold-400">{formatNaira(cartTotal)}</span>
                </div>
              </div>
            </div>

            <button onClick={sendWhatsApp} className="btn-primary w-full mt-6">
              <MessageCircle size={18} />
              Send Order to WhatsApp
            </button>
            <p className="mt-4 text-center text-xs text-ink-500">
              Click the button above to send your complete order details to our WhatsApp.
            </p>

            <button
              onClick={() => navigate("/")}
              className="mt-6 w-full text-center text-xs uppercase tracking-[0.15em] text-ink-400 hover:text-gold-400"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container-luxury">
        <button
          onClick={() => navigate("/shop")}
          className="mb-6 flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-ink-400 hover:text-gold-400"
        >
          <ChevronLeft size={16} /> Continue Shopping
        </button>

        <h1 className="font-display text-section text-ink-50 mb-10">Checkout</h1>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-gold-400">
              Delivery Details
            </h2>

            <div>
              <label className="label-luxury">Full Name *</label>
              <input
                required
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-luxury"
                placeholder="Enter your full name"
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="label-luxury">Phone Number *</label>
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="input-luxury"
                  placeholder="e.g. 0801 234 5678"
                />
              </div>
              <div>
                <label className="label-luxury">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-luxury"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="label-luxury">Delivery Address *</label>
              <textarea
                required
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="input-luxury resize-none"
                rows={2}
                placeholder="House number, street name, area"
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="label-luxury">State *</label>
                <select
                  required
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className="input-luxury cursor-pointer"
                >
                  <option value="" className="bg-ink-900">Select State</option>
                  {NIGERIAN_STATES.map((s) => (
                    <option key={s} value={s} className="bg-ink-900">{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label-luxury">City *</label>
                <input
                  required
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="input-luxury"
                  placeholder="e.g. Victoria Island"
                />
              </div>
            </div>

            <div>
              <label className="label-luxury">Delivery Notes</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="input-luxury resize-none"
                rows={2}
                placeholder="Any special delivery instructions (optional)"
              />
            </div>

            <div>
              <label className="label-luxury">Payment Method</label>
              <div className="border border-gold-400/40 bg-gold-400/5 p-4 flex items-center gap-3">
                <CreditCard size={20} className="text-gold-400" />
                <div>
                  <p className="text-sm text-ink-100">Bank Transfer</p>
                  <p className="text-xs text-ink-500">Transfer to our bank account and confirm via WhatsApp</p>
                </div>
              </div>
            </div>

            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? "Placing Order..." : "Place Order"}
            </button>
          </form>

          {/* Order summary */}
          <div>
            <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-gold-400 mb-6">
              Order Summary
            </h2>
            <div className="border border-ink-700 bg-ink-900 p-6">
              {cart.map((item) => (
                <div key={item.product.id + (item.variant.color || "") + (item.variant.size || "")} className="flex gap-4 border-b border-ink-800 py-4 last:border-0">
                  <div className="h-20 w-16 shrink-0 overflow-hidden bg-ink-800">
                    <img src={item.product.images[0]} alt={item.product.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-ink-100">{item.product.name}</p>
                    {(item.variant.color || item.variant.size) && (
                      <p className="text-xs text-ink-500">
                        {[item.variant.color, item.variant.size].filter(Boolean).join(" / ")}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-ink-400">
                      {item.quantity} x {formatNaira(item.product.price)}
                    </p>
                  </div>
                  <span className="text-sm text-gold-400">
                    {formatNaira(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
              <div className="mt-4 pt-4 border-t border-ink-700">
                <div className="flex justify-between">
                  <span className="text-sm text-ink-300">Total</span>
                  <span className="text-xl text-ink-50">{formatNaira(cartTotal)}</span>
                </div>
              </div>
            </div>

            {/* Bank details preview */}
            <div className="mt-6 border border-ink-700 bg-ink-900 p-6">
              <h3 className="text-xs font-medium uppercase tracking-[0.15em] text-gold-400 mb-4">
                Bank Transfer Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-ink-400">Bank:</span>
                  <span className="text-ink-100">{settings?.bank_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-400">Account Name:</span>
                  <span className="text-ink-100">{settings?.account_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-400">Account Number:</span>
                  <span className="text-ink-100 font-mono">{settings?.account_number}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
