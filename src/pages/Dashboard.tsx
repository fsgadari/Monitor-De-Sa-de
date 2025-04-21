import React, { useState } from 'react';
import { useHealth } from '../context/HealthContext';
import DateFilterSelector from '../components/DateFilterSelector';
import GlycemiaChart from '../components/GlycemiaChart';
import BloodPressureChart from '../components/BloodPressureChart';
import HeartRateChart from '../components/HeartRateChart';
import { DateFilter } from '../types';
import { applyDateFilter } from '../utils/dateFilters';
import { Link } from 'react-router-dom';
import { PlusCircle, ListPlus } from 'lucide-react';
import { generatePDF } from '../utils/pdfGenerator';

const Dashboard: React.FC = () => {
  const { records } = useHealth();
  const [dateFilter, setDateFilter] = useState<DateFilter>({ type: 'last7days' });

  const filteredRecords = applyDateFilter(records, dateFilter);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>

        <Link
          to="/form"
          className="bg-blue-600 text-white py-2 px-4 rounded-full flex items-center gap-2 hover:bg-blue-700 transition duration-200 shadow-sm"
        >
          <PlusCircle size={18} />
          <span>Novo Registro</span>
        </Link>
      </div>

      {records.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <div className="text-gray-500 mb-4">
            Nenhum registro de saúde encontrado
          </div>
          <Link
            to="/form"
            className="inline-flex items-center gap-2 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            <ListPlus size={20} />
            <span>Adicionar Primeiro Registro</span>
          </Link>
        </div>
      ) : (
        <>
          <DateFilterSelector filter={dateFilter} onChange={setDateFilter} />

          <div id="glycemia-chart">
            <GlycemiaChart records={filteredRecords} />
          </div>

          <div id="blood-pressure-chart">
            <BloodPressureChart records={filteredRecords} />
          </div>

          <div id="heart-rate-chart">
            <HeartRateChart records={filteredRecords} />
          </div>

          <div className="text-center mt-6 space-y-3">
            <Link
              to="/records"
              className="text-blue-600 hover:text-blue-800 font-medium block"
            >
              Ver tabela completa de registros →
            </Link>

            <button
              onClick={() => generatePDF(records)}
              className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200"
            >
              Gerar PDF com Gráficos
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
