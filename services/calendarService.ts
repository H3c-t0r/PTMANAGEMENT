import { CalendarEvent, DashboardStats, ApiResponse } from '@/models';
import { apiClient } from './apiClient';

export const calendarService = {
  async getCalendarEvents(userId: string, month: Date): Promise<CalendarEvent[]> {
    const response = await apiClient.get<ApiResponse<CalendarEvent[]>>(
      `/calendar/events?userId=${userId}&month=${month.toISOString()}`
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch calendar events');
    }

    return response.data.data;
  },

  async getDashboardStats(userId: string, month: Date): Promise<DashboardStats> {
    const response = await apiClient.get<ApiResponse<DashboardStats>>(
      `/calendar/stats?userId=${userId}&month=${month.toISOString()}`
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch dashboard stats');
    }

    return response.data.data;
  }
};