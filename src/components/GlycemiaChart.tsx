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
import annotationPlugin from 'chartjs-plugin-annotation';
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
  Legend,
  annotationPlugin
);

interface GlycemiaChartProps {
  records: HealthRecord[];
}

const GlycemiaChart: React.FC<GlycemiaChartProps> = ({ records }) => {
  const filteredRecords = records
    .filter(record => record.glycemia !== undefined)
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const labels = filteredRecords.map(record =>
    format(record.date, 'dd/MM HH:mm', { locale: ptBR })
  );

  const glycemiaData = filteredRecords.map(record => record.glycemia!);

  const data = {
    labels,
    datasets: [
      {
        label: 'Glicemia (mg/dL)',
        data: glycemiaData,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        pointBackgroundColor: filteredRecords.map(record => {
          if (record.glycemia === undefined) return 'rgba(59, 130, 246, 0.5)';
          return record.glycemia < 70 || record.glycemia > 180
            ? 'rgba(239, 68, 68, 0.8)'
            : 'rgba(34, 197, 94, 0.8)';
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
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          afterLabel: context => {
            const value = context.parsed.y;
            if (value < 70) return 'Glicemia baixa';
            if (value > 180) return 'Glicemia alta';
            return 'Glicemia normal';
          }
        }
      },
      annotation: {
        annotations: {
          linhaBaixa: {
            type: 'line',
            yMin: 70,
            yMax: 70,
            borderColor: 'rgba(34, 197, 94, 0.8)',
            borderWidth: 1,
            borderDash: [6, 6],
          },
          linhaAlta: {
            type: 'line',
            yMin: 180,
            yMax: 180,
            borderColor: 'rgba(34, 197, 94, 0.8)',
            borderWidth: 1,
            borderDash: [6, 6],
          }
        }
      }
    },
    scales: {
      y: {
        min: 40,
        max: Math.max(300, Math.max(...glycemiaData) + 20),
        ticks: { stepSize: 10, precision: 0 },
        grid: { color: 'rgba(0, 0, 0, 0.05)' }
      },
      x: {
        grid: { display: false }
      }
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Gráfico de Glicemia</h3>
      <div className="h-64 relative">
        {filteredRecords.length > 0 ? (
          <Line options={options} data={data} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Sem dados de glicemia para exibir
          </div>
        )}
      </div>
    </div>
  );
};

export default GlycemiaChart;
