import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ptBR } from 'date-fns/locale';
import { Calendar } from 'lucide-react';
import { DateFilter, DateFilterType } from '../types';
import { getFilterLabel } from '../utils/dateFilters';

registerLocale('pt-BR', ptBR);

interface DateFilterSelectorProps {
  filter: DateFilter;
  onChange: (filter: DateFilter) => void;
}

const DateFilterSelector: React.FC<DateFilterSelectorProps> = ({ filter, onChange }) => {
  const [showCustomDates, setShowCustomDates] = useState(filter.type === 'custom');
  
  const handleFilterTypeChange = (type: DateFilterType) => {
    if (type === 'custom') {
      setShowCustomDates(true);
      onChange({
        type,
        startDate: filter.startDate || new Date(),
        endDate: filter.endDate || new Date()
      });
    } else {
      setShowCustomDates(false);
      onChange({ type });
    }
  };
  
  const handleStartDateChange = (date: Date) => {
    onChange({
      ...filter,
      startDate: date
    });
  };
  
  const handleEndDateChange = (date: Date) => {
    onChange({
      ...filter,
      endDate: date
    });
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <h3 className="text-lg font-medium text-gray-800 mb-3">Filtro de Período</h3>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => handleFilterTypeChange('today')}
          className={`px-3 py-1.5 rounded-full text-sm ${
            filter.type === 'today' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          Hoje
        </button>
        
        <button
          onClick={() => handleFilterTypeChange('last7days')}
          className={`px-3 py-1.5 rounded-full text-sm ${
            filter.type === 'last7days' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          Últimos 7 dias
        </button>
        
        <button
          onClick={() => handleFilterTypeChange('last30days')}
          className={`px-3 py-1.5 rounded-full text-sm ${
            filter.type === 'last30days' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          Últimos 30 dias
        </button>
        
        <button
          onClick={() => handleFilterTypeChange('custom')}
          className={`px-3 py-1.5 rounded-full text-sm ${
            filter.type === 'custom' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          Personalizado
        </button>
      </div>
      
      {showCustomDates && (
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative w-full sm:w-auto">
            <DatePicker
              selected={filter.startDate}
              onChange={handleStartDateChange}
              selectsStart
              startDate={filter.startDate}
              endDate={filter.endDate}
              dateFormat="dd/MM/yyyy"
              locale="pt-BR"
              className="pl-9 p-2 w-full border border-gray-300 rounded-md shadow-sm"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              <Calendar size={16} />
            </div>
          </div>
          
          <span className="text-gray-500">até</span>
          
          <div className="relative w-full sm:w-auto">
            <DatePicker
              selected={filter.endDate}
              onChange={handleEndDateChange}
              selectsEnd
              startDate={filter.startDate}
              endDate={filter.endDate}
              minDate={filter.startDate}
              dateFormat="dd/MM/yyyy"
              locale="pt-BR"
              className="pl-9 p-2 w-full border border-gray-300 rounded-md shadow-sm"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              <Calendar size={16} />
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-2 text-sm text-gray-500">
        Exibindo: <span className="font-medium">{getFilterLabel(filter)}</span>
      </div>
    </div>
  );
};

export default DateFilterSelector;