export interface Venda {
  id: number;
  produtoId: number;
  quantidade: number;
  valorTotal: number;
  dataVenda: Date;
  cliente?: string;
  status?: 'PENDENTE' | 'CONCLUIDA' | 'CANCELADA';
}