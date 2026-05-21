/**
 * ⚙️ SHARED LAYER: App Registry
 * Centraliza los enlaces, puertos y configuración estática de las apps satélite.
 */

export const REGISTRATION_LINKS = [
  {
    id: 'courier',
    label: 'Soy Repartidor',
    url: 'http://localhost:5174/registro', // Redirige directamente al Wizard de Repartidores
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
  COURIER: 'http://localhost:5174/dashboard',
  REPARTIDOR: 'http://localhost:5174/dashboard',
  repartidor: 'http://localhost:5174/dashboard',

  // Agentes de Servicio al Cliente (app-agentes)
  AGENT: 'http://localhost:5176/',
  AGENTE: 'http://localhost:5176/',
  agente: 'http://localhost:5176/',
};