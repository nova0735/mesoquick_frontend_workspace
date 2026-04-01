import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Cargamos las variables de entorno del archivo .env
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      // Necesario para que el contenedor Docker exponga el puerto al host
      host: '0.0.0.0', 
      port: 5173,
      // Configuración del Proxy Inverso (Evasión de CORS)
      proxy: {
        // Intercepta todas las peticiones HTTP que comiencen con /api
        '/api': {
          target: env.VITE_API_GATEWAY_URL || 'http://broker-gateway:8000',
          changeOrigin: true,
          secure: false, // true si en producción usaremos HTTPS
        },
        // Intercepta todas las conexiones WebSocket que comiencen con /ws
        '/ws': {
          target: env.VITE_WS_URL || 'ws://broker-gateway:8000',
          ws: true, // Indica a Vite que esto es tráfico de WebSockets
          changeOrigin: true,
          secure: false,
        }
      }
    }
  };
});