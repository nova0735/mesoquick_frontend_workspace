// 🧩 NOTA DE ARQUITECTURA: 
// Aquí es donde los diferentes equipos "conectarán" sus aplicaciones al Login.
// El LoginPage leerá esto dinámicamente.

export const REGISTRATION_LINKS = [
  {
    id: 'courier',
    label: 'Soy Repartidor',
    url: 'http://localhost:5173/register', // App de Repartidores
    color: '#56bd64' // Verde MesoQuick
  },
  // 💡 El equipo de Clientes o Restaurantes solo tendrá que descomentar y adaptar esto:
  /*
  {
    id: 'restaurant',
    label: 'Soy Restaurante',
    url: 'http://localhost:5175/register',
    color: '#f59e0b' // Naranja, por ejemplo
  }
  */
];