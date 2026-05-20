import { User } from 'lucide-react';

/**
 * Indicador visual de que el agente está "escribiendo".
 * Tres puntos animados al estilo WhatsApp/Telegram.
 */
export default function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 animate-fade-in-up">
      {/* Avatar del agente */}
      <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0 mb-1">
        <User className="w-4 h-4 text-white" />
      </div>

      {/* Burbuja con puntos animados */}
      <div className="bg-white border border-border rounded-2xl rounded-bl-sm px-4 py-3">
        <div className="flex items-center gap-1">
          <span
            className="w-1.5 h-1.5 rounded-full bg-text/40 animate-bounce"
            style={{ animationDelay: '0ms' }}
          />
          <span
            className="w-1.5 h-1.5 rounded-full bg-text/40 animate-bounce"
            style={{ animationDelay: '150ms' }}
          />
          <span
            className="w-1.5 h-1.5 rounded-full bg-text/40 animate-bounce"
            style={{ animationDelay: '300ms' }}
          />
        </div>
      </div>
    </div>
  );
}