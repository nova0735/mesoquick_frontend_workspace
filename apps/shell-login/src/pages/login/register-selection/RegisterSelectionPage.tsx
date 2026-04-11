import React from 'react';
import { useNavigate } from 'react-router-dom';
import { REGISTRATION_LINKS } from '../../../shared/config/app-registry';

export const RegisterSelectionPage: React.FC = () => {
  const navigate = useNavigate();

  const handleRedirect = (url: string, role: string) => {
    console.log(`Intentando redirigir al rol: ${role} en la URL: ${url}`);
    if (url) {
      window.location.assign(url);
    } else {
      console.error("¡Error! La URL está vacía. Revisa app-registry.ts");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f7f7] px-4">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-lg text-center">
        
        <h2 className="text-3xl font-bold text-[#3c606b] mb-2">
          Únete a MesoQuick
        </h2>
        <p className="text-gray-500 mb-8">
          Selecciona el tipo de cuenta que deseas crear:
        </p>

        <div className="grid gap-4">
          {REGISTRATION_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => handleRedirect(link.url, link.label)} 
              className="w-full bg-white border-2 font-semibold p-4 rounded-lg transition-all duration-300 transform hover:-translate-y-1 shadow-sm hover:shadow-md"
              style={{ borderColor: link.color, color: link.color }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = link.color;
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.color = link.color;
              }}
            >
              <span className="text-lg">{link.label}</span>
            </button>
          ))}
        </div>

        <button onClick={() => navigate('/')} className="text-sm text-[#3c606b] hover:underline mt-6 block w-full text-center">
          Volver al inicio de sesión
        </button>
      </div>
    </div>
  );
};