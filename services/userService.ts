import { User, ApiResponse, PaginatedResponse } from '@/models';
import { apiClient } from './apiClient';

export const userService = {
  async getUsers(role?: string): Promise<User[]> {
    const endpoint = role ? `/users?role=${role}` : '/users';
    const response = await apiClient.get<ApiResponse<User[]>>(endpoint);
    
    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch users');
    }

    return response.data.data;
  },

  async getUserById(id: string): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
    
    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch user');
    }

    return response.data.data;
  },

  async createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const response = await apiClient.post<ApiResponse<User>>('/users', user);
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to create user');
    }

    return response.data.data;
  },

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const response = await apiClient.put<ApiResponse<User>>(`/users/${id}`, updates);
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to update user');
    }

    return response.data.data;
  },

  async deleteUser(id: string): Promise<void> {
    const response = await apiClient.delete<ApiResponse<void>>(`/users/${id}`);
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to delete user');
    }
  }
};