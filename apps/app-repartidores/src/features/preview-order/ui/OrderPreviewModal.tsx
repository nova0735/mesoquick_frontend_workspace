import React from 'react';
import { usePreviewStore } from '../model/usePreviewStore';
import { formatQuetzales } from '../../../shared/utils/currency';
import { MapViewer } from '@mesoquick/ui-kit';

export interface OrderPreviewModalProps {
  AcceptButtonComponent?: React.ReactNode;
}

export const OrderPreviewModal: React.FC<OrderPreviewModalProps> = ({ AcceptButtonComponent }) => {
  const { isOpen, selectedOrder, isLoading, closePreview } = usePreviewStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="flex flex-col w-full max-w-md max-h-[90vh] overflow-hidden bg-white rounded-lg shadow-xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Order Preview</h2>
          <button onClick={closePreview} className="text-gray-500 hover:text-gray-800">
            ✕
          </button>
        </div>
        
        <div className="flex flex-col flex-1 gap-4 p-4 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <div className="w-8 h-8 border-b-2 border-indigo-600 rounded-full animate-spin"></div>
            </div>
          ) : selectedOrder ? (
            <>
              <div className="relative w-full h-48 overflow-hidden bg-gray-100 rounded">
                <MapViewer center={selectedOrder.originCoordinates} />
              </div>
              
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-600">Tariff:</span>
                  <span className="text-lg font-bold text-green-600">
                    {formatQuetzales(selectedOrder.offeredTariff)}
                  </span>
                </div>
                
                <div className="p-3 border rounded bg-gray-50">
                  <h3 className="mb-1 text-xs font-semibold uppercase text-gray-500">Pickup Address</h3>
                  <p className="text-sm text-gray-800">{selectedOrder.originAddress}</p>
                </div>
                
                <div className="p-3 border rounded bg-gray-50">
                  <h3 className="mb-1 text-xs font-semibold uppercase text-gray-500">Delivery Address</h3>
                  <p className="text-sm text-gray-800">{selectedOrder.destinationAddress}</p>
                </div>
              </div>
            </>
          ) : (
            <div className="py-10 text-center text-gray-500">Failed to load order details.</div>
          )}
        </div>
        
        {AcceptButtonComponent && selectedOrder && !isLoading && (
          <div className="p-4 border-t bg-gray-50">{AcceptButtonComponent}</div>
        )}
      </div>
    </div>
  );
};