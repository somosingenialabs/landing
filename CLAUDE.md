# Landing de Ingenia Solutions

Sitio: https://ingenia.solutions · Repo: https://github.com/somosingenialabs/landing (público)

## Con quién trabajás

Este proyecto lo mantienen los tres fundadores de Ingenia Solutions (ingenieros mecánico, electromecánico e industrial). Algunos no son programadores:

- Hablá en español rioplatense (voseo), con palabras simples. Evitá jerga técnica o explicala en una línea.
- Antes de cambiar algo, contá en una o dos frases qué vas a hacer.
- Al terminar, mostrá el resultado en la vista previa (`/vista-previa`) en vez de describir código.
- Publicar es una acción aparte que siempre se confirma (`/publicar`).

## Cómo funciona

- Sitio estático (HTML, CSS y JS sin frameworks ni dependencias). Solo hace falta Node.js.
- **Todo el texto vive en `content.js`.** `node build.mjs` genera `index.html`, `privacidad/index.html`, `404.html`, `robots.txt` y `sitemap.xml`. **Nunca edites esos HTML a mano:** se pisan en cada build.
- Vista previa local: `node serve.mjs` → http://localhost:5173 (configurado como "landing" en `.claude/launch.json`).
- **Push a `main` = publicación en producción.** Netlify (cuenta compartida de los fundadores) corre el build de `netlify.toml` y publica la carpeta `dist/` en ~1 minuto.

| Archivo | Para qué |
|---|---|
| `content.js` | Textos, sectores, soluciones, métricas, videos, formulario, política de privacidad |
| `build.mjs` | Arma el HTML para SEO a partir de `content.js` |
| `styles.css` | Tokens de marca y estilos |
| `app.js` | Comportamiento: tablero animado, pestañas, modal de video, formulario |
| `serve.mjs` | Servidor de vista previa local |
| `brand/` | Logos SVG oficiales y el HTML fuente de `og-image.png` y `apple-touch-icon.png` (`node brand/export-images.mjs`, requiere Chrome o Edge) |
| `netlify.toml` | Build y archivos que se publican. Si agregás un archivo que el sitio necesita, sumalo a la lista de `cp` |

## Pedidos frecuentes

- **Cambiar un texto:** editá `content.js` → `node build.mjs` → `/vista-previa`.
- **Cargar un video de demo:** completá `videoSrc` en `solutions` de `content.js` (URL embed de YouTube/Vimeo o un `.mp4`; si es `.mp4`, agregalo también a `netlify.toml`).
- **Sumar una sección o componente nuevo:** se arma en `build.mjs` + `styles.css` con los datos en `content.js`. Respetá el sistema de marca de abajo.
- **Publicar:** `/publicar`.

## Reglas de contenido

- Voseo en todo el texto visible ("Pedí", "Coordiná", "querés").
- No usar rayas largas (— ni –). Usar punto, coma, dos puntos o guion común.
- No inventar métricas, clientes, testimonios ni nombres. Las métricas actuales (-20%, -60%, -70%) están marcadas como "resultados esperados de referencia"; si llegan datos reales, reemplazarlas y ajustar la nota.
- Si se agrega analítica, cookies o un servicio nuevo que reciba datos de visitantes, actualizar la política de privacidad (`privacy` en `content.js`): hoy dice que no hay cookies de seguimiento.

## Sistema de marca

- Modo oscuro "Dark Tech": canvas `#080C14`, superficie `#111827`, elevada `#162032`, bordes `#1F2937` / `#25334A`, texto `#F8FAFC` / `#94A3B8`.
- Acento cian `#38BDF8`, degradado de marca `#38BDF8 → #06B6D4`, azul de botones `#2563EB`. Ámbar `#F59E0B` y verde `#10B981` solo para datos (alertas y ahorro).
- Tipografía: Plus Jakarta Sans (400 a 800). JetBrains Mono solo para etiquetas de datos tipo `[ OEE METRICS ]`.
- Logo: `ingen` + `< ia >` y debajo `· SOLUTIONS ·`. El `<` nunca toca la `n`; los chevrones respiran respecto a `ia`. Ya está implementado en CSS (`.logo`); reutilizalo, no lo redibujes.

## Servicios y cuentas

- **Formulario:** Formspree, endpoint en `content.js` (`form.endpoint`), cuenta de somos.ingenialabs@gmail.com. Plan gratuito: 50 envíos por mes. **No envíes el formulario para probar sin permiso del usuario:** llega un mail real y consume cupo.
- **Hosting:** Netlify, proyecto `ingenialabs`, conectado a este repo.
- **Dominio y DNS:** Hostinger (`ingenia.solutions`: registro A a `75.2.60.5`, `www` CNAME a `ingenialabs.netlify.app`). No tocar sin necesidad.

## Pendientes conocidos

- Videos de las tres demos (`videoSrc` vacío: el modal muestra "Estamos terminando de grabar esta demo").
- Nombres, fotos y LinkedIn de los fundadores en la sección de equipo.
- Casos o testimonios con resultados reales.
- Número de WhatsApp para un botón de contacto.
- Razón social y CUIT en la política de privacidad (`privacy.legalName` y `privacy.taxId`), y revisión legal del texto.
