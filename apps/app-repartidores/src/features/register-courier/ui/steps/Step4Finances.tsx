import React from 'react';
import { useWizardStore } from '../../model/useWizardStore';

export const Step4Finances: React.FC = () => {
  const { formData, updateFormData } = useWizardStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    updateFormData({ [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      <h3 className="text-xl font-bold text-[#3c606b] mb-4">Paso 4: Datos Bancarios</h3>
      <p className="text-sm text-gray-500 mb-4">Esta cuenta se utilizará para depositar tus ganancias.</p>
      
      <div>
        <label className="block text-sm text-gray-600 mb-1">Nombre del Banco</label>
        <input type="text" name="bankName" value={formData.bankName || ''} onChange={handleChange} 
               className="w-full border border-gray-300 rounded p-2 focus:border-[#3c606b] outline-none" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Tipo de Cuenta</label>
          <select name="accountType" value={formData.accountType || ''} onChange={handleChange} 
                  className="w-full border border-gray-300 rounded p-2 focus:border-[#3c606b] outline-none bg-white">
            <option value="">Selecciona una opción</option>
            <option value="MONETARY">Monetaria</option>
            <option value="SAVINGS">Ahorro</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Número de Cuenta</label>
          <input type="text" name="accountNumber" value={formData.accountNumber || ''} onChange={handleChange} 
                 className="w-full border border-gray-300 rounded p-2 focus:border-[#3c606b] outline-none" />
        </div>
      </div>
    </div>
  );
};