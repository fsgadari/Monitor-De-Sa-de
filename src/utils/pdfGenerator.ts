import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { HealthRecord } from '../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { applyDateFilter } from './dateFilters';

export const generatePDF = async (records: HealthRecord[]) => {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm' });

  // Cabeçalho
  doc.setFontSize(20);
  doc.text('Relatório de Saúde', 15, 15);

  const currentDate = format(new Date(), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR });
  doc.setFontSize(10);
  doc.text(`Gerado em: ${currentDate}`, 15, 22);

  // Tabela de resumo primeiro
  if (records.length > 0) {
    doc.setFontSize(14);
    doc.text('Resumo', 15, 30);

    const last7 = applyDateFilter(records, { type: 'last7days' });

    const calcAvg = (arr: number[]) =>
      arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1) : ' ';

    const getVals = (arr: HealthRecord[], key: keyof HealthRecord) =>
      arr.filter(r => r[key] !== undefined).map(r => r[key] as number);

    const summaryData = [
      ['Glicemia (mg/dL)', calcAvg(getVals(records, 'glycemia')), calcAvg(getVals(last7, 'glycemia'))],
      ['Sistólica (mmHg)', calcAvg(getVals(records, 'systolic')), calcAvg(getVals(last7, 'systolic'))],
      ['Diastólica (mmHg)', calcAvg(getVals(records, 'diastolic')), calcAvg(getVals(last7, 'diastolic'))],
      ['Batimentos (bpm)', calcAvg(getVals(records, 'heartRate')), calcAvg(getVals(last7, 'heartRate'))],
    ];

    autoTable(doc, {
      startY: 35,
      margin: { left: 15 },
      head: [['Métrica', 'Média Geral', 'Média 7 dias']],
      body: summaryData,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246], textColor: 255 },
    });
  }

  // Captura os gráficos
  const captureChart = async (id: string) => {
    const el = document.getElementById(id);
    if (!el) return null;
    const canvas = await html2canvas(el);
    return canvas.toDataURL('image/png');
  };

  const glycemiaImg = await captureChart('glycemia-chart');
  const bpImg = await captureChart('blood-pressure-chart');
  const hrImg = await captureChart('heart-rate-chart');

  let y = doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 10 : 80;

  const renderImage = (img: string | null, height: number, label: string) => {
    if (img) {
      doc.setFontSize(12);
      doc.text(label, 15, y);
      y += 5;
      doc.addImage(img, 'PNG', 15, y, 260, height);
      y += height + 10;
    }
  };

  renderImage(glycemiaImg, 40, 'Gráfico de Glicemia');
  renderImage(bpImg, 40, 'Gráfico de Pressão Arterial');
  renderImage(hrImg, 40, 'Gráfico de Frequência Cardíaca');

  // Página de registros
  doc.addPage();
  doc.setFontSize(14);
  doc.text('Registros', 15, 15);

  const sorted = [...records].sort((a, b) => b.date.getTime() - a.date.getTime());

  const tableData = sorted.map(r => [
    format(r.date, 'dd/MM/yyyy HH:mm', { locale: ptBR }),
    r.systolic !== undefined && r.diastolic !== undefined ? `${r.systolic}/${r.diastolic}` : '',
    r.glycemia !== undefined ? `${r.glycemia}` : '',
    r.heartRate !== undefined ? `${r.heartRate}` : '',
    r.observations || ''
  ]);

  // Função para verificar se o valor está fora da normalidade
  const isAbnormal = (r: HealthRecord, col: string) => {
    switch (col) {
      case 'bloodPressure':
        return (
          (r.systolic !== undefined && (r.systolic < 90 || r.systolic > 139)) ||
          (r.diastolic !== undefined && (r.diastolic < 60 || r.diastolic > 90))
        );
      case 'glycemia':
        return r.glycemia !== undefined && (r.glycemia < 70 || r.glycemia > 180);
      default:
        return false;
    }
  };

  autoTable(doc, {
    startY: 20,
    margin: { top: 20 },
    head: [['Data/Hora', 'Pressão (mmHg)', 'Glicemia (mg/dL)', 'Freq. Cardíaca', 'Observações']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [59, 130, 246], textColor: 255 },
    willDrawCell: (data) => {
      const r = sorted[data.row.index];

      if (data.section === 'body') {
        // Verificar a coluna de pressão arterial (índice 1)
        if (data.column.index === 1) {
          if (isAbnormal(r, 'bloodPressure')) {
            doc.setTextColor(255, 0, 0); // Vermelho para pressão arterial fora da normalidade
          } else {
            doc.setTextColor(0, 0, 0); // Preto para pressão normal
          }
        }
        
        // Verificar a coluna de glicemia (índice 2)
        if (data.column.index === 2) {
          if (isAbnormal(r, 'glycemia')) {
            doc.setTextColor(255, 0, 0); // Vermelho para glicemia fora da normalidade
          } else {
            doc.setTextColor(0, 0, 0); // Preto para glicemia normal
          }
        }
      }
    }
  });

  // Rodapé
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(`Página ${i} de ${pageCount}`, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 10);
  }

  doc.save('relatorio-saude.pdf');
};
