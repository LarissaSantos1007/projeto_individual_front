import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  Chip,
  LinearProgress,
  TablePagination
} from '@mui/material';
import { Add, ShoppingCart } from '@mui/icons-material';

interface ProdutoReposicao {
  id: number;
  nome: string;
  quantidade_disponivel: number;
  quantidade_minima: number;
  necessidade: number;
}

const ReposicaoPage = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const produtos: ProdutoReposicao[] = [
    { id: 1, nome: 'Smartphone', quantidade_disponivel: 5, quantidade_minima: 10, necessidade: 15 },
    { id: 2, nome: 'Notebook', quantidade_disponivel: 3, quantidade_minima: 8, necessidade: 12 },
    { id: 3, nome: 'Camiseta', quantidade_disponivel: 20, quantidade_minima: 15, necessidade: 0 },
    { id: 4, nome: 'Arroz', quantidade_disponivel: 8, quantidade_minima: 10, necessidade: 12 },
  ];

  const precisaRepor = (produto: ProdutoReposicao) => {
    return produto.quantidade_disponivel < produto.quantidade_minima;
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Reposição de Estoque</Typography>
        <Button variant="contained" startIcon={<ShoppingCart />}>
          Solicitar Reposição
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Produto</TableCell>
              <TableCell>Estoque</TableCell>
              <TableCell>Mínimo</TableCell>
              <TableCell>Necessidade</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {produtos
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((produto) => {
                const precisa = precisaRepor(produto);
                const percentual = Math.min((produto.quantidade_disponivel / produto.quantidade_minima) * 100, 100);
                
                return (
                  <TableRow key={produto.id} sx={{ bgcolor: precisa ? '#fff3e0' : 'inherit' }}>
                    <TableCell>{produto.id}</TableCell>
                    <TableCell>{produto.nome}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {produto.quantidade_disponivel}
                        <LinearProgress 
                          variant="determinate" 
                          value={percentual} 
                          sx={{ width: 60, height: 8, borderRadius: 4 }}
                          color={percentual < 50 ? 'error' : percentual < 75 ? 'warning' : 'success'}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>{produto.quantidade_minima}</TableCell>
                    <TableCell>
                      {produto.necessidade > 0 ? (
                        <Chip label={`+${produto.necessidade}`} color="warning" size="small" />
                      ) : (
                        <Chip label="OK" color="success" size="small" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={precisa ? 'Precisa Repor' : 'Estoque OK'}
                        color={precisa ? 'error' : 'success'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button 
                        size="small" 
                        variant="contained" 
                        color={precisa ? 'error' : 'primary'}
                        startIcon={<Add />}
                      >
                        Repor
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={produtos.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Itens por página"
        />
      </TableContainer>
    </Container>
  );
};

export default ReposicaoPage;