import React from 'react';
import { useWizardStore } from '../../model/useWizardStore';

export const Step3Vehicle: React.FC = () => {
  const { formData, updateFormData } = useWizardStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    updateFormData({ [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      <h3 className="text-xl font-bold text-[#3c606b] mb-4">Paso 3: Vehículo de Trabajo</h3>
      
      <div>
        <label className="block text-sm text-gray-600 mb-1">Tipo de Vehículo</label>
        <select name="vehicleType" value={formData.vehicleType || ''} onChange={handleChange} 
                className="w-full border border-gray-300 rounded p-2 focus:border-[#3c606b] outline-none bg-white">
          <option value="">Selecciona una opción</option>
          <option value="MOTORCYCLE">Motocicleta</option>
          <option value="BICYCLE">Bicicleta</option>
          <option value="CAR">Automóvil</option>
        </select>
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">Número de Placa (Si aplica)</label>
        <input type="text" name="licensePlate" value={formData.licensePlate || ''} onChange={handleChange} 
               placeholder="Ej: M-123ABC"
               className="w-full border border-gray-300 rounded p-2 focus:border-[#3c606b] outline-none uppercase" />
      </div>
    </div>
  );
};