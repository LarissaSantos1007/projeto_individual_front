export interface Produto {
  id: number;
  nome: string;
  id_categoria: number;
  preco_unitario: number;
  quantidade_disponivel: number;
  codigo?: string;
  descricao?: string;
  data_criacao?: Date;
  data_atualizacao?: Date;
}

export type ProdutoDTO = Omit<Produto, 'id'>;

export interface Categoria {
  id: number;
  nome: string;
  descricao: string;
  ativo?: boolean;
}