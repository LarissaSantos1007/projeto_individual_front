import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Paper
} from '@mui/material';
import { Add } from '@mui/icons-material';
import ProdutoList from '../components/ProdutoList/ProdutoList';
import ProdutoForm from '../components/ProdutoForm/ProdutoForm';
import { Produto } from '../models/Produto';

const ProdutoPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedProduto, setSelectedProduto] = useState<Produto | null>(null);

  const handleEdit = (produto: Produto) => {
    setSelectedProduto(produto);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedProduto(null);
  };

  const handleSave = (produto: Produto) => {
    console.log('Salvando produto:', produto);
    handleCloseForm();
  };

  const handleDelete = (id: number) => {
    console.log('Deletando produto:', id);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Produtos
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setShowForm(true)}
        >
          Novo Produto
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 2 }}>
            <ProdutoList 
              onEditProduct={handleEdit}
              onDeleteProduct={handleDelete}
            />
          </Paper>
        </Grid>
      </Grid>

      {showForm && (
        <ProdutoForm
          produtoData={selectedProduto}
          onClose={handleCloseForm}
          onSave={handleSave}
        />
      )}
    </Container>
  );
};

export default ProdutoPage;