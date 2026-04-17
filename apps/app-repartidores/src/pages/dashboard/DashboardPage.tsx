import React, { useState } from 'react';
import { useActiveOrderStore } from '../../features/manage-active-order/model/useActiveOrderStore';
import { ActiveOrderPanel } from '../../features/manage-active-order/ui/ActiveOrderPanel';
import { OrderFeed } from '../../features/browse-available-orders/ui/OrderFeed';
import { StatusToggle } from '../../features/toggle-courier-status/ui/StatusToggle';
import { StatusStepButton } from '../../features/update-order-status/ui/StatusStepButton';

export const DashboardPage: React.FC = () => {
  const activeOrder = useActiveOrderStore((state) => state.activeOrder);
  const [currentView, setCurrentView] = useState<'pedidos' | 'billetera' | 'soporte' | 'perfil'>('pedidos');

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
      <div className="bg-[#F7F7F7] min-h-screen w-full font-['Montserrat'] flex">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex fixed left-0 top-0 h-full w-72 flex-col p-6 z-50 bg-[#3C606B] shadow-2xl space-y-6">
          <h1 className="text-2xl font-extrabold text-white mb-8">Meso<span className="text-[#56BD64]">Quick</span></h1>
          
          <div className="flex items-center space-x-3 mb-6 p-4 bg-white/10 rounded-2xl">
            <div className="w-12 h-12 bg-gray-200 flex-shrink-0 rounded-full"></div>
            <div>
              <p className="font-bold text-white">Juan Repartidor</p>
              <p className="text-xs text-[#56BD64]">Repartidor Activo</p>
            </div>
          </div>

          <nav className="flex flex-col space-y-2">
            <button 
              onClick={() => setCurrentView('pedidos')}
              className={`flex items-center space-x-4 px-4 py-3 rounded-xl transition-all ${
                currentView === 'pedidos' ? 'bg-[#56BD64] text-white font-bold shadow-md' : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="material-symbols-outlined">local_shipping</span>
              <span>Pedidos</span>
            </button>
            <button 
              onClick={() => setCurrentView('billetera')}
              className={`flex items-center space-x-4 px-4 py-3 rounded-xl transition-all ${
                currentView === 'billetera' ? 'bg-[#56BD64] text-white font-bold shadow-md' : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="material-symbols-outlined">account_balance_wallet</span>
              <span>Billetera</span>
            </button>
            <button 
              onClick={() => setCurrentView('soporte')}
              className={`flex items-center space-x-4 px-4 py-3 rounded-xl transition-all ${
                currentView === 'soporte' ? 'bg-[#56BD64] text-white font-bold shadow-md' : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="material-symbols-outlined">support_agent</span>
              <span>Soporte</span>
            </button>
            <button 
              onClick={() => setCurrentView('perfil')}
              className={`flex items-center space-x-4 px-4 py-3 rounded-xl transition-all ${
                currentView === 'perfil' ? 'bg-[#56BD64] text-white font-bold shadow-md' : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="material-symbols-outlined">person</span>
              <span>Perfil</span>
            </button>
          </nav>
        </aside>

        {/* Mobile Header */}
        <header className="md:hidden fixed top-0 w-full z-40 bg-white/90 backdrop-blur-md flex justify-between items-center px-6 py-4 shadow-sm">
          <h1 className="text-xl font-extrabold text-[#56BD64]">MesoQuick</h1>
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 md:ml-72 pt-20 md:pt-0 pb-20 md:pb-0 relative min-h-screen">
          {/* Kinetic Curve Accent */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#56BD64]/5 [clip-path:ellipse(80%_50%_at_50%_0%)] -rotate-12 pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 relative z-10 h-full flex flex-col">
            {currentView === 'pedidos' ? (
              <>
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                  <h2 className="text-2xl font-extrabold text-[#3C606B]">📦 Tus Entregas</h2>
                  <StatusToggle />
                </div>
                
                <div className="flex-1">
                  {activeOrder !== null ? (
                    <ActiveOrderPanel 
                      StatusStepButtonComponent={
                        <StatusStepButton 
                          orderId={activeOrder.orderId} 
                          currentStatus={activeOrder.currentStatus} 
                        />
                      } 
                    />
                  ) : (
                    <OrderFeed />
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 bg-white rounded-3xl border-2 border-dashed border-[#3C606B]/20 text-center p-8 mt-12">
                <span className="material-symbols-outlined text-5xl text-[#3C606B] mb-4">construction</span>
                <h3 className="text-xl font-bold text-[#3C606B]">Área en Construcción</h3>
                <p className="text-[#3C606B]">Este módulo será integrado por el equipo de desarrollo correspondiente.</p>
              </div>
            )}
          </div>
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden fixed bottom-0 w-full bg-[#3C606B] flex justify-around items-center py-3 z-50">
          <button 
            onClick={() => setCurrentView('pedidos')}
            className={`flex flex-col items-center space-y-1 ${currentView === 'pedidos' ? 'text-[#56BD64]' : 'text-gray-400'}`}
          >
            <span className="material-symbols-outlined">local_shipping</span>
            <span className="text-[10px] font-bold">Pedidos</span>
          </button>
          <button 
            onClick={() => setCurrentView('billetera')}
            className={`flex flex-col items-center space-y-1 ${currentView === 'billetera' ? 'text-[#56BD64]' : 'text-gray-400'}`}
          >
            <span className="material-symbols-outlined">account_balance_wallet</span>
            <span className="text-[10px] font-bold">Billetera</span>
          </button>
          <button 
            onClick={() => setCurrentView('soporte')}
            className={`flex flex-col items-center space-y-1 ${currentView === 'soporte' ? 'text-[#56BD64]' : 'text-gray-400'}`}
          >
            <span className="material-symbols-outlined">support_agent</span>
            <span className="text-[10px] font-bold">Soporte</span>
          </button>
          <button 
            onClick={() => setCurrentView('perfil')}
            className={`flex flex-col items-center space-y-1 ${currentView === 'perfil' ? 'text-[#56BD64]' : 'text-gray-400'}`}
          >
            <span className="material-symbols-outlined">person</span>
            <span className="text-[10px] font-bold">Perfil</span>
          </button>
        </nav>
      </div>
    </>
  );
};