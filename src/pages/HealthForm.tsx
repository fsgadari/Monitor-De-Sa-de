import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ptBR } from 'date-fns/locale';
import { useHealth } from '../context/HealthContext';

// Register Portuguese locale
registerLocale('pt-BR', ptBR);

const HealthForm: React.FC = () => {
  const navigate = useNavigate();
  const { addRecord } = useHealth();
  
  const [date, setDate] = useState<Date>(new Date());
  const [systolic, setSystolic] = useState<string>('');
  const [diastolic, setDiastolic] = useState<string>('');
  const [glycemia, setGlycemia] = useState<string>('');
  const [heartRate, setHeartRate] = useState<string>('');
  const [observations, setObservations] = useState<string>('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addRecord({
      date,
      systolic: systolic ? Number(systolic) : undefined,
      diastolic: diastolic ? Number(diastolic) : undefined,
      glycemia: glycemia ? Number(glycemia) : undefined,
      heartRate: heartRate ? Number(heartRate) : undefined,
      observations: observations || undefined
    });
    
    // Reset form
    setSystolic('');
    setDiastolic('');
    setGlycemia('');
    setHeartRate('');
    setObservations('');
    
    // Show success message
    alert('Registro adicionado com sucesso!');
    
    // Navigate to records
    navigate('/records');
  };
  
  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Novo Registro de Saúde</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Data e Hora <span className="text-red-500">*</span>
            </label>
            <DatePicker
              id="date"
              selected={date}
              onChange={(date: Date) => setDate(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="Hora"
              dateFormat="dd/MM/yyyy HH:mm"
              locale="pt-BR"
              className="block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring focus:ring-blue-200"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="systolic" className="block text-sm font-medium text-gray-700">
                Pressão Sistólica (mmHg)
              </label>
              <input
                type="number"
                id="systolic"
                value={systolic}
                onChange={(e) => setSystolic(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring focus:ring-blue-200"
                placeholder="Ex: 120"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="diastolic" className="block text-sm font-medium text-gray-700">
                Pressão Diastólica (mmHg)
              </label>
              <input
                type="number"
                id="diastolic"
                value={diastolic}
                onChange={(e) => setDiastolic(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring focus:ring-blue-200"
                placeholder="Ex: 80"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="glycemia" className="block text-sm font-medium text-gray-700">
                Glicemia (mg/dL)
              </label>
              <input
                type="number"
                id="glycemia"
                value={glycemia}
                onChange={(e) => setGlycemia(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring focus:ring-blue-200"
                placeholder="Ex: 100"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="heartRate" className="block text-sm font-medium text-gray-700">
                Frequência Cardíaca (bpm)
              </label>
              <input
                type="number"
                id="heartRate"
                value={heartRate}
                onChange={(e) => setHeartRate(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring focus:ring-blue-200"
                placeholder="Ex: 70"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="observations" className="block text-sm font-medium text-gray-700">
              Observações
            </label>
            <textarea
              id="observations"
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              rows={3}
              className="block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring focus:ring-blue-200"
              placeholder="Observações adicionais..."
            />
          </div>
          
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 transition duration-200 shadow-md"
            >
              Salvar Registro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HealthForm;