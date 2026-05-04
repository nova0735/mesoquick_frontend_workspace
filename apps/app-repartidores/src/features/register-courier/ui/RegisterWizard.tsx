import { useRegisterWizardStore } from '../model/wizard.store';

// ==========================================
// SUB-COMPONENTES (Pasos del Wizard)
// ==========================================

const PersonalInfoStep = () => {
  const { dto, updateData } = useRegisterWizardStore();
  return (
    <div className="flex flex-col gap-4 animate-fadeIn">
      <h2 className="text-xl font-bold text-[#3c606b]">Información Personal</h2>
      <input
        type="text"
        placeholder="Nombre"
        value={dto.firstName}
        onChange={(e) => updateData({ firstName: e.target.value })}
        className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3c606b]"
      />
      <input
        type="text"
        placeholder="Apellidos"
        value={dto.lastName}
        onChange={(e) => updateData({ lastName: e.target.value })}
        className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3c606b]"
      />
      <input
        type="email"
        placeholder="Correo electrónico"
        value={dto.email}
        onChange={(e) => updateData({ email: e.target.value })}
        className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3c606b]"
      />
      <input
        type="tel"
        placeholder="Teléfono"
        value={dto.phone}
        onChange={(e) => updateData({ phone: e.target.value })}
        className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3c606b]"
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={dto.password}
        onChange={(e) => updateData({ password: e.target.value })}
        className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3c606b]"
      />
    </div>
  );
};

const VehicleInfoStep = () => {
  const { dto, updateData } = useRegisterWizardStore();
  return (
    <div className="flex flex-col gap-4 animate-fadeIn">
      <h2 className="text-xl font-bold text-[#3c606b]">Datos del Vehículo</h2>
      <select
        value={dto.vehicleType}
        onChange={(e) => updateData({ vehicleType: e.target.value })}
        className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3c606b]"
      >
        <option value="MOTORCYCLE">Motocicleta</option>
        <option value="BICYCLE">Bicicleta</option>
        <option value="CAR">Automóvil</option>
      </select>
      <input
        type="text"
        placeholder="Placa del vehículo"
        value={dto.plate}
        onChange={(e) => updateData({ plate: e.target.value })}
        className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3c606b]"
      />
    </div>
  );
};

const DocumentsStep = () => {
  const { updateData } = useRegisterWizardStore();
  return (
    <div className="flex flex-col gap-4 animate-fadeIn">
      <h2 className="text-xl font-bold text-[#3c606b]">Documentación Oficial</h2>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-gray-700">Foto de Identidad (INE/DPI)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => updateData({ idImage: e.target.files?.[0] || null })}
          className="p-2 border rounded-lg text-sm"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-gray-700">Licencia de Conducir (Opcional para bicicleta)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => updateData({ licenseImage: e.target.files?.[0] || null })}
          className="p-2 border rounded-lg text-sm"
        />
      </div>
    </div>
  );
};

const ReviewSubmitStep = () => {
  const { dto } = useRegisterWizardStore();
  return (
    <div className="flex flex-col gap-4 animate-fadeIn">
      <h2 className="text-xl font-bold text-[#3c606b]">Revisión de Datos</h2>
      <div className="bg-gray-100 p-4 rounded-lg text-sm text-gray-700">
        <p><strong>Nombre:</strong> {dto.firstName} {dto.lastName}</p>
        <p><strong>Email:</strong> {dto.email}</p>
        <p><strong>Vehículo:</strong> {dto.vehicleType} - {dto.plate || 'N/A'}</p>
        <p><strong>Documentos:</strong> {dto.idImage ? 'Cargado' : 'Faltante'}</p>
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
  const { step, nextStep, prevStep, submit, isLoading, error, isSuccess } = useRegisterWizardStore();

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
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`h-2 flex-1 mx-1 rounded-full ${step >= i ? 'bg-[#3c606b]' : 'bg-gray-200'}`} />
            ))}
          </div>

          {/* Switcher de Vistas */}
          <div className="min-h-[250px]">
            {step === 1 && <PersonalInfoStep />}
            {step === 2 && <VehicleInfoStep />}
            {step === 3 && <DocumentsStep />}
            {step === 4 && <ReviewSubmitStep />}
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
                onClick={step === 4 ? submit : nextStep} 
                disabled={isLoading} 
                className="px-6 py-3 rounded-lg font-semibold text-white bg-[#3c606b] hover:bg-[#2a454d] shadow-md hover:shadow-lg disabled:opacity-50 transition-all flex-1 sm:flex-none"
              >
                {isLoading ? 'Enviando...' : (step === 4 ? 'Finalizar Solicitud' : 'Siguiente')}
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};