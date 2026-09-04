import { authApi } from'../api/authApi';
import { LoginRequest, LoginResponse, Usuario } from '../models/Usuario';

interface AuthUser {
  email: string;
  nome: string;
  token: string;
}

class AuthService {
  private static instance: AuthService;
  private token: string | null = null;
  private user: AuthUser | null = null;

  private constructor() {
    this.token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        this.user = JSON.parse(userStr);
      } catch {
        this.user = null;
      }
    }
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await authApi.login(credentials);
      
      // Salvar token e dados do usuário
      this.setToken(response.token);
      this.setUser({
        email: response.email,
        nome: response.nome,
        token: response.token
      });
      
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  logout(): void {
    this.clearToken();
    this.clearUser();
    // Opcional: chamar API de logout
    // authApi.logout().catch(console.error);
  }

  getToken(): string | null {
    return this.token || localStorage.getItem('token');
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('token', token);
  }

  clearToken(): void {
    this.token = null;
    localStorage.removeItem('token');
  }

  getUser(): AuthUser | null {
    return this.user;
  }

  setUser(user: AuthUser): void {
    this.user = user;
    localStorage.setItem('user', JSON.stringify(user));
  }

  clearUser(): void {
    this.user = null;
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): AuthUser | null {
    return this.user;
  }

  private handleError(error: any): Error {
    if (error.response) {
      const message = error.response.data?.message || 'Erro ao fazer login';
      const status = error.response.status;
      
      if (status === 401) {
        return new Error('Email ou senha inválidos');
      } else if (status === 404) {
        return new Error('Usuário não encontrado');
      } else if (status === 403) {
        return new Error('Acesso negado');
      } else {
        return new Error(message);
      }
    }
    return new Error('Erro de conexão com o servidor');
  }
}

export default AuthService;