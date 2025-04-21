import React, { useState } from 'react';
import { useHealth } from '../context/HealthContext';
import { toast } from 'sonner';

const HealthForm: React.FC = () => {
  const { addRecord } = useHealth();

  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [glycemia, setGlycemia] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [observations, setObservations] = useState('');
  const [date, setDate] = useState(() => {
    const now = new Date();
    return now.toISOString().substring(0, 16);
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      toast.error('Data inválida.');
      return;
    }

    addRecord({
      systolic: systolic ? parseInt(systolic) : undefined,
      diastolic: diastolic ? parseInt(diastolic) : undefined,
      glycemia: glycemia ? parseInt(glycemia) : undefined,
      heartRate: heartRate ? parseInt(heartRate) : undefined,
      observations,
      date: parsedDate,
    });

    // Limpar formulário
    setSystolic('');
    setDiastolic('');
    setGlycemia('');
    setHeartRate('');
    setObservations('');
    setDate(new Date().toISOString().substring(0, 16));

    // Mostrar toast de sucesso
    toast.success('Registro salvo com sucesso!');
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Novo Registro de Saúde</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Pressão Sistólica (mmHg)</label>
          <input
            type="number"
            value={systolic}
            onChange={(e) => setSystolic(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Ex: 120"
          />
        </div>
        <div>
          <label className="block mb-1">Pressão Diastólica (mmHg)</label>
          <input
            type="number"
            value={diastolic}
            onChange={(e) => setDiastolic(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Ex: 80"
          />
        </div>
        <div>
          <label className="block mb-1">Glicemia (mg/dL)</label>
          <input
            type="number"
            value={glycemia}
            onChange={(e) => setGlycemia(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Ex: 95"
          />
        </div>
        <div>
          <label className="block mb-1">Batimentos Cardíacos (bpm)</label>
          <input
            type="number"
            value={heartRate}
            onChange={(e) => setHeartRate(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Ex: 72"
          />
        </div>
        <div>
          <label className="block mb-1">Observações</label>
          <textarea
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            className="w-full p-2 border rounded"
            rows={3}
            placeholder="Ex: Após o almoço, dor de cabeça leve..."
          />
        </div>
        <div>
          <label className="block mb-1">Data e Hora</label>
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Salvar Registro
        </button>
      </form>
    </div>
  );
};

export default HealthForm;
