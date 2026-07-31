import { writeFileSync, mkdirSync } from "fs";

// Neutrale, markeneigene Titelbilder pro Rubrik (1200x630, SVG, keine externen Assets)
const CATS = {
  "finanzen-spartipps": { label: "Finanzen & Spartipps", c1: "#eaf2fb", c2: "#2b6cb0", accent: "#1c3d6c", motif: "coins" },
  familienleben: { label: "Familienleben", c1: "#e9f7f0", c2: "#2f9e6b", accent: "#1c5c46", motif: "tree" },
  "kinder-bildung": { label: "Kinder & Bildung", c1: "#fdf3e3", c2: "#e0912f", accent: "#8a5410", motif: "cap" },
  lifestyle: { label: "Lifestyle", c1: "#f1ecfb", c2: "#7c5cd6", accent: "#4b3a86", motif: "spark" },
};

const motif = (name, color) => {
  const o = 0.16;
  if (name === "coins")
    return `<g fill="${color}" opacity="${o}"><circle cx="1010" cy="470" r="70"/><circle cx="1090" cy="360" r="46"/><circle cx="930" cy="380" r="34"/></g>`;
  if (name === "tree")
    return `<g fill="${color}" opacity="${o}"><circle cx="1020" cy="360" r="80"/><circle cx="960" cy="430" r="55"/><circle cx="1085" cy="430" r="55"/><rect x="1008" y="440" width="24" height="90" rx="8"/></g>`;
  if (name === "cap")
    return `<g fill="${color}" opacity="${o}"><polygon points="1010,330 1130,390 1010,450 890,390"/><rect x="1100" y="390" width="14" height="70" rx="6"/></g>`;
  return `<g fill="${color}" opacity="${o}"><path d="M1010 330 l22 60 62 22 -62 22 -22 60 -22 -60 -62 -22 62 -22 z"/><circle cx="1110" cy="470" r="22"/><circle cx="915" cy="450" r="14"/></g>`;
};

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const svg = (cfg) => `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="${esc(cfg.label)}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${cfg.c1}"/>
      <stop offset="1" stop-color="${cfg.c2}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <circle cx="1040" cy="410" r="230" fill="#ffffff" opacity="0.10"/>
  ${motif(cfg.motif, cfg.accent)}
  <g transform="translate(90,250)">
    <text x="0" y="0" font-family="Inter, system-ui, sans-serif" font-size="24" font-weight="700" letter-spacing="8" fill="${cfg.accent}" opacity="0.85">LOBBIUM</text>
    <text x="0" y="72" font-family="Georgia, 'Times New Roman', serif" font-size="60" font-weight="700" fill="#0F1C3F">${esc(cfg.label)}</text>
    <text x="0" y="120" font-family="Inter, system-ui, sans-serif" font-size="24" fill="#0F1C3F" opacity="0.65">Smart Family Life</text>
  </g>
  <text x="90" y="560" font-family="Inter, system-ui, sans-serif" font-size="20" fill="${cfg.accent}" opacity="0.7">lobbium.com</text>
</svg>`;

mkdirSync("/Users/eimex/Downloads/lobbium_final_v6_stable_full_db/public/blog", { recursive: true });
for (const [key, cfg] of Object.entries(CATS)) {
  const path = `/Users/eimex/Downloads/lobbium_final_v6_stable_full_db/public/blog/cover-${key}.svg`;
  writeFileSync(path, svg(cfg));
  console.log("  ✓", `public/blog/cover-${key}.svg`);
}
