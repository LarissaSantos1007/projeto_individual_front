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
  Card,
  CardContent,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Add,
  Remove,
  Search,
  FilterList,
  Download,
  Print,
  Visibility,
  Edit,
  Delete,
  Close as CloseIcon
} from '@mui/icons-material';
import { showSuccess, showError } from '../utils/toastUtils';
import PageWrapper from '../components/PageWrapper';

interface Movimentacao {
  id: number;
  produto: string;
  tipo: 'ENTRADA' | 'SAIDA';
  quantidade: number;
  data: string;
  usuario: string;
  observacao: string;
}

const MovimentacaoPage = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState('todos');
  const [openModal, setOpenModal] = useState(false);
  const [tipoMovimentacao, setTipoMovimentacao] = useState<'ENTRADA' | 'SAIDA'>('ENTRADA');
  
  // ✅ ESTADO COM MOVIMENTAÇÕES - ATUALIZÁVEL
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([
    { id: 1, produto: 'Smartphone Pro', tipo: 'ENTRADA', quantidade: 10, data: '15/01/2024 14:30', usuario: 'Admin', observacao: 'Compra do fornecedor' },
    { id: 2, produto: 'Notebook Ultra', tipo: 'SAIDA', quantidade: 2, data: '16/01/2024 10:15', usuario: 'Admin', observacao: 'Venda para cliente' },
    { id: 3, produto: 'Tablet Max', tipo: 'ENTRADA', quantidade: 15, data: '17/01/2024 09:00', usuario: 'Admin', observacao: 'Novo lote' },
    { id: 4, produto: 'Fone Bluetooth', tipo: 'SAIDA', quantidade: 5, data: '18/01/2024 16:45', usuario: 'Admin', observacao: 'Venda' },
    { id: 5, produto: 'Monitor 4K', tipo: 'ENTRADA', quantidade: 3, data: '19/01/2024 11:20', usuario: 'Admin', observacao: 'Reposição' },
    { id: 6, produto: 'Teclado Mecânico', tipo: 'SAIDA', quantidade: 8, data: '20/01/2024 08:30', usuario: 'Admin', observacao: 'Venda' },
  ]);

  const [novaMovimentacao, setNovaMovimentacao] = useState({
    produto: '',
    quantidade: '',
    observacao: ''
  });

  const gerarId = () => {
    if (movimentacoes.length === 0) return 1;
    return Math.max(...movimentacoes.map(m => m.id)) + 1;
  };

  // ✅ SALVAR MOVIMENTAÇÃO
  const handleSaveMovimentacao = () => {
    if (!novaMovimentacao.produto || !novaMovimentacao.quantidade) {
      showError('Preencha todos os campos obrigatórios!');
      return;
    }

    const quantidade = parseInt(novaMovimentacao.quantidade);
    if (isNaN(quantidade) || quantidade <= 0) {
      showError('Quantidade deve ser um número válido!');
      return;
    }

    const novaMov: Movimentacao = {
      id: gerarId(),
      produto: novaMovimentacao.produto,
      tipo: tipoMovimentacao,
      quantidade: quantidade,
      data: new Date().toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      usuario: 'Admin',
      observacao: novaMovimentacao.observacao || 'N/A'
    };

    setMovimentacoes([...movimentacoes, novaMov]);
    const emoji = tipoMovimentacao === 'ENTRADA' ? '📥' : '📤';
    showSuccess(`${emoji} Movimentação de ${tipoMovimentacao} para "${novaMovimentacao.produto}" criada com sucesso!`);
    setNovaMovimentacao({ produto: '', quantidade: '', observacao: '' });
    setOpenModal(false);
  };

  // ✅ EXCLUIR MOVIMENTAÇÃO
  const handleDeleteMovimentacao = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta movimentação?')) {
      setMovimentacoes(movimentacoes.filter(m => m.id !== id));
      showSuccess('🗑️ Movimentação excluída com sucesso!');
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenModal = (tipo: 'ENTRADA' | 'SAIDA') => {
    setTipoMovimentacao(tipo);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setNovaMovimentacao({ produto: '', quantidade: '', observacao: '' });
  };

  const filteredMovimentacoes = movimentacoes.filter(mov => {
    const matchSearch = mov.produto.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTipo = tipoFilter === 'todos' || mov.tipo === tipoFilter;
    return matchSearch && matchTipo;
  });

  const totalMovimentacoes = movimentacoes.length;
  const totalEntradas = movimentacoes.filter(m => m.tipo === 'ENTRADA').length;
  const totalSaidas = movimentacoes.filter(m => m.tipo === 'SAIDA').length;
  const totalItens = movimentacoes.reduce((sum, m) => sum + m.quantidade, 0);

  return (
    <PageWrapper>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>📊 Movimentações</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenModal('ENTRADA')} sx={{ background: 'linear-gradient(135deg, #11998e, #38ef7d)', '&:hover': { background: 'linear-gradient(135deg, #0d7a6e, #2bc96a)' } }}>Entrada</Button>
          <Button variant="contained" startIcon={<Remove />} onClick={() => handleOpenModal('SAIDA')} sx={{ background: 'linear-gradient(135deg, #f093fb, #f5576c)', '&:hover': { background: 'linear-gradient(135deg, #d47ae8, #e0485c)' } }}>Saída</Button>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4 }}>
            <CardContent><Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Total</Typography><Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>{totalMovimentacoes}</Typography></CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4 }}>
            <CardContent><Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Entradas</Typography><Typography variant="h5" sx={{ color: '#38ef7d', fontWeight: 700 }}>{totalEntradas}</Typography></CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4 }}>
            <CardContent><Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Saídas</Typography><Typography variant="h5" sx={{ color: '#f5576c', fontWeight: 700 }}>{totalSaidas}</Typography></CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4 }}>
            <CardContent><Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Itens Movimentados</Typography><Typography variant="h5" sx={{ color: '#4facfe', fontWeight: 700 }}>{totalItens}</Typography></CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 2, mb: 3, background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField placeholder="Buscar movimentação..." size="small" value={searchTerm} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)} sx={{ flex: 1, minWidth: 200, '& .MuiInputBase-root': { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' }, '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' } } }} slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search sx={{ color: 'rgba(255,255,255,0.5)' }} /></InputAdornment> } }} />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel sx={{ color: 'rgba(255,255,255,0.5)' }}>Tipo</InputLabel>
          <Select value={tipoFilter} label="Tipo" onChange={(e) => setTipoFilter(e.target.value)} sx={{ color: 'white', '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' }, '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' } } }}>
            <MenuItem value="todos">Todos</MenuItem>
            <MenuItem value="ENTRADA">Entrada</MenuItem>
            <MenuItem value="SAIDA">Saída</MenuItem>
          </Select>
        </FormControl>
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
                <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Tipo</TableCell>
                <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }} align="center">Qtd</TableCell>
                <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Data</TableCell>
                <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Usuário</TableCell>
                <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Observação</TableCell>
                <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }} align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMovimentacoes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((mov) => (
                <TableRow key={mov.id} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.03)' } }}>
                  <TableCell sx={{ color: 'white' }}>{mov.id}</TableCell>
                  <TableCell sx={{ color: 'white' }}>{mov.produto}</TableCell>
                  <TableCell><Chip label={mov.tipo} size="small" sx={{ bgcolor: mov.tipo === 'ENTRADA' ? 'rgba(17, 153, 142, 0.3)' : 'rgba(245, 87, 108, 0.3)', color: mov.tipo === 'ENTRADA' ? '#38ef7d' : '#f5576c', border: `1px solid ${mov.tipo === 'ENTRADA' ? 'rgba(17, 153, 142, 0.2)' : 'rgba(245, 87, 108, 0.2)'}` }} /></TableCell>
                  <TableCell align="center"><Typography variant="body2" sx={{ color: mov.tipo === 'ENTRADA' ? '#38ef7d' : '#f5576c', fontWeight: 600 }}>{mov.tipo === 'ENTRADA' ? '+' : '-'}{mov.quantidade}</Typography></TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>{mov.data}</TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.7)' }}>{mov.usuario}</TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>{mov.observacao}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Visualizar"><IconButton size="small" sx={{ color: '#667eea' }}><Visibility fontSize="small" /></IconButton></Tooltip>
                    <Tooltip title="Editar"><IconButton size="small" sx={{ color: '#4facfe' }}><Edit fontSize="small" /></IconButton></Tooltip>
                    <Tooltip title="Excluir"><IconButton size="small" sx={{ color: '#f5576c' }} onClick={() => handleDeleteMovimentacao(mov.id)}><Delete fontSize="small" /></IconButton></Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination rowsPerPageOptions={[5, 10, 25]} component="div" count={filteredMovimentacoes.length} rowsPerPage={rowsPerPage} page={page} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage} labelRowsPerPage="Itens por página" sx={{ color: 'rgba(255,255,255,0.5)', '& .MuiTablePagination-select': { color: 'white' }, '& .MuiTablePagination-selectIcon': { color: 'rgba(255,255,255,0.5)' } }} />
      </Paper>

      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white', bgcolor: 'rgba(15,12,41,0.95)' }}>
          {tipoMovimentacao === 'ENTRADA' ? 'Nova Entrada' : 'Nova Saída'}
          <IconButton onClick={handleCloseModal} sx={{ color: 'rgba(255,255,255,0.5)' }}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ bgcolor: 'rgba(15,12,41,0.95)' }}>
          <TextField autoFocus margin="dense" label="Produto" fullWidth select value={novaMovimentacao.produto} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNovaMovimentacao({ ...novaMovimentacao, produto: e.target.value })} sx={{ mt: 2, '& .MuiInputBase-root': { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } }, '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' } }}>
            <MenuItem value="Smartphone Pro">Smartphone Pro</MenuItem>
            <MenuItem value="Notebook Ultra">Notebook Ultra</MenuItem>
            <MenuItem value="Tablet Max">Tablet Max</MenuItem>
            <MenuItem value="Fone Bluetooth">Fone Bluetooth</MenuItem>
            <MenuItem value="Monitor 4K">Monitor 4K</MenuItem>
            <MenuItem value="Teclado Mecânico">Teclado Mecânico</MenuItem>
          </TextField>
          <TextField margin="dense" label="Quantidade" fullWidth type="number" value={novaMovimentacao.quantidade} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNovaMovimentacao({ ...novaMovimentacao, quantidade: e.target.value })} sx={{ mt: 2, '& .MuiInputBase-root': { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } }, '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' } }} />
          <TextField margin="dense" label="Observação" fullWidth multiline rows={2} value={novaMovimentacao.observacao} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNovaMovimentacao({ ...novaMovimentacao, observacao: e.target.value })} sx={{ mt: 2, '& .MuiInputBase-root': { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } }, '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' } }} />
        </DialogContent>
        <DialogActions sx={{ bgcolor: 'rgba(15,12,41,0.95)', p: 2 }}>
          <Button onClick={handleCloseModal} sx={{ color: 'rgba(255,255,255,0.5)' }}>Cancelar</Button>
          <Button onClick={handleSaveMovimentacao} variant="contained" sx={{ background: tipoMovimentacao === 'ENTRADA' ? 'linear-gradient(135deg, #11998e, #38ef7d)' : 'linear-gradient(135deg, #f093fb, #f5576c)' }}>
            {tipoMovimentacao === 'ENTRADA' ? 'Registrar Entrada' : 'Registrar Saída'}
          </Button>
        </DialogActions>
      </Dialog>
    </PageWrapper>
  );
};

export default MovimentacaoPage;