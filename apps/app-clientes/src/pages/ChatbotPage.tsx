import { ChatbotWindow } from '@features/support';

export default function ChatbotPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-text-heading mb-4">
        Asistente virtual
      </h1>
      <ChatbotWindow />
    </div>
  );
}