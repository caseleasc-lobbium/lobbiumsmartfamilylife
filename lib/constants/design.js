// 🎨 Lobbium Design Tokens
// Einheitliche Designwerte für Smart Family Life by Lobbium

export const design = {
  colors: {
    primary: "#1c3d6c",          // Hauptblau
    primaryLight: "#4e73b6",
    primaryDark: "#13294b",
    accent: "#2b6cb0",           // Akzentfarbe (Buttons, Links)
    accentLight: "#63b3ed",
    neutralLight: "#f5f7fa",     // Hintergrund oben
    neutral: "#f3f5f8",          // Mittelgrau
    neutralDark: "#e9edf2",      // dunkler Verlauf
    white: "#ffffff",
    text: "#2d3748",             // Haupttext
    textMuted: "#4a5568",
    border: "#d9dee8",
  },

  font: {
    family: "'Inter', system-ui, sans-serif",
    sizes: {
      xs: "0.8rem",
      sm: "0.9rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "2rem",
      "4xl": "2.5rem",
    },
    weight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },

  radius: {
    sm: "0.375rem",
    md: "0.75rem",
    lg: "1rem",
    xl: "1.5rem",
  },

  shadow: {
    soft: "0 4px 12px rgba(0, 0, 0, 0.05)",
    glow: "0 0 10px rgba(59, 130, 246, 0.2)",
  },

  gradient: {
    hero: "linear-gradient(to bottom, #eef3fb, #f8faff)",
    section: "linear-gradient(to right, #f0f4ff, #ffffff)",
    footer: "linear-gradient(to bottom, #dce8ff, #f8faff)",
  },
};
