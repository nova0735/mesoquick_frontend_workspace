/**
 * Constantes de paths de la aplicación.
 * Centralizar las rutas aquí evita strings mágicos regados por el código.
 * Si una ruta cambia, solo se modifica en este archivo.
 */
export const ROUTES = {
  // Públicas
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/registro',

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

/**
 * Helpers para construir rutas con parámetros dinámicos.
 * Uso: buildRoute.businessDetail('123') → '/comercio/123'
 */
export const buildRoute = {
  businessDetail: (businessId: string) => `/comercio/${businessId}`,
  orderConfirmation: (orderId: string) => `/pedido/confirmacion/${orderId}`,
  orderTracking: (orderId: string) => `/pedidos/${orderId}/tracking`,
};