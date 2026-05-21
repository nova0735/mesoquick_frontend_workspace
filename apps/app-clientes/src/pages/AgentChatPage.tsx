import { AgentChatWindow } from '@features/support';

export default function AgentChatPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-text-heading mb-4">
        Chat con agente
      </h1>
      <AgentChatWindow />
    </div>
  );
}