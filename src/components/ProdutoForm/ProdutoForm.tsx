import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Alert,
  MenuItem
} from '@mui/material';
// CORREÇÃO: Caminho correto para o modelo
import { Produto } from '../../models/Produto';

interface ProdutoFormProps {
  produtoData?: Produto | null;
  onClose: () => void;
  onSave: (produto: Produto) => void;
}

const ProdutoForm: React.FC<ProdutoFormProps> = ({ produtoData, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nome: '',
    id_categoria: '',
    preco_unitario: '',
    quantidade_disponivel: '',
    codigo: '',
    descricao: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (produtoData) {
      setFormData({
        nome: produtoData.nome || '',
        id_categoria: produtoData.id_categoria?.toString() || '',
        preco_unitario: produtoData.preco_unitario?.toString() || '',
        quantidade_disponivel: produtoData.quantidade_disponivel?.toString() || '',
        codigo: produtoData.codigo || '',
        descricao: produtoData.descricao || ''
      });
    }
  }, [produtoData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.nome || !formData.id_categoria || !formData.preco_unitario) {
      setError('Preencha todos os campos obrigatórios');
      return;
    }

    const produto: Produto = {
      id: produtoData?.id || 0,
      nome: formData.nome,
      id_categoria: parseInt(formData.id_categoria),
      preco_unitario: parseFloat(formData.preco_unitario),
      quantidade_disponivel: parseInt(formData.quantidade_disponivel) || 0,
      codigo: formData.codigo,
      descricao: formData.descricao
    };

    onSave(produto);
    onClose();
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {produtoData ? 'Editar Produto' : 'Novo Produto'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                required
                fullWidth
                label="Nome do Produto"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                required
                fullWidth
                select
                label="Categoria"
                name="id_categoria"
                value={formData.id_categoria}
                onChange={handleChange}
              >
                <MenuItem value="1">Eletrônicos</MenuItem>
                <MenuItem value="2">Roupas</MenuItem>
                <MenuItem value="3">Alimentos</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField
                required
                fullWidth
                label="Preço Unitário"
                name="preco_unitario"
                type="number"
                value={formData.preco_unitario}
                onChange={handleChange}
                slotProps={{
                  input: {
                    startAdornment: 'R$ '
                  }
                }}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField
                required
                fullWidth
                label="Quantidade Disponível"
                name="quantidade_disponivel"
                type="number"
                value={formData.quantidade_disponivel}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Código"
                name="codigo"
                value={formData.codigo}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Descrição"
                name="descricao"
                multiline
                rows={3}
                value={formData.descricao}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained">
            {produtoData ? 'Atualizar' : 'Salvar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProdutoForm;