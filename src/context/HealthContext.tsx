import React, { createContext, useContext, useState, useEffect } from 'react';
import { HealthRecord } from '../types';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

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

  // Carrega registros do Firebase ao iniciar
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'healthRecords'));
        const firebaseRecords: HealthRecord[] = querySnapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            date: new Date(data.date), // transforma string ISO em Date
            systolic: data.systolic || null,
            diastolic: data.diastolic || null,
            glycemia: data.glycemia || null,
            heartRate: data.heartRate || null,
            observations: data.observations || ''
          };
        });
        setRecords(firebaseRecords);
      } catch (error) {
        console.error('Erro ao buscar registros do Firebase:', error);
      }
    };

    fetchRecords();
  }, []);

  const addRecord = async (record: Omit<HealthRecord, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'healthRecords'), {
        ...record,
        date: record.date.toISOString() // salva como string ISO
      });

      const newRecord: HealthRecord = {
        ...record,
        id: docRef.id
      };

      setRecords((prev) => [newRecord, ...prev]);
    } catch (error) {
      console.error('Erro ao adicionar registro ao Firebase:', error);
    }
  };

  const deleteRecord = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'healthRecords', id));
      setRecords((prev) => prev.filter((record) => record.id !== id));
    } catch (error) {
      console.error('Erro ao deletar registro do Firebase:', error);
    }
  };

  const clearAllRecords = async () => {
    const confirmClear = window.confirm('Tem certeza que deseja limpar todos os registros? Esta ação não pode ser desfeita.');
    if (!confirmClear) return;

    try {
      const querySnapshot = await getDocs(collection(db, 'healthRecords'));
      const deletions = querySnapshot.docs.map((docSnap) =>
        deleteDoc(doc(db, 'healthRecords', docSnap.id))
      );
      await Promise.all(deletions);
      setRecords([]);
    } catch (error) {
      console.error('Erro ao limpar registros do Firebase:', error);
    }
  };

  return (
    <HealthContext.Provider value={{ records, addRecord, deleteRecord, clearAllRecords }}>
      {children}
    </HealthContext.Provider>
  );
};
