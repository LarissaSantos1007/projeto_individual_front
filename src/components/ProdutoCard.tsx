import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Divider
} from '@mui/material';

interface Produto {
  id: number;
  nome: string;
  id_categoria: number;
  preco_unitario: number;
  quantidade_disponivel: number;
  codigo?: string;
}

const ProdutoCard = () => {
  const produtos: Produto[] = [
    { id: 1, nome: 'Smartphone', id_categoria: 1, preco_unitario: 1999.99, quantidade_disponivel: 15, codigo: 'SP001' },
    { id: 2, nome: 'Camiseta', id_categoria: 2, preco_unitario: 49.99, quantidade_disponivel: 30, codigo: 'CS002' },
    { id: 3, nome: 'Arroz', id_categoria: 3, preco_unitario: 25.99, quantidade_disponivel: 100, codigo: 'AR003' },
  ];

  const getCategoriaNome = (id: number) => {
    const categorias: { [key: number]: string } = {
      1: 'Eletrônicos',
      2: 'Roupas',
      3: 'Alimentos'
    };
    return categorias[id] || 'Outros';
  };

  return (
    <Box>
      {produtos.map((produto, index) => (
        <Card key={produto.id} sx={{ mb: index < produtos.length - 1 ? 1 : 0 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                {/* CORREÇÃO: Remover fontWeight como prop separada */}
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  {produto.nome}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {getCategoriaNome(produto.id_categoria)}
                </Typography>
                {produto.codigo && (
                  <Typography variant="caption" color="textSecondary">
                    Código: {produto.codigo}
                  </Typography>
                )}
              </Box>
              <Chip 
                label={`Estoque: ${produto.quantidade_disponivel}`}
                color={produto.quantidade_disponivel > 20 ? 'success' : produto.quantidade_disponivel > 10 ? 'warning' : 'error'}
                size="small"
              />
            </Box>
            <Divider sx={{ my: 1 }} />
            <Typography variant="h6" color="primary">
              R$ {produto.preco_unitario.toFixed(2)}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default ProdutoCard;