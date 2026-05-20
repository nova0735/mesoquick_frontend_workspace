import { useWizardStore } from '../model/useWizardStore';
import { Step1PersonalInfo } from './steps/Step1PersonalInfo';
import { Step2Documentation } from './steps/Step2Documentation';
import { Step3Vehicle } from './steps/Step3Vehicle';
import { Step4Finances } from './steps/Step4Finances';

// ==========================================
// COMPONENTE DE REVISIÓN FINAL
// ==========================================

const ReviewSubmitStep = () => {
  const { dto, files } = useWizardStore();
  return (
    <div className="flex flex-col gap-4 animate-fadeIn">
      <h2 className="text-xl font-bold text-[#3c606b]">Revisión de Datos</h2>
      <div className="bg-gray-100 p-4 rounded-lg text-sm text-gray-700 space-y-2">
        <p><strong>Nombre:</strong> {dto.firstName} {dto.lastName}</p>
        <p><strong>Email:</strong> {dto.email}</p>
        <p><strong>Teléfono:</strong> {dto.phone}</p>
        <p><strong>DPI / CUI:</strong> {dto.cui}</p>
        <p><strong>NIT:</strong> {dto.nit}</p>
        <p><strong>Vehículo:</strong> {dto.vehicleType} - {dto.licensePlate || 'N/A'}</p>
        <p><strong>Cuenta Bancaria:</strong> {dto.bankAccountType} (ID: {dto.bankId})</p>
        <p><strong>Documentos:</strong> {files.dpiPhoto && files.profilePhoto ? 'Cargados correctamente' : 'Faltantes'}</p>
      </div>
      <p className="text-xs text-gray-500 text-center mt-2">
        Al enviar tu solicitud, aceptas los términos y condiciones de MesoQuick.
      </p>
    </div>
  );
};

// ==========================================
// 🎨 ORQUESTRADOR PRINCIPAL: RegisterWizard
// ==========================================
export const RegisterWizard = () => {
  const { step, nextStep, prevStep, submit, isLoading, error, isSuccess } = useWizardStore();

  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f7f7f7] p-4">
        <div className="bg-white max-w-2xl w-full rounded-2xl shadow-xl overflow-hidden p-8 text-center">
          <h2 className="text-3xl font-bold text-[#3c606b] mb-4">¡Solicitud Enviada!</h2>
          <p className="text-gray-600 mb-6 text-lg">
            Hemos recibido tus datos correctamente. Nuestro equipo revisará tu solicitud y te contactaremos pronto.
          </p>
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f7f7f7] p-4">
      <div className="bg-white max-w-2xl w-full rounded-2xl shadow-xl overflow-hidden">
        
        {/* Cabecera Visual */}
        <div className="bg-[#3c606b]/5 p-8 text-center border-b border-gray-100">
          <h1 className="text-[#3c606b] font-bold text-3xl mb-2">Únete a MesoQuick</h1>
          <p className="text-gray-600 text-lg">Completa tu perfil para empezar a repartir</p>
        </div>

        {/* Contenedor del Formulario */}
        <div className="p-8">
          {/* Indicador de progreso */}
          <div className="flex justify-between mb-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={`h-2 flex-1 mx-1 rounded-full ${step >= i ? 'bg-[#3c606b]' : 'bg-gray-200'}`} />
            ))}
          </div>

          {/* Switcher de Vistas */}
          <div className="min-h-[250px]">
            {step === 1 && <Step1PersonalInfo />}
            {step === 2 && <Step2Documentation />}
            {step === 3 && <Step3Vehicle />}
            {step === 4 && <Step4Finances />}
            {step === 5 && <ReviewSubmitStep />}
          </div>

          {/* Manejo de errores */}
          {error && <p className="text-red-500 text-sm mt-4 text-center bg-red-50 p-3 rounded-lg border border-red-200">{error}</p>}

          {/* Controles de Navegación con Botón Cancelar */}
          <div className="flex flex-col-reverse sm:flex-row justify-between mt-8 gap-4 pt-6 border-t border-gray-100">
            
            {/* 🚪 El Puente de regreso al Login (Puerto 5173) */}
            <button 
              type="button" 
              onClick={() => window.location.href = 'http://localhost:5173/register'} 
              className="px-6 py-3 rounded-lg font-semibold text-gray-500 bg-transparent border-2 border-gray-200 hover:bg-gray-50 hover:text-gray-700 transition-colors sm:w-auto w-full text-center"
            >
              Cancelar Registro
            </button>
            
            <div className="flex gap-4 sm:w-auto w-full">
              <button 
                type="button" 
                onClick={prevStep} 
                disabled={step === 1 || isLoading} 
                className="px-6 py-3 rounded-lg font-semibold text-gray-600 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 transition-colors flex-1 sm:flex-none"
              >
                Atrás
              </button>
              <button 
                type="button" 
                onClick={step === 5 ? submit : nextStep} 
                disabled={isLoading} 
                className="px-6 py-3 rounded-lg font-semibold text-white bg-[#3c606b] hover:bg-[#2a454d] shadow-md hover:shadow-lg disabled:opacity-50 transition-all flex-1 sm:flex-none"
              >
                {isLoading ? 'Enviando...' : (step === 5 ? 'Finalizar Solicitud' : 'Siguiente')}
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};