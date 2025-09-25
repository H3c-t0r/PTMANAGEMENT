import { DashboardStats, ApiResponse } from '@/models';
import { apiClient } from './apiClient';

interface DateRange {
  start: Date;
  end: Date;
}

export const managerService = {
  async getGlobalStats(dateRange: DateRange): Promise<DashboardStats> {
    const response = await apiClient.get<ApiResponse<DashboardStats>>(
      `/manager/stats?start=${dateRange.start.toISOString()}&end=${dateRange.end.toISOString()}`
    );
    
    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch global stats');
    }

    return response.data.data;
  },

  async exportReports(format: 'csv' | 'pdf', filters: any): Promise<Blob> {
    const response = await fetch(`/api/manager/export/${format}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filters)
    });
    
    if (!response.ok) {
      throw new Error('Failed to export reports');
    }

    return response.blob();
  }
};