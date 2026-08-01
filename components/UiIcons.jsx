// Kleine, markeneigene SVG-Icons (weiche Kachel + Glyph) – Ersatz für Emoji.
function Tile({ bg, children, size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="48" height="48" rx="14" fill={bg} />
      {children}
    </svg>
  );
}

// 🏷️ Deals / Angebote – Preisschild
export function IconDeal({ size }) {
  return (
    <Tile bg="#fbf0da" size={size}>
      <path d="M25 12 h7 a4 4 0 0 1 4 4 v7 a4 4 0 0 1 -1.2 2.8 l-9 9 a3 3 0 0 1 -4.2 0 l-6.6 -6.6 a3 3 0 0 1 0 -4.2 l9 -9 A4 4 0 0 1 25 12 Z" fill="#e0a83a" />
      <circle cx="30.5" cy="17.5" r="2.4" fill="#fff" />
    </Tile>
  );
}

// 💡 Spartipp – Glühbirne
export function IconTip({ size }) {
  return (
    <Tile bg="#fdf3d6" size={size}>
      <path d="M24 12 a9 9 0 0 1 5.5 16.1 c-1 .8 -1.5 1.6 -1.6 2.9 h-7.8 c-.1 -1.3 -.6 -2.1 -1.6 -2.9 A9 9 0 0 1 24 12 Z" fill="#eab308" />
      <rect x="20.5" y="32.5" width="7" height="3" rx="1.5" fill="#c99700" />
      <rect x="21.5" y="36.5" width="5" height="2.5" rx="1.25" fill="#c99700" />
    </Tile>
  );
}

// 🧮 Tool / Rechner – Taschenrechner
export function IconTool({ size }) {
  return (
    <Tile bg="#e7effb" size={size}>
      <rect x="14" y="12" width="20" height="24" rx="4" fill="#2b6cb0" />
      <rect x="17.5" y="15.5" width="13" height="5" rx="1.5" fill="#dbeafe" />
      <g fill="#dbeafe">
        <circle cx="19" cy="26" r="1.7" /><circle cx="24" cy="26" r="1.7" /><circle cx="29" cy="26" r="1.7" />
        <circle cx="19" cy="31.5" r="1.7" /><circle cx="24" cy="31.5" r="1.7" /><circle cx="29" cy="31.5" r="1.7" />
      </g>
    </Tile>
  );
}

// 📬 Newsletter – Umschlag
export function IconMail({ size }) {
  return (
    <Tile bg="#e7effb" size={size}>
      <rect x="12" y="15" width="24" height="18" rx="3.5" fill="#2b6cb0" />
      <path d="M13 17.5 L24 26 L35 17.5" fill="none" stroke="#dbeafe" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />
    </Tile>
  );
}

// ✅ Vorteil – Häkchen (optional)
export function IconCheck({ size }) {
  return (
    <Tile bg="#e3f4ea" size={size}>
      <path d="M16 24.5 L21.5 30 L32 18.5" fill="none" stroke="#1f9e6b" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
    </Tile>
  );
}
