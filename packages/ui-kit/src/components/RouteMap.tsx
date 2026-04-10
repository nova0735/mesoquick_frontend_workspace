import React from 'react';

interface RouteMapProps {
  originCoordinates?: { lat: number; lng: number };
  destinationCoordinates?: { lat: number; lng: number };
}

// Usamos 'props' genérico en lugar de desestructurar para evitar la advertencia de 'no usado'
export const RouteMap = (props: RouteMapProps) => {
  return (
    <div className="w-full h-96 bg-gray-200 flex items-center justify-center rounded-lg">
      <p className="text-gray-600">Google Maps Integration Pending...</p>
    </div>
  );
};