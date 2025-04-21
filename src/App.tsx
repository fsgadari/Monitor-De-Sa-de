import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HealthProvider } from './context/HealthContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import HealthForm from './pages/HealthForm';
import RecordsTable from './pages/RecordsTable';
import { Toaster } from 'sonner'; // 👈 Importa o Toaster do sonner

function App() {
  return (
    <HealthProvider>
      <Router>
        {/* Toaster global para exibir popups */}
        <Toaster position="top-center" richColors />
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/form" element={<HealthForm />} />
            <Route path="/records" element={<RecordsTable />} />
          </Routes>
        </Layout>
      </Router>
    </HealthProvider>
  );
}

export default App;
