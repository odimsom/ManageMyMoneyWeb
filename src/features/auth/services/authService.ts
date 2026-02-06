import api from '../../../services/api';
import type { LoginRequest, RegisterRequest, AuthResponse, User, ApiResponse } from '../types/auth';

export const authService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/api/Auth/login', credentials);
    const { data } = response;
    
    if (data.success && data.data) {
      localStorage.setItem('token', data.data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      return data.data;
    }
    throw new Error(data.message || 'Login failed');
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/api/Auth/register', data);
    const { data: responseData } = response;

    if (responseData.success && responseData.data) {
      localStorage.setItem('token', responseData.data.accessToken);
      localStorage.setItem('user', JSON.stringify(responseData.data.user));
      return responseData.data;
    }
    throw new Error(responseData.message || 'Registration failed');
  },

  verifyEmail: async (token: string): Promise<void> => {
    const response = await api.post<ApiResponse<null>>('/api/Auth/verify-email', { token });
    if (!response.data.success) {
      throw new Error(response.data.message || 'Verification failed');
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        console.error('Failed to parse user from local storage', e);
        return null;
      }
    }
    return null;
  },
};
