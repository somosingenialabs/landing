# Ingenia Solutions · Landing

Landing de [ingenia.solutions](https://ingenia.solutions). HTML, CSS y JS estáticos, sin dependencias. Solo hace falta Node.js.

**¿Primera vez en esta computadora?** Seguí la [Guía para fundadores](GUIA-FUNDADORES.md): Claude instala todo y deja el proyecto listo.

## Editar textos

1. Cambiá el contenido en `content.js` (textos, sectores, métricas, videos, formulario).
2. Regenerá el sitio: `node build.mjs` (escribe `index.html`, `privacidad/index.html`, `404.html`, `robots.txt` y `sitemap.xml`).
3. No edites esos HTML a mano: se sobrescriben en cada build. La política de privacidad también se edita en `content.js` (sección `privacy`).

## Ver en local

```bash
node build.mjs
node serve.mjs
```

Abrir http://localhost:5173 (en Claude: `/vista-previa`).

## Publicación

Netlify publica automáticamente cada push a `main`. La configuración está en `netlify.toml`
(corre `node build.mjs` y publica la carpeta `dist/`). En Claude: `/publicar`.

## Archivos

- `content.js`: todo el contenido editable.
- `build.mjs`: genera el HTML estático para SEO.
- `styles.css`: tokens de diseño y componentes.
- `app.js`: comportamiento (tablero animado, pestañas, modal de video, formulario).
- `serve.mjs`: vista previa local.
- `CLAUDE.md` y `.claude/`: instrucciones y comandos (`/vista-previa`, `/publicar`) para trabajar con Claude.
- `setup/`: scripts que instalan Git, Node.js y GitHub CLI en Windows o Mac.
- `brand/`: SVG oficiales del logo (claro y oscuro), isotipo y avatar para redes. No se publican en el sitio.
- `favicon.svg`: isotipo `< ia >` usado como ícono de la pestaña.
- `og-image.png` y `apple-touch-icon.png`: imagen al compartir el link (1200x630) e ícono para iPhone (180x180). Se editan en `brand/og-image.html` y `brand/apple-touch-icon.html`, y se regeneran con `node brand/export-images.mjs` (requiere Chrome o Edge).
