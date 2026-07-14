import { MessageCircle } from "lucide-react";
import { useStore } from "../../store/StoreContext";

export function WhatsAppFloat() {
  const { settings } = useStore();

  if (!settings?.whatsapp_number) return null;

  const whatsappLink = `https://wa.me/${settings.whatsapp_number.replace(/\+/g, "").replace(/\s/g, "")}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl transition-all duration-300 hover:scale-110 hover:-translate-y-1 active:scale-95 group"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={24} fill="currentColor" className="text-white" />
      
      {/* Tooltip */}
      <span className="absolute left-14 scale-0 rounded bg-ink-900 px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider text-gold-400 opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100 whitespace-nowrap border border-ink-800 shadow-xl">
        Chat with us
      </span>
    </a>
  );
}
