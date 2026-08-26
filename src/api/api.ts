import axios from 'axios';

const API_BASE_URL = 'http://localhost:3333/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('Erro na resposta da API:', error.response.data);
      throw new Error(error.response.data?.message || 'Erro ao processar requisição');
    } else if (error.request) {
      console.error('Erro na requisição:', error.request);
      throw new Error('Serviço indisponível, tente novamente mais tarde');
    } else {
      console.error('Erro:', error.message);
      throw new Error('Erro desconhecido ao processar requisição');
    }
  }
);