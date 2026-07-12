export function Loader() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink-950">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-2 border-ink-700"></div>
        <div className="absolute inset-0 h-16 w-16 rounded-full border-2 border-transparent border-t-gold-400 animate-spin"></div>
      </div>
      <div className="mt-6 font-display text-xl tracking-wide text-ink-300">
        MarWiz
      </div>
    </div>
  );
}
