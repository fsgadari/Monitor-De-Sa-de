import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { HealthRecord } from '../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { applyDateFilter } from './dateFilters';

export const generatePDF = async (records: HealthRecord[]) => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
  });

  // Título e data
  doc.setFontSize(20);
  doc.text('Relatório de Saúde', 15, 15);

  const currentDate = format(new Date(), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR });
  doc.setFontSize(10);
  doc.text(`Gerado em: ${currentDate}`, 15, 22);

  // Captura os gráficos da página
  const captureChart = async (id: string) => {
    const el = document.getElementById(id);
    if (!el) return null;
    const canvas = await html2canvas(el);
    return canvas.toDataURL('image/png');
  };

  const glycemiaImg = await captureChart('glycemia-chart');
  const bpImg = await captureChart('blood-pressure-chart');
  const hrImg = await captureChart('heart-rate-chart');

  let y = 30;

  const renderImage = (img: string | null, height: number) => {
    if (img) {
      doc.addImage(img, 'PNG', 15, y, 85, height);
      y += height + 5;
    }
  };

  renderImage(glycemiaImg, 40);
  renderImage(bpImg, 40);
  renderImage(hrImg, 40);

  // Resumo
  if (records.length > 0) {
    doc.setFontSize(14);
    doc.text('Resumo', 115, 30);

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
      margin: { left: 115 },
      head: [['Métrica', 'Média Geral', 'Média 7 dias']],
      body: summaryData,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246], textColor: 255 },
    });
  }

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

  const isAbnormal = (r: HealthRecord, col: string) => {
    switch (col) {
      case 'bloodPressure':
        return (r.systolic !== undefined && (r.systolic < 90 || r.systolic > 139)) ||
               (r.diastolic !== undefined && (r.diastolic < 60 || r.diastolic > 90));
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
        if (data.column.index === 1 && isAbnormal(r, 'bloodPressure')) {
          data.cell.styles.textColor = [239, 68, 68];
        }
        if (data.column.index === 2 && isAbnormal(r, 'glycemia')) {
          data.cell.styles.textColor = [239, 68, 68];
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
