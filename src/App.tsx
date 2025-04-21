import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HealthProvider } from './context/HealthContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import HealthForm from './pages/HealthForm';
import RecordsTable from './pages/RecordsTable';

function App() {
  return (
    <HealthProvider>
      <Router>
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
