# Instala las herramientas para trabajar en la landing de Ingenia Solutions en Windows 10/11.
# Herramientas: Git, Node.js (LTS) y GitHub CLI. Usa winget (viene con Windows).
# Si alguna ya está instalada, la saltea. Windows puede pedir permiso de administrador: hay que aceptar.
# Uso: powershell -ExecutionPolicy Bypass -File setup\instalar-windows.ps1

$ErrorActionPreference = "Stop"

if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {
    Write-Host "No encontré winget. Instalá 'App Installer' desde Microsoft Store y volvé a correr este script." -ForegroundColor Red
    exit 1
}

$tools = @(
    @{ Name = "Git";        Command = "git";  Id = "Git.Git" },
    @{ Name = "Node.js";    Command = "node"; Id = "OpenJS.NodeJS.LTS" },
    @{ Name = "GitHub CLI"; Command = "gh";   Id = "GitHub.cli" }
)

foreach ($t in $tools) {
    if (Get-Command $t.Command -ErrorAction SilentlyContinue) {
        Write-Host "OK  $($t.Name) ya está instalado." -ForegroundColor Green
        continue
    }
    Write-Host "... Instalando $($t.Name)" -ForegroundColor Cyan
    winget install --id $t.Id --exact --silent --accept-source-agreements --accept-package-agreements
    if ($LASTEXITCODE -ne 0) {
        Write-Host "No se pudo instalar $($t.Name) (código $LASTEXITCODE)." -ForegroundColor Red
        exit 1
    }
}

# Recargar el PATH para usar las herramientas recién instaladas sin reiniciar
$env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")

Write-Host ""
Write-Host "Versiones instaladas:" -ForegroundColor Cyan
foreach ($c in @("git --version", "node --version", "gh --version")) {
    try { Write-Host ("  " + (Invoke-Expression $c | Select-Object -First 1)) }
    catch { Write-Host "  $c no responde todavía: cerrá y volvé a abrir Claude o la terminal." -ForegroundColor Yellow }
}
Write-Host ""
Write-Host "Listo. Siguiente paso: iniciar sesión en GitHub con 'gh auth login'." -ForegroundColor Green
