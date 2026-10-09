# Guía para trabajar en la landing con Claude

Esta guía deja tu computadora lista para editar y publicar https://ingenia.solutions pidiéndoselo a Claude. No hace falta saber programar: Claude instala las herramientas, descarga el proyecto y hace los cambios. Vos revisás y decidís cuándo publicar.

Lleva unos 15 minutos la primera vez.

## Antes de empezar

1. **Cuenta de GitHub.** Si no tenés, creala gratis en https://github.com/signup.
2. **Acceso a la organización.** Pasale tu usuario de GitHub a un fundador que ya tenga acceso, para que te invite a `somosingenialabs` con permiso de escritura. Te llega un mail de invitación: aceptalo. Sin este paso podés ver y editar en tu computadora, pero no publicar.
3. **Claude de escritorio** con la pestaña **Code** (Claude Code). Si no la tenés: https://claude.ai/download

## Paso 1: crear la carpeta del proyecto

Creá una carpeta vacía llamada `Ingenia` en el Escritorio.

## Paso 2: abrir Claude en esa carpeta

Abrí Claude de escritorio → pestaña **Code** → elegí la carpeta `Ingenia` como carpeta de trabajo.

## Paso 3: pegarle esto a Claude

Copiá el texto completo de abajo y mandáselo como mensaje:

```text
Hola Claude. Soy cofundador de Ingenia Solutions y quiero dejar esta computadora lista para trabajar en la landing de la empresa. El proyecto está en https://github.com/somosingenialabs/landing (repositorio público de la empresa). No soy programador: explicame cada paso en palabras simples y pedime permiso antes de instalar algo.

1. Fijate si estoy en Windows o en Mac.
2. Instalá las herramientas con el script oficial del repositorio. Leelo antes de correrlo y contame qué hace:
   - Windows: https://raw.githubusercontent.com/somosingenialabs/landing/main/setup/instalar-windows.ps1 (correlo con: powershell -ExecutionPolicy Bypass -File instalar-windows.ps1)
   - Mac: https://raw.githubusercontent.com/somosingenialabs/landing/main/setup/instalar-mac.sh (correlo con: bash instalar-mac.sh)
   Después borrá el script descargado.
3. Cloná el repositorio dentro de esta carpeta (que está vacía) y trabajá desde ahí.
4. Pedime que inicie sesión en GitHub: lo hago yo en una terminal con "gh auth login" (GitHub.com, HTTPS, iniciar sesión con el navegador). Cuando te avise que terminé, corré "gh auth setup-git" y configurá git solo para este repositorio con mi nombre y con el email privado de mi cuenta de GitHub (el que termina en @users.noreply.github.com; sacalo con "gh api user").
5. Corré "node build.mjs", abrí la vista previa del sitio y leé el archivo CLAUDE.md.
6. Para terminar, contame en cinco líneas cómo te pido cambios y cómo publico.
```

Durante la instalación, Windows o Mac pueden pedirte permiso de administrador o tu contraseña: es normal, aceptá.

## Paso 4: iniciar sesión en GitHub

Cuando Claude te lo pida:

1. Abrí una terminal: en Claude de escritorio, el panel **Terminal**; si no, PowerShell en Windows o la app Terminal en Mac.
2. Escribí `gh auth login` y respondé: **GitHub.com** → **HTTPS** → **Yes** → **Login with a web browser**.
3. Copiá el código que aparece, pegalo en la página de GitHub que se abre y autorizá.
4. Volvé a Claude y avisale que terminaste.

## El día a día

Abrí Claude de escritorio → **Code** → carpeta `Ingenia` (o la subcarpeta del proyecto que creó Claude). Después pedile las cosas como se las pedirías a una persona:

- "Cambiá el título del hero por: …"
- "Agregá Logística y Transporte a la lista de sectores."
- "Cargá este video de YouTube en la demo de CRM: <link>"
- "Mostrame cómo queda en celular."

Dos comandos útiles:

- **`/vista-previa`**: regenera la página y te la muestra, sin publicar nada.
- **`/publicar`**: te resume qué cambia, te pide confirmación y lo sube a https://ingenia.solutions. Tarda un minuto. Si no ves el cambio, recargá con Ctrl+F5 (Cmd+Shift+R en Mac).

## Para tener en cuenta

- **Publicar es inmediato:** lo que confirmás en `/publicar` queda online para todos.
- **Trabajamos tres sobre lo mismo:** Claude baja los cambios de los demás antes de publicar. Si te avisa de un conflicto, frená y coordiná con el resto.
- **El formulario es real:** si lo enviás en la vista previa, llega un mail a somos.ingenialabs@gmail.com y consume uno de los 50 envíos gratuitos del mes.
- **Si algo sale mal:** todo queda guardado en GitHub y cualquier versión anterior se puede recuperar. Pedile a Claude "mostrame los últimos cambios publicados" o escribile al resto del equipo.
