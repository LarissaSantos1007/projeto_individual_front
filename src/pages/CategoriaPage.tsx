import React, { useState } from 'react';
import {
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
  IconButton,
  Tooltip,
  TablePagination,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField as MuiTextField
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  FilterList,
  Download,
  Print,
  Visibility,
  Close
} from '@mui/icons-material';
import { showSuccess, showError } from '../utils/toastUtils';
import PageWrapper from '../components/PageWrapper';

interface Categoria {
  id: number;
  nome: string;
  descricao: string;
  ativo: boolean;
  totalProdutos: number;
  vendasMes: number;
}

const CategoriaPage = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [openModal, setOpenModal] = useState(false);
  
  // ✅ ESTADO COM CATEGORIAS - ATUALIZÁVEL
  const [categorias, setCategorias] = useState<Categoria[]>([
    { id: 1, nome: 'Eletrônicos', descricao: 'Produtos eletrônicos em geral', ativo: true, totalProdutos: 45, vendasMes: 120 },
    { id: 2, nome: 'Roupas', descricao: 'Vestuário e acessórios', ativo: true, totalProdutos: 32, vendasMes: 85 },
    { id: 3, nome: 'Alimentos', descricao: 'Produtos alimentícios', ativo: false, totalProdutos: 28, vendasMes: 60 },
    { id: 4, nome: 'Móveis', descricao: 'Móveis e decoração', ativo: true, totalProdutos: 18, vendasMes: 42 },
    { id: 5, nome: 'Livros', descricao: 'Livros e materiais educativos', ativo: true, totalProdutos: 12, vendasMes: 35 },
  ]);

  const [novaCategoria, setNovaCategoria] = useState({ nome: '', descricao: '' });

  const gerarId = () => {
    if (categorias.length === 0) return 1;
    return Math.max(...categorias.map(c => c.id)) + 1;
  };

  // ✅ SALVAR CATEGORIA
  const handleSaveCategoria = () => {
    if (!novaCategoria.nome) {
      showError('Preencha o nome da categoria!');
      return;
    }
    const newCategoria: Categoria = {
      id: gerarId(),
      nome: novaCategoria.nome,
      descricao: novaCategoria.descricao || '',
      ativo: true,
      totalProdutos: 0,
      vendasMes: 0
    };
    setCategorias([...categorias, newCategoria]);
    showSuccess(`Categoria "${novaCategoria.nome}" criada com sucesso! 🎉`);
    handleCloseModal();
  };

  // ✅ EXCLUIR CATEGORIA
  const handleDeleteCategoria = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      setCategorias(categorias.filter(c => c.id !== id));
      showSuccess('🗑️ Categoria excluída com sucesso!');
    }
  };

  // ✅ ALTERNAR STATUS
  const handleToggleStatus = (id: number) => {
    setCategorias(categorias.map(c => 
      c.id === id ? { ...c, ativo: !c.ativo } : c
    ));
    const categoria = categorias.find(c => c.id === id);
    showSuccess(`Status da categoria "${categoria?.nome}" alterado!`);
  };

  const handleChangePage = (event: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    setOpenModal(false);
    setNovaCategoria({ nome: '', descricao: '' });
  };

  const filteredCategorias = categorias.filter(c => 
    c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCategorias = categorias.length;
  const categoriasAtivas = categorias.filter(c => c.ativo).length;
  const totalProdutos = categorias.reduce((sum, c) => sum + c.totalProdutos, 0);
  const totalVendas = categorias.reduce((sum, c) => sum + c.vendasMes, 0);

  return (
    <PageWrapper>
      <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 3 }}>📂 Categorias</Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4 }}>
            <CardContent>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Total</Typography>
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>{totalCategorias}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4 }}>
            <CardContent>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Ativas</Typography>
              <Typography variant="h5" sx={{ color: '#38ef7d', fontWeight: 700 }}>{categoriasAtivas}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4 }}>
            <CardContent>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Produtos</Typography>
              <Typography variant="h5" sx={{ color: '#4facfe', fontWeight: 700 }}>{totalProdutos}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4 }}>
            <CardContent>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Vendas/Mês</Typography>
              <Typography variant="h5" sx={{ color: '#f093fb', fontWeight: 700 }}>{totalVendas}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 2, mb: 3, background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField placeholder="Buscar categoria..." size="small" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} sx={{ flex: 1, minWidth: 200, '& .MuiInputBase-root': { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' }, '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' } } }} slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search sx={{ color: 'rgba(255,255,255,0.5)' }} /></InputAdornment> } }} />
        <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
          <Button variant="contained" startIcon={<Add />} onClick={handleOpenModal} sx={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', '&:hover': { background: 'linear-gradient(135deg, #5a67d8, #6b3fa0)' } }}>Nova Categoria</Button>
          <Tooltip title="Filtrar"><IconButton sx={{ color: 'rgba(255,255,255,0.5)' }}><FilterList /></IconButton></Tooltip>
          <Tooltip title="Exportar"><IconButton sx={{ color: 'rgba(255,255,255,0.5)' }}><Download /></IconButton></Tooltip>
          <Tooltip title="Imprimir"><IconButton sx={{ color: 'rgba(255,255,255,0.5)' }}><Print /></IconButton></Tooltip>
        </Box>
      </Paper>

      <Paper sx={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'rgba(255,255,255,0.05)' }}>
                <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>ID</TableCell>
                <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Nome</TableCell>
                <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Descrição</TableCell>
                <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }} align="center">Produtos</TableCell>
                <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }} align="center">Vendas/Mês</TableCell>
                <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }} align="center">Status</TableCell>
                <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }} align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCategorias.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((categoria) => (
                <TableRow key={categoria.id} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.03)' } }}>
                  <TableCell sx={{ color: 'white' }}>{categoria.id}</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 500 }}>{categoria.nome}</TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.7)' }}>{categoria.descricao}</TableCell>
                  <TableCell align="center"><Chip label={categoria.totalProdutos} size="small" sx={{ bgcolor: 'rgba(79, 172, 254, 0.2)', color: '#4facfe', fontWeight: 600 }} /></TableCell>
                  <TableCell align="center"><Chip label={categoria.vendasMes} size="small" sx={{ bgcolor: 'rgba(240, 147, 251, 0.2)', color: '#f093fb', fontWeight: 600 }} /></TableCell>
                  <TableCell align="center">
                    <Chip label={categoria.ativo ? '✅ Ativo' : '❌ Inativo'} size="small" sx={{ bgcolor: categoria.ativo ? 'rgba(17, 153, 142, 0.3)' : 'rgba(245, 87, 108, 0.3)', color: categoria.ativo ? '#38ef7d' : '#f5576c', border: `1px solid ${categoria.ativo ? 'rgba(17, 153, 142, 0.2)' : 'rgba(245, 87, 108, 0.2)'}`, cursor: 'pointer' }} onClick={() => handleToggleStatus(categoria.id)} />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Visualizar"><IconButton size="small" sx={{ color: '#667eea' }}><Visibility fontSize="small" /></IconButton></Tooltip>
                    <Tooltip title="Editar"><IconButton size="small" sx={{ color: '#4facfe' }}><Edit fontSize="small" /></IconButton></Tooltip>
                    <Tooltip title="Excluir"><IconButton size="small" sx={{ color: '#f5576c' }} onClick={() => handleDeleteCategoria(categoria.id)}><Delete fontSize="small" /></IconButton></Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination rowsPerPageOptions={[5, 10, 25]} component="div" count={filteredCategorias.length} rowsPerPage={rowsPerPage} page={page} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage} labelRowsPerPage="Itens por página" sx={{ color: 'rgba(255,255,255,0.5)', '& .MuiTablePagination-select': { color: 'white' }, '& .MuiTablePagination-selectIcon': { color: 'rgba(255,255,255,0.5)' } }} />
      </Paper>

      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white', bgcolor: 'rgba(15,12,41,0.95)' }}>
          Nova Categoria
          <IconButton onClick={handleCloseModal} sx={{ color: 'rgba(255,255,255,0.5)' }}><Close /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ bgcolor: 'rgba(15,12,41,0.95)' }}>
          <MuiTextField autoFocus margin="dense" label="Nome da Categoria" fullWidth value={novaCategoria.nome} onChange={(e) => setNovaCategoria({ ...novaCategoria, nome: e.target.value })} sx={{ mt: 2, '& .MuiInputBase-root': { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } }, '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' } }} />
          <MuiTextField margin="dense" label="Descrição" fullWidth multiline rows={3} value={novaCategoria.descricao} onChange={(e) => setNovaCategoria({ ...novaCategoria, descricao: e.target.value })} sx={{ mt: 2, '& .MuiInputBase-root': { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } }, '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' } }} />
        </DialogContent>
        <DialogActions sx={{ bgcolor: 'rgba(15,12,41,0.95)', p: 2 }}>
          <Button onClick={handleCloseModal} sx={{ color: 'rgba(255,255,255,0.5)' }}>Cancelar</Button>
          <Button onClick={handleSaveCategoria} variant="contained" sx={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>Salvar</Button>
        </DialogActions>
      </Dialog>
    </PageWrapper>
  );
};

export default CategoriaPage;