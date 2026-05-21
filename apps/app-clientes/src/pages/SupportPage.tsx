import { Link } from 'react-router-dom';
import { Card, Button } from '@shared/ui';
import { Bot, MessageSquare } from 'lucide-react';
import { ROUTES } from '@app/router/routes';

export default function SupportPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold text-text-heading mb-2">
          Centro de soporte
        </h1>
        <p className="text-text">
          Estamos aquí para ayudarte. Elige cómo prefieres contactarnos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to={ROUTES.CHATBOT}>
          <Card hoverable className="h-full text-center p-6">
            <div className="w-16 h-16 rounded-full bg-accent-bg flex items-center justify-center mx-auto mb-4">
              <Bot className="w-8 h-8 text-accent" />
            </div>
            <h2 className="text-xl font-semibold text-text-heading mb-2">
              Asistente virtual
            </h2>
            <p className="text-sm text-text mb-4">
              Respuestas instantáneas a las preguntas más frecuentes. Disponible 24/7.
            </p>
            <Button variant="primary" fullWidth>
              Iniciar chat
            </Button>
          </Card>
        </Link>

        <Link to={ROUTES.AGENT_CHAT}>
          <Card hoverable className="h-full text-center p-6">
            <div className="w-16 h-16 rounded-full bg-accent-bg flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-accent" />
            </div>
            <h2 className="text-xl font-semibold text-text-heading mb-2">
              Hablar con un agente
            </h2>
            <p className="text-sm text-text mb-4">
              Conéctate con un asesor humano para resolver casos más complejos.
            </p>
            <Button variant="outline" fullWidth>
              Conectar
            </Button>
          </Card>
        </Link>
      </div>
    </div>
  );
}