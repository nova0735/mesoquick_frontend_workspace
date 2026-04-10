import React from 'react';
import { Link } from 'react-router-dom';

export const BaseSidebar: React.FC = () => {
  return (
    <aside className="w-64 min-h-screen bg-primary text-base flex flex-col shadow-lg">
      <div className="p-6 text-2xl font-bold border-b border-base/20">
        MesoQuick
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <Link to="/dashboard" className="block px-4 py-3 rounded hover:bg-base hover:text-primary transition-colors font-medium">ORDERS</Link>
        <Link to="/wallet" className="block px-4 py-3 rounded hover:bg-base hover:text-primary transition-colors font-medium">VIRTUAL WALLET</Link>
        <Link to="/support" className="block px-4 py-3 rounded hover:bg-base hover:text-primary transition-colors font-medium">TECHNICAL SUPPORT</Link>
        <Link to="/profile" className="block px-4 py-3 rounded hover:bg-base hover:text-primary transition-colors font-medium">PROFILE</Link>
      </nav>
      <div className="p-4 border-t border-base/20">
        <button className="w-full px-4 py-2 text-left rounded hover:bg-red-600 hover:text-white transition-colors">LOGOUT</button>
      </div>
    </aside>
  );
};