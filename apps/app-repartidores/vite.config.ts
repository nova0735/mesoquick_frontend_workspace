import { defineConfig, loadEnv, ConfigEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0', 
      port: 5173,
      // VITAL PARA DOCKER EN WINDOWS/MAC: Forzar polling para HMR
      watch: {
        usePolling: true,
      },
      proxy: {
        '/api': {
          target: env.VITE_API_GATEWAY_URL || 'http://broker-gateway:8000',
          changeOrigin: true,
          secure: false,
        },
        '/ws': {
          target: env.VITE_WS_URL || 'ws://broker-gateway:8000',
          ws: true,
          changeOrigin: true,
          secure: false,
        }
      }
    }
  };
});