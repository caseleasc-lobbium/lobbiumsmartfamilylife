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

// 🧾 Familienleistungen – Schild mit Häkchen (Anspruch geprüft)
export function IconBenefits({ size }) {
  return (
    <Tile bg="#e7effb" size={size}>
      <path d="M24 12 l10 4 v7 c0 7 -4.5 11.5 -10 13.5 c-5.5 -2 -10 -6.5 -10 -13.5 v-7 Z" fill="#2b6cb0" />
      <path d="M20 24 l3 3 l6 -6.5" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
    </Tile>
  );
}

// 💰 Budget – Münzstapel
export function IconBudget({ size }) {
  return (
    <Tile bg="#e3f4ea" size={size}>
      <ellipse cx="24" cy="30" rx="10" ry="4" fill="#1f9e6b" />
      <ellipse cx="24" cy="25" rx="10" ry="4" fill="#2fb37c" />
      <ellipse cx="24" cy="20" rx="10" ry="4" fill="#41c48d" />
      <text x="24" y="22.5" text-anchor="middle" font-size="6" font-weight="700" fill="#0f5c3f" font-family="system-ui,sans-serif">€</text>
    </Tile>
  );
}

// 🍼 Baby – Fläschchen
export function IconBaby({ size }) {
  return (
    <Tile bg="#fdeef4" size={size}>
      <rect x="19" y="18" width="10" height="18" rx="4" fill="#ec6f9e" />
      <rect x="18" y="16" width="12" height="3.5" rx="1.75" fill="#d94f83" />
      <path d="M22 12 h4 v3.5 h-4 Z" fill="#d94f83" />
      <g stroke="#fff" stroke-width="1.4" stroke-linecap="round">
        <line x1="21.5" y1="24" x2="26.5" y2="24" /><line x1="21.5" y1="27.5" x2="26.5" y2="27.5" />
      </g>
    </Tile>
  );
}

// 🐷 Taschengeld – Sparschwein
export function IconPiggy({ size }) {
  return (
    <Tile bg="#fbe8ef" size={size}>
      <ellipse cx="25" cy="26" rx="11" ry="8.5" fill="#ec6f9e" />
      <circle cx="34" cy="25" r="4" fill="#ec6f9e" />
      <circle cx="34.5" cy="24.5" r="1" fill="#b83a6a" /><circle cx="35.5" cy="24.5" r="1" fill="#b83a6a" />
      <circle cx="21" cy="23" r="1.3" fill="#fff" />
      <path d="M16 20 l4 2" stroke="#d94f83" stroke-width="3" stroke-linecap="round" />
      <rect x="22" y="17.5" width="6" height="2" rx="1" fill="#b83a6a" />
      <rect x="19" y="33" width="3" height="4" rx="1" fill="#d94f83" /><rect x="28" y="33" width="3" height="4" rx="1" fill="#d94f83" />
    </Tile>
  );
}

// 🧭 Quiz – Kompass
export function IconCompass({ size }) {
  return (
    <Tile bg="#e7effb" size={size}>
      <circle cx="24" cy="24" r="12" fill="none" stroke="#2b6cb0" stroke-width="2.5" />
      <path d="M24 24 L30 18 L26 26 Z" fill="#2b6cb0" />
      <path d="M24 24 L18 30 L22 22 Z" fill="#9cc2f0" />
      <circle cx="24" cy="24" r="1.6" fill="#0f1c3f" />
    </Tile>
  );
}

// 🖨️ Druckvorlagen – Drucker
export function IconPrinter({ size }) {
  return (
    <Tile bg="#eef2fb" size={size}>
      <rect x="15" y="22" width="18" height="10" rx="2.5" fill="#2b6cb0" />
      <rect x="18" y="14" width="12" height="7" rx="1.5" fill="#9cc2f0" />
      <rect x="18" y="28" width="12" height="8" rx="1.5" fill="#fff" stroke="#c7d6ee" stroke-width="1" />
      <circle cx="29.5" cy="25.5" r="1.3" fill="#dbeafe" />
    </Tile>
  );
}

// 🍽️ Wochenplan – Teller
export function IconPlate({ size }) {
  return (
    <Tile bg="#fbf0da" size={size}>
      <circle cx="25" cy="24" r="9" fill="#e0a83a" />
      <circle cx="25" cy="24" r="4.5" fill="#fbf0da" />
      <line x1="14" y1="16" x2="14" y2="32" stroke="#c99022" stroke-width="2" stroke-linecap="round" />
    </Tile>
  );
}

// 🧳 Packliste – Koffer
export function IconSuitcase({ size }) {
  return (
    <Tile bg="#e3f4ea" size={size}>
      <rect x="15" y="19" width="18" height="15" rx="3" fill="#1f9e6b" />
      <path d="M20 19 v-2.5 a2 2 0 0 1 2 -2 h4 a2 2 0 0 1 2 2 V19" fill="none" stroke="#177a52" stroke-width="2.2" />
      <line x1="24" y1="19" x2="24" y2="34" stroke="#cdeede" stroke-width="2" />
    </Tile>
  );
}

// 🎯 Sparziel – Zielscheibe
export function IconTarget({ size }) {
  return (
    <Tile bg="#fbe8ea" size={size}>
      <circle cx="24" cy="24" r="11" fill="none" stroke="#d1495b" stroke-width="2.5" />
      <circle cx="24" cy="24" r="6.5" fill="none" stroke="#d1495b" stroke-width="2.5" />
      <circle cx="24" cy="24" r="2.2" fill="#d1495b" />
    </Tile>
  );
}
