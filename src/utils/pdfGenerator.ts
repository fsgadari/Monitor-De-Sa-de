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
  
  // Add title
  doc.setFontSize(20);
  doc.text('Relatório de Saúde', 15, 15);
  
  // Add date
  const currentDate = format(new Date(), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR });
  doc.setFontSize(10);
  doc.text(`Gerado em: ${currentDate}`, 15, 22);
  
  // Summary section
  if (records.length > 0) {
    doc.setFontSize(14);
    doc.text('Resumo', 15, 30);
    
    const lastSevenDaysRecords = applyDateFilter(records, { type: 'last7days' });
    
    const allGlycemiaRecords = records.filter(r => r.glycemia !== undefined);
    const allGlycemiaValues = allGlycemiaRecords.map(r => r.glycemia as number);
    const averageGlycemia = allGlycemiaValues.length 
      ? (allGlycemiaValues.reduce((a, b) => a + b, 0) / allGlycemiaValues.length).toFixed(1)
      : ' ';
      
    const last7DaysGlycemiaRecords = lastSevenDaysRecords.filter(r => r.glycemia !== undefined);
    const last7DaysGlycemiaValues = last7DaysGlycemiaRecords.map(r => r.glycemia as number);
    const last7DaysAverageGlycemia = last7DaysGlycemiaValues.length 
      ? (last7DaysGlycemiaValues.reduce((a, b) => a + b, 0) / last7DaysGlycemiaValues.length).toFixed(1)
      : ' ';
    
    const allSystolicRecords = records.filter(r => r.systolic !== undefined);
    const allSystolicValues = allSystolicRecords.map(r => r.systolic as number);
    const averageSystolic = allSystolicValues.length 
      ? (allSystolicValues.reduce((a, b) => a + b, 0) / allSystolicValues.length).toFixed(1)
      : ' ';
      
    const last7DaysSystolicRecords = lastSevenDaysRecords.filter(r => r.systolic !== undefined);
    const last7DaysSystolicValues = last7DaysSystolicRecords.map(r => r.systolic as number);
    const last7DaysAverageSystolic = last7DaysSystolicValues.length 
      ? (last7DaysSystolicValues.reduce((a, b) => a + b, 0) / last7DaysSystolicValues.length).toFixed(1)
      : ' ';
    
    const allDiastolicRecords = records.filter(r => r.diastolic !== undefined);
    const allDiastolicValues = allDiastolicRecords.map(r => r.diastolic as number);
    const averageDiastolic = allDiastolicValues.length 
      ? (allDiastolicValues.reduce((a, b) => a + b, 0) / allDiastolicValues.length).toFixed(1)
      : ' ';
      
    const last7DaysDiastolicRecords = lastSevenDaysRecords.filter(r => r.diastolic !== undefined);
    const last7DaysDiastolicValues = last7DaysDiastolicRecords.map(r => r.diastolic as number);
    const last7DaysAverageDiastolic = last7DaysDiastolicValues.length 
      ? (last7DaysDiastolicValues.reduce((a, b) => a + b, 0) / last7DaysDiastolicValues.length).toFixed(1)
      : ' ';
      
    const allHeartRateRecords = records.filter(r => r.heartRate !== undefined);
    const allHeartRateValues = allHeartRateRecords.map(r => r.heartRate as number);
    const averageHeartRate = allHeartRateValues.length 
      ? (allHeartRateValues.reduce((a, b) => a + b, 0) / allHeartRateValues.length).toFixed(1)
      : ' ';
      
    const last7DaysHeartRateRecords = lastSevenDaysRecords.filter(r => r.heartRate !== undefined);
    const last7DaysHeartRateValues = last7DaysHeartRateRecords.map(r => r.heartRate as number);
    const last7DaysAverageHeartRate = last7DaysHeartRateValues.length 
      ? (last7DaysHeartRateValues.reduce((a, b) => a + b, 0) / last7DaysHeartRateValues.length).toFixed(1)
      : ' ';
    
    const summaryData = [
      ['Glicemia (mg/dL)', averageGlycemia, last7DaysAverageGlycemia],
      ['Pressão Sistólica (mmHg)', averageSystolic, last7DaysAverageSystolic],
      ['Pressão Diastólica (mmHg)', averageDiastolic, last7DaysAverageDiastolic],
      ['Frequência Cardíaca (bpm)', averageHeartRate, last7DaysAverageHeartRate],
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
  
  // Records table
  doc.addPage();
  doc.setFontSize(14);
  doc.text('Registros', 15, 15);
  
  // Sort records by date (newest first) for the table
  const sortedRecords = [...records].sort((a, b) => b.date.getTime() - a.date.getTime());
  
  const tableData = sortedRecords.map(record => [
    format(record.date, 'dd/MM/yyyy HH:mm', { locale: ptBR }),
    record.systolic && record.diastolic 
      ? `${record.systolic}/${record.diastolic}`
      : ' ',
    record.glycemia !== undefined ? record.glycemia : '',
    record.heartRate !== undefined ? record.heartRate : ' ',
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
        
        if (data.column.index === 1 && isAbnormal(record, 'bloodPressure')) {
          data.cell.styles.textColor = [239, 68, 68]; // Red for abnormal blood pressure
        }
        
        if (data.column.index === 2 && isAbnormal(record, 'glycemia')) {
          data.cell.styles.textColor = [239, 68, 68]; // Red for abnormal glycemia
        }
      }
    },
    margin: { top: 20 },
  });
  
  // Add footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(`Página ${i} de ${pageCount}`, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 10);
  }
  
  // Save the PDF
  doc.save('relatorio-saude.pdf');
};
