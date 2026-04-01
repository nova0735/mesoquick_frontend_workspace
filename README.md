# MesoQuick Frontend Workspace

Este es el Monorepo oficial para el Frontend de MesoQuick.

## Requisitos
* Git
* Docker Engine & Docker Compose V2

**Nota:** No necesitas Node.js instalado en tu computadora física. Todo corre en Docker.

## Instrucciones de Inicio Rápido

1. Clona el repositorio:
   `git clone <URL_DEL_REPOSITORIO>`
   `cd mesoquick_frontend_workspace`

2. Levanta la infraestructura de contenedores:
   `docker compose up -d --build`

3. Instala las dependencias (dentro del contenedor):
   `docker compose exec frontend-dev npm install`

4. Inicia la aplicación en la que estás trabajando (ejemplo Repartidores):
   `docker compose exec frontend-dev npm run dev -w @mesoquick/app-repartidores`

5. Abre tu navegador en `http://localhost:5173`
