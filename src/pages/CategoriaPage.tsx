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
  Chip
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';

const CategoriaPage = () => {
  const [categorias] = useState([
    { id: 1, nome: 'Eletrônicos', descricao: 'Produtos eletrônicos em geral', ativo: true },
    { id: 2, nome: 'Roupas', descricao: 'Vestuário e acessórios', ativo: true },
    { id: 3, nome: 'Alimentos', descricao: 'Produtos alimentícios', ativo: false },
  ]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Categorias</Typography>
        <Button variant="contained" startIcon={<Add />}>
          Nova Categoria
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categorias.map((categoria) => (
              <TableRow key={categoria.id}>
                <TableCell>{categoria.id}</TableCell>
                <TableCell>{categoria.nome}</TableCell>
                <TableCell>{categoria.descricao}</TableCell>
                <TableCell>
                  <Chip 
                    label={categoria.ativo ? 'Ativo' : 'Inativo'}
                    color={categoria.ativo ? 'success' : 'error'}
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
      </TableContainer>
    </Container>
  );
};

export default CategoriaPage;