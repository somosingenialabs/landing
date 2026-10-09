#!/bin/bash
# Instala las herramientas para trabajar en la landing de Ingenia Solutions en macOS.
# Herramientas: Git, Node.js (LTS) y GitHub CLI, con Homebrew.
# Si alguna ya está instalada, la saltea.
# Uso: bash setup/instalar-mac.sh

set -e

if ! command -v brew >/dev/null 2>&1; then
  echo "Falta Homebrew (el instalador de programas de Mac)."
  echo "Instalalo vos desde la app Terminal pegando esta línea (te va a pedir la contraseña de la Mac):"
  echo ""
  echo '  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"'
  echo ""
  echo "Después volvé a correr este script."
  exit 1
fi

install_if_missing() {
  local name="$1" cmd="$2" formula="$3"
  if command -v "$cmd" >/dev/null 2>&1; then
    echo "OK  $name ya está instalado."
  else
    echo "... Instalando $name"
    brew install "$formula"
  fi
}

install_if_missing "Git" git git
install_if_missing "Node.js" node node@22
install_if_missing "GitHub CLI" gh gh

# node@22 es "keg-only": se enlaza para que quede disponible como 'node'
if ! command -v node >/dev/null 2>&1; then
  brew link --overwrite --force node@22
fi

echo ""
echo "Versiones instaladas:"
git --version
node --version
gh --version | head -1
echo ""
echo "Listo. Siguiente paso: iniciar sesión en GitHub con 'gh auth login'."
