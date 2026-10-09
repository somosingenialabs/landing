---
name: publicar
description: Publica los cambios de la landing de Ingenia Solutions en https://ingenia.solutions (commit y push a main, que Netlify despliega solo) y verifica que hayan salido bien. Usar cuando el usuario pida publicar, subir, actualizar la web o poner online un cambio.
---

# Publicar la landing

Subir a `main` publica en producción en aproximadamente un minuto. Seguí estos pasos en orden y no saltees la confirmación.

1. **Traer lo último del equipo:** `git pull --rebase`. Si hay conflictos, frená y explicale al usuario qué archivos chocan; no los resuelvas a ciegas.
2. **Regenerar:** `node build.mjs`. Si cambió algo en `brand/`, también `node brand/export-images.mjs`.
3. **Revisar el texto** contra las reglas de `CLAUDE.md` (voseo, sin rayas largas, sin métricas o testimonios inventados).
4. **Mostrar el resumen:** corré `git status` y `git diff --stat`, y contale al usuario en lenguaje simple qué cambia en la página. Si todavía no lo vio en `/vista-previa`, ofrecéselo.
5. **Pedir confirmación explícita** ("¿Lo publico?"). Sin un sí claro, no sigas.
6. **Commit y push:**
   - `git add -A`
   - `git commit -m "<qué cambia, en español, una línea>"`
   - `git push`
   Nunca uses `--force` ni reescribas historial.
7. **Verificar en vivo:** esperá alrededor de un minuto y comprobá con `curl` que https://ingenia.solutions responda 200 y contenga el texto nuevo (reintentá cada 20 segundos, hasta unos 5 minutos). Si no aparece, revisá el último deploy en Netlify o avisale al usuario.
8. **Cerrar:** decile que ya está online y que, si no lo ve, recargue con Ctrl+F5 (Cmd+Shift+R en Mac).

Si `git push` falla por permisos, probablemente su cuenta de GitHub no tiene acceso de escritura a la organización `somosingenialabs`, o falta iniciar sesión con `gh auth login`. Explicáselo y no intentes otros caminos.
