// Genera los SVG de marca de Ingenia (logos e íconos) en brand/assets/ a partir de una sola geometría.
// Uso: node brand/generate-brand.mjs
// Si cambiás la forma o los colores del isotipo, hacelo acá y volvé a correr el script (no edites los SVG a mano).
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const out = (rel, svg) => {
  const file = join(here, "assets", rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, svg.trim() + "\n");
  console.log(`OK: brand/assets/${rel}`);
};

/* ---------- Colores oficiales ---------- */
const C = {
  blue: "#007AFF",   // Electric Blue
  navy: "#1C1C1E",   // Deep Navy
  teal: "#30B0C7",   // Kinetic Teal
  gray: "#8E8E93",   // Slate Gray
  canvas: "#F2F2F7", // Studio White
  white: "#FFFFFF",  // Pure White
};
const FONT = "'Plus Jakarta Sans','Inter','Segoe UI',system-ui,-apple-system,sans-serif";

/* ---------- Isotipo: "I" como viga doble T en proyección isométrica ----------
   Perfil (ancho 60, alto 100, espesor 24): ala superior, alma y ala inferior.
   Caras: frente (gradiente azul a turquesa), techo (turquesa claro) y lateral (sombra azul marino).
   Coordenadas ya proyectadas, centradas en un cuadro de 160 x 160 con translate(64.4 109). */
const F = {
  bfTop: "-20.78,-12 31.18,18 51.96,6 0,-24",
  bfSide: "31.18,42 51.96,30 51.96,6 31.18,18",
  bfFront: "-20.78,12 31.18,42 31.18,18 -20.78,-12",
  wSide: "12.99,7.5 33.77,-4.5 33.77,-56.5 12.99,-44.5",
  wFront: "-2.6,-1.5 12.99,7.5 12.99,-44.5 -2.6,-53.5",
  tfSide: "31.18,-34 51.96,-46 51.96,-70 31.18,-58",
  tfTop: "-20.78,-88 31.18,-58 51.96,-70 0,-100",
  tfFront: "-20.78,-64 31.18,-34 31.18,-58 -20.78,-88",
};
// Orden de dibujo: de atrás hacia adelante
const ORDER = [
  ["bfTop", "top"], ["bfSide", "side"], ["bfFront", "front"],
  ["wSide", "side"], ["wFront", "front"],
  ["tfSide", "side"], ["tfTop", "top"], ["tfFront", "front"],
];

// dark = true aclara la sombra para que el lateral no se pierda sobre fondos oscuros
const gradientDefs = (id, dark = false) => `
    <linearGradient id="${id}-front" gradientUnits="userSpaceOnUse" x1="-21" y1="-88" x2="31" y2="42">
      <stop offset="0" stop-color="${C.blue}"/><stop offset="1" stop-color="${C.teal}"/>
    </linearGradient>
    <linearGradient id="${id}-top" gradientUnits="userSpaceOnUse" x1="0" y1="-100" x2="52" y2="-58">
      <stop offset="0" stop-color="${C.teal}"/><stop offset="1" stop-color="#7AD3E3"/>
    </linearGradient>
    <linearGradient id="${id}-side" gradientUnits="userSpaceOnUse" x1="31" y1="-70" x2="52" y2="42">
      <stop offset="0" stop-color="${dark ? "#1E63B8" : "#0A4FA3"}"/><stop offset="1" stop-color="${dark ? "#123A6B" : C.navy}"/>
    </linearGradient>`;

const isoGroup = (id, transform = "translate(64.4 109)") => `
  <g transform="${transform}">${ORDER.map(([k, face]) => `
    <polygon points="${F[k]}" fill="url(#${id}-${face})"/>`).join("")}
  </g>`;

/* ---------- Wordmark: "Ingen" en navy (o blanco) + "ia" en Electric Blue ---------- */
const wordmarkText = ({ x, y, size, anchor = "start", ingen }) => `
  <text x="${x}" y="${y}" text-anchor="${anchor}" font-family="${FONT}" font-weight="800" font-size="${size}" letter-spacing="${(-size * 0.03).toFixed(1)}"><tspan fill="${ingen}">Ingen</tspan><tspan fill="${C.blue}">ia</tspan></text>`;

const svg = (viewBox, title, body, extra = "") =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" role="img" aria-labelledby="title"${extra}>
  <title id="title">${title}</title>${body}
</svg>`;

/* ---------- Logos ---------- */
const horizontal = (dark) => svg("0 0 448 152", "Ingenia", `
  <defs>${gradientDefs("ing", dark)}
  </defs>${isoGroup("ing", "translate(30 105)")}${wordmarkText({ x: 102, y: 104, size: 78, ingen: dark ? C.white : C.navy })}`);

out("logo/ingenia-logo-horizontal.svg", horizontal(false));
out("logo/ingenia-logo-horizontal-dark.svg", horizontal(true));

out("logo/ingenia-logo-vertical.svg", svg("0 0 360 280", "Ingenia", `
  <defs>${gradientDefs("ing")}
  </defs>${isoGroup("ing", "translate(164.4 114)")}${wordmarkText({ x: 180, y: 252, size: 64, anchor: "middle", ingen: C.navy })}`));

const wordmark = (dark) => svg("0 0 380 110", "Ingenia",
  wordmarkText({ x: 190, y: 78, size: 78, anchor: "middle", ingen: dark ? C.white : C.navy }));
out("logo/ingenia-wordmark.svg", wordmark(false));
out("logo/ingenia-wordmark-dark.svg", wordmark(true));

/* ---------- Íconos ---------- */
out("icon/ingenia-icon.svg", svg("0 0 160 160", "Ingenia", `
  <defs>${gradientDefs("ing")}
  </defs>${isoGroup("ing")}`));

// Silueta monocromática: un solo color (currentColor, navy por defecto) con tres tonos por cara
const tone = { front: 1, top: 0.55, side: 0.8 };
out("icon/ingenia-icon-flat.svg", svg("0 0 160 160", "Ingenia", `
  <g transform="translate(64.4 109)" fill="currentColor">${ORDER.map(([k, face]) => `
    <polygon points="${F[k]}"${tone[face] < 1 ? ` fill-opacity="${tone[face]}"` : ""}/>`).join("")}
  </g>`, ` color="${C.navy}"`));

// Ícono de app: squircle (superelipse n=5) con fondo oscuro e isotipo en gradiente
const SQUIRCLE = "M1024 512 L1023 714.2 L1020 778.3 L1015.1 824.2 L1008 860.7 L998.9 891 L987.6 916.7 L973.9 938.8 L957.7 957.7 L938.8 973.9 L916.7 987.6 L891 998.9 L860.7 1008 L824.2 1015.1 L778.3 1020 L714.2 1023 L512 1024 L309.8 1023 L245.7 1020 L199.8 1015.1 L163.3 1008 L133 998.9 L107.3 987.6 L85.2 973.9 L66.3 957.7 L50.1 938.8 L36.4 916.7 L25.1 891 L16 860.7 L8.9 824.2 L4 778.3 L1 714.2 L0 512 L1 309.8 L4 245.7 L8.9 199.8 L16 163.3 L25.1 133 L36.4 107.3 L50.1 85.2 L66.3 66.3 L85.2 50.1 L107.3 36.4 L133 25.1 L163.3 16 L199.8 8.9 L245.7 4 L309.8 1 L512 0 L714.2 1 L778.3 4 L824.2 8.9 L860.7 16 L891 25.1 L916.7 36.4 L938.8 50.1 L957.7 66.3 L973.9 85.2 L987.6 107.3 L998.9 133 L1008 163.3 L1015.1 199.8 L1020 245.7 L1023 309.8 Z";
out("icon/ingenia-app-icon-ios.svg", svg("0 0 1024 1024", "Ingenia", `
  <defs>${gradientDefs("ing", true)}
    <radialGradient id="ing-bg" cx="30%" cy="20%" r="95%">
      <stop offset="0" stop-color="#2C2C30"/><stop offset="1" stop-color="${C.navy}"/>
    </radialGradient>
    <radialGradient id="ing-glow" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="${C.blue}" stop-opacity=".28"/><stop offset="1" stop-color="${C.blue}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <path d="${SQUIRCLE}" fill="url(#ing-bg)"/>
  <circle cx="512" cy="512" r="380" fill="url(#ing-glow)"/>${isoGroup("ing", "translate(512 512) scale(4.6) translate(-15.6 29)")}`));

// Favicon: versión simplificada para 16 a 32 px. Colores planos y sin gradientes, sobre azul.
const favTone = { front: C.white, top: "#BFE9F2", side: "#0A3F80" };
out("icon/ingenia-favicon.svg", svg("0 0 32 32", "Ingenia", `
  <rect width="32" height="32" rx="7" fill="${C.blue}"/>
  <g transform="translate(16 16) scale(.19) translate(-15.6 29)">${ORDER.map(([k, face]) => `
    <polygon points="${F[k]}" fill="${favTone[face]}"/>`).join("")}
  </g>`));
