import { useStore } from "../../store/StoreContext";

export function AnnouncementBar() {
  const { settings } = useStore();
  if (!settings?.announcement_active || !settings?.announcement_text) return null;

  // Duplicate text to ensure it always spans wider than the screen
  const repetitions = 20;
  const items = Array.from({ length: repetitions }).fill(settings.announcement_text) as string[];

  return (
    <div className="relative overflow-hidden bg-ink-950 py-2.5 flex items-center">
      <div className="flex whitespace-nowrap animate-marquee w-max">
        {/* First Half */}
        <div className="flex shrink-0">
          {items.map((text, i) => (
            <span key={`a-${i}`} className="px-8 text-xs font-light uppercase tracking-[0.25em] text-gold-400">
              {text}
            </span>
          ))}
        </div>
        {/* Second Half (Exact Duplicate) */}
        <div className="flex shrink-0">
          {items.map((text, i) => (
            <span key={`b-${i}`} className="px-8 text-xs font-light uppercase tracking-[0.25em] text-gold-400">
              {text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
