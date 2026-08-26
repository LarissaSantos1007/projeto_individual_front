export interface Venda {
  id_venda?: number;
  id_movimentacao: number;
  preco_unitario_praticado: number;
  quantidade: number;
  valor_total: number;
}

export interface VendaDTO {
  id_movimentacao: number;
  preco_unitario_praticado: number;
  quantidade: number;
  valor_total: number;
}