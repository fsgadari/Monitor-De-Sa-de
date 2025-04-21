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

  const systolicData = filteredRecords.map(record => record.systolic);
  const diastolicData = filteredRecords.map(record => record.diastolic);

  const data = {
    labels,
    datasets: [
      {
        label: 'Sistólica (mmHg)',
        data: systolicData,
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        pointBackgroundColor: filteredRecords.map(record => {
          if (record.systolic === undefined) return 'rgba(239, 68, 68, 0.5)';
          return record.systolic < 90 || record.systolic > 139
            ? 'rgba(239, 68, 68, 0.9)'
            : 'rgba(239, 68, 68, 0.5)';
        }),
        pointRadius: 5,
        tension: 0.1,
      },
      {
        label: 'Diastólica (mmHg)',
        data: diastolicData,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        pointBackgroundColor: filteredRecords.map(record => {
          if (record.diastolic === undefined) return 'rgba(59, 130, 246, 0.5)';
          return record.diastolic < 60 || record.diastolic > 90
            ? 'rgba(239, 68, 68, 0.9)'
            : 'rgba(59, 130, 246, 0.5)';
        }),
        pointRadius: 5,
        tension: 0.1,
      }
    ]
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          afterLabel: function(context) {
            const datasetIndex = context.datasetIndex;
            const value = context.parsed.y;

            if (datasetIndex === 0) {
              if (value < 90) return 'Pressão sistólica baixa';
              if (value > 139) return 'Pressão sistólica alta';
              return 'Pressão sistólica normal';
            } else {
              if (value < 60) return 'Pressão diastólica baixa';
              if (value > 90) return 'Pressão diastólica alta';
              return 'Pressão diastólica normal';
            }
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        min: 40,
        max: Math.max(180, ...systolicData, ...diastolicData) + 10,
        ticks: {
          stepSize: 10,
          precision: 0,
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

      <div className="h-64">
        {filteredRecords.length > 0 ? (
          <>
            <div className="relative z-10">
              <Line options={options} data={data} />
            </div>
            <div className="flex flex-col sm:flex-row justify-between mt-2 text-xs text-gray-500 px-2 sm:px-10">
              <span>Sistólica normal: 90-139 mmHg</span>
              <span>Diastólica normal: 60-90 mmHg</span>
            </div>
          </>
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
