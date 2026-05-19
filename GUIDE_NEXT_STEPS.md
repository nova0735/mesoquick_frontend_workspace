# 🚀 Guía de Handoff para Desarrolladores (Fase 1 Completada)

El objetivo de este documento es establecer el punto de partida para la Fase 2 de desarrollo. La infraestructura del monorepo y la orquestación base ya están configuradas. Tu único enfoque a partir de ahora debe ser la **lógica de negocio**.

---

## 1. Levantamiento del Proyecto

Para correr múltiples aplicaciones simultáneamente y evitar conflictos del tipo *"Port already in use"*, se han definido puertos específicos en los comandos de inicio. Ejecuta los siguientes comandos desde el contenedor o la raíz (dependiendo de tu entorno):

- **Comando para Login (Shell IdP):**
  `npm run dev -w "@mesoquick/shell-login" -- --port 5175`
- **Comando para App Repartidores:**
  `npm run dev -w "@mesoquick/app-repartidores" -- --port 5174`

---

## 2. Áreas de Trabajo por Desarrollador

- **Dev 2 (Pedidos y Tracking):** 
  Tu lienzo principal de trabajo es `DashboardPage.tsx`. Dentro del archivo, busca el marcador `[ÁREA DE INYECCIÓN]`. El componente `MapViewer` ya ha sido importado y está configurado como el fondo interactivo de la vista.

- **Devs 3 y 4 (Onboarding y Finanzas):** 
  Los archivos `WalletPage.tsx`, `SupportPage.tsx` y `ProfilePage.tsx` ya fueron creados y enrutados en el flujo de navegación. Tu misión es tomar estos cascarones vacíos e inyectar las *features* y *widgets* correspondientes.

---

## 3. Arquitectura y UI-KIT

- **Regla de Oro (Componentes):** Queda estrictamente prohibido crear componentes genéricos locales si estos ya existen en el paquete `@mesoquick/ui-kit`. Siempre revisa el UI Kit antes de construir un botón, modal o input desde cero.
- **Manejo de Sesión:** Toda la información sobre el estado de autenticación del usuario actual debe ser consumida a través del store orquestado en `entities/session`.

---

## 4. Estado del Monorepo

Se confirma que el refactor hacia la arquitectura **Feature-Sliced Design (FSD)** se ha completado de forma estricta. Las Public APIs (archivos `index.ts`) han sido saneadas a lo largo de todas las capas (*shared, entities, features, widgets, pages*). Recuerda importar siempre desde los barriles (`index.ts`) y nunca mediante rutas profundas para mantener el aislamiento entre capas.

¡Mucho éxito en el desarrollo de sus respectivos dominios!