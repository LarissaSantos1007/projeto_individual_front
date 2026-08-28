import axios from 'axios';

const API_URL = 'http://localhost:3333/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // ← VOLTOU PARA 10s PARA NÃO DAR ERRO
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') {
      console.warn('⚠️ Backend indisponível - usando dados de exemplo');
      return Promise.reject({ ...error, isOffline: true });
    }
    return Promise.reject(error);
  }
);