import { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import type { FaqItem } from '../../../entities/faq';
import { FaqAccordionItem } from './FaqAccordionItem';

interface FaqAccordionProps {
  faqs: readonly FaqItem[];
}

/**
 * Lista colapsable de FAQs. Solo permite un panel abierto a la vez para
 * evitar scroll excesivo y mantener el foco en una respuesta.
 */
export function FaqAccordion({ faqs }: FaqAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  if (faqs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
        <HelpCircle className="w-10 h-10 mb-3 text-gray-300" />
        <p className="text-sm font-semibold">No se encontraron preguntas</p>
        <p className="text-xs mt-1">
          Prueba con otro término o cambia el filtro de categoría.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {faqs.map((faq) => (
        <FaqAccordionItem
          key={faq.id}
          faq={faq}
          isOpen={openId === faq.id}
          onToggle={() => setOpenId((current) => (current === faq.id ? null : faq.id))}
        />
      ))}
    </div>
  );
}
