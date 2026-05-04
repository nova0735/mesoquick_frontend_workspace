import React from 'react';
import { useActiveOrderStore } from '../model/useActiveOrderStore';
import { MapViewer, ActionDropdownMenu } from '@mesoquick/ui-kit';

export interface ActiveOrderPanelProps {
  StatusStepButtonComponent?: React.ReactNode;
}

export const ActiveOrderPanel: React.FC<ActiveOrderPanelProps> = ({ StatusStepButtonComponent }) => {
  const { activeOrder } = useActiveOrderStore();

  if (!activeOrder) {
    return null;
  }

  return (
    <div className="flex flex-col h-full w-full bg-gray-50 overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 bg-white border-b shadow-sm z-10">
        <h2 className="text-lg font-bold text-gray-800">
          Order #{activeOrder.orderId?.slice(-6) || '...'}
        </h2>
        <ActionDropdownMenu 
          orderId={activeOrder.orderId || 'UNKNOWN_ORDER'} 
          onActionSelected={(action, id) => console.log(`Action ${action} triggered for order ${id}`)} 
        />
      </div>

      {/* Middle Area: Map */}
      <div className="flex-1 relative w-full bg-gray-200">
        <MapViewer center={activeOrder.destinationCoordinates || { lat: 0, lng: 0 }} />
      </div>

      {/* Bottom Sheet */}
      <div className="bg-white border-t rounded-t-3xl shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.1)] p-6 flex flex-col gap-5 z-10 relative">
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Customer</h3>
          <p className="text-xl font-bold text-gray-800">{activeOrder.customerName || activeOrder.businessOrSenderName || 'Loading...'}</p>
        </div>
        
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Delivery Address</h3>
          <p className="text-md font-medium text-gray-700 leading-snug">{activeOrder.destinationAddress}</p>
        </div>

        {StatusStepButtonComponent && (
          <div className="mt-2 pt-2 border-t border-gray-100">
            {StatusStepButtonComponent}
          </div>
        )}
      </div>
    </div>
  );
};