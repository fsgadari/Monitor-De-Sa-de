import React, { createContext, useContext, useState, useEffect } from 'react';
import { HealthRecord } from '../types';
import { db } from '../firebase'; // importa a instância do Firestore
import { collection, addDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';

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

  useEffect(() => {
    const fetchRecords = async () => {
      const querySnapshot = await getDocs(collection(db, 'health-records'));
      const loadedRecords: HealthRecord[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        loadedRecords.push({
          id: docSnap.id,
          date: new Date(data.date),
          systolic: data.systolic,
          diastolic: data.diastolic,
          glycemia: data.glycemia,
          heartRate: data.heartRate,
          observations: data.observations
        });
      });
      // Ordena por data decrescente
      loadedRecords.sort((a, b) => b.date.getTime() - a.date.getTime());
      setRecords(loadedRecords);
    };

    fetchRecords();
  }, []);

  const addRecord = async (record: Omit<HealthRecord, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'health-records'), {
        ...record,
        date: record.date.toISOString() // salva como string ISO
      });
      setRecords(prev => [
        {
          ...record,
          id: docRef.id
        },
        ...prev
      ]);
    } catch (e) {
      console.error('Erro ao adicionar registro no Firebase:', e);
    }
  };

  const deleteRecord = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'health-records', id));
      setRecords(prev => prev.filter(record => record.id !== id));
    } catch (e) {
      console.error('Erro ao excluir registro:', e);
    }
  };

  const clearAllRecords = async () => {
    if (window.confirm('Tem certeza que deseja limpar todos os registros? Esta ação não pode ser desfeita.')) {
      try {
        const querySnapshot = await getDocs(collection(db, 'health-records'));
        const batchDeletes = querySnapshot.docs.map(docSnap => deleteDoc(doc(db, 'health-records', docSnap.id)));
        await Promise.all(batchDeletes);
        setRecords([]);
      } catch (e) {
        console.error('Erro ao limpar registros:', e);
      }
    }
  };

  return (
    <HealthContext.Provider value={{ records, addRecord, deleteRecord, clearAllRecords }}>
      {children}
    </HealthContext.Provider>
  );
};
