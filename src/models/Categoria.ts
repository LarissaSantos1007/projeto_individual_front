export interface Categoria {
  id_categoria?: number;
  nome: string;
  descricao?: string;
}

export interface CategoriaDTO {
  nome: string;
  descricao?: string;
}