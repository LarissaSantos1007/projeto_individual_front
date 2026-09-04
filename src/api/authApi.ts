import api from './api';
import { LoginRequest, LoginResponse } from '../models/Usuario';

export const authApi = {
  // Fazer login
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },

  // Logout (apenas limpa o token no cliente)
  logout: async (): Promise<void> => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Verificar se o token é válido
  validateToken: async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return false;
      return true;
    } catch {
      return false;
    }
  },

  // Buscar dados do usuário logado
  getCurrentUser: async (): Promise<any> => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};