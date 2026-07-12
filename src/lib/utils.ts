export function formatNaira(amount: number): string {
  return "₦" + new Intl.NumberFormat("en-NG", { maximumFractionDigits: 0 }).format(amount);
}

export function generateOrderNumber(): string {
  const prefix = "MW";
  const timestamp = Date.now().toString(36).toUpperCase().slice(-6);
  const random = Math.random().toString(36).toUpperCase().slice(2, 6);
  return `${prefix}-${timestamp}${random}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}
