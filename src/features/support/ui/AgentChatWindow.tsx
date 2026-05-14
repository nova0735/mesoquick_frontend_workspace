import { useEffect, useRef } from 'react';
import { Spinner } from '@shared/ui';
import { User } from 'lucide-react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { useAgentChat } from '../model/useAgentChat';

export default function AgentChatWindow() {
  const { messages, isConnected, agentName, sendMessage } = useAgentChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
                En línea
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
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {!isConnected && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-text">
            <Spinner size="lg" />
            <p className="text-sm">Conectando con un agente disponible...</p>
          </div>
        )}

        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput
        onSend={sendMessage}
        disabled={!isConnected}
        placeholder={isConnected ? 'Escribe tu mensaje...' : 'Esperando agente...'}
      />
    </div>
  );
}