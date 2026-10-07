# Ingenia Solutions · Landing

Landing de [ingenia.solutions](https://ingenia.solutions). HTML, CSS y JS estáticos, sin dependencias.

## Editar textos

1. Cambiá el contenido en `content.js` (textos, sectores, métricas, videos, formulario).
2. Regenerá la página: `node build.mjs` (escribe `index.html`, `robots.txt` y `sitemap.xml`).
3. No edites `index.html` a mano: se sobrescribe en cada build.

## Ver en local

```bash
node build.mjs
python -m http.server 5173
```

Abrir http://localhost:5173

## Publicación

Netlify publica automáticamente cada push a `main`. La configuración está en `netlify.toml`
(corre `node build.mjs` y publica la carpeta `dist/`).

## Archivos

- `content.js`: todo el contenido editable.
- `build.mjs`: genera el HTML estático para SEO.
- `styles.css`: tokens de diseño y componentes.
- `app.js`: comportamiento (tablero animado, pestañas, modal de video, formulario).
- `brand/`: SVG oficiales del logo (claro y oscuro), isotipo y avatar para redes. No se publican en el sitio.
- `favicon.svg`: isotipo `< ia >` usado como ícono de la pestaña.
- `og-image.png`: imagen al compartir el link (1200x630). Se edita en `brand/og-image.html` y se regenera con `node brand/og-image.mjs` (requiere Chrome o Edge).
