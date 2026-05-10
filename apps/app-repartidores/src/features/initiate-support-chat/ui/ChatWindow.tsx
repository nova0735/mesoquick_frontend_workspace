import React, { useState, useRef, useEffect } from 'react';
import { Button, InputText } from '@mesoquick/ui-kit';
import { useChatStore } from '../model/useChatStore';
import { uploadEvidence } from '../api/chat.api';

export const ChatWindow: React.FC = () => {
  const [input, setInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const messages = useChatStore((state) => state.messages);
  const isConnected = useChatStore((state) => state.isConnected);
  const initializeChat = useChatStore((state) => state.initializeChat);
  const addMessage = useChatStore((state) => state.addMessage);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isConnected) {
      initializeChat();
    }
  }, [isConnected, initializeChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() || file) {
      let attachmentUrl = '';
      if (file) {
        try {
          const result = await uploadEvidence(file);
          attachmentUrl = result.url;
        } catch (error) {
          console.error('Error uploading file:', error);
          return;
        }
      }

      const message: any = {
        id: Date.now().toString(),
        content: input.trim(),
        sender: 'user',
        timestamp: new Date().toISOString(),
        attachment: attachmentUrl || undefined,
      };
      addMessage(message);
      setInput('');
      setFile(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col h-96 bg-white rounded-lg shadow-lg">
      <div className="bg-green-500 text-white p-4 rounded-t-lg">
        <h3 className="text-lg font-bold">Soporte en Vivo</h3>
        <p className="text-sm">{isConnected ? 'Conectado' : 'Conectando...'}</p>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs p-2 rounded-lg ${msg.sender === 'user' ? 'bg-green-500 text-white' : 'bg-gray-200 text-black'}`}>
              {msg.content}
              {msg.attachment && <img src={msg.attachment} alt="attachment" className="mt-2 max-w-full" />}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t">
        <div className="flex space-x-2 mb-2">
          <label htmlFor="file-upload" className="flex-1 cursor-pointer">
            <input id="file-upload" type="file" onChange={handleFileChange} className="hidden" />
            <div className="border border-gray-300 rounded p-2 text-center">
              {file ? file.name : 'Seleccionar archivo'}
            </div>
          </label>
          <Button onClick={() => {}}>Adjuntar</Button>
        </div>
        <div className="flex space-x-2">
          <InputText
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe un mensaje..."
            className="flex-1"
          />
          <Button onClick={handleSend} disabled={!input.trim() && !file}>
            Enviar
          </Button>
        </div>
      </div>
    </div>
  );
};