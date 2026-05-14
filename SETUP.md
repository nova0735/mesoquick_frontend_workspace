# 🚀 Guía de inicio rápido — UI Clientes Mesoquick

¡Bienvenido al equipo! Esta guía te lleva paso a paso desde cero hasta tener tu ambiente de desarrollo funcionando en **Windows**.

**Tiempo estimado:** 15-20 minutos.

---

## 📑 Tabla de contenidos

1. [Requisitos previos](#1-requisitos-previos)
2. [Aceptar invitación al repo](#2-aceptar-invitación-al-repo)
3. [Clonar el repositorio](#3-clonar-el-repositorio)
4. [Configurar Git](#4-configurar-git)
5. [Cambiarte a tu rama asignada](#5-cambiarte-a-tu-rama-asignada)
6. [Sincronizar con main](#6-sincronizar-con-main)
7. [Instalar dependencias](#7-instalar-dependencias)
8. [Verificar que funciona](#8-verificar-que-funciona)
9. [Abrir en VSCode](#9-abrir-en-vscode)
10. [Flujo diario de trabajo](#10-flujo-diario-de-trabajo)
11. [Convención de commits](#11-convención-de-commits)
12. [Reglas que NO debés romper](#12-reglas-que-no-debés-romper)
13. [Cómo trabajar con Claude](#13-cómo-trabajar-con-claude)
14. [Problemas comunes](#14-problemas-comunes)

---

## 1. Requisitos previos

Asegurate de tener instalado en tu Windows:

| Herramienta | Link de descarga | Comando para verificar |
|-------------|------------------|------------------------|
| **Git para Windows** | https://git-scm.com/download/win | `git --version` |
| **Node.js 18 o superior** | https://nodejs.org/ (versión LTS) | `node --version` |
| **VSCode** (recomendado) | https://code.visualstudio.com/ | `code --version` |

Para verificar las instalaciones:

1. Abrí **PowerShell** (presioná tecla Windows, escribí "PowerShell", Enter).
2. Pegá cada comando y presioná Enter.

Deberías ver versiones de las 3 herramientas. Si alguna tira error, instalala con el link correspondiente.

También necesitás una cuenta de **GitHub**. Si no tenés, creala en https://github.com/signup.

---

## 2. Aceptar invitación al repo

Heather te envió una invitación por GitHub. Para aceptarla:

1. Revisá tu email del que registraste en GitHub.
2. O entrá directamente a: `https://github.com/AngelOvalle29/mesoquick-app-clientes/invitations`
3. Hacé clic en **"Accept invitation"**.

**Sin esto, no podés clonar el repo.**

---

## 3. Clonar el repositorio

Abrí **PowerShell** y navegá a la carpeta donde querés guardar el proyecto. Por ejemplo, en Documentos:

```powershell
cd C:\Users\TuUsuario\Documents
```

(Reemplazá `TuUsuario` con tu nombre de usuario de Windows)

Cloná el repo:

```powershell
git clone https://github.com/AngelOvalle29/mesoquick-app-clientes.git
```

Entrá a la carpeta:

```powershell
cd mesoquick-app-clientes
```

---

## 4. Configurar Git

**Solo la primera vez** en esta computadora, configurá tu identidad en Git. Esto es para que tus commits aparezcan con tu nombre:

```powershell
git config --global user.name "Tu Nombre Completo"
git config --global user.email "tu-email-de-github@example.com"
```

**Importante:** usá el **mismo email** que tenés en GitHub.

---

## 5. Cambiarte a tu rama asignada

Cada integrante tiene una rama específica:

| Persona | Rama asignada |
|---------|---------------|
| **Heather** (líder técnica) | `main` |
| **Persona 1** (Catálogo) | `feature/catalogo` |
| **Persona 2** (Carrito + Checkout) | `feature/cart-checkout` |
| **Persona 3** (Pedidos + Auth) | `feature/orders-auth` |

Traé todas las ramas desde el remoto:

```powershell
git fetch origin
```

Cambiate a tu rama (reemplazá `[tu-rama]` con la que te corresponde):

```powershell
git checkout feature/[tu-rama]
```

**Ejemplo si sos Persona 1:**

```powershell
git checkout feature/catalogo
```

---

## 6. Sincronizar con main

Tu rama puede estar atrás de `main` (que tiene la base completa hecha por Heather). Sincronizala:

```powershell
git merge origin/main
```

Esto trae todo el trabajo base a tu rama sin perder nada.

---

## 7. Instalar dependencias

```powershell
npm install
```

Esto descarga todas las librerías necesarias (React, TypeScript, Tailwind, etc.) en la carpeta `node_modules/`.

**Puede tomar 1-2 minutos.** No cierres PowerShell hasta que termine.

---

## 8. Verificar que funciona

Levantá el servidor de desarrollo:

```powershell
npm run dev
```

Deberías ver algo como:

```
VITE v5.x ready in 400 ms
➜ Local: http://localhost:5173/
```

Abrí esa URL en tu navegador. **Si ves la home de Mesoquick** con el hero morado y los comercios destacados, ¡todo está funcionando! 🎉

Para detener el servidor: `Ctrl + C` en PowerShell, después confirmás con `S` + Enter.

---

## 9. Abrir en VSCode

Desde PowerShell, estando en la carpeta del proyecto:

```powershell
code .
```

Si `code` no funciona desde PowerShell, abrí VSCode manualmente:

**File → Open Folder → seleccioná `mesoquick-app-clientes/`**

### Extensiones recomendadas para VSCode

Instalá estas extensiones desde el panel de extensiones (Ctrl + Shift + X):

- **ESLint** (Microsoft)
- **Tailwind CSS IntelliSense** (Tailwind Labs)
- **ES7+ React/Redux/React-Native snippets**
- **GitLens** (opcional, ayuda con Git)

---

## 10. Flujo diario de trabajo

### Cuando empezás el día

```powershell
# Asegurate de estar en tu rama
git checkout feature/[tu-rama]

# Traé lo último de main (por si Heather mergeó cambios nuevos)
git pull origin main
```

### Mientras programás

Editá archivos en VSCode normalmente. El servidor de Vite (`npm run dev`) recarga automáticamente cuando guardás.

**Mantené dos ventanas abiertas:**
- VSCode (para editar código)
- PowerShell con `npm run dev` corriendo (para que la app esté en vivo)

### Cuando termines una tarea

```powershell
# Ver qué archivos cambiaron
git status

# Agregar todos los cambios
git add .

# Hacer commit con mensaje claro
git commit -m "feat(area): descripción de lo que hiciste"

# Subir tu rama remota
git push origin feature/[tu-rama]
```

### Cuando quieras mergear a main

1. Andá a `https://github.com/AngelOvalle29/mesoquick-app-clientes`.
2. Te aparece un banner amarillo "Open Pull Request" → clic.
3. Completá:
   - **Title:** `feat(area): descripción`
   - **Description:** breve explicación + screenshots si es visual
4. Asignále el PR a **Heather** como reviewer.
5. Esperá a que ella revise y mergee.

---

## 11. Convención de commits

Usamos **Conventional Commits** para que el historial sea ordenado:

| Prefijo | Cuándo usarlo |
|---------|---------------|
| `feat(area)` | Nueva funcionalidad |
| `fix(area)` | Corrección de bug |
| `refactor(area)` | Reorganización sin cambiar comportamiento |
| `style(area)` | Cambios visuales o de formato |
| `docs(area)` | Documentación |
| `chore(area)` | Configuración, dependencias |

**Ejemplos según tu rol:**

Persona 1 (Catálogo):

```
feat(catalog): agrega BusinessCard con rating y delivery time
fix(catalog): corrige filtro de comercios cerrados
```

Persona 2 (Carrito + Checkout):

```
feat(cart): implementa regla del comercio único
feat(checkout): agrega paso de selección de dirección
```

Persona 3 (Pedidos + Auth):

```
feat(orders): agrega tracking en tiempo real con setInterval
feat(auth): formulario de registro con validaciones
```

---

## 12. Reglas que NO debés romper

⚠️ **Estas reglas son críticas para que el equipo funcione:**

1. **NO hagas push directo a `main`.** Siempre via Pull Request.

2. **NO modifiques archivos fuera de tus carpetas asignadas.** Está PROHIBIDO tocar:
   - `src/app/` (router, layouts, providers)
   - `src/shared/` (UI, types, mocks, lib, hooks, api)
   - `src/features/support/` (soporte)
   - Las features de otros compañeros

3. **NO instales paquetes nuevos sin avisar a Heather.** Coordiná primero por chat.

4. **NO subas `node_modules/`** (ya está en `.gitignore`, pero verificá).

5. **NO trabajes en la rama de otra persona.** Cada quien en la suya.

6. **Si necesitás algo de `shared/ui` o del router que no existe**, pedíselo a Heather. NO lo crees vos.

7. **Imports siempre con alias** (`@shared/...`, `@features/...`), nunca rutas relativas largas (`../../../`).

8. **Estilos solo con Tailwind** usando las variables del proyecto (`bg-accent`, `text-text-heading`, etc.). Nada de colores hardcodeados.

---

## 13. Cómo trabajar con Claude

Heather te envió un **prompt específico** para tu rol. Funciona así:

### Cada vez que vayas a trabajar

1. Abrí Claude (gratis o pro, da igual).
2. Empezás una **conversación nueva** (botón "+" en la barra lateral).
3. **Pegás el prompt completo** que te corresponde como primer mensaje.
4. Esperás a que Claude responda algo como "vamos con la primera tarea".
5. Vas pidiendo lo que necesités y siguiendo paso a paso.

### Reglas para usar Claude bien

- **Si Claude se confunde o sugiere cosas raras**, abrí una conversación nueva y volvé a pegar el prompt. Eso lo "resetea".

- **Antes de pegar código a tu proyecto**, leélo. Si menciona componentes o archivos que NO existen en `shared/`, avisá a Heather.

- **Los primeros 2-3 días, pasale el código a Heather** antes de hacer commit. Ella te confirma que respeta las convenciones. Después podés volar sola/o.

- **No le pidas a Claude que toque archivos fuera de tu carpeta.** Si Claude te sugiere modificar algo en `shared/` o `app/`, ignorá la sugerencia y pedíselo a Heather.

---

## 14. Problemas comunes

### "npm install" tira errores

Probá borrar y reinstalar:

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install
```

Si sigue fallando, verificá que Node.js esté actualizado a versión 18 o superior con `node --version`.

### "git push" me pide usuario y contraseña

GitHub ya no acepta contraseñas. Necesitás un **Personal Access Token (PAT):**

1. GitHub → tu avatar (arriba a la derecha) → **Settings**.
2. Bajá hasta **"Developer settings"** (al final del menú izquierdo).
3. **Personal access tokens → Tokens (classic)**.
4. **Generate new token (classic)**.
5. Nombre: "Mi laptop" (o lo que quieras).
6. Expiración: 90 días.
7. Marcá el scope **`repo`** (todo el grupo).
8. **Generate token** → **copialo inmediatamente** (solo se muestra una vez).
9. Cuando Git te pida contraseña, pegá ese token.

### El servidor `npm run dev` no levanta

Verificá que estés en la carpeta correcta:

```powershell
Get-Location
```

La ruta debe terminar en `\mesoquick-app-clientes`. Si no, navegá ahí primero con `cd`.

### Tengo conflictos al hacer merge o pull

**Avisá a Heather antes de intentar resolverlos sola/o.** Los conflictos en Git son delicados y mal resueltos pueden borrar trabajo. Mejor pedir ayuda.

### El puerto 5173 está ocupado

Vite va a usar otro automáticamente (5174, 5175, etc.). Mirá la URL en PowerShell cuando arranca el servidor.

### VSCode marca todo en rojo

Si VSCode marca errores raros en archivos que no tocaste, probá:

1. Cerrá VSCode.
2. Abrílo de nuevo.
3. Esperá 30 segundos a que TypeScript termine de cargar.

Si sigue, abrí la paleta de comandos (`Ctrl + Shift + P`) y buscá **"TypeScript: Restart TS Server"**.

### PowerShell no me deja ejecutar scripts

Si te sale un error tipo "execution of scripts is disabled", abrí PowerShell **como administrador** y corré:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Confirmá con `S` + Enter. Eso permite ejecutar scripts locales.

### El comando `code .` no funciona

Si VSCode no se abre con `code .`, necesitás agregarlo al PATH:

1. Abrí VSCode manualmente.
2. Paleta de comandos (`Ctrl + Shift + P`).
3. Buscá: **"Shell Command: Install 'code' command in PATH"**.
4. Cerrá y abrí PowerShell de nuevo.
5. Probá `code .` otra vez.

---

## 📞 Contacto

Si algo no funciona y no está en esta guía, escribíle a **Heather** con:

1. **Qué estabas intentando hacer** (paso exacto).
2. **Qué error te salió** (screenshot ideal).
3. **Comando exacto que corriste** (copialo de PowerShell).

---

## ✅ Checklist final

Antes de empezar a programar, verificá:

- [ ] Tengo Git, Node.js y VSCode instalados.
- [ ] Acepté la invitación al repo en GitHub.
- [ ] Cloné el repo correctamente en mi PC.
- [ ] Configuré Git con mi nombre y email.
- [ ] Estoy en mi rama asignada.
- [ ] Hice `git merge origin/main` para sincronizar.
- [ ] `npm install` corrió sin errores.
- [ ] `npm run dev` levanta la app y veo la home de Mesoquick.
- [ ] Tengo el prompt de Claude listo para mi rol.

**Cuando todo lo de arriba esté ✅, ¡estás lista/o para programar!** 🚀

---

**Universidad Mesoamericana — Facultad de Ingeniería — Arquitectura de Sistemas II — 2026**