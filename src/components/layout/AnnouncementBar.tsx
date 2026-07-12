import { useStore } from "../../store/StoreContext";

export function AnnouncementBar() {
  const { settings } = useStore();
  if (!settings?.announcement_active || !settings?.announcement_text) return null;

  return (
    <div className="relative overflow-hidden bg-ink-950 py-2.5 text-center">
      <div className="flex whitespace-nowrap animate-marquee">
        <span className="px-8 text-xs font-light uppercase tracking-[0.25em] text-gold-400">
          {settings.announcement_text}
        </span>
        <span className="px-8 text-xs font-light uppercase tracking-[0.25em] text-gold-400">
          {settings.announcement_text}
        </span>
      </div>
    </div>
  );
}
