import { Button } from '@shared/ui';
import type { ChatbotOption } from '@shared/mocks';

interface ChatbotOptionsProps {
  options: ChatbotOption[];
  onSelect: (option: ChatbotOption) => void;
}

export default function ChatbotOptions({ options, onSelect }: ChatbotOptionsProps) {
  if (options.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 mt-3">
      {options.map((option) => (
        <Button
          key={option.id}
          variant="outline"
          size="sm"
          onClick={() => onSelect(option)}
          className="justify-start text-left"
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}