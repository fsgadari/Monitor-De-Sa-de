import { HealthRecord, DateFilter } from '../types';
import { startOfDay, endOfDay, subDays, isWithinInterval } from 'date-fns';

export const applyDateFilter = (records: HealthRecord[], filter: DateFilter): HealthRecord[] => {
  const now = new Date();
  const today = startOfDay(now);
  const todayEnd = endOfDay(now);
  
  switch (filter.type) {
    case 'today':
      return records.filter(record => 
        isWithinInterval(record.date, { start: today, end: todayEnd })
      );
      
    case 'last7days':
      const sevenDaysAgo = startOfDay(subDays(now, 6));
      return records.filter(record => 
        isWithinInterval(record.date, { start: sevenDaysAgo, end: todayEnd })
      );
      
    case 'last30days':
      const thirtyDaysAgo = startOfDay(subDays(now, 29));
      return records.filter(record => 
        isWithinInterval(record.date, { start: thirtyDaysAgo, end: todayEnd })
      );
      
    case 'custom':
      if (filter.startDate && filter.endDate) {
        const start = startOfDay(filter.startDate);
        const end = endOfDay(filter.endDate);
        return records.filter(record => 
          isWithinInterval(record.date, { start, end })
        );
      }
      return records;
      
    default:
      return records;
  }
};

export const getFilterLabel = (filter: DateFilter): string => {
  switch (filter.type) {
    case 'today':
      return 'Hoje';
    case 'last7days':
      return 'Últimos 7 dias';
    case 'last30days':
      return 'Últimos 30 dias';
    case 'custom':
      if (filter.startDate && filter.endDate) {
        const formatDate = (date: Date) => date.toLocaleDateString('pt-BR');
        return `${formatDate(filter.startDate)} - ${formatDate(filter.endDate)}`;
      }
      return 'Período personalizado';
    default:
      return '';
  }
};