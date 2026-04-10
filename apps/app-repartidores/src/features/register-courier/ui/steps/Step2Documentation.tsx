import React from 'react';
import { useWizardStore } from '../../model/useWizardStore';

export const Step2Documentation: React.FC = () => {
  const { formData, updateFormData, updateFiles } = useWizardStore();

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      updateFiles({ [e.target.name]: e.target.files[0] });
    }
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      <h3 className="text-xl font-bold text-[#3c606b] mb-4">Paso 2: Documentación Legal</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">DPI / CUI</label>
          <input type="text" name="cui" value={formData.cui || ''} onChange={handleTextChange} 
                 className="w-full border border-gray-300 rounded p-2 focus:border-[#3c606b] outline-none" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">NIT</label>
          <input type="text" name="nit" value={formData.nit || ''} onChange={handleTextChange} 
                 className="w-full border border-gray-300 rounded p-2 focus:border-[#3c606b] outline-none" />
        </div>
      </div>

      <div className="mt-4 p-4 border-2 border-dashed border-gray-300 rounded bg-gray-50">
        <label className="block text-sm font-semibold text-[#3c606b] mb-2">Fotografía Frontal del DPI</label>
        <input type="file" accept="image/*" name="dpiPhoto" onChange={handleFileChange} 
               className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#3c606b]/10 file:text-[#3c606b] hover:file:bg-[#3c606b]/20" />
      </div>

      <div className="mt-4 p-4 border-2 border-dashed border-gray-300 rounded bg-gray-50">
        <label className="block text-sm font-semibold text-[#3c606b] mb-2">Fotografía del Rostro (Selfie)</label>
        <input type="file" accept="image/*" name="facePhoto" onChange={handleFileChange} 
               className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#3c606b]/10 file:text-[#3c606b] hover:file:bg-[#3c606b]/20" />
      </div>
    </div>
  );
};