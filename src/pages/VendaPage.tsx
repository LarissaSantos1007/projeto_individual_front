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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Alert
} from '@mui/material';
import {
  Receipt,
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

interface Venda {
  id: number;
  cliente: string;
  produto: string;
  quantidade: number;
  valorTotal: number;
  data: string;
  status: 'concluida' | 'pendente' | 'cancelada';
  metodo: string;
}

const VendaPage = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [openModal, setOpenModal] = useState(false);

  const [vendas, setVendas] = useState<Venda[]>([
    { id: 1, cliente: 'João Silva', produto: 'Smartphone Pro', quantidade: 2, valorTotal: 5999.98, data: '15/01/2024', status: 'concluida', metodo: 'Cartão' },
    { id: 2, cliente: 'Maria Santos', produto: 'Notebook Ultra', quantidade: 1, valorTotal: 4599.99, data: '16/01/2024', status: 'concluida', metodo: 'Pix' },
    { id: 3, cliente: 'Carlos Lima', produto: 'Tablet Max', quantidade: 3, valorTotal: 5699.97, data: '17/01/2024', status: 'pendente', metodo: 'Boleto' },
    { id: 4, cliente: 'Ana Oliveira', produto: 'Fone Bluetooth', quantidade: 5, valorTotal: 999.50, data: '18/01/2024', status: 'concluida', metodo: 'Dinheiro' },
    { id: 5, cliente: 'Pedro Souza', produto: 'Monitor 4K', quantidade: 1, valorTotal: 1299.99, data: '19/01/2024', status: 'cancelada', metodo: 'Cartão' },
    { id: 6, cliente: 'Fernanda Lima', produto: 'Teclado Mecânico', quantidade: 2, valorTotal: 699.80, data: '20/01/2024', status: 'pendente', metodo: 'Pix' },
    { id: 7, cliente: 'Roberto Alves', produto: 'Mouse Gamer', quantidade: 3, valorTotal: 389.70, data: '21/01/2024', status: 'concluida', metodo: 'Cartão' },
    { id: 8, cliente: 'Carla Dias', produto: 'Smartwatch', quantidade: 1, valorTotal: 799.99, data: '22/01/2024', status: 'concluida', metodo: 'Pix' },
    { id: 9, cliente: 'José Mateus', produto: 'Mouse Gamer', quantidade: 3, valorTotal: 389.70, data: '09/09/2026', status: 'pendente', metodo: 'Cartão' },
  ]);

  const [novaVenda, setNovaVenda] = useState({
    cliente: '',
    produto: '',
    quantidade: '',
    metodo: ''
  });

  const precos: { [key: string]: number } = {
    'Smartphone Pro': 2999.99,
    'Notebook Ultra': 4599.99,
    'Tablet Max': 1899.99,
    'Fone Bluetooth': 199.90,
    'Monitor 4K': 1299.99,
    'Teclado Mecânico': 349.90,
    'Mouse Gamer': 129.90,
    'Smartwatch': 799.99
  };

  const calcularValorTotal = (produto: string, quantidade: string) => {
    const qtd = parseInt(quantidade) || 0;
    const preco = precos[produto] || 0;
    return preco * qtd;
  };

  const valorTotalCalculado = calcularValorTotal(novaVenda.produto, novaVenda.quantidade);

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const gerarId = () => {
    if (vendas.length === 0) return 1;
    return Math.max(...vendas.map(v => v.id)) + 1;
  };

  const handleSaveVenda = () => {
    if (!novaVenda.cliente || !novaVenda.produto || !novaVenda.quantidade) {
      showError('Preencha todos os campos obrigatórios!');
      return;
    }

    const quantidade = parseInt(novaVenda.quantidade);
    if (isNaN(quantidade) || quantidade <= 0) {
      showError('Quantidade deve ser um número válido!');
      return;
    }

    if (!novaVenda.metodo) {
      showError('Selecione o método de pagamento!');
      return;
    }

    const valorTotal = valorTotalCalculado;

    const novaVendaObj: Venda = {
      id: gerarId(),
      cliente: novaVenda.cliente,
      produto: novaVenda.produto,
      quantidade: quantidade,
      valorTotal: valorTotal,
      data: new Date().toLocaleDateString('pt-BR'),
      status: 'pendente',
      metodo: novaVenda.metodo
    };

    setVendas([...vendas, novaVendaObj]);
    showSuccess(`🛒 Venda para "${novaVenda.cliente}" criada com sucesso!`);
    setNovaVenda({ cliente: '', produto: '', quantidade: '', metodo: '' });
    setOpenModal(false);
  };

  const handleDeleteVenda = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta venda?')) {
      setVendas(vendas.filter(v => v.id !== id));
      showSuccess('🗑️ Venda excluída com sucesso!');
    }
  };

  const handleStatusChange = (id: number) => {
    const statusOptions = ['concluida', 'pendente', 'cancelada'];
    setVendas(vendas.map(v => {
      if (v.id === id) {
        const currentIndex = statusOptions.indexOf(v.status);
        const nextIndex = (currentIndex + 1) % statusOptions.length;
        const newStatus = statusOptions[nextIndex] as 'concluida' | 'pendente' | 'cancelada';
        showSuccess(`Status alterado para: ${newStatus}`);
        return { ...v, status: newStatus };
      }
      return v;
    }));
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    setOpenModal(false);
    setNovaVenda({ cliente: '', produto: '', quantidade: '', metodo: '' });
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'concluida': return { bg: 'rgba(17, 153, 142, 0.3)', color: '#38ef7d', label: '✅ Concluída' };
      case 'pendente': return { bg: 'rgba(255, 152, 0, 0.3)', color: '#FF9800', label: '⏳ Pendente' };
      case 'cancelada': return { bg: 'rgba(245, 87, 108, 0.3)', color: '#f5576c', label: '❌ Cancelada' };
      default: return { bg: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', label: status };
    }
  };

  const filteredVendas = vendas.filter(v =>
    v.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.produto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredVendas.slice(startIndex, endIndex);

  const totalVendas = vendas.reduce((sum, v) => sum + v.valorTotal, 0);
  const totalConcluidas = vendas.filter(v => v.status === 'concluida').length;
  const ticketMedio = vendas.length > 0 ? totalVendas / vendas.length : 0;

  return (
    <PageWrapper>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>🛒 Vendas</Typography>
        <Button variant="contained" startIcon={<Receipt />} onClick={handleOpenModal} sx={{ background: 'linear-gradient(135deg, #4facfe, #00f2fe)', '&:hover': { background: 'linear-gradient(135deg, #3a8fd4, #00c8d4)' } }}>Nova Venda</Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4 }}>
            <CardContent>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Faturamento</Typography>
              <Typography variant="h5" sx={{ color: '#38ef7d', fontWeight: 700 }}>R$ {totalVendas.toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4 }}>
            <CardContent>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Total</Typography>
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>{vendas.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4 }}>
            <CardContent>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Concluídas</Typography>
              <Typography variant="h5" sx={{ color: '#4facfe', fontWeight: 700 }}>{totalConcluidas}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4 }}>
            <CardContent>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Ticket Médio</Typography>
              <Typography variant="h5" sx={{ color: '#f093fb', fontWeight: 700 }}>R$ {ticketMedio.toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 2, mb: 3, background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          placeholder="Buscar venda..."
          size="small"
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          sx={{ flex: 1, minWidth: 200, '& .MuiInputBase-root': { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' }, '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' } } }}
          slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search sx={{ color: 'rgba(255,255,255,0.5)' }} /></InputAdornment> } }}
        />
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
                <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Cliente</TableCell>
                <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Produto</TableCell>
                <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }} align="center">Qtd</TableCell>
                <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }} align="right">Valor</TableCell>
                <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Data</TableCell>
                <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }} align="center">Status</TableCell>
                <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }} align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((venda) => {
                const status = getStatusColor(venda.status);
                return (
                  <TableRow key={venda.id} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.03)' } }}>
                    <TableCell sx={{ color: 'white' }}>{venda.id}</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 500 }}>{venda.cliente}</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.7)' }}>{venda.produto}</TableCell>
                    <TableCell align="center" sx={{ color: 'white', fontWeight: 600 }}>{venda.quantidade}</TableCell>
                    <TableCell align="right" sx={{ color: '#38ef7d', fontWeight: 600 }}>R$ {venda.valorTotal.toFixed(2)}</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>{venda.data}</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={status.label}
                        size="small"
                        sx={{ bgcolor: status.bg, color: status.color, border: `1px solid ${status.color}33`, cursor: 'pointer' }}
                        onClick={() => handleStatusChange(venda.id)}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Visualizar"><IconButton size="small" sx={{ color: '#667eea' }}><Visibility fontSize="small" /></IconButton></Tooltip>
                      <Tooltip title="Editar"><IconButton size="small" sx={{ color: '#4facfe' }}><Edit fontSize="small" /></IconButton></Tooltip>
                      <Tooltip title="Excluir">
                        <IconButton size="small" sx={{ color: '#f5576c' }} onClick={() => handleDeleteVenda(venda.id)}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredVendas.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Itens por página"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          sx={{
            color: 'rgba(255,255,255,0.5)',
            '& .MuiTablePagination-select': { color: 'white' },
            '& .MuiTablePagination-selectIcon': { color: 'rgba(255,255,255,0.5)' },
            '& .MuiTablePagination-actions .MuiIconButton-root': {
              color: 'rgba(255,255,255,0.5)',
              '&:hover': { color: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
            }
          }}
        />
      </Paper>

      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white', bgcolor: 'rgba(15,12,41,0.95)' }}>
          Nova Venda
          <IconButton onClick={handleCloseModal} sx={{ color: 'rgba(255,255,255,0.5)' }}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ bgcolor: 'rgba(15,12,41,0.95)', pt: 2 }}>

          {novaVenda.produto && novaVenda.quantidade && (
            <Alert 
              severity="info" 
              sx={{ 
                mb: 2, 
                background: 'rgba(102, 126, 234, 0.15)',
                border: '1px solid rgba(102, 126, 234, 0.3)',
                color: 'white'
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                💰 Valor Total: <strong style={{ color: '#38ef7d' }}>R$ {valorTotalCalculado.toFixed(2)}</strong>
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                {novaVenda.produto} x {novaVenda.quantidade} = R$ {valorTotalCalculado.toFixed(2)}
              </Typography>
            </Alert>
          )}

          <TextField
            autoFocus
            margin="dense"
            label="Cliente"
            fullWidth
            value={novaVenda.cliente}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNovaVenda({ ...novaVenda, cliente: e.target.value })}
            sx={{ 
              mt: 1, 
              mb: 2,
              '& .MuiInputBase-root': { color: 'white' }, 
              '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' }, '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' } }, 
              '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' } 
            }}
          />

          <TextField
            margin="dense"
            label="Produto"
            fullWidth
            select
            value={novaVenda.produto}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setNovaVenda({ ...novaVenda, produto: e.target.value, quantidade: '' });
            }}
            sx={{ 
              mb: 2,
              '& .MuiInputBase-root': { color: 'white' }, 
              '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' }, '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' } }, 
              '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' } 
            }}
          >
            <MenuItem value="Smartphone Pro">Smartphone Pro - R$ 2.999,99</MenuItem>
            <MenuItem value="Notebook Ultra">Notebook Ultra - R$ 4.599,99</MenuItem>
            <MenuItem value="Tablet Max">Tablet Max - R$ 1.899,99</MenuItem>
            <MenuItem value="Fone Bluetooth">Fone Bluetooth - R$ 199,90</MenuItem>
            <MenuItem value="Monitor 4K">Monitor 4K - R$ 1.299,99</MenuItem>
            <MenuItem value="Teclado Mecânico">Teclado Mecânico - R$ 349,90</MenuItem>
            <MenuItem value="Mouse Gamer">Mouse Gamer - R$ 129,90</MenuItem>
            <MenuItem value="Smartwatch">Smartwatch - R$ 799,99</MenuItem>
          </TextField>

          <TextField
            margin="dense"
            label="Quantidade"
            fullWidth
            type="number"
            value={novaVenda.quantidade}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setNovaVenda({ ...novaVenda, quantidade: e.target.value });
            }}
            slotProps={{
              input: {
                inputProps: { min: 1 }
              }
            }}
            sx={{ 
              mb: 2,
              '& .MuiInputBase-root': { color: 'white' }, 
              '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' }, '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' } }, 
              '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' } 
            }}
          />

          {novaVenda.produto && novaVenda.quantidade && valorTotalCalculado > 0 && (
            <TextField
              margin="dense"
              label="Método de Pagamento"
              fullWidth
              select
              value={novaVenda.metodo}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNovaVenda({ ...novaVenda, metodo: e.target.value })}
              sx={{ 
                mt: 1,
                '& .MuiInputBase-root': { color: 'white' }, 
                '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' }, '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' } }, 
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' } 
              }}
            >
              <MenuItem value="Cartão">💳 Cartão de Crédito</MenuItem>
              <MenuItem value="Pix">📱 Pix</MenuItem>
              <MenuItem value="Boleto">📄 Boleto</MenuItem>
              <MenuItem value="Dinheiro">💰 Dinheiro</MenuItem>
            </TextField>
          )}
        </DialogContent>
        <DialogActions sx={{ bgcolor: 'rgba(15,12,41,0.95)', p: 2, gap: 1 }}>
          <Button onClick={handleCloseModal} sx={{ color: 'rgba(255,255,255,0.5)' }}>Cancelar</Button>
          <Button 
            onClick={handleSaveVenda} 
            variant="contained" 
            disabled={!novaVenda.cliente || !novaVenda.produto || !novaVenda.quantidade || !novaVenda.metodo}
            sx={{ 
              background: 'linear-gradient(135deg, #4facfe, #00f2fe)',
              '&:hover': { background: 'linear-gradient(135deg, #3a8fd4, #00c8d4)' },
              '&:disabled': { opacity: 0.5 }
            }}
          >
            Finalizar Venda - R$ {valorTotalCalculado.toFixed(2)}
          </Button>
        </DialogActions>
      </Dialog>
    </PageWrapper>
  );
};

export default VendaPage;