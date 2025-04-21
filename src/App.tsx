import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, FilePlus, List } from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useSafeLocation();

  return (
    <div className="relative min-h-screen flex flex-col bg-gray-100">
      <main className="flex-1 pb-20">{children}</main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md z-50">
        <div className="flex justify-around items-center h-16">
          <NavItem to="/" icon={<Home size={24} />} active={location.pathname === '/'} label="Início" />
          <NavItem to="/form" icon={<FilePlus size={24} />} active={location.pathname === '/form'} label="Novo" />
          <NavItem to="/records" icon={<List size={24} />} active={location.pathname === '/records'} label="Registros" />
        </div>
      </nav>
    </div>
  );
};

const NavItem = ({
  to,
  icon,
  active,
  label,
}: {
  to: string;
  icon: React.ReactNode;
  active: boolean;
  label: string;
}) => (
  <Link
    to={to}
    className={`flex flex-col items-center ${
      active ? 'text-blue-600' : 'text-gray-600'
    } hover:text-blue-500 transition-colors`}
  >
    {icon}
    <span className="text-xs">{label}</span>
  </Link>
);

// Hook seguro para evitar erro do useLocation fora do Router
const useSafeLocation = () => {
  try {
    return useLocation();
  } catch {
    return { pathname: '/' };
  }
};

export default Layout;
