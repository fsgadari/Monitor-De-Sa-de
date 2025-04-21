import React, { useState } from 'react';
import { useHealth } from '../context/HealthContext';
import DateFilterSelector from '../components/DateFilterSelector';
import { DateFilter } from '../types';
import { applyDateFilter } from '../utils/dateFilters';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Trash2, FilePlus, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const RecordsTable: React.FC = () => {
  const { records, deleteRecord, clearAllRecords } = useHealth();
  const [dateFilter, setDateFilter] = useState<DateFilter>({ type: 'last30days' });

  const filteredRecords = applyDateFilter(records, dateFilter);
  const sortedRecords = [...filteredRecords].sort((a, b) => b.date.getTime() - a.date.getTime());

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este registro?')) {
      deleteRecord(id);
    }
  };

  const handleGeneratePDF = async () => {
    await new Promise(resolve => setTimeout(resolve, 500)); // aguarda o DOM atualizar
    const { generatePDF } = await import('../utils/pdfGenerator');
    generatePDF(records);
  };

  const isBloodPressureAbnormal = (systolic?: number, diastolic?: number): boolean => {
    if (systolic === undefined || diastolic === undefined) return false;
    return (systolic < 90 || systolic > 139) || (diastolic < 60 || diastolic > 90);
  };

  const isGlycemiaAbnormal = (glycemia?: number): boolean => {
    if (glycemia === undefined) return false;
    return glycemia < 70 || glycemia > 180;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Registros</h2>

        <div className="flex gap-2">
          <Link
            to="/form"
            className="bg-blue-600 text-white py-2 px-4 rounded-md flex items-center gap-1 hover:bg-blue-700 transition-colors"
          >
            <FilePlus size={18} />
            <span className="hidden sm:inline">Novo Registro</span>
          </Link>

          <button
            onClick={handleGeneratePDF}
            className="bg-green-600 text-white py-2 px-4 rounded-md flex items-center gap-1 hover:bg-green-700 transition-colors"
            disabled={records.length === 0}
          >
            <FileText size={18} />
            <span className="hidden sm:inline">Gerar PDF</span>
          </button>
        </div>
      </div>

      {records.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <div className="text-gray-500 mb-4">Nenhum registro de saúde encontrado</div>
          <Link
            to="/form"
            className="inline-flex items-center gap-2 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            <FilePlus size={20} />
            <span>Adicionar Primeiro Registro</span>
          </Link>
        </div>
      ) : (
        <>
          <DateFilterSelector filter={dateFilter} onChange={setDateFilter} />

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-800">
                Registros: <span className="text-gray-600">{sortedRecords.length}</span>
              </h3>

              <button
                onClick={clearAllRecords}
                className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center gap-1"
              >
                <Trash2 size={16} />
                <span>Limpar todos</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data/Hora</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pressão Arterial</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Glicemia</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Freq. Cardíaca</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Observações</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedRecords.map((record) => (
                    <tr key={record.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="block sm:hidden">{format(record.date, 'dd/MM HH:mm')}</span>
                        <span className="hidden sm:block">
                          {format(record.date, 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {record.systolic && record.diastolic ? (
                          <span
                            className={
                              isBloodPressureAbnormal(record.systolic, record.diastolic)
                                ? 'text-red-600 font-medium'
                                : 'text-gray-900'
                            }
                          >
                            {record.systolic}/{record.diastolic}
                            <span className="hidden sm:inline"> mmHg</span>
                          </span>
                        ) : (
                          <span className="text-gray-400"> </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {record.glycemia !== undefined ? (
                          <span
                            className={
                              isGlycemiaAbnormal(record.glycemia)
                                ? 'text-red-600 font-medium'
                                : 'text-gray-900'
                            }
                          >
                            {record.glycemia}
                            <span className="hidden sm:inline"> mg/dL</span>
                          </span>
                        ) : (
                          <span className="text-gray-400"> </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.heartRate !== undefined ? (
                          <>
                            {record.heartRate}
                            <span className="hidden sm:inline"> bpm</span>
                          </>
                        ) : (
                          <span className="text-gray-400"> </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                        {record.observations || <span className="text-gray-400"> </span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDelete(record.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Excluir registro"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {sortedRecords.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                Nenhum registro encontrado para o período selecionado
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default RecordsTable;
