import React, { createContext, useContext, useState, useEffect } from 'react';
import { HealthRecord } from '../types';

interface HealthContextType {
  records: HealthRecord[];
  addRecord: (record: Omit<HealthRecord, 'id'>) => void;
  deleteRecord: (id: string) => void;
  clearAllRecords: () => void;
}

const HealthContext = createContext<HealthContextType | undefined>(undefined);

export const useHealth = () => {
  const context = useContext(HealthContext);
  if (!context) {
    throw new Error('useHealth must be used within a HealthProvider');
  }
  return context;
};

export const HealthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [records, setRecords] = useState<HealthRecord[]>([]);

  // Carrega os dados do localStorage uma vez, ao montar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedRecords = localStorage.getItem('healthRecords');
      if (savedRecords) {
        try {
          const parsed = JSON.parse(savedRecords);
          const recordsParsed = parsed.map((record: any) => ({
            ...record,
            date: new Date(record.date)
          }));
          setRecords(recordsParsed);
        } catch (e) {
          console.error('Erro ao carregar os registros do localStorage:', e);
        }
      }
    }
  }, []);

  // Salva os dados sempre que records mudar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('healthRecords', JSON.stringify(records));
    }
  }, [records]);

  const addRecord = (record: Omit<HealthRecord, 'id'>) => {
    const newRecord: HealthRecord = {
      ...record,
      id: crypto.randomUUID()
    };
    setRecords(prev => [newRecord, ...prev]);
  };

  const deleteRecord = (id: string) => {
    setRecords(prev => prev.filter(record => record.id !== id));
  };

  const clearAllRecords = () => {
    if (window.confirm('Tem certeza que deseja limpar todos os registros? Esta ação não pode ser desfeita.')) {
      setRecords([]);
    }
  };

  return (
    <HealthContext.Provider value={{ records, addRecord, deleteRecord, clearAllRecords }}>
      {children}
    </HealthContext.Provider>
  );
};
