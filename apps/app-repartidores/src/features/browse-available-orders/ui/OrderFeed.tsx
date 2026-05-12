import React from 'react';
import { useFeedStore } from '../model/useFeedStore';
import { formatQuetzales } from '../../../shared/utils/currency';

export interface OrderFeedProps {
  onPreviewClick?: (orderId: string) => void;
}

export const OrderFeed: React.FC<OrderFeedProps> = ({ onPreviewClick }) => {
  const { availableOrders } = useFeedStore();

  return (
    <div className="w-full px-4 md:px-8 py-8 max-w-7xl mx-auto bg-[#f9f9f9] min-h-full">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#3C606B] tracking-tight mb-2">
          📦 Pedidos Disponibles
        </h1>
        <p className="text-gray-500 font-medium">Nuevas oportunidades de entrega cerca de ti.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          {availableOrders.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              No hay pedidos disponibles por el momento.
            </div>
          ) : (
            availableOrders.map((order) => (
              <div
                key={order.orderId}
                className="bg-white rounded-[24px] p-6 flex flex-col md:flex-row gap-6 shadow-sm border border-transparent hover:border-[#56BD64]/30 hover:shadow-xl transition-all"
              >
                <div className="w-full md:w-28 h-28 rounded-2xl bg-gray-100 flex-shrink-0"></div>
                
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-[#3C606B]">{order.businessOrSenderName}</h2>
                  <p className="text-gray-600">{order.estimatedDistanceKm} km de tu ubicación</p>
                  
                  <div className="mt-4 flex gap-3">
                    <div className="bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-bold">
                      {order.paymentMethod || 'Efectivo'}
                    </div>
                    <div className="bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-bold">
                      #{order.orderId ? order.orderId.substring(order.orderId.length - 6) : 'N/A'}
                    </div>
                    <div className="bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-bold">
                      {order.category}
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-auto flex flex-col items-start md:items-end flex-shrink-0">
                  <span className="block text-2xl font-extrabold text-[#3C606B]">
                    {formatQuetzales(order.offeredTariff)}
                  </span>
                  
                  <div className="flex flex-col gap-2 mt-4 w-full md:w-48">
                    <button className="w-full bg-[#56BD64] hover:bg-[#45a051] text-white font-bold py-3 px-6 rounded-full active:scale-95 transition-all shadow-md shadow-[#56BD64]/30">
                      Aceptar
                    </button>
                    <button
                      onClick={() => onPreviewClick?.(order.orderId)}
                      className="w-full border-2 border-gray-100 hover:border-gray-200 text-[#3C606B] font-bold py-3 px-6 rounded-full active:scale-95 transition-all"
                    >
                      Ver detalles
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <aside className="lg:col-span-4 space-y-8 hidden lg:block">
          <div className="bg-[#3C606B] p-8 rounded-[24px] text-white relative overflow-hidden">
            <p className="text-[#A7CDD9] text-sm font-semibold uppercase tracking-widest mb-1">
              Ganancias de Hoy
            </p>
            <h4 className="text-4xl font-extrabold mb-6">Q245.50</h4>
            
            <div className="flex justify-between items-center mb-2">
              <span className="text-[#A7CDD9]">Entregas completas:</span>
              <span className="font-bold">12</span>
            </div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-[#A7CDD9]">Tiempo en línea:</span>
              <span className="font-bold">4h 22m</span>
            </div>
            
            <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
              <div className="bg-[#EDCA11] h-full" style={{ width: '75%' }}></div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};