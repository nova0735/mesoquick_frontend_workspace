import React from 'react';
import { DirectoryList } from '../../features/view-support-directory';
import { FaqAccordion } from '../../features/browse-faqs';

export const SupportPage: React.FC = () => {
  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto py-8 gap-8">
      <header>
        <h1 className="text-3xl font-bold text-primary">Help Center</h1>
        <p className="text-primary/70 mt-2">
          Find answers to common questions or contact our support team directly.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <aside className="col-span-1 flex flex-col gap-6">
          <DirectoryList/>
        </aside>

        <section className="col-span-1 lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-primary mb-6">Frequently Asked Questions</h2>
          <FaqAccordion/>
        </section>
      </div>
    </div>
  );
};
