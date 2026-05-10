import React, { useState, useRef, useEffect } from 'react';
import { Button, InputText } from '@mesoquick/ui-kit';
import { useChatbotStore } from '../model/useChatbotStore';

export const ChatbotWidget: React.FC = () => {
  const [input, setInput] = useState('');
  const messages = useChatbotStore((state) => state.messages);
  const isTyping = useChatbotStore((state) => state.isTyping);
  const sendMessage = useChatbotStore((state) => state.sendMessage);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (input.trim()) {
      await sendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-96 bg-white rounded-lg shadow-lg">
      <div className="bg-primary text-white p-4 rounded-t-lg">
        <h3 className="text-lg font-bold">Asistente Virtual</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs p-2 rounded-lg ${msg.sender === 'user' ? 'bg-primary text-white' : 'bg-gray-200 text-black'}`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-black p-2 rounded-lg">
              Escribiendo...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <InputText
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe un mensaje..."
            className="flex-1"
          />
          <Button onClick={handleSend} disabled={!input.trim()}>
            Enviar
          </Button>
        </div>
      </div>
    </div>
  );
};