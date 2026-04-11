import React from 'react';

interface MapViewerProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  apiKey?: string;
  className?: string;
}

export const MapViewer: React.FC<MapViewerProps> = ({ 
  center = { lat: 14.6349, lng: -90.5069 }, 
  zoom = 14,
  className = ""
}) => {
  return (
    <div className={`relative bg-gray-100 flex items-center justify-center w-full h-full min-h-[300px] rounded-xl overflow-hidden ${className}`}>
      <div className="text-center">
        <span className="text-5xl block mb-2">📍</span>
        <p className="font-bold text-[#3c606b]">Mapa de MesoQuick</p>
        <p className="text-xs text-gray-400">
          Lat: {center.lat} | Lng: {center.lng}
        </p>
      </div>
      {/* Simulación de cuadrícula de mapa */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }} 
      />
    </div>
  );
};