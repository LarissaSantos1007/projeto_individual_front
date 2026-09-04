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
import { Edit, Delete, Receipt } from '@mui/icons-material';

const VendaPage = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const vendas = [
    { id: 1, produto: 'Smartphone', quantidade: 2, valorTotal: 3999.98, data: '2024-01-15', status: 'CONCLUIDA' },
    { id: 2, produto: 'Camiseta', quantidade: 3, valorTotal: 149.97, data: '2024-01-16', status: 'PENDENTE' },
    { id: 3, produto: 'Arroz', quantidade: 10, valorTotal: 259.90, data: '2024-01-17', status: 'CONCLUIDA' },
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'CONCLUIDA': return 'success';
      case 'PENDENTE': return 'warning';
      case 'CANCELADA': return 'error';
      default: return 'default';
    }
  };

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
        <Typography variant="h4">Vendas</Typography>
        <Button variant="contained" startIcon={<Receipt />}>
          Nova Venda
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Produto</TableCell>
              <TableCell>Quantidade</TableCell>
              <TableCell>Valor Total</TableCell>
              <TableCell>Data</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vendas
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((venda) => (
                <TableRow key={venda.id}>
                  <TableCell>{venda.id}</TableCell>
                  <TableCell>{venda.produto}</TableCell>
                  <TableCell>{venda.quantidade}</TableCell>
                  <TableCell>R$ {venda.valorTotal.toFixed(2)}</TableCell>
                  <TableCell>{venda.data}</TableCell>
                  <TableCell>
                    <Chip 
                      label={venda.status}
                      color={getStatusColor(venda.status)}
                      size="small"
                    />
                  </TableCell>
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
          count={vendas.length}
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

export default VendaPage;