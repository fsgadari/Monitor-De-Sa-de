export interface HealthRecord {
  id: string;
  date: Date;
  systolic?: number;
  diastolic?: number;
  glycemia?: number;
  heartRate?: number;
  observations?: string;
}

export type DateFilterType = 'today' | 'last7days' | 'last30days' | 'custom';

export interface DateFilter {
  type: DateFilterType;
  startDate?: Date;
  endDate?: Date;
}