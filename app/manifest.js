export default function manifest() {
  return {
    name: "Lobbium – Smart Family Life",
    short_name: "Lobbium",
    description:
      "Clever sparen, Familienalltag organisieren und Kinder fördern – Ratgeber, Tools & Rechner für Familien.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f8faff",
    theme_color: "#2b6cb0",
    lang: "de",
    categories: ["lifestyle", "finance", "education"],
    icons: [
      { src: "/icon.svg", sizes: "192x192", type: "image/svg+xml", purpose: "any" },
      { src: "/icon.svg", sizes: "512x512", type: "image/svg+xml", purpose: "any" },
      { src: "/icon.svg", sizes: "512x512", type: "image/svg+xml", purpose: "maskable" },
    ],
  };
}
