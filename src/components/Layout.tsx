import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FilePlus, ListChecks, Home } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-gradient-to-r from-blue-600 to-teal-500 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Monitoramento de Saúde</h1>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 md:p-6">
        {children}
      </main>

      <nav className="bg-white border-t border-gray-200 fixed bottom-0 w-full shadow-lg z-50">
        <div className="container mx-auto px-4">
          <ul className="flex justify-around">
            <li className="flex-1">
              <Link 
                to="/" 
                className={`flex flex-col items-center justify-center py-4 ${
                  isActive('/') ? 'text-blue-600' : 'text-gray-500 hover:text-blue-500'
                }`}
              >
                <Home size={24} />
                <span className="text-xs mt-1">Início</span>
              </Link>
            </li>
            <li className="flex-1">
              <Link 
                to="/form" 
                className={`flex flex-col items-center justify-center py-4 ${
                  isActive('/form') ? 'text-blue-600' : 'text-gray-500 hover:text-blue-500'
                }`}
              >
                <FilePlus size={24} />
                <span className="text-xs mt-1">Novo</span>
              </Link>
            </li>
            <li className="flex-1">
              <Link 
                to="/records" 
                className={`flex flex-col items-center justify-center py-4 ${
                  isActive('/records') ? 'text-blue-600' : 'text-gray-500 hover:text-blue-500'
                }`}
              >
                <ListChecks size={24} />
                <span className="text-xs mt-1">Registros</span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Espaço para a navegação fixa não cobrir conteúdo */}
      <div className="h-20"></div>
    </div>
  );
};

export default Layout;
