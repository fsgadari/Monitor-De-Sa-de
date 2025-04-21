import React, { useState } from 'react';
import { useHealth } from '../context/HealthContext';

const HealthForm: React.FC = () => {
  const { addRecord } = useHealth();

  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [glucose, setGlucose] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(() => {
    const now = new Date();
    const iso = now.toISOString();
    return iso.substring(0, 16); // yyyy-MM-ddTHH:mm
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      alert('Data inválida.');
      return;
    }

    addRecord({
      systolic: systolic ? parseInt(systolic) : undefined,
      diastolic: diastolic ? parseInt(diastolic) : undefined,
      glucose: glucose ? parseInt(glucose) : undefined,
      heartRate: heartRate ? parseInt(heartRate) : undefined,
      notes,
      date: parsedDate,
    });

    // Limpar formulário
    setSystolic('');
    setDiastolic('');
    setGlucose('');
    setHeartRate('');
    setNotes('');
    setDate(new Date().toISOString().substring(0, 16));
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
            value={glucose}
            onChange={(e) => setGlucose(e.target.value)}
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
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
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
