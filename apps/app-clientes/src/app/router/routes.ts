/**
 * 🛣️ Cambios al archivo: src/app/router/routes.ts
 *
 * Solo agregar UNA línea en el bloque "Públicas":
 *
 *   LOGIN: '/login',
 *
 * El archivo final queda así (las líneas marcadas con ➕ son nuevas):
 */

export const ROUTES = {
  // Públicas
  HOME: '/',
  REGISTER: '/registro',
  LOGIN: '/login',           // ➕ NUEVO

  // Catálogo
  CATALOG: '/catalogo',
  BUSINESS_DETAIL: '/comercio/:businessId',

  // Carrito y checkout
  CART: '/carrito',
  CHECKOUT: '/checkout',
  ORDER_CONFIRMATION: '/pedido/confirmacion/:orderId',

  // Pedidos
  ORDERS: '/pedidos',
  ORDER_TRACKING: '/pedidos/:orderId/tracking',

  // Perfil
  PROFILE: '/perfil',
  PROFILE_EDIT: '/perfil/editar',

  // Soporte
  SUPPORT: '/soporte',
  CHATBOT: '/soporte/chatbot',
  AGENT_CHAT: '/soporte/agente',

  // Error
  NOT_FOUND: '*',
} as const;

export const buildRoute = {
  businessDetail: (businessId: string) => `/comercio/${businessId}`,
  orderConfirmation: (orderId: string) => `/pedido/confirmacion/${orderId}`,
  orderTracking: (orderId: string) => `/pedidos/${orderId}/tracking`,
};