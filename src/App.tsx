import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, FilePlus, List } from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 pb-16">{children}</main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 shadow-md z-50">
        <div className="flex justify-around items-center h-16">
          <Link to="/" className={`flex flex-col items-center ${location.pathname === '/' ? 'text-blue-600' : 'text-gray-600'}`}>
            <Home size={24} />
            <span className="text-xs">Início</span>
          </Link>
          <Link to="/form" className={`flex flex-col items-center ${location.pathname === '/form' ? 'text-blue-600' : 'text-gray-600'}`}>
            <FilePlus size={24} />
            <span className="text-xs">Novo</span>
          </Link>
          <Link to="/records" className={`flex flex-col items-center ${location.pathname === '/records' ? 'text-blue-600' : 'text-gray-600'}`}>
            <List size={24} />
            <span className="text-xs">Registros</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Layout;
