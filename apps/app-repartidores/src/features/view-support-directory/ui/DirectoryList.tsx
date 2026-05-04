import React, { useEffect } from 'react';
import { useDirectoryStore } from '../model/useDirectoryStore';

export const DirectoryList: React.FC = () => {
  const data = useDirectoryStore((state) => state.data);
  const isLoading = useDirectoryStore((state) => state.isLoading);
  const loadDirectory = useDirectoryStore((state) => state.loadDirectory);

  useEffect(() => {
    loadDirectory();
  }, [loadDirectory]);

  if (isLoading) {
    return (
      <div className="w-full bg-white p-4 rounded-lg shadow-sm animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-10 bg-gray-100 rounded w-full mb-2"></div>
        <div className="h-10 bg-gray-100 rounded w-full"></div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="flex flex-col gap-4 bg-white p-6 rounded-lg shadow-md w-full">
      <h2 className="text-xl font-bold text-primary mb-2">Emergency & Direct Contact</h2>
      
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-primary/70 uppercase">Phone Lines</h3>
        {data.phones.map((phone) => (
          <a 
            key={phone.id} 
            href={`tel:${phone.value.replace(/\s+/g, '')}`} 
            className="flex justify-between items-center p-3 bg-base rounded-lg hover:bg-gray-200 transition-colors"
          >
            <span className="font-medium text-primary">{phone.label}</span>
            <span className="font-bold text-green-600">{phone.value}</span>
          </a>
        ))}
      </div>

      <div className="flex flex-col gap-3 mt-2">
        <h3 className="text-sm font-semibold text-primary/70 uppercase">Email Support</h3>
        {data.emails.map((email) => (
          <a 
            key={email.id} 
            href={`mailto:${email.value}`} 
            className="flex justify-between items-center p-3 bg-base rounded-lg hover:bg-gray-200 transition-colors"
          >
            <span className="font-medium text-primary">{email.label}</span>
            <span className="font-bold text-[#3c606b]">{email.value}</span>
          </a>
        ))}
      </div>
    </div>
  );
};
