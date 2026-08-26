export interface Movimentacao {
  id_movimentacao?: number;
  id_produto: number;
  tipo: 'ENTRADA' | 'RETIRADA';
  quantidade: number;
  data: Date;
  observacao?: string;
  motivo: 'COMPRA' | 'VENDA' | 'USO_INTERNO' | 'DEVOLUCAO' | 'PERDA' | 'AJUSTE';
  id_movimentacao_original?: number;
}

export interface MovimentacaoDTO {
  id_produto: number;
  tipo: 'ENTRADA' | 'RETIRADA';
  quantidade: number;
  data: Date;
  observacao?: string;
  motivo: 'COMPRA' | 'VENDA' | 'USO_INTERNO' | 'DEVOLUCAO' | 'PERDA' | 'AJUSTE';
  id_movimentacao_original?: number;
}