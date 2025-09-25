import { useState, useEffect } from 'react';
import { CalendarEvent, DashboardStats } from '@/models';
import { calendarService } from '@/services/calendarService';
import { useAuth } from './useAuth';

export function useCalendarData(userId?: string, selectedMonth?: Date) {
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchCalendarData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const targetUserId = userId || user.id;
        const month = selectedMonth || new Date();
        
        const [eventsData, statsData] = await Promise.all([
          calendarService.getCalendarEvents(targetUserId, month),
          calendarService.getDashboardStats(targetUserId, month)
        ]);
        
        setCalendarEvents(eventsData);
        setStats(statsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch calendar data');
      } finally {
        setLoading(false);
      }
    };

    fetchCalendarData();
  }, [userId, selectedMonth, user]);

  const refreshData = () => {
    if (user) {
      const targetUserId = userId || user.id;
      const month = selectedMonth || new Date();
      
      Promise.all([
        calendarService.getCalendarEvents(targetUserId, month),
        calendarService.getDashboardStats(targetUserId, month)
      ]).then(([eventsData, statsData]) => {
        setCalendarEvents(eventsData);
        setStats(statsData);
      });
    }
  };

  return {
    calendarEvents,
    stats,
    loading,
    error,
    refreshData
  };
}