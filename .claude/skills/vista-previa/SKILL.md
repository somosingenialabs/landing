---
name: vista-previa
description: Regenera la landing de Ingenia Solutions y la muestra en el navegador local para revisar cambios antes de publicarlos. Usar cuando el usuario pida ver, previsualizar, mostrar o revisar la página o un cambio.
---

# Vista previa de la landing

Objetivo: que el fundador vea la página tal como va a quedar publicada, sin publicar nada todavía.

1. Si hay cambios en `content.js`, `build.mjs` o `styles.css`, regenerá el sitio con `node build.mjs`. Si falla, explicá el error en palabras simples y corregilo antes de seguir.
2. Abrí la vista previa con el servidor "landing" de `.claude/launch.json` (corre `node serve.mjs` en http://localhost:5173). Si la herramienta de vista previa del navegador no está disponible, corré `node serve.mjs` en segundo plano y pasale al usuario el enlace http://localhost:5173 para abrirlo en su navegador.
3. Llevá la vista a la sección que cambió (por ejemplo `http://localhost:5173/#diagnostico`) y revisá:
   - que el texto nuevo se vea completo y sin errores de tipeo;
   - que no haya scroll horizontal en celular (ancho 375 px);
   - que la consola del navegador no muestre errores.
4. Contale al usuario qué ves, en dos o tres líneas, y preguntale si quiere publicarlo (eso es `/publicar`).

No hagas commit ni push en este paso.

Nota: el formulario de la vista previa envía solicitudes reales a Formspree (llegan a somos.ingenialabs@gmail.com y cuentan para el límite de 50 por mes). No lo envíes sin permiso del usuario.
