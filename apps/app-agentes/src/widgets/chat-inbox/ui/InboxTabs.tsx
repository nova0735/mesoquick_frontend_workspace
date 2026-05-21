import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Inbox, Users } from 'lucide-react';
import { useChatsStore } from '../../../entities/chat';
import { useSessionStore } from '../../../entities/session';
import { PendingChatsList } from '../../../features/list-pending-chats';
import { ActiveChatsList } from '../../../features/list-active-chats';

type InboxTab = 'pending' | 'active';

interface InboxTabsProps {
  selectedChatId: string | null;
  onSelectChat: (chatId: string) => void;
}

/**
 * Panel izquierdo del backoffice de chats. Tabs entre la cola pendiente y los
 * chats activos del agente, con contadores derivados del store.
 *
 * Los conteos se calculan con useMemo sobre la mapa cruda del store —
 * `state.chats` se mantiene como mapa para que el selector retorne una
 * referencia estable hasta que muta algo.
 */
export function InboxTabs({ selectedChatId, onSelectChat }: InboxTabsProps) {
  const [tab, setTab] = useState<InboxTab>('pending');
  const chats = useChatsStore((state) => state.chats);
  const agentId = useSessionStore((state) => state.user?.id);

  const counts = useMemo(() => {
    let pending = 0;
    let active = 0;
    for (const chat of Object.values(chats)) {
      if (chat.status === 'PENDING') {
        pending += 1;
      } else if (
        chat.status === 'IN_ATTENTION' &&
        chat.assignedAgentId === agentId
      ) {
        active += 1;
      }
    }
    return { pending, active };
  }, [chats, agentId]);

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col h-full">
      <div className="flex border-b border-gray-200 bg-base flex-shrink-0">
        <TabButton
          active={tab === 'pending'}
          onClick={() => setTab('pending')}
          icon={<Inbox className="w-4 h-4" />}
        >
          Pendientes ({counts.pending})
        </TabButton>
        <TabButton
          active={tab === 'active'}
          onClick={() => setTab('active')}
          icon={<Users className="w-4 h-4" />}
        >
          Mis chats ({counts.active})
        </TabButton>
      </div>
      <div className="flex-1 overflow-y-auto">
        {tab === 'pending' ? (
          <PendingChatsList
            selectedChatId={selectedChatId}
            onSelectChat={onSelectChat}
          />
        ) : (
          <ActiveChatsList
            selectedChatId={selectedChatId}
            onSelectChat={onSelectChat}
          />
        )}
      </div>
    </div>
  );
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  children: ReactNode;
}

function TabButton({ active, onClick, icon, children }: TabButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-semibold transition-colors ${
        active
          ? 'bg-white text-primary border-b-2 border-primary'
          : 'text-gray-500 hover:text-primary hover:bg-white/50'
      }`}
    >
      {icon}
      {children}
    </button>
  );
}
