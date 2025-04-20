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

interface HeartRateChartProps {
  records: HealthRecord[];
}

const HeartRateChart: React.FC<HeartRateChartProps> = ({ records }) => {
  // Filter records that have heart rate values and sort by date
  const filteredRecords = records
    .filter(record => record.heartRate !== undefined)
    .sort((a, b) => a.date.getTime() - b.date.getTime());
  
  const labels = filteredRecords.map(record => 
    format(record.date, 'dd/MM HH:mm', { locale: ptBR })
  );
  
  const heartRateData = filteredRecords.map(record => record.heartRate);
  
  const data = {
    labels,
    datasets: [
      {
        label: 'Frequência Cardíaca (bpm)',
        data: heartRateData,
        borderColor: 'rgb(220, 38, 38)',
        backgroundColor: 'rgba(220, 38, 38, 0.5)',
        pointBackgroundColor: 'rgba(220, 38, 38, 0.8)',
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
        position: 'top' as const,
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          precision: 0,
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
      <h3 className="text-lg font-medium text-gray-800 mb-4">Gráfico de Frequência Cardíaca</h3>
      
      <div className="h-64">
        {filteredRecords.length > 0 ? (
          <Line options={options} data={data} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Sem dados de frequência cardíaca para exibir
          </div>
        )}
      </div>
    </div>
  );
};

export default HeartRateChart;