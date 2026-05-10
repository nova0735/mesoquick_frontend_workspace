import React, { useState } from 'react';
import { DirectoryList } from '../../features/view-support-directory';
import { FaqAccordion } from '../../features/browse-faqs';
import { DisputeModal } from '../../features/dispute-penalty/ui/DisputeModal';
import { ChatbotWidget } from '../../features/interact-with-chatbot/ui/ChatbotWidget';
import { ChatWindow } from '../../features/initiate-support-chat/ui/ChatWindow';
import { Button } from '@mesoquick/ui-kit';

export const SupportPage: React.FC = () => {
  const [isDisputeOpen, setIsDisputeOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isLiveChatOpen, setIsLiveChatOpen] = useState(false);

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto py-8 gap-8">
      <header>
        <h1 className="text-3xl font-bold text-primary">Centro de Soporte</h1>
        <p className="text-primary/70 mt-2">
          Encuentra respuestas a preguntas comunes o contacta directamente a nuestro equipo de soporte.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <aside className="col-span-1 flex flex-col gap-6">
          <DirectoryList />
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-primary mb-4">Acciones Rápidas</h3>
            <div className="flex flex-col gap-3">
              <Button onClick={() => setIsDisputeOpen(true)} className="w-full">
                Disputar Sanción
              </Button>
              <Button onClick={() => setIsChatbotOpen(true)} className="w-full">
                Asistente Virtual
              </Button>
              <Button onClick={() => setIsLiveChatOpen(true)} className="w-full">
                Soporte en Vivo
              </Button>
            </div>
          </div>
        </aside>

        <section className="col-span-1 lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-primary mb-6">Preguntas Frecuentes</h2>
          <FaqAccordion />
        </section>
      </div>

      {isDisputeOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <DisputeModal isOpen={isDisputeOpen} onClose={() => setIsDisputeOpen(false)} />
        </div>
      )}

      {isChatbotOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <ChatbotWidget />
          <button onClick={() => setIsChatbotOpen(false)} className="absolute top-4 right-4 text-white">Cerrar</button>
        </div>
      )}

      {isLiveChatOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <ChatWindow />
          <button onClick={() => setIsLiveChatOpen(false)} className="absolute top-4 right-4 text-white">Cerrar</button>
        </div>
      )}
    </div>
  );
};
