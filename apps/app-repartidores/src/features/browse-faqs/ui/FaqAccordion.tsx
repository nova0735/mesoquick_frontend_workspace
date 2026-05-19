import React, { useEffect } from 'react';
import { Accordion } from '@mesoquick/ui-kit';
import { useFaqStore } from '../model/useFaqStore';

export const FaqAccordion: React.FC = () => {
  const data = useFaqStore((state) => state.data);
  const isLoading = useFaqStore((state) => state.isLoading);
  const loadFaqs = useFaqStore((state) => state.loadFaqs);

  useEffect(() => {
    loadFaqs();
  }, [loadFaqs]);

  if (isLoading) {
    return (
      <div className="w-full flex flex-col gap-2 animate-pulse">
        {[1, 2, 3].map((skeleton) => (
          <div key={skeleton} className="h-12 w-full bg-gray-200 rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (!data || data.categories.length === 0) return null;

  return (
    <div className="flex flex-col w-full gap-6">
      {data.categories.map((category, index) => (
        <div key={index} className="flex flex-col gap-2">
          <h3 className="text-lg font-bold text-primary mb-2 border-b border-gray-200 pb-2">
            {category.categoryName}
          </h3>
          {category.items.map((item) => (
            <Accordion 
              key={item.id} 
              title={item.question} 
              content={<p className="leading-relaxed">{item.answer}</p>} 
            />
          ))}
        </div>
      ))}
    </div>
  );
};
