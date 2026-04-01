# MesoQuick Frontend Workspace

Este es el Monorepo oficial para el Frontend de MesoQuick.

## Requisitos
* Git (Configurado para respetar saltos de línea LF)
* Docker Engine & Docker Compose V2

**Nota:** No necesitas Node.js instalado en tu computadora física. Todo corre en Docker.

## Instrucciones de Inicio Rápido

1. Clona el repositorio:
   `git clone <URL_DEL_REPOSITORIO>`
   `cd mesoquick_frontend_workspace`

2. Configura las variables de entorno:
   Antes de levantar la aplicación, debes crear tu archivo de entorno local a partir de la plantilla proporcionada. 
   (Ejemplo para Repartidores):
   `cp apps/app-repartidores/.env.example apps/app-repartidores/.env`

3. Levanta la infraestructura de contenedores:
   `docker compose up -d --build`

4. Instala las dependencias (dentro del contenedor):
   Instala los paquetes de NPM ejecutando la orden hacia el interior del ecosistema virtual.
   `docker compose exec frontend-dev npm install`

   ## Contingencia para Linux Host:  
   Si este comando falla arrojando un error de permisos (EACCES), el sistema de archivos ha bloqueado la creación del directorio node_modules. Ejecuta `sudo chown -R $USER:$USER .` en tu terminal local y repite este paso.


5. Inicia la aplicación en la que estás trabajando (ejemplo Repartidores):
   `docker compose exec frontend-dev npm run dev -w @mesoquick/app-repartidores`

6. Abre tu navegador en `http://localhost:5173`


----------------------------------------------------------------------------------------------------------------------

## Topología del Monorepo

El código se organiza mediante NPM Workspaces, dividiendo el ecosistema en dos dominios estrictamente aislados:

mesoquick_frontend_workspace/
├── apps/                        # Aplicaciones Ejecutables (Aisladas)
│   ├── app-repartidores/        # Interfaz de mensajeros (Rastreo, Billetera)
│   ├── shell-login/             # IdP: Orquestador central de autenticación
│   └── ...
├── packages/                    # Internal SDK (Agnóstico al negocio)
│   ├── core-network/            # Instancia global Axios y Sockets (WSS)
│   ├── ui-kit/                  # Brandbook, Tailwind y Componentes Puros
│   └── ts-config/               # Reglas estrictas de TypeScript
└── docker-compose.yml           # Orquestador maestro

## Regla de Importación: 

   Los módulos dentro de apps/ pueden importar dependencias de packages/. 
   
   ## Queda terminantemente prohibido que una aplicación importe código de otra aplicación, o que un paquete importe código de una aplicación.


## Directivas Operativas

1. Gestión de Paquetes:
   Para instalar una nueva librería, utiliza siempre el contenedor.
   `docker compose exec frontend-dev npm install <paquete> -w @mesoquick/<app>`

2. Evasión de CORS:
   El Frontend nunca debe apuntar a URLs absolutas (ej. http://localhost:8000). Utiliza rutas relativas (/api/... o /ws/...). El proxy inverso de Vite interceptará este tráfico y lo enviará al Gateway interno de la red Docker.

3. Feature-Sliced Design:
   El directorio src/ de cada aplicación debe respetar el flujo unidireccional de capas: app/ -> pages/ -> widgets/ -> features/ -> entities/ -> shared/. Una feature jamás debe importar a otra feature.