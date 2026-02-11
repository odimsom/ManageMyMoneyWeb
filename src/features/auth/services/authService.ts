import api from '../../../services/api';
import type { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  User, 
  ApiResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  RefreshTokenRequest,
  ResendVerificationEmailRequest,
  UpdateUserProfileRequest,
  ChangePasswordRequest
} from '../types/auth';

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

  refreshToken: async (data: RefreshTokenRequest): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/api/Auth/refresh-token', data);
    if (response.data.success && response.data.data) {
      localStorage.setItem('token', response.data.data.accessToken);
      return response.data.data;
    }
    throw new Error(response.data.message || 'Token refresh failed');
  },

  logout: async (data?: RefreshTokenRequest) => {
    if (data) {
      await api.post('/api/Auth/logout', data);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  forgotPassword: async (data: ForgotPasswordRequest): Promise<void> => {
    const response = await api.post<ApiResponse<null>>('/api/Auth/forgot-password', data);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to send reset email');
    }
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<void> => {
    const response = await api.post<ApiResponse<null>>('/api/Auth/reset-password', data);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Reset password failed');
    }
  },

  resendVerification: async (data: ResendVerificationEmailRequest): Promise<void> => {
    const response = await api.post<ApiResponse<null>>('/api/Auth/resend-verification', data);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to resend verification email');
    }
  },

  getMe: async (): Promise<User> => {
    const response = await api.get<ApiResponse<User>>('/api/Auth/me');
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to get user profile');
  },

  updateProfile: async (data: UpdateUserProfileRequest): Promise<User> => {
    const response = await api.put<ApiResponse<User>>('/api/Auth/profile', data);
    if (response.data.success && response.data.data) {
      localStorage.setItem('user', JSON.stringify(response.data.data));
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to update profile');
  },

  uploadAvatar: async (file: File): Promise<User> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post<ApiResponse<User>>('/api/Auth/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    if (response.data.success && response.data.data) {
      localStorage.setItem('user', JSON.stringify(response.data.data));
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to upload avatar');
  },

  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    const response = await api.post<ApiResponse<null>>('/api/Auth/change-password', data);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to change password');
    }
  },

  deleteAccount: async (): Promise<void> => {
    const response = await api.delete<ApiResponse<null>>('/api/Auth/account');
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to delete account');
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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
