# Guía para trabajar en la landing con Claude

Esta guía deja tu computadora lista para editar y publicar https://ingenia.solutions pidiéndoselo a Claude. No hace falta saber programar: Claude te acompaña paso a paso a crear tu cuenta de GitHub, instala las herramientas, descarga el proyecto y después hace los cambios que le pidas. Vos revisás y decidís cuándo publicar.

La primera vez lleva entre 20 y 30 minutos, más lo que tarde en llegarte la invitación de acceso.

## Antes de empezar

1. **Claude de escritorio** con la pestaña **Code** (Claude Code). Si no lo tenés: https://claude.ai/download
2. **Una carpeta vacía** llamada `Ingenia` en el Escritorio.
3. Abrí Claude de escritorio → pestaña **Code** → elegí la carpeta `Ingenia` como carpeta de trabajo.

## Pegale este mensaje a Claude

Copiá el texto completo de abajo y mandáselo como primer mensaje. Claude va a ir de a un paso por vez y te va a esperar entre cada uno.

```text
Hola Claude. Soy cofundador de Ingenia Solutions, una empresa de ingeniería y software para PYMEs industriales. Quiero dejar esta computadora lista para trabajar en la página web de la empresa (https://ingenia.solutions), cuyo proyecto está en el repositorio público https://github.com/somosingenialabs/landing. No soy programador.

Cómo quiero que trabajes:
- Guiame de a UN paso por vez. Al terminar cada paso, decime qué cambió y esperá a que te confirme antes de seguir.
- Explicame todo en español rioplatense y con palabras simples. Si usás un término técnico, aclaralo en una línea.
- Pedime permiso antes de instalar o descargar algo, y contame qué es.
- Las cuentas y contraseñas las manejo yo: nunca me pidas una contraseña ni un código de verificación. Vos me decís qué hacer y yo lo hago en el navegador.
- Si algo falla, no pruebes atajos raros: explicame qué pasó y qué opciones tengo.

Pasos:

1. Revisá en qué sistema estoy (Windows o Mac) y contame el plan completo en cinco líneas antes de arrancar.

2. Cuenta de GitHub. Preguntame si ya tengo una.
   - Si no tengo: guiame para crearla en https://github.com/signup (plan gratuito). Ayudame a elegir un nombre de usuario profesional y fácil de reconocer (por ejemplo nombre-apellido). Avisame que GitHub me va a mandar un código por mail para verificar la cuenta.
   - Después guiame para activar la verificación en dos pasos (Settings > Password and authentication), recomendando una app de autenticación en el celular, y para guardar los códigos de recuperación en un lugar seguro.
   - Guiame para que mi email sea privado en los cambios que publique (Settings > Emails > "Keep my email addresses private").
   - Cuando tenga la cuenta, preguntame el nombre de usuario y escribime un mensaje corto de WhatsApp para pedirle a mis socios que me den acceso de escritura al repositorio somosingenialabs/landing. Mientras espero la invitación, seguimos con el paso 3.

3. Instalá las herramientas con el script oficial del repositorio. Primero descargalo, leelo y explicame qué va a instalar:
   - Windows: https://raw.githubusercontent.com/somosingenialabs/landing/main/setup/instalar-windows.ps1 (se corre con: powershell -ExecutionPolicy Bypass -File instalar-windows.ps1)
   - Mac: https://raw.githubusercontent.com/somosingenialabs/landing/main/setup/instalar-mac.sh (se corre con: bash instalar-mac.sh). Si falta Homebrew, mostrame la línea para instalarlo y la ejecuto yo en la app Terminal, porque pide la contraseña de la Mac.
   Avisame que la computadora puede pedirme permiso de administrador. Al terminar, borrá el script descargado y mostrame las versiones instaladas.

4. Cloná el repositorio dentro de esta carpeta (que está vacía) y trabajá desde ahí de ahora en adelante.

5. Conectar esta computadora con mi cuenta de GitHub. Pedime que corra yo "gh auth login" en una terminal (en Claude de escritorio, el panel Terminal; si no, PowerShell en Windows o la app Terminal en Mac) y explicame qué responder: GitHub.com, HTTPS, Yes, Login with a web browser; después copio el código que aparece y lo pego en la página de GitHub. Cuando te avise que terminé:
   - corré "gh auth setup-git";
   - configurá git solo para este repositorio con mi nombre y el email privado de mi cuenta (el que termina en @users.noreply.github.com; sacalo con "gh api user").

6. Verificá mi acceso con "gh repo view somosingenialabs/landing --json viewerPermission". Tiene que decir WRITE o ADMIN. Si dice READ, la invitación todavía no está aceptada o no llegó: recordame que revise el mail de GitHub y la acepte, y volvé a verificar cuando te avise.

7. Corré "node build.mjs", abrime la vista previa del sitio y leé el archivo CLAUDE.md del proyecto.

8. Para cerrar, explicame en cinco líneas cómo te pido cambios, cómo los veo antes de publicar (/vista-previa) y cómo los publico (/publicar). No publiques nada todavía.
```

## Lo que vas a hacer vos durante el proceso

Claude te va a ir indicando cada cosa. Para que no te sorprenda:

- **Crear la cuenta de GitHub** en el navegador: email, contraseña, nombre de usuario y el código que te llega por mail.
- **Activar la verificación en dos pasos** con una app en el celular (Google Authenticator, Microsoft Authenticator o similar) y guardar los códigos de recuperación.
- **Mandarles tu usuario a tus socios** para que te den acceso, y **aceptar la invitación** que te llega por mail de GitHub.
- **Aceptar los permisos de administrador** cuando Windows o Mac los pidan durante la instalación.
- **Iniciar sesión** con `gh auth login` en una terminal, cuando Claude te lo pida.

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
