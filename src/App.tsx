import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HealthProvider } from './context/HealthContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard'; // <- Recoloque isso
import HealthForm from './pages/HealthForm';
import RecordsTable from './pages/RecordsTable';
import { Toaster } from 'sonner';

function App() {
  return (
    <HealthProvider>
      <Router>
        <Toaster position="top-center" richColors />
        <Layout>
          <Routes>
            <Route path="/" element={<HealthForm />} /> {/* Formulário é a página inicial */}
            <Route path="/form" element={<HealthForm />} />
            <Route path="/records" element={<RecordsTable />} />
            <Route path="/dashboard" element={<Dashboard />} /> {/* <- Adicionado de volta */}
          </Routes>
        </Layout>
      </Router>
    </HealthProvider>
  );
}

export default App;
