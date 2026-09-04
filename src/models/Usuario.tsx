export interface Usuario {
  id: number;
  email: string;
  nome: string;
  perfis: string[];
  ativo: boolean;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  email: string;
  nome: string;
  tipo: string;
  expiresIn: number;
}