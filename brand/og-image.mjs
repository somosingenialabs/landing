// Exporta brand/og-image.html a og-image.png (1200x630) con Chrome o Edge sin ventana.
// Uso: node brand/og-image.mjs
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, "..", "og-image.png");
const candidates = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
].filter(Boolean);
const browser = candidates.find((p) => existsSync(p));
if (!browser) throw new Error("No encontré Chrome ni Edge. Definí CHROME_PATH con la ruta al ejecutable.");

execFileSync(browser, [
  "--headless=new",
  "--disable-gpu",
  "--hide-scrollbars",
  "--force-device-scale-factor=1",
  "--window-size=1200,630",
  "--virtual-time-budget=8000",
  `--screenshot=${out}`,
  pathToFileURL(join(here, "og-image.html")).href,
], { stdio: "inherit" });
console.log(`OK: ${out}`);
