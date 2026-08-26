import { api } from '../api/produtoApi';
import { Produto, ProdutoDTO } from '../models/Produto';

class ProdutoService {
  private readonly endpoint = '/produtos';

  async listarTodos(): Promise<Produto[]> {
    const response = await api.get<Produto[]>(this.endpoint);
    return response.data;
  }

  async buscarPorId(id: number): Promise<Produto> {
    const response = await api.get<Produto>(`${this.endpoint}/${id}`);
    return response.data;
  }

  async criar(produtoDTO: ProdutoDTO): Promise<Produto> {
    const response = await api.post<Produto>(this.endpoint, produtoDTO);
    return response.data;
  }

  async atualizar(id: number, produtoDTO: ProdutoDTO): Promise<Produto> {
    const response = await api.put<Produto>(`${this.endpoint}/${id}`, produtoDTO);
    return response.data;
  }

  async deletar(id: number): Promise<void> {
    await api.delete(`${this.endpoint}/${id}`);
  }

  async buscarPorCategoria(categoria: string): Promise<Produto[]> {
    const response = await api.get<Produto[]>(`${this.endpoint}/categoria/${categoria}`);
    return response.data;
  }

  async buscarAtivos(): Promise<Produto[]> {
    const response = await api.get<Produto[]>(`${this.endpoint}/ativos`);
    return response.data;
  }
}

export const produtoService = new ProdutoService();