import { useState, type FormEvent } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@shared/ui';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function ChatInput({
  onSend,
  disabled = false,
  placeholder = 'Escribe tu mensaje...',
}: ChatInputProps) {
  const [value, setValue] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!value.trim() || disabled) return;
    onSend(value);
    setValue('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t border-border">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 h-10 px-3 rounded border border-border bg-bg text-text-heading placeholder:text-text/60 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:opacity-50"
      />
      <Button
        type="submit"
        disabled={disabled || !value.trim()}
        leftIcon={<Send className="w-4 h-4" />}
      >
        Enviar
      </Button>
    </form>
  );
}