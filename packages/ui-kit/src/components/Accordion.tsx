import React from 'react';
import { Disclosure, Transition } from '@headlessui/react';
import { ChevronUp } from 'lucide-react';

export interface AccordionProps {
  title: string;
  content: React.ReactNode;
}

export const Accordion: React.FC<AccordionProps> = ({ title, content }) => {
  return (
    <div className="w-full mb-2">
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex w-full justify-between rounded-lg bg-base px-4 py-3 text-left text-sm font-semibold text-primary hover:bg-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-primary/50 transition-colors">
              <span>{title}</span>
              <ChevronUp className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-primary transition-transform`} />
            </Disclosure.Button>
            <Transition
              enter="transition-all duration-300 ease-out"
              enterFrom="max-h-0 opacity-0"
              enterTo="max-h-screen opacity-100"
              leave="transition-all duration-200 ease-in"
              leaveFrom="max-h-screen opacity-100"
              leaveTo="max-h-0 opacity-0"
            >
              <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-primary/80 overflow-hidden">
                {content}
              </Disclosure.Panel>
            </Transition>
          </>
        )}
      </Disclosure>
    </div>
  );
};
