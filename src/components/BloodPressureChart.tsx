import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { HealthRecord } from '../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface BloodPressureChartProps {
  records: HealthRecord[];
}

const BloodPressureChart: React.FC<BloodPressureChartProps> = ({ records }) => {
  const filteredRecords = records
    .filter(record => record.systolic !== undefined && record.diastolic !== undefined)
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const labels = filteredRecords.map(record =>
    format(record.date, 'dd/MM HH:mm', { locale: ptBR })
  );

  const systolicData = filteredRecords.map(record => record.systolic!);
  const diastolicData = filteredRecords.map(record => record.diastolic!);

  const maxY = Math.max(160, ...systolicData, ...diastolicData) + 10;

  const data = {
    labels,
    datasets: [
      {
        label: 'Sistólica (mmHg)',
        data: systolicData,
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        pointBackgroundColor: filteredRecords.map(record =>
          record.systolic! < 90 || record.systolic! > 139
            ? 'rgba(239, 68, 68, 0.9)' // vermelho
            : 'rgba(34, 197, 94, 0.8)' // verde
        ),
        pointRadius: 5,
        tension: 0.1,
      },
      {
        label: 'Diastólica (mmHg)',
        data: diastolicData,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        pointBackgroundColor: filteredRecords.map(record =>
          record.diastolic! < 60 || record.diastolic! > 90
            ? 'rgba(239, 68, 68, 0.9)' // vermelho
            : 'rgba(34, 197, 94, 0.8)' // verde
        ),
        pointRadius: 5,
        tension: 0.1,
      }
    ]
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          afterLabel: function (context) {
            const value = context.parsed.y;
            const datasetIndex = context.datasetIndex;

            if (datasetIndex === 0) {
              if (value < 90) return 'Sistólica baixa';
              if (value > 139) return 'Sistólica alta';
              return 'Sistólica normal';
            } else {
              if (value < 60) return 'Diastólica baixa';
              if (value > 90) return 'Diastólica alta';
              return 'Diastólica normal';
            }
          }
        }
      }
    },
    scales: {
      y: {
        min: 40,
        max: maxY,
        ticks: {
          stepSize: 10,
          precision: 0,
          callback: (value) => `${value} mmHg`,
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        }
      },
      x: {
        grid: {
          display: false,
        }
      }
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Gráfico de Pressão Arterial</h3>
      <div className="h-72">
        {filteredRecords.length > 0 ? (
          <Line options={options} data={data} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Sem dados de pressão arterial para exibir
          </div>
        )}
      </div>
    </div>
  );
};

export default BloodPressureChart;
