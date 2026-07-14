import { useStore } from "../../store/StoreContext";

export function WhatsAppFloat() {
  const { settings } = useStore();

  if (!settings?.whatsapp_number) return null;

  const cleanNumber = settings.whatsapp_number.replace(/\+/g, "").replace(/\s/g, "");

  const handleClick = () => {
    const message = encodeURIComponent("Hello! I am visiting from Marwiz Wears & Watches. I would like to make an inquiry or lodge a complaint.");
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      onClick={handleClick}
      type="button"
      className="fixed bottom-6 left-6 z-50 flex items-center justify-center rounded-full bg-[#25D366] text-white px-3.5 py-1.5 shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 active:scale-95 text-[9px] font-bold tracking-widest uppercase cursor-pointer border-none"
      aria-label="Chat with us on WhatsApp"
    >
      CHAT WITH US
    </button>
  );
}
