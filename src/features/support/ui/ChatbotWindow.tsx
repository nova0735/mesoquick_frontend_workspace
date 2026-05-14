import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button, EmptyState } from '@shared/ui';
import { RotateCcw, MessageSquare, Bot } from 'lucide-react';
import { ROUTES } from '@app/router/routes';
import ChatMessage from './ChatMessage';
import ChatbotOptions from './ChatbotOptions';
import { useChatbotFlow } from '../model/useChatbotFlow';

export default function ChatbotWindow() {
  const {
    messages,
    currentOptions,
    isFinished,
    escalatedToAgent,
    selectOption,
    restart,
  } = useChatbotFlow();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-[600px] max-h-[80vh] bg-bg border border-border rounded-lg overflow-hidden">
      {/* Header del chat */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-accent-bg/50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-text-heading">Asistente Mesoquick</p>
            <p className="text-xs text-text">Disponible 24/7</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={restart}
          leftIcon={<RotateCcw className="w-4 h-4" />}
        >
          Reiniciar
        </Button>
      </div>

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {/* Opciones disponibles después del último mensaje */}
        {!isFinished && currentOptions.length > 0 && (
          <ChatbotOptions options={currentOptions} onSelect={selectOption} />
        )}

        {/* Si la conversación terminó normalmente */}
        {isFinished && !escalatedToAgent && (
          <div className="pt-4 border-t border-border">
            <EmptyState
              title="Conversación finalizada"
              description="¿Necesitas ayuda con otra cosa?"
              action={
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={restart}>
                    Nueva consulta
                  </Button>
                </div>
              }
            />
          </div>
        )}

        {/* Si se escaló a agente */}
        {escalatedToAgent && (
          <div className="pt-4 border-t border-border">
            <EmptyState
              icon={<MessageSquare className="w-12 h-12" />}
              title="Hablemos con un agente"
              description="Un agente humano puede ayudarte con tu consulta."
              action={
                <Link to={ROUTES.AGENT_CHAT}>
                  <Button>Conectar con agente</Button>
                </Link>
              }
            />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}