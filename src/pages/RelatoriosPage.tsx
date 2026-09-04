import React, { useState } from 'react';
import {
  Typography,
  Box,
  Grid,
  Paper,
  Card,
  CardContent,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Divider,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Assessment,
  TrendingUp,
  TrendingDown,
  Download,
  Print,
  FileDownload,
  BarChart,
  PieChart,
  AttachMoney,
  Inventory,
  ShoppingCart,
  People,
  Timeline,
  Flag
} from '@mui/icons-material';
import { showSuccess, showError } from '../utils/toastUtils';
import PageWrapper from '../components/PageWrapper';

const RelatoriosPage = () => {
  const [periodo, setPeriodo] = useState('mensal');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGerarRelatorio = () => {
    if (!dataInicio || !dataFim) {
      showError('Selecione as datas para gerar o relatório!');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showSuccess('📊 Relatório gerado com sucesso!');
    }, 2000);
  };

  const stats = [
    { title: 'Faturamento Total', value: 'R$ 45.780,00', change: '+18.5%', trend: 'up', icon: <AttachMoney sx={{ fontSize: 32, color: '#38ef7d' }} />, cor: '#38ef7d', detalhe: '+R$ 7.120,00 vs mês anterior' },
    { title: 'Total de Vendas', value: '1.247', change: '+12.3%', trend: 'up', icon: <ShoppingCart sx={{ fontSize: 32, color: '#4facfe' }} />, cor: '#4facfe', detalhe: '+137 vendas vs mês anterior' },
    { title: 'Produtos Vendidos', value: '3.892', change: '+8.7%', trend: 'up', icon: <Inventory sx={{ fontSize: 32, color: '#f093fb' }} />, cor: '#f093fb', detalhe: '+312 produtos vs mês anterior' },
    { title: 'Clientes Ativos', value: '567', change: '+22.1%', trend: 'up', icon: <People sx={{ fontSize: 32, color: '#f5576c' }} />, cor: '#f5576c', detalhe: '+103 clientes vs mês anterior' }
  ];

  const categorias = [
    { nome: 'Eletrônicos', valor: 18500, porcentagem: 40, cor: '#667eea', crescimento: '+15%' },
    { nome: 'Roupas', valor: 12000, porcentagem: 26, cor: '#4facfe', crescimento: '+8%' },
    { nome: 'Alimentos', valor: 8500, porcentagem: 19, cor: '#38ef7d', crescimento: '-2%' },
    { nome: 'Outros', valor: 6780, porcentagem: 15, cor: '#f093fb', crescimento: '+5%' }
  ];

  const topProdutos = [
    { nome: 'Smartphone Pro', vendas: 89, receita: 266999.11, crescimento: '+23%', avaliacao: 4.8 },
    { nome: 'Notebook Ultra', vendas: 67, receita: 308199.33, crescimento: '+15%', avaliacao: 4.9 },
    { nome: 'Tablet Max', vendas: 234, receita: 18700.66, crescimento: '+8%', avaliacao: 4.5 },
    { nome: 'Fone Bluetooth', vendas: 456, receita: 14820.00, crescimento: '-5%', avaliacao: 4.2 }
  ];

  const desempenhoMensal = [
    { mes: 'Jan', vendas: 8500, meta: 10000, atingido: 85 },
    { mes: 'Fev', vendas: 9200, meta: 10000, atingido: 92 },
    { mes: 'Mar', vendas: 7800, meta: 10000, atingido: 78 },
    { mes: 'Abr', vendas: 10500, meta: 10000, atingido: 105 },
    { mes: 'Mai', vendas: 11200, meta: 10000, atingido: 112 },
    { mes: 'Jun', vendas: 12500, meta: 10000, atingido: 125 }
  ];

  return (
    <PageWrapper>
      <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 3 }}>📈 Relatórios</Typography>

      <Paper sx={{ p: 3, mb: 4, background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: 'rgba(255,255,255,0.5)' }}>Período</InputLabel>
              <Select value={periodo} label="Período" onChange={(e) => setPeriodo(e.target.value)} sx={{ color: 'white', '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' }, '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' } } }}>
                <MenuItem value="diario">📅 Diário</MenuItem>
                <MenuItem value="semanal">📊 Semanal</MenuItem>
                <MenuItem value="mensal">📈 Mensal</MenuItem>
                <MenuItem value="anual">📉 Anual</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField fullWidth label="Data Início" type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} slotProps={{ inputLabel: { shrink: true } }} sx={{ '& .MuiInputBase-root': { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' }, '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' } } }} />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField fullWidth label="Data Fim" type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} slotProps={{ inputLabel: { shrink: true } }} sx={{ '& .MuiInputBase-root': { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' }, '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' } } }} />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Button fullWidth variant="contained" onClick={handleGerarRelatorio} disabled={loading} startIcon={<Assessment />} sx={{ height: 56, borderRadius: 3, background: 'linear-gradient(135deg, #667eea, #764ba2)', '&:hover': { background: 'linear-gradient(135deg, #5a67d8, #6b3fa0)' }, fontWeight: 600, fontSize: '1rem' }}>
              {loading ? <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}><LinearProgress sx={{ width: '100%', height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.2)' }} /><Typography variant="caption" sx={{ color: 'white' }}>Gerando...</Typography></Box> : 'Gerar Relatório'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)' } }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>{stat.title}</Typography>
                    <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, mt: 1 }}>{stat.value}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                      <Chip size="small" label={stat.change} icon={stat.trend === 'up' ? <TrendingUp sx={{ fontSize: 14 }} /> : <TrendingDown sx={{ fontSize: 14 }} />} sx={{ bgcolor: stat.trend === 'up' ? 'rgba(17, 153, 142, 0.3)' : 'rgba(245, 87, 108, 0.3)', color: stat.trend === 'up' ? '#38ef7d' : '#f5576c', fontWeight: 600 }} />
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)' }}>período anterior</Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', display: 'block', mt: 0.5 }}>{stat.detalhe}</Typography>
                  </Box>
                  <Box sx={{ width: 48, height: 48, borderRadius: 3, background: `rgba(${stat.cor === '#38ef7d' ? '17, 153, 142' : stat.cor === '#4facfe' ? '79, 172, 254' : stat.cor === '#f093fb' ? '240, 147, 251' : '245, 87, 108'}, 0.2)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{stat.icon}</Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ p: 3, mb: 4, background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}><Timeline sx={{ verticalAlign: 'middle', mr: 1, color: '#667eea' }} />Desempenho Mensal</Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>Comparativo de vendas vs meta</Typography>
          </Box>
          <Chip label="Meta: R$ 10.000,00" size="small" sx={{ bgcolor: 'rgba(17, 153, 142, 0.3)', color: '#38ef7d', border: '1px solid rgba(17, 153, 142, 0.2)' }} />
        </Box>
        <Grid container spacing={2}>
          {desempenhoMensal.map((item, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 2 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>{item.mes}</Typography>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>R$ {item.vendas}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                  <LinearProgress variant="determinate" value={Math.min(item.atingido, 100)} sx={{ flex: 1, height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.05)', '& .MuiLinearProgress-bar': { borderRadius: 3, bgcolor: item.atingido >= 100 ? '#38ef7d' : item.atingido >= 80 ? '#FF9800' : '#f5576c' } }} />
                  <Typography variant="caption" sx={{ color: item.atingido >= 100 ? '#38ef7d' : item.atingido >= 80 ? '#FF9800' : '#f5576c', fontWeight: 600 }}>{item.atingido}%</Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}><PieChart sx={{ verticalAlign: 'middle', mr: 1, color: '#667eea' }} />Vendas por Categoria</Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>Distribuição de vendas por categoria</Typography>
              </Box>
              <Box>
                <Tooltip title="Imprimir"><IconButton size="small" sx={{ color: 'rgba(255,255,255,0.5)' }}><Print fontSize="small" /></IconButton></Tooltip>
                <Tooltip title="Exportar"><IconButton size="small" sx={{ color: 'rgba(255,255,255,0.5)' }}><FileDownload fontSize="small" /></IconButton></Tooltip>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {categorias.map((cat, index) => (
                <Box key={index}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>{cat.nome}</Typography>
                      <Chip size="small" label={cat.crescimento} sx={{ height: 16, fontSize: '0.5rem', bgcolor: cat.crescimento.startsWith('+') ? 'rgba(17, 153, 142, 0.3)' : 'rgba(245, 87, 108, 0.3)', color: cat.crescimento.startsWith('+') ? '#38ef7d' : '#f5576c' }} />
                    </Box>
                    <Typography variant="body2" sx={{ color: cat.cor, fontWeight: 600 }}>R$ {cat.valor.toLocaleString('pt-BR')}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <LinearProgress variant="determinate" value={cat.porcentagem} sx={{ flex: 1, height: 8, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.05)', '& .MuiLinearProgress-bar': { bgcolor: cat.cor, borderRadius: 4 } }} />
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', minWidth: 45 }}>{cat.porcentagem}%</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
            <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.05)' }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
              {categorias.map((cat, index) => (<Box key={index} sx={{ textAlign: 'center' }}><Box sx={{ width: 12, height: 12, borderRadius: 2, bgcolor: cat.cor, mx: 'auto', mb: 0.5 }} /><Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)' }}>{cat.nome}</Typography></Box>))}
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}><BarChart sx={{ verticalAlign: 'middle', mr: 1, color: '#4facfe' }} />Produtos Mais Vendidos</Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>Top produtos em desempenho</Typography>
              </Box>
              <Box>
                <Tooltip title="Imprimir"><IconButton size="small" sx={{ color: 'rgba(255,255,255,0.5)' }}><Print fontSize="small" /></IconButton></Tooltip>
                <Tooltip title="Exportar"><IconButton size="small" sx={{ color: 'rgba(255,255,255,0.5)' }}><FileDownload fontSize="small" /></IconButton></Tooltip>
              </Box>
            </Box>
            {topProdutos.map((prod, index) => (
              <Paper key={index} elevation={0} sx={{ p: 2, mb: 1.5, borderRadius: 3, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.3s ease', '&:hover': { background: 'rgba(255,255,255,0.08)', transform: 'translateX(8px)', borderColor: 'rgba(255,255,255,0.1)', cursor: 'pointer' } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ width: 32, height: 32, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: index === 0 ? 'rgba(102, 126, 234, 0.3)' : index === 1 ? 'rgba(79, 172, 254, 0.3)' : index === 2 ? 'rgba(56, 239, 125, 0.3)' : 'rgba(240, 147, 251, 0.3)', color: index === 0 ? '#667eea' : index === 1 ? '#4facfe' : index === 2 ? '#38ef7d' : '#f093fb', fontWeight: 'bold', fontSize: '0.875rem' }}>#{index + 1}</Box>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>{prod.nome}</Typography>
                      <Chip size="small" label={`⭐ ${prod.avaliacao}`} sx={{ height: 16, fontSize: '0.5rem', bgcolor: 'rgba(255, 183, 77, 0.3)', color: '#FFB300' }} />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>🛒 {prod.vendas} vendas</Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>💰 R$ {prod.receita.toFixed(2)}</Typography>
                    </Box>
                  </Box>
                  <Chip size="small" label={prod.crescimento} sx={{ bgcolor: prod.crescimento.startsWith('+') ? 'rgba(17, 153, 142, 0.3)' : 'rgba(245, 87, 108, 0.3)', color: prod.crescimento.startsWith('+') ? '#38ef7d' : '#f5576c', fontWeight: 600 }} />
                </Box>
              </Paper>
            ))}
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, mt: 3, background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Button variant="outlined" startIcon={<Download />} sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.2)', '&:hover': { borderColor: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.1)' } }}>Exportar PDF</Button>
        <Button variant="outlined" startIcon={<FileDownload />} sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.2)', '&:hover': { borderColor: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.1)' } }}>Exportar Excel</Button>
        <Button variant="outlined" startIcon={<Print />} sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.2)', '&:hover': { borderColor: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.1)' } }}>Imprimir Relatório</Button>
      </Paper>
    </PageWrapper>
  );
};

export default RelatoriosPage;