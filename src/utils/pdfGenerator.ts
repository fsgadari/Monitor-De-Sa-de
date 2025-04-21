import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { HealthRecord } from '../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { applyDateFilter } from './dateFilters';

export const generatePDF = (records: HealthRecord[]) => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
  });

  // Título
  doc.setFontSize(20);
  doc.text('Relatório de Saúde', 15, 15);

  // Data de geração
  const currentDate = format(new Date(), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR });
  doc.setFontSize(10);
  doc.text(`Gerado em: ${currentDate}`, 15, 22);

  // Resumo
  if (records.length > 0) {
    doc.setFontSize(14);
    doc.text('Resumo', 15, 30);

    const lastSevenDaysRecords = applyDateFilter(records, { type: 'last7days' });

    const calcAverage = (arr: number[]) =>
      arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1) : ' ';

    const getValues = (arr: HealthRecord[], key: keyof HealthRecord) =>
      arr.filter(r => r[key] !== undefined).map(r => r[key] as number);

    const summaryData = [
      ['Glicemia (mg/dL)', calcAverage(getValues(records, 'glycemia')), calcAverage(getValues(lastSevenDaysRecords, 'glycemia'))],
      ['Pressão Sistólica (mmHg)', calcAverage(getValues(records, 'systolic')), calcAverage(getValues(lastSevenDaysRecords, 'systolic'))],
      ['Pressão Diastólica (mmHg)', calcAverage(getValues(records, 'diastolic')), calcAverage(getValues(lastSevenDaysRecords, 'diastolic'))],
      ['Frequência Cardíaca (bpm)', calcAverage(getValues(records, 'heartRate')), calcAverage(getValues(lastSevenDaysRecords, 'heartRate'))],
    ];

    autoTable(doc, {
      startY: 35,
      head: [['Medida', 'Média Geral', 'Média Últimos 7 dias']],
      body: summaryData,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246], textColor: 255 },
      margin: { top: 35 },
    });
  }

  // Página de registros
  doc.addPage();
  doc.setFontSize(14);
  doc.text('Registros', 15, 15);

  const sortedRecords = [...records].sort((a, b) => b.date.getTime() - a.date.getTime());

  const tableData = sortedRecords.map(record => [
    format(record.date, 'dd/MM/yyyy HH:mm', { locale: ptBR }),
    record.systolic !== undefined && record.diastolic !== undefined
      ? `${record.systolic}/${record.diastolic}`
      : '',
    record.glycemia !== undefined ? `${record.glycemia}` : '',
    record.heartRate !== undefined ? `${record.heartRate}` : '',
    record.observations || ''
  ]);

  const isAbnormal = (record: HealthRecord, column: string): boolean => {
    switch (column) {
      case 'bloodPressure':
        return (record.systolic !== undefined && (record.systolic < 90 || record.systolic > 139)) ||
               (record.diastolic !== undefined && (record.diastolic < 60 || record.diastolic > 90));
      case 'glycemia':
        return record.glycemia !== undefined && (record.glycemia < 70 || record.glycemia > 180);
      default:
        return false;
    }
  };

  autoTable(doc, {
    startY: 20,
    head: [['Data/Hora', 'Pressão (mmHg)', 'Glicemia (mg/dL)', 'Freq. Cardíaca (bpm)', 'Observações']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [59, 130, 246], textColor: 255 },
    willDrawCell: (data) => {
      if (data.section === 'body') {
        const record = sortedRecords[data.row.index];

        // Destaca pressão anormal
        if (data.column.index === 1 && isAbnormal(record, 'bloodPressure')) {
          data.cell.styles.textColor = [239, 68, 68];
        }

        // Destaca glicemia anormal
        if (data.column.index === 2 && isAbnormal(record, 'glycemia')) {
          data.cell.styles.textColor = [239, 68, 68];
        }

        // Batimentos cardíacos não são destacados
      }
    },
    margin: { top: 20 },
  });

  // Rodapé com paginação
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(`Página ${i} de ${pageCount}`, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 10);
  }

  doc.save('relatorio-saude.pdf');
};
