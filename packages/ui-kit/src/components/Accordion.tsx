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
            <Disclosure.Button className="flex w-full justify-between rounded-lg bg-[#f7f7f7] px-4 py-3 text-left text-sm font-semibold text-[#3c606b] hover:bg-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-[#3c606b]/50 transition-colors">
              <span>{title}</span>
              <ChevronUp className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-[#3c606b] transition-transform`}/>
            </Disclosure.Button>
            <Transition 
              enter="transition duration-100 ease-out" 
              enterFrom="transform scale-95 opacity-0" 
              enterTo="transform scale-100 opacity-100" 
              leave="transition duration-75 ease-out" 
              leaveFrom="transform scale-100 opacity-100" 
              leaveTo="transform scale-95 opacity-0"
            >
              <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-[#3c606b]/80">
                {content}
              </Disclosure.Panel>
            </Transition>
          </>
        )}
      </Disclosure>
    </div>
  );
};
