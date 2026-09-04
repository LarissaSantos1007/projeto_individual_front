import api from './api';
import { LoginRequest, LoginResponse } from '../models/Usuario';

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },

  logout: async (): Promise<void> => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
  },

  validateToken: async (): Promise<boolean> => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) return false;
      return true;
    } catch {
      return false;
    }
  },

  getCurrentUser: async (): Promise<any> => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};