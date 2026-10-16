/**
 * Preset de Tailwind CSS con los tokens de la marca Ingenia. Fuente: brand-tokens.json
 * Uso en tailwind.config.js:  presets: [require("./brand/tokens/tailwind.preset.js")]
 * Ejemplos: bg-ingenia-navy, text-ingenia-blue, bg-ingenia-gradient, font-sans, rounded-pill
 */
module.exports = {
  theme: {
    extend: {
      colors: {
        ingenia: {
          blue: "#007AFF",   // Electric Blue
          "blue-text": "#0062CC", // Electric Blue accesible para texto chico (AA)
          "blue-on-dark": "#409CFF", // Electric Blue accesible sobre fondos oscuros (AA)
          navy: "#1C1C1E",   // Deep Navy
          teal: "#30B0C7",   // Kinetic Teal
          gray: "#8E8E93",   // Slate Gray
          canvas: "#F2F2F7", // Studio White
          white: "#FFFFFF",  // Pure White
          muted: "#636366",  // texto secundario sobre fondo claro (contraste AA)
          border: "#D1D1D6",
          "border-dark": "#38383A",
        },
      },
      backgroundImage: {
        "ingenia-gradient": "linear-gradient(135deg, #007AFF 0%, #30B0C7 100%)",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "Geist Mono", "ui-monospace", "monospace"],
      },
      borderRadius: {
        "ingenia-sm": "8px",
        "ingenia-md": "14px",
        "ingenia-lg": "22px",
        pill: "999px",
      },
    },
  },
};
