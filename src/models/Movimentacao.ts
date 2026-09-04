export interface Movimentacao {
  id: number;
  produtoId: number;
  tipo: 'ENTRADA' | 'SAIDA';
  quantidade: number;
  data: Date;
  observacao?: string;
  usuario?: string;
}