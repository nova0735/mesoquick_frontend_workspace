/**
 * ⚙️ SHARED LAYER: App Registry
 * Centraliza los enlaces, puertos y configuración estática de las apps satélite.
 */

export const REGISTRATION_LINKS = [
  {
    id: 'courier',
    label: 'Soy Repartidor',
    // 🔥 CORREGIDO: Redirección dinámica al registro en producción
    url: `${import.meta.env.VITE_APP_REPARTIDORES_URL || 'https://mesoquick-repartidores.vercel.app'}/registro`, 
    color: '#56bd64' // Verde MesoQuick
  },
  /*{
    id: 'customer',
    label: 'Soy Cliente',
    url: 'http://localhost:5175/registro', // Hipotética app de clientes
    color: '#3c606b' // Azul MesoQuick
  }*/
];

/**
 * Mapa de despacho post-login: rol del usuario → URL destino en la app correspondiente.
 *
 * El LoginForm consulta este mapa después de autenticar para enviar al usuario a su
 * app. Cada equipo agrega su entrada aquí sin tocar la lógica del LoginForm.
 *
 * Nota: las keys aceptan tanto formato corto en mayúsculas ("AGENT") como
 * minúsculas en español ("agente") porque el broker no estandarizó el shape del rol.
 */
export const ROLE_TO_APP_URL: Record<string, string> = {
  // Repartidores (app-repartidores)
  // 🔥 CORREGIDO: Cuando inicien sesión con éxito, irán al dashboard en producción
  COURIER: `${import.meta.env.VITE_APP_REPARTIDORES_URL || 'https://mesoquick-repartidores.vercel.app'}/dashboard`,
  REPARTIDOR: `${import.meta.env.VITE_APP_REPARTIDORES_URL || 'https://mesoquick-repartidores.vercel.app'}/dashboard`,
  repartidor: `${import.meta.env.VITE_APP_REPARTIDORES_URL || 'https://mesoquick-repartidores.vercel.app'}/dashboard`,

  // Agentes de Servicio al Cliente (app-agentes) - Se quedan en localhost temporalmente si no los han desplegado
  AGENT: 'http://localhost:5176/',
  AGENTE: 'http://localhost:5176/',
  agente: 'http://localhost:5176/',
};