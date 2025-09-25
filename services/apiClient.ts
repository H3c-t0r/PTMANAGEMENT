// API client configuration for future backend integration

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface RequestConfig {
  headers?: Record<string, string>;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getHeaders(config?: RequestConfig): Headers {
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');

    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    // Merge additional headers
    if (config?.headers) {
      Object.entries(config.headers).forEach(([key, value]) => {
        headers.set(key, value);
      });
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<{ data: T; status: number }> {
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return { data, status: response.status };
  }

  async get<T>(endpoint: string, config?: RequestConfig): Promise<{ data: T; status: number }> {
    // Mock data for development
    return this.getMockData<T>(endpoint);
  }

  async post<T>(endpoint: string, body?: any, config?: RequestConfig): Promise<{ data: T; status: number }> {
    // Mock data for development
    return this.getMockData<T>(endpoint, body);
  }

  async put<T>(endpoint: string, body?: any, config?: RequestConfig): Promise<{ data: T; status: number }> {
    // Mock data for development
    return this.getMockData<T>(endpoint, body);
  }

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<{ data: T; status: number }> {
    // Mock data for development
    return this.getMockData<T>(endpoint);
  }

  // Mock data provider for development
  private async getMockData<T>(endpoint: string, body?: any): Promise<{ data: T; status: number }> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 200));

    // Mock responses based on endpoint
    const mockData = this.generateMockResponse<T>(endpoint, body);
    
    return {
      data: mockData,
      status: 200
    };
  }

  private generateMockResponse<T>(endpoint: string, body?: any): T {
    // This will be replaced with actual API calls when backend is ready
    if (endpoint.includes('/auth/login')) {
      return {
        success: true,
        data: {
          id: '1',
          name: 'John Doe',
          email: body?.email || 'john@example.com',
          role: body?.email?.includes('ces') ? 'ces' : 
                body?.email?.includes('manager') ? 'manager' : 'pentester',
          token: 'mock-jwt-token'
        }
      } as T;
    }

    if (endpoint.includes('/users')) {
      return {
        success: true,
        data: [
          { id: '1', name: 'John Doe', email: 'john@example.com', role: 'pentester', isActive: true },
          { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'pentester', isActive: true },
          { id: '3', name: 'Mike Wilson', email: 'mike@example.com', role: 'ces', isActive: true }
        ]
      } as T;
    }

    if (endpoint.includes('/calendar/events')) {
      return {
        success: true,
        data: []
      } as T;
    }

    if (endpoint.includes('/calendar/stats')) {
      return {
        success: true,
        data: {
          workingDays: 22,
          pentestDays: 15,
          leaveDays: 2,
          nonPentestDays: 5,
          totalPentests: 8,
          completedPentests: 3,
          inProgressPentests: 2,
          plannedPentests: 3,
          onHoldPentests: 0,
          stoppedPentests: 0
        }
      } as T;
    }

    return { success: true, data: [] } as T;
  }
}

export const apiClient = new ApiClient(API_BASE_URL);