// src/components/Layout.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, FilePlus, List } from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen pb-20 bg-gray-100">
      <main className="p-4">{children}</main>

      {/* Barra de navegação fixa inferior */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-md z-50">
        <div className="flex justify-around py-2">
          <Link to="/" className={`flex flex-col items-center text-sm ${isActive('/') ? 'text-blue-600' : 'text-gray-500 hover:text-blue-500'}`}>
            <Home size={24} />
            Início
          </Link>

          <Link to="/form" className={`flex flex-col items-center text-sm ${isActive('/form') ? 'text-blue-600' : 'text-gray-500 hover:text-blue-500'}`}>
            <FilePlus size={24} />
            Novo
          </Link>

          <Link to="/records" className={`flex flex-col items-center text-sm ${isActive('/records') ? 'text-blue-600' : 'text-gray-500 hover:text-blue-500'}`}>
            <List size={24} />
            Registros
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Layout;
