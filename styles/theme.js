// styles/theme.js
const theme = {
  colors: {
    primary: "#1c3d6c", // Dunkelblau für Headlines, Links, Icons
    secondary: "#3b82f6", // Lobbium-Blau (Buttons, Akzente)
    gradientFrom: "#f8faff", // Heller Verlauf oben
    gradientTo: "#eef3fa", // Verlauf unten
    border: "#dbe2ed", // Linien & Rahmen
    textDark: "#1f2937", // Standard-Text
    textLight: "#6b7280", // Beschreibungstexte
    background: "#ffffff", // Hauptfläche
  },
  spacing: {
    sectionY: "py-20", // vertikaler Abstand für Sektionen
    sectionX: "px-6", // horizontaler Abstand
  },
  effects: {
    shadow: "shadow-sm hover:shadow-md transition-all duration-300",
    card: "border border-[#e0e6ef] rounded-2xl bg-white",
  },
};

export default theme;
