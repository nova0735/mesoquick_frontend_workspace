import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port: 5174,
      watch: {
        usePolling: true, // Critical for Docker on Windows/Mac hosts
      },
      proxy: {
        '/api': {
          // Usamos la URL de producción de Railway
          target: 'https://broker-services-production.up.railway.app',
          changeOrigin: true,
          rewrite: (path) => path,
          secure: false, // Cambiado a false para evitar problemas de certificados SSL locales en Node
        },
        '/ws': {
          // Usamos wss (Websocket Secure) para Railway
          target: 'wss://broker-services-production.up.railway.app',
          ws: true,
          changeOrigin: true,
          secure: true,
        }
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});
