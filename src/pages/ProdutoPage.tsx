import React, { useState } from 'react';
import {
  Typography,
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  TablePagination,
  TextField,
  InputAdornment,
  LinearProgress,
  Card,
  CardContent,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField as MuiTextField,
  MenuItem
} from '@mui/material';
import {
  Add,
  Search,
  FilterList,
  Download,
  Print,
  Visibility,
  Edit,
  Delete,
  Star,
  Close
} from '@mui/icons-material';
import { showSuccess, showError } from '../utils/toastUtils';
import PageWrapper from '../components/PageWrapper';

interface Produto {
  id: number;
  nome: string;
  categoria: string;
  preco: number;
  estoque: number;
  status: string;
  vendas: number;
  avaliacao: number;
}

const ProdutoPage = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [openModal, setOpenModal] = useState(false);
  
  // ✅ ESTADO COM PRODUTOS - ATUALIZÁVEL
  const [produtos, setProdutos] = useState<Produto[]>([
    { id: 1, nome: 'Smartphone Pro', categoria: 'Eletrônicos', preco: 2999.99, estoque: 12, status: 'ok', vendas: 45, avaliacao: 4.8 },
    { id: 2, nome: 'Notebook Ultra', categoria: 'Eletrônicos', preco: 4599.99, estoque: 5, status: 'critico', vendas: 29, avaliacao: 4.9 },
    { id: 3, nome: 'Tablet Max', categoria: 'Eletrônicos', preco: 1899.99, estoque: 8, status: 'baixo', vendas: 38, avaliacao: 4.5 },
    { id: 4, nome: 'Fone Bluetooth', categoria: 'Acessórios', preco: 199.90, estoque: 23, status: 'ok', vendas: 25, avaliacao: 4.2 },
    { id: 5, nome: 'Monitor 4K', categoria: 'Eletrônicos', preco: 1299.99, estoque: 3, status: 'critico', vendas: 18, avaliacao: 4.3 },
    { id: 6, nome: 'Teclado Mecânico', categoria: 'Acessórios', preco: 349.90, estoque: 15, status: 'baixo', vendas: 32, avaliacao: 4.0 },
  ]);

  const [novoProduto, setNovoProduto] = useState({
    nome: '',
    categoria: '',
    preco: '',
    estoque: ''
  });

  const gerarId = () => {
    if (produtos.length === 0) return 1;
    return Math.max(...produtos.map(p => p.id)) + 1;
  };

  // ✅ SALVAR PRODUTO
  const handleSaveProduto = () => {
    if (!novoProduto.nome || !novoProduto.preco) {
      showError('Preencha todos os campos obrigatórios!');
      return;
    }
    const newProduto: Produto = {
      id: gerarId(),
      nome: novoProduto.nome,
      categoria: novoProduto.categoria || 'Eletrônicos',
      preco: parseFloat(novoProduto.preco),
      estoque: parseInt(novoProduto.estoque) || 0,
      status: 'ok',
      vendas: 0,
      avaliacao: 0
    };
    setProdutos([...produtos, newProduto]);
    showSuccess(`Produto "${novoProduto.nome}" criado com sucesso! 📦`);
    handleCloseModal();
  };

  // ✅ EXCLUIR PRODUTO
  const handleDeleteProduto = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      setProdutos(produtos.filter(p => p.id !== id));
      showSuccess('🗑️ Produto excluído com sucesso!');
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    setOpenModal(false);
    setNovoProduto({ nome: '', categoria: '', preco: '', estoque: '' });
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'ok': return { bg: 'rgba(17, 153, 142, 0.3)', color: '#38ef7d', label: '✅ OK' };
      case 'baixo': return { bg: 'rgba(255, 152, 0, 0.3)', color: '#FF9800', label: '⚠️ Baixo' };
      case 'critico': return { bg: 'rgba(245, 87, 108, 0.3)', color: '#f5576c', label: '🚨 Crítico' };
      default: return { bg: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', label: status };
    }
  };

  const filteredProdutos = produtos.filter(p => 
    p.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalEstoque = produtos.reduce((sum, p) => sum + p.estoque, 0);
  const totalVendas = produtos.reduce((sum, p) => sum + p.vendas, 0);
  const mediaAvaliacao = produtos.length > 0 ? (produtos.reduce((sum, p) => sum + p.avaliacao, 0) / produtos.length).toFixed(1) : '0';

  return (
    <PageWrapper>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>📦 Produtos</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpenModal} sx={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', '&:hover': { background: 'linear-gradient(135deg, #5a67d8, #6b3fa0)' } }}>Novo Produto</Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4 }}>
            <CardContent><Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Total</Typography><Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>{produtos.length}</Typography></CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4 }}>
            <CardContent><Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Estoque</Typography><Typography variant="h5" sx={{ color: '#38ef7d', fontWeight: 700 }}>{totalEstoque}</Typography></CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4 }}>
            <CardContent><Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Vendas</Typography><Typography variant="h5" sx={{ color: '#4facfe', fontWeight: 700 }}>{totalVendas}</Typography></CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4 }}>
            <CardContent><Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Avaliação</Typography><Typography variant="h5" sx={{ color: '#f093fb', fontWeight: 700 }}>⭐ {mediaAvaliacao}</Typography></CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 2, mb: 3, background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField placeholder="Buscar produto..." size="small" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} sx={{ flex: 1, minWidth: 200, '& .MuiInputBase-root': { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' }, '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' } } }} slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search sx={{ color: 'rgba(255,255,255,0.5)' }} /></InputAdornment> } }} />
        <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
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
                <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Produto</TableCell>
                <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Categoria</TableCell>
                <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }} align="right">Preço</TableCell>
                <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }} align="center">Estoque</TableCell>
                <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }} align="center">Vendas</TableCell>
                <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }} align="center">Status</TableCell>
                <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }} align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProdutos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((produto) => {
                const status = getStatusColor(produto.status);
                const percentual = Math.min((produto.estoque / 50) * 100, 100);
                return (
                  <TableRow key={produto.id} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.03)' } }}>
                    <TableCell sx={{ color: 'white' }}>{produto.id}</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 500 }}>
                      {produto.nome}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Star sx={{ fontSize: 12, color: '#FFB300' }} />
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>{produto.avaliacao}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.7)' }}>{produto.categoria}</TableCell>
                    <TableCell align="right" sx={{ color: '#38ef7d', fontWeight: 600 }}>R$ {produto.preco.toFixed(2)}</TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                        <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>{produto.estoque}</Typography>
                        <LinearProgress variant="determinate" value={percentual} sx={{ width: 60, height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.1)', '& .MuiLinearProgress-bar': { borderRadius: 3, bgcolor: percentual < 30 ? '#f5576c' : percentual < 60 ? '#FF9800' : '#38ef7d' } }} />
                      </Box>
                    </TableCell>
                    <TableCell align="center"><Chip label={produto.vendas} size="small" sx={{ bgcolor: 'rgba(79, 172, 254, 0.2)', color: '#4facfe', fontWeight: 600 }} /></TableCell>
                    <TableCell align="center"><Chip label={status.label} size="small" sx={{ bgcolor: status.bg, color: status.color, border: `1px solid ${status.color}33` }} /></TableCell>
                    <TableCell align="center">
                      <Tooltip title="Visualizar"><IconButton size="small" sx={{ color: '#667eea' }}><Visibility fontSize="small" /></IconButton></Tooltip>
                      <Tooltip title="Editar"><IconButton size="small" sx={{ color: '#4facfe' }}><Edit fontSize="small" /></IconButton></Tooltip>
                      <Tooltip title="Excluir"><IconButton size="small" sx={{ color: '#f5576c' }} onClick={() => handleDeleteProduto(produto.id)}><Delete fontSize="small" /></IconButton></Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination rowsPerPageOptions={[5, 10, 25]} component="div" count={filteredProdutos.length} rowsPerPage={rowsPerPage} page={page} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage} labelRowsPerPage="Itens por página" sx={{ color: 'rgba(255,255,255,0.5)', '& .MuiTablePagination-select': { color: 'white' }, '& .MuiTablePagination-selectIcon': { color: 'rgba(255,255,255,0.5)' } }} />
      </Paper>

      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white', bgcolor: 'rgba(15,12,41,0.95)' }}>
          Novo Produto
          <IconButton onClick={handleCloseModal} sx={{ color: 'rgba(255,255,255,0.5)' }}><Close /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ bgcolor: 'rgba(15,12,41,0.95)' }}>
          <MuiTextField autoFocus margin="dense" label="Nome do Produto" fullWidth value={novoProduto.nome} onChange={(e) => setNovoProduto({ ...novoProduto, nome: e.target.value })} sx={{ mt: 2, '& .MuiInputBase-root': { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } }, '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' } }} />
          <MuiTextField margin="dense" label="Categoria" fullWidth select value={novoProduto.categoria} onChange={(e) => setNovoProduto({ ...novoProduto, categoria: e.target.value })} sx={{ mt: 2, '& .MuiInputBase-root': { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } }, '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' } }}>
            <MenuItem value="Eletrônicos">Eletrônicos</MenuItem>
            <MenuItem value="Acessórios">Acessórios</MenuItem>
            <MenuItem value="Periféricos">Periféricos</MenuItem>
          </MuiTextField>
          <MuiTextField margin="dense" label="Preço" fullWidth type="number" value={novoProduto.preco} onChange={(e) => setNovoProduto({ ...novoProduto, preco: e.target.value })} sx={{ mt: 2, '& .MuiInputBase-root': { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } }, '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' } }} />
          <MuiTextField margin="dense" label="Estoque" fullWidth type="number" value={novoProduto.estoque} onChange={(e) => setNovoProduto({ ...novoProduto, estoque: e.target.value })} sx={{ mt: 2, '& .MuiInputBase-root': { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } }, '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' } }} />
        </DialogContent>
        <DialogActions sx={{ bgcolor: 'rgba(15,12,41,0.95)', p: 2 }}>
          <Button onClick={handleCloseModal} sx={{ color: 'rgba(255,255,255,0.5)' }}>Cancelar</Button>
          <Button onClick={handleSaveProduto} variant="contained" sx={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>Salvar</Button>
        </DialogActions>
      </Dialog>
    </PageWrapper>
  );
};

export default ProdutoPage;