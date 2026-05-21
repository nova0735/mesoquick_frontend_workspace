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
  {
    id: 'customer',
    label: 'Soy Cliente',
    url: 'https://mesoquick-app-clientes.vercel.app/registro',
    color: '#3c606b'
  }
];
