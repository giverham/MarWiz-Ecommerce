import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-gold-400 bg-ink-950 text-gold-400 shadow-2xl transition-all duration-500 hover:bg-gold-400 hover:text-ink-950 hover:-translate-y-1 active:scale-95 ${
        visible
          ? "translate-y-0 opacity-100 scale-100 pointer-events-auto"
          : "translate-y-10 opacity-0 scale-75 pointer-events-none"
      }`}
      aria-label="Back to top"
    >
      <ChevronUp size={18} className="animate-pulse" />
    </button>
  );
}
