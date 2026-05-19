import React, { useEffect } from 'react';
import { useAccountStatusStore } from '../model/useAccountStatusStore';
import { UnlockRequestForm } from '../../request-account-unlock';

/**
 * COMPONENTE DE UI: Overlay Bloqueador de Estado de Cuenta
 * 
 * 🧩 NOTA DE ARQUITECTURA FSD:
 * Este componente está diseñado para inyectarse de forma global en el nivel 
 * Layout de la app (app-repartidores). Al montarse, disparará la validación 
 * automáticamente.
 */
export const AccountStatusBanner: React.FC = () => {
  const { status, isLoading, error, checkStatus } = useAccountStatusStore();

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  // 1. Cargando: Retornamos null para que la app base se encargue de mostrar
  // un esqueleto de carga general, o no mostrar nada hasta resolver la petición.
  if (isLoading) {
    return null;
  }

  // 2. Estado Activo: El repartidor está limpio. Retornamos null para NO BLOQUEAR la UI.
  if (status === 'ACTIVE') {
    return null;
  }

  // 3. Fallo de red (Opcional): Si hay un error, mostramos un banner superior.
  if (error) {
    return (
      <div className="fixed top-0 left-0 w-full bg-red-500 text-white text-center p-2 z-[60]">
        Error de conexión: {error} - Reintentando...
      </div>
    );
  }

  // 4. ESTADO BLOQUEANTE (PENDING_DOCS, SUSPENDED, etc)
  // Renderizamos un "Full-Screen Blocking Overlay" que impide la navegación interna.
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg text-center m-4">
        
        {/* Icono de advertencia */}
        <div className="flex justify-center mb-4 text-[#3c606b]">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Atención: Cuenta Inactiva</h2>
        <p className="text-gray-600 mb-6"> {/* Aumenté un poco el margin-bottom (mb-6) */}
          Actualmente el estado de tu cuenta es <span className="font-semibold text-gray-800 uppercase">{status}</span>.
          No puedes conectarte, ver el mapa ni recibir pedidos en este momento.
        </p>
        
        {/* Renderizamos el formulario directamente. Él ya tiene su propio botón de submit */}
        <div className="mt-4 border-t border-gray-200 pt-4 text-left">
           <h3 className="text-sm font-semibold text-gray-700 mb-3">Solicitar Revisión / Apelación:</h3>
           <UnlockRequestForm />
        </div>
      </div>
    </div>
  );
};