import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  TablePagination,
  Box
} from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
// CORREÇÃO: Caminho correto para o modelo
import { Produto } from '../../models/Produto';

interface ProdutoListProps {
  onEditProduct?: (produto: Produto) => void;
  onDeleteProduct?: (id: number) => void;
}

const ProdutoList: React.FC<ProdutoListProps> = ({ onEditProduct, onDeleteProduct }) => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    setProdutos([
      { 
        id: 1, 
        nome: 'Smartphone', 
        id_categoria: 1, 
        preco_unitario: 1999.99, 
        quantidade_disponivel: 15,
        codigo: 'SP001',
        descricao: 'Smartphone de última geração'
      },
      { 
        id: 2, 
        nome: 'Camiseta', 
        id_categoria: 2, 
        preco_unitario: 49.99, 
        quantidade_disponivel: 30,
        codigo: 'CS002',
        descricao: 'Camiseta de algodão'
      },
      { 
        id: 3, 
        nome: 'Arroz', 
        id_categoria: 3, 
        preco_unitario: 25.99, 
        quantidade_disponivel: 100,
        codigo: 'AR003',
        descricao: 'Arroz branco tipo 1'
      },
      { 
        id: 4, 
        nome: 'Notebook', 
        id_categoria: 1, 
        preco_unitario: 3599.99, 
        quantidade_disponivel: 8,
        codigo: 'NB004',
        descricao: 'Notebook com 16GB RAM'
      },
      { 
        id: 5, 
        nome: 'Calça Jeans', 
        id_categoria: 2, 
        preco_unitario: 89.99, 
        quantidade_disponivel: 20,
        codigo: 'CJ005',
        descricao: 'Calça jeans azul'
      },
    ]);
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (quantidade: number) => {
    if (quantidade > 20) return 'success';
    if (quantidade > 10) return 'warning';
    return 'error';
  };

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Código</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Categoria</TableCell>
              <TableCell align="right">Preço</TableCell>
              <TableCell align="center">Estoque</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {produtos
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((produto) => (
                <TableRow key={produto.id}>
                  <TableCell>{produto.id}</TableCell>
                  <TableCell>{produto.codigo || '-'}</TableCell>
                  <TableCell>{produto.nome}</TableCell>
                  <TableCell>{produto.id_categoria}</TableCell>
                  <TableCell align="right">
                    R$ {produto.preco_unitario.toFixed(2)}
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={produto.quantidade_disponivel}
                      color={getStatusColor(produto.quantidade_disponivel)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Visualizar">
                      <IconButton size="small" color="primary">
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar">
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => onEditProduct && onEditProduct(produto)}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir">
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => onDeleteProduct && onDeleteProduct(produto.id)}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={produtos.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Itens por página"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
      />
    </Box>
  );
};

export default ProdutoList;