import { useState, useEffect } from 'react';
import { DashboardStats } from '@/models';
import { managerService } from '@/services/managerService';

interface DateRange {
  start: Date;
  end: Date;
}

export function useManagerStats(dateRange: DateRange) {
  const [managerStats, setManagerStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const stats = await managerService.getGlobalStats(dateRange);
        setManagerStats(stats);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch manager stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [dateRange]);

  return {
    managerStats,
    loading,
    error
  };
}