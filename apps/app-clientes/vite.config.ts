import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // ← clave: escucha en todas las interfaces, no solo localhost
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true,  // ← clave en Docker: detecta cambios en archivos
    },
  },
});
