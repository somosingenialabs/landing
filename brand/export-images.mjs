// Exporta las imágenes de marca desde su HTML fuente con Chrome o Edge sin ventana:
//   brand/og-image.html         -> og-image.png         (1200x630, vista previa al compartir el link)
//   brand/apple-touch-icon.html -> apple-touch-icon.png (180x180, ícono en la pantalla de inicio de iPhone)
// Uso: node brand/export-images.mjs
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const candidates = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
].filter(Boolean);
const browser = candidates.find((p) => existsSync(p));
if (!browser) throw new Error("No encontré Chrome ni Edge. Definí CHROME_PATH con la ruta al ejecutable.");

const jobs = [
  { src: "og-image.html", out: "og-image.png", size: "1200,630" },
  { src: "apple-touch-icon.html", out: "apple-touch-icon.png", size: "180,180" },
];

for (const { src, out, size } of jobs) {
  execFileSync(browser, [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--force-device-scale-factor=1",
    `--window-size=${size}`,
    "--virtual-time-budget=8000",
    `--screenshot=${join(root, out)}`,
    pathToFileURL(join(here, src)).href,
  ], { stdio: "ignore" });
  console.log(`OK: ${out}`);
}
