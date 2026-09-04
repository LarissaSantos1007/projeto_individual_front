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
  TablePagination
} from '@mui/material';
import { Add, Remove, Edit, Delete } from '@mui/icons-material';

const MovimentacaoPage = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const movimentacoes = [
    { id: 1, produto: 'Smartphone', tipo: 'ENTRADA', quantidade: 10, data: '2024-01-15', usuario: 'Admin' },
    { id: 2, produto: 'Camiseta', tipo: 'SAIDA', quantidade: 5, data: '2024-01-16', usuario: 'Admin' },
    { id: 3, produto: 'Arroz', tipo: 'ENTRADA', quantidade: 50, data: '2024-01-17', usuario: 'Admin' },
  ];

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Movimentações</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained" color="success" startIcon={<Add />}>
            Entrada
          </Button>
          <Button variant="contained" color="warning" startIcon={<Remove />}>
            Saída
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Produto</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Quantidade</TableCell>
              <TableCell>Data</TableCell>
              <TableCell>Usuário</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {movimentacoes
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((mov) => (
                <TableRow key={mov.id}>
                  <TableCell>{mov.id}</TableCell>
                  <TableCell>{mov.produto}</TableCell>
                  <TableCell>
                    <Chip 
                      label={mov.tipo}
                      color={mov.tipo === 'ENTRADA' ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{mov.quantidade}</TableCell>
                  <TableCell>{mov.data}</TableCell>
                  <TableCell>{mov.usuario}</TableCell>
                  <TableCell align="right">
                    <Button size="small" color="primary" startIcon={<Edit />}>
                      Editar
                    </Button>
                    <Button size="small" color="error" startIcon={<Delete />}>
                      Excluir
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={movimentacoes.length}
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

export default MovimentacaoPage;