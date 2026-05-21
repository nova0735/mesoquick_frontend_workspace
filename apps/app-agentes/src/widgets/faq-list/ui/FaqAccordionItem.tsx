import { ChevronDown } from 'lucide-react';
import {
  FAQ_CATEGORY_LABEL,
  type FaqItem,
} from '../../../entities/faq';

interface FaqAccordionItemProps {
  faq: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
}

export function FaqAccordionItem({ faq, isOpen, onToggle }: FaqAccordionItemProps) {
  const panelId = `faq-panel-${faq.id}`;
  const buttonId = `faq-button-${faq.id}`;

  return (
    <div className="border border-gray-200 rounded-lg bg-white overflow-hidden transition-shadow hover:shadow-sm">
      <button
        id={buttonId}
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="w-full flex items-center justify-between gap-4 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <span className="inline-block px-2 py-0.5 mb-1 text-[10px] font-bold uppercase tracking-wider rounded bg-accent/15 text-primary">
            {FAQ_CATEGORY_LABEL[faq.category]}
          </span>
          <h3 className="text-sm font-semibold text-primary leading-snug">
            {faq.question}
          </h3>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          id={panelId}
          role="region"
          aria-labelledby={buttonId}
          className="px-4 pb-4 pt-1 text-sm text-gray-700 leading-relaxed border-t border-gray-100"
        >
          {faq.answer}
        </div>
      )}
    </div>
  );
}
