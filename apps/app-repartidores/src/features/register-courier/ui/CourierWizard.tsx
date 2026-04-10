import React from 'react';
import { useWizardStore } from '../model/useWizardStore';
import { Step1PersonalInfo } from './steps/Step1PersonalInfo';
import { Step2Documentation } from './steps/Step2Documentation';
import { Step3Vehicle } from './steps/Step3Vehicle';
import { Step4Finances } from './steps/Step4Finances';

export const CourierWizard: React.FC = () => {
  const { 
    currentStep, isLoading, error, isSuccess, 
    nextStep, prevStep, submitWizard 
  } = useWizardStore();

  // Pantalla final de éxito
  if (isSuccess) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto text-center animate-fadeIn">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Registro Completado!</h2>
        <p className="text-gray-600 mb-6">Hemos recibido tu información y documentos. Nuestro equipo revisará tu solicitud y te contactaremos pronto.</p>
        <button 
          onClick={() => window.location.href = '/login'} 
          className="bg-[#3c606b] hover:bg-opacity-90 text-white px-6 py-2 rounded transition-colors"
        >
          Volver al Inicio
        </button>
      </div>
    );
  }

  // Switch de renderizado según el paso activo
  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Step1PersonalInfo />;
      case 2: return <Step2Documentation />;
      case 3: return <Step3Vehicle />;
      case 4: return <Step4Finances />;
      default: return <Step1PersonalInfo />;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      {/* Cabecera: Barra de Progreso */}
      <div className="mb-6 border-b pb-4">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          Paso {currentStep} de 4
        </p>
        <div className="w-full bg-gray-200 h-2 rounded mt-2 overflow-hidden">
          <div 
            className="bg-[#56bd64] h-2 rounded transition-all duration-300 ease-in-out" 
            style={{ width: `${(currentStep / 4) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Banner de Errores (Si falla el POST) */}
      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded mb-4 text-sm border border-red-200">
          {error}
        </div>
      )}

      {/* Contenido Dinámico del Paso */}
      <div className="min-h-[300px]">
        {renderStep()}
      </div>

      {/* Pie: Botones de Navegación */}
      <div className="mt-8 flex justify-between pt-4 border-t border-gray-100">
        <button
          onClick={prevStep}
          disabled={currentStep === 1 || isLoading}
          className={`px-6 py-2 rounded transition-colors ${
            currentStep === 1 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          }`}
        >
          Anterior
        </button>

        {currentStep < 4 ? (
          <button
            onClick={nextStep}
            className="bg-[#56bd64] hover:bg-[#37e64f] text-white px-6 py-2 rounded transition-colors font-medium"
          >
            Siguiente
          </button>
        ) : (
          <button
            onClick={submitWizard}
            disabled={isLoading}
            className="bg-[#3c606b] hover:bg-[#2a444c] text-white px-6 py-2 rounded transition-colors font-medium"
          >
            {isLoading ? 'Enviando Datos...' : 'Finalizar Registro'}
          </button>
        )}
      </div>
    </div>
  );
};