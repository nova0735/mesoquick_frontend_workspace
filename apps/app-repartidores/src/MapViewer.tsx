import React, { useMemo } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  color?: string;
}

export interface MapViewerProps {
  apiKey: string;
  center: { lat: number; lng: number };
  zoom: number;
  markers?: MapMarker[];
  className?: string;
}

/**
 * COMPONENTE DUMB: MapViewer
 *
 * 🛡️ PATRÓN DE INYECCIÓN DE API KEY:
 * Al obligar a que la `apiKey` pase como prop desde la aplicación consumidora 
 * (Ej. app-repartidores, app-clientes), mantenemos este paquete (ui-kit) 
 * completamente agnóstico a la lógica de negocio y a los secretos de entorno.
 * 
 * El ui-kit NUNCA debe leer variables como `import.meta.env.VITE_MAPS_KEY` 
 * directamente. Esto garantiza que el componente sea un bloque de construcción 
 * genérico, y centraliza el manejo de credenciales en las aplicaciones.
 */
export const MapViewer: React.FC<MapViewerProps> = ({
  apiKey,
  center,
  zoom,
  markers = [],
  className = 'w-full h-full min-h-[400px]', // Altura mínima por defecto para evitar que el mapa colapse
}) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
  });

  // Memorizamos el centro para evitar re-renderizados innecesarios del mapa
  const mapCenter = useMemo(() => center, [center.lat, center.lng]);

  if (loadError) {
    return (
      <div className={`flex items-center justify-center bg-gray-200 text-red-600 font-semibold ${className}`}>
        Error al cargar el mapa. Verifica tu conexión o la clave de API.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className={`flex flex-col items-center justify-center bg-gray-200 text-gray-600 ${className}`}>
        <div className="w-10 h-10 border-4 border-gray-400 border-t-[#3c606b] rounded-full animate-spin mb-3"></div>
        <p className="font-medium">Cargando mapa...</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={mapCenter}
        zoom={zoom}
        options={{
          disableDefaultUI: true, // Interfaz limpia por defecto
          zoomControl: true,      // Permitimos hacer zoom manual
        }}
      >
        {markers.map((marker) => (
          <Marker key={marker.id} position={{ lat: marker.lat, lng: marker.lng }} />
        ))}
      </GoogleMap>
    </div>
  );
};