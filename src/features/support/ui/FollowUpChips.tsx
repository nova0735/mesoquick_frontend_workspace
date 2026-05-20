import { cn } from '@shared/lib/cn';

interface FollowUpChipsProps {
  /** Lista de sugerencias clickeables */
  suggestions: string[];
  /** Callback al clickear una sugerencia */
  onSelect: (suggestion: string) => void;
  /** Deshabilitar si el agente está escribiendo */
  disabled?: boolean;
}

/**
 * Chips de respuestas rápidas que aparecen debajo de los mensajes
 * del agente. Permiten al usuario responder con un click sin tipear.
 */
export default function FollowUpChips({
  suggestions,
  onSelect,
  disabled = false,
}: FollowUpChipsProps) {
  if (suggestions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5 mt-2 ml-11 animate-fade-in-up">
      {suggestions.map((suggestion) => (
        <button
          key={suggestion}
          onClick={() => onSelect(suggestion)}
          disabled={disabled}
          className={cn(
            'px-3 py-1.5 text-xs rounded-full transition-all',
            'bg-white border border-accent/30 text-accent',
            'hover:bg-accent hover:text-white hover:border-accent',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
}