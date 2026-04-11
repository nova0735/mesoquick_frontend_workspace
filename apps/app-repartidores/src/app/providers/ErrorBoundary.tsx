import React, { Component, ErrorInfo, ReactNode } from 'react';

// ==========================================
// GLOBAL ERROR BOUNDARY (Capa App / Providers)
// ==========================================
// 🧩 NOTA DE ARQUITECTURA (FSD):
// Este componente de clase atrapa los errores de renderizado en cualquier 
// componente hijo debajo de él en el árbol de React. Evita que la aplicación 
// se rompa completamente (pantalla blanca) y muestra una UI amigable de rescate.

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    // Actualiza el estado para que el siguiente renderizado muestre la UI de repuesto.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Aquí podríamos registrar el error en un servicio de telemetría externo (Ej. Sentry, Datadog)
    console.error("🔴 [Error Boundary Atrapó un Fallo]:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      // UI de Fallback aplicando los lineamientos visuales del Brandbook
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#f7f7f7] px-4">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
            <h1 className="text-3xl font-bold text-[#3c606b] mb-4">¡Ups!</h1>
            <p className="text-gray-500 mb-6">
              Algo salió mal en la interfaz mientras intentábamos cargar esta vista. 
              Por favor, intenta recargar la página.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-[#3c606b] text-white hover:bg-[#2a454d] font-semibold py-3 px-4 rounded-lg transition-colors duration-300"
            >
              Recargar Aplicación
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}