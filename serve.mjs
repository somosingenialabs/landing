// Vista previa local del sitio, sin dependencias: node serve.mjs  ->  http://localhost:5173
// Sirve los archivos tal como los publica Netlify (carpetas con index.html y 404.html para lo que no existe).
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { dirname, extname, join, normalize, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT) || 5173;
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".mp4": "video/mp4",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

async function resolve(urlPath) {
  const clean = normalize(decodeURIComponent(urlPath.split("?")[0])).replace(/^([/\\])+/, "");
  const file = join(root, clean);
  if (!file.startsWith(root + sep) && file !== root) return null; // no salir de la carpeta del proyecto
  try {
    const info = await stat(file);
    if (info.isDirectory()) {
      if (!urlPath.split("?")[0].endsWith("/")) return { redirect: `${urlPath.split("?")[0]}/` };
      return { file: join(file, "index.html") };
    }
    return { file };
  } catch {
    return null;
  }
}

createServer(async (req, res) => {
  const found = await resolve(req.url || "/");
  if (found?.redirect) {
    res.writeHead(301, { Location: found.redirect });
    return res.end();
  }
  try {
    if (!found) throw new Error("not found");
    const body = await readFile(found.file);
    res.writeHead(200, { "Content-Type": types[extname(found.file)] || "application/octet-stream", "Cache-Control": "no-store" });
    res.end(body);
  } catch {
    const body = await readFile(join(root, "404.html")).catch(() => "404");
    res.writeHead(404, { "Content-Type": types[".html"] });
    res.end(body);
  }
}).listen(port, "127.0.0.1", () => {
  console.log(`Vista previa en http://localhost:${port}  (Ctrl+C para cortar)`);
});
