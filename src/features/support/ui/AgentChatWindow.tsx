import { useEffect, useRef } from 'react';
import { Spinner } from '@shared/ui';
import { User } from 'lucide-react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import FollowUpChips from './FollowUpChips';
import TypingIndicator from './TypingIndicator';
import { useAgentChat } from '../model/useAgentChat';

export default function AgentChatWindow() {
  const { messages, isConnected, agentName, isTyping, sendMessage } =
    useAgentChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll cuando llega un mensaje nuevo o cuando empieza/termina de escribir
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Último mensaje del agente (para mostrar followUps solo en el más reciente)
  const lastAgentMessageIdx = [...messages]
    .reverse()
    .findIndex((m) => m.role === 'agent');
  const lastAgentMessageIndex =
    lastAgentMessageIdx === -1 ? -1 : messages.length - 1 - lastAgentMessageIdx;

  return (
    <div className="flex flex-col h-[600px] max-h-[80vh] bg-bg border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border bg-accent-bg/50">
        <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          {isConnected ? (
            <>
              <p className="font-semibold text-text-heading">
                {agentName || 'Agente'}
              </p>
              <p className="text-xs text-green-500 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                {isTyping ? 'Escribiendo...' : 'En línea'}
              </p>
            </>
          ) : (
            <>
              <p className="font-semibold text-text-heading">Conectando...</p>
              <p className="text-xs text-text">Te asignaremos un agente</p>
            </>
          )}
        </div>
      </div>

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-bg/50">
        {!isConnected && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-text">
            <Spinner size="lg" />
            <p className="text-sm">Conectando con un agente disponible...</p>
          </div>
        )}

        {messages.map((message, index) => {
          const isLastAgentMessage =
            message.role === 'agent' && index === lastAgentMessageIndex;
          return (
            <div key={message.id}>
              <ChatMessage message={message} />
              {/* FollowUps solo en el último mensaje del agente */}
              {isLastAgentMessage &&
                message.followUps &&
                message.followUps.length > 0 &&
                !isTyping && (
                  <FollowUpChips
                    suggestions={message.followUps}
                    onSelect={sendMessage}
                    disabled={isTyping}
                  />
                )}
            </div>
          );
        })}

        {/* Indicador "escribiendo..." */}
        {isTyping && messages.length > 0 && <TypingIndicator />}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput
        onSend={sendMessage}
        disabled={!isConnected || isTyping}
        placeholder={
          !isConnected
            ? 'Esperando agente...'
            : isTyping
              ? 'Carlos está escribiendo...'
              : 'Escribí tu mensaje...'
        }
      />
    </div>
  );
}