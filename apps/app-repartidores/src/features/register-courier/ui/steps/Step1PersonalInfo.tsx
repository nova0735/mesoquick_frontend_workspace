import React from 'react';
import { useWizardStore } from '../../model/useWizardStore';

export const Step1PersonalInfo: React.FC = () => {
  const { formData, updateFormData } = useWizardStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      <h3 className="text-xl font-bold text-[#3c606b] mb-4">Paso 1: Datos Personales</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Nombres</label>
          <input type="text" name="firstName" value={formData.firstName || ''} onChange={handleChange} 
                 className="w-full border border-gray-300 rounded p-2 focus:border-[#3c606b] outline-none" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Apellidos</label>
          <input type="text" name="lastName" value={formData.lastName || ''} onChange={handleChange} 
                 className="w-full border border-gray-300 rounded p-2 focus:border-[#3c606b] outline-none" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Teléfono</label>
          <input type="tel" name="phone" value={formData.phone || ''} onChange={handleChange} 
                 className="w-full border border-gray-300 rounded p-2 focus:border-[#3c606b] outline-none" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Correo Electrónico</label>
          <input type="email" name="email" value={formData.email || ''} onChange={handleChange} 
                 className="w-full border border-gray-300 rounded p-2 focus:border-[#3c606b] outline-none" />
        </div>
      </div>
      
      <div>
        <label className="block text-sm text-gray-600 mb-1">Dirección Completa</label>
        <input type="text" name="address" value={formData.address || ''} onChange={handleChange} 
               className="w-full border border-gray-300 rounded p-2 focus:border-[#3c606b] outline-none" />
      </div>
    </div>
  );
};