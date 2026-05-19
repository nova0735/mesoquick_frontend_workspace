import React from 'react';
import { useWizardStore } from '../../model/useWizardStore';

export const Step1PersonalInfo: React.FC = () => {
  // Consumimos el estado global del wizard desde el store (FSD: Feature Model)
  const { dto, updateData } = useWizardStore();

  // Función optimizada para actualizar cualquier campo de texto/fecha
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateData({ [name]: value });
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nombres */}
        <div className="flex flex-col">
          <label htmlFor="firstName" className="mb-1 text-sm font-semibold text-gray-700">Nombres</label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            value={dto.firstName}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3c606b] text-gray-700 transition-colors"
            placeholder="Ej. Juan Carlos"
          />
        </div>

        {/* Apellidos */}
        <div className="flex flex-col">
          <label htmlFor="lastName" className="mb-1 text-sm font-semibold text-gray-700">Apellidos</label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            value={dto.lastName}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3c606b] text-gray-700 transition-colors"
            placeholder="Ej. Pérez"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Correo */}
        <div className="flex flex-col">
          <label htmlFor="email" className="mb-1 text-sm font-semibold text-gray-700">Correo Electrónico</label>
          <input
            id="email"
            name="email"
            type="email"
            value={dto.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3c606b] text-gray-700 transition-colors"
            placeholder="Ej. juan@correo.com"
          />
        </div>

        {/* Teléfono */}
        <div className="flex flex-col">
          <label htmlFor="phone" className="mb-1 text-sm font-semibold text-gray-700">Teléfono</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={dto.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3c606b] text-gray-700 transition-colors"
            placeholder="Ej. 55551234"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Fecha de Nacimiento (NUEVO) */}
        <div className="flex flex-col">
          <label htmlFor="birthDate" className="mb-1 text-sm font-semibold text-gray-700">Fecha de Nacimiento</label>
          <input
            id="birthDate"
            name="birthDate"
            type="date"
            value={dto.birthDate}
            onChange={handleChange}
            // El input type="date" maneja nativamente el formato YYYY-MM-DD requerido
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3c606b] text-gray-700 transition-colors"
          />
        </div>

        {/* Nacionalidad (NUEVO) */}
        <div className="flex flex-col">
          <label htmlFor="nationality" className="mb-1 text-sm font-semibold text-gray-700">Nacionalidad</label>
          <input
            id="nationality"
            name="nationality"
            type="text"
            value={dto.nationality}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3c606b] text-gray-700 transition-colors"
            placeholder="Ej. Guatemalteca"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Departamento (NUEVO) */}
        <div className="flex flex-col">
          <label htmlFor="department" className="mb-1 text-sm font-semibold text-gray-700">Departamento</label>
          <input
            id="department"
            name="department"
            type="text"
            value={dto.department}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3c606b] text-gray-700 transition-colors"
            placeholder="Ej. Guatemala"
          />
        </div>

        {/* Dirección (NUEVO) */}
        <div className="flex flex-col">
          <label htmlFor="address" className="mb-1 text-sm font-semibold text-gray-700">Dirección de Residencia</label>
          <input
            id="address"
            name="address"
            type="text"
            value={dto.address}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3c606b] text-gray-700 transition-colors"
            placeholder="Ej. 5ta Avenida 12-34 Zona 1"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Contraseña */}
        <div className="flex flex-col">
          <label htmlFor="password" className="mb-1 text-sm font-semibold text-gray-700">Contraseña</label>
          <input
            id="password"
            name="password"
            type="password"
            value={dto.password}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3c606b] text-gray-700 transition-colors"
            placeholder="Ingresa una contraseña segura"
          />
        </div>
      </div>
    </div>
  );
};