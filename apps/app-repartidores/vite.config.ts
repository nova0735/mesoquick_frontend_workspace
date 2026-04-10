import { defineConfig, type PluginOption } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react() as PluginOption[],
  ],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://broker-gateway:8000',
        changeOrigin: true,
      },
      '/ws': {
        target: 'ws://broker-gateway:8000',
        ws: true,
      }
    },
    watch: {
      usePolling: true
    }
  },
  optimizeDeps: {
    exclude: ['@mesoquick/ui-kit', '@mesoquick/core-network']
  }
});