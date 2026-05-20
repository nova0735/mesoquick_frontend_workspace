import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css'; // Includes Tailwind directives
import { useAuthStore } from './entities/session/model/auth.store';

// 🚀 HIDRATACIÓN DE SESIÓN: Pesca el token de la URL o LocalStorage antes de renderizar
useAuthStore.getState().hydrate();

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App/>
    </StrictMode>
  );
} else {
  console.error("Failed to find the root element to mount React.");
}
