import { useState, useEffect } from 'react';
import { User } from '@/models';
import { userService } from '@/services/userService';

export function useUsers(role?: string) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await userService.getUsers(role);
        setUsers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [role]);

  return {
    users,
    loading,
    error,
    refreshData: () => {
      userService.getUsers(role).then(setUsers);
    }
  };
}