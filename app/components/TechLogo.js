import { ICONS } from "@/lib/techIcons";

// Brand colours too dark to read on the dark theme fall back to plain text colour on hover
function isDark(hex) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [n >> 16, (n >> 8) & 255, n & 255];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 70;
}

export function techTitle(key) {
  return ICONS[key]?.title ?? key;
}

// Monochrome logo that takes its brand colour when an ancestor with the `group` class is hovered
export default function TechLogo({ name, className = "w-6 h-6" }) {
  const icon = ICONS[name];
  if (!icon) return null;
  const brand = icon.hex && !isDark(icon.hex) ? icon.hex : "var(--color-zinc-100)";
  return (
    <svg
      aria-hidden="true"
      viewBox={icon.viewBox ?? "0 0 24 24"}
      className={`${className} fill-current transition-colors duration-300 group-hover:[color:var(--brand)]`}
      style={{ "--brand": brand }}
    >
      <path d={icon.path} fillRule={icon.fillRule} clipRule={icon.fillRule} />
    </svg>
  );
}
