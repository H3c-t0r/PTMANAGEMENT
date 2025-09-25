import { AuthUser, LoginRequest, ApiResponse } from '@/models';
import { apiClient } from './apiClient';

export const authService = {
  async login(email: string, password: string): Promise<AuthUser> {
    const response = await apiClient.post<ApiResponse<AuthUser>>('/auth/login', {
      email,
      password
    });

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Login failed');
    }

    return response.data.data;
  },

  async validateToken(token: string): Promise<AuthUser> {
    const response = await apiClient.get<ApiResponse<AuthUser>>('/auth/validate', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.data.success || !response.data.data) {
      throw new Error('Token validation failed');
    }

    return response.data.data;
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  }
};