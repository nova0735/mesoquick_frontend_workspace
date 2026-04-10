import React, { useState } from 'react';
import { submitUnlockRequest } from '../api/unlock.api';

/**
 * COMPONENTE DE UI: Formulario de Solicitud de Desbloqueo de Cuenta
 * 
 * 🧩 NOTA DE ARQUITECTURA FSD:
 * Este componente maneja su propio estado local (estado aislado). No requiere
 * integrarse con Zustand porque la acción de solicitar un desbloqueo es transaccional
 * y no afecta el estado en memoria de la aplicación en tiempo real. 
 * Ideal para ser renderizado dentro del `AccountStatusBanner` cuando la cuenta está suspendida.
 */
export const UnlockRequestForm: React.FC = () => {
  // Estados locales para el ciclo de vida de la petición
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica: evitar enviar justificaciones vacías
    if (!reason.trim()) {
      setError('Por favor, ingresa un motivo para tu solicitud.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Llamada a nuestra API aislada
      await submitUnlockRequest(reason);
      // ÉXITO: Mostramos el mensaje de confirmación
      setIsSuccess(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // ERROR: Capturamos y mostramos la retroalimentación del servidor
      setError(err?.response?.data?.message || err.message || 'Error al enviar la solicitud. Intenta más tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  // Renderizado Condicional: Si fue exitoso, mostramos un mensaje y ocultamos el form
  if (isSuccess) {
    return (
      <div className="w-full text-center p-4 bg-green-50 rounded border border-green-200 mt-4">
        <p className="text-green-600 font-medium">
          Tu solicitud ha sido enviada a soporte. Te contactaremos pronto.
        </p>
      </div>
    );
  }

  // Renderizado por defecto: El formulario con su Textarea y Botón
  return (
    <form onSubmit={handleSubmit} className="w-full mt-4 text-left">
      {error && <div className="mb-3 text-sm text-red-500 font-medium">{error}</div>}
      
      <div className="mb-4">
        <textarea
          placeholder="Explica brevemente por qué solicitas la revisión de tu cuenta..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
          className="w-full p-3 border border-[#3c606b]/30 rounded focus:outline-none focus:border-[#3c606b] focus:ring-1 focus:ring-[#3c606b] resize-none text-gray-700"
        />
      </div>
      
      <button
        type="submit"
        disabled={isLoading || !reason.trim()}
        className="bg-[#56bd64] hover:bg-[#37e64f] text-white font-semibold w-full py-2 rounded transition-colors disabled:opacity-50"
      >
        {isLoading ? 'Enviando solicitud...' : 'Enviar Solicitud a Soporte'}
      </button>
    </form>
  );
};