import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2, Send } from 'lucide-react';
import { useSessionStore } from '../../../entities/session';
import { zodFormResolver } from '../../../shared/lib/zodFormResolver';
import { mockSendAgentMessage } from '../api/mockSendMessage';
import {
  messageSchema,
  type MessageFormValues,
} from '../model/messageSchema';

interface MessageComposerProps {
  chatId: string;
  /** Si está activo, el composer se renderiza como banner deshabilitado. */
  disabled?: boolean;
  /** Texto del banner cuando disabled = true. */
  disabledHint?: string;
}

/**
 * Composer del agente. react-hook-form + zod, con Enter para enviar y
 * Shift+Enter para nueva línea. Se limpia automáticamente cuando cambia el
 * chat seleccionado para no enviar contenido residual al chat equivocado.
 */
export function MessageComposer({
  chatId,
  disabled,
  disabledHint,
}: MessageComposerProps) {
  const agentName = useSessionStore((state) => state.user?.name);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<MessageFormValues>({
    resolver: zodFormResolver(messageSchema),
    defaultValues: { text: '' },
  });

  useEffect(() => {
    reset({ text: '' });
  }, [chatId, reset]);

  const onSubmit = async (values: MessageFormValues) => {
    if (!agentName) return;
    await mockSendAgentMessage({
      chatId,
      agentName,
      text: values.text.trim(),
    });
    reset({ text: '' });
  };

  if (disabled) {
    return (
      <div className="p-4 border-t border-gray-200 bg-base text-center text-sm text-gray-500">
        {disabledHint ?? 'No puedes enviar mensajes en este chat.'}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-3 border-t border-gray-200 bg-white"
      noValidate
    >
      <div className="flex gap-2 items-end">
        <textarea
          {...register('text')}
          rows={2}
          placeholder="Escribe tu respuesta... (Enter para enviar · Shift+Enter para nueva línea)"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              void handleSubmit(onSubmit)();
            }
          }}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-base text-white text-sm font-semibold rounded-lg hover:bg-green-bright disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          Enviar
        </button>
      </div>
      {errors.text && (
        <p className="mt-1 text-xs text-red-600">{errors.text.message}</p>
      )}
    </form>
  );
}
