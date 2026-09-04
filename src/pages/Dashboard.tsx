import React, { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  Button,
  Divider,
  LinearProgress,
  Paper
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Inventory,
  ShoppingCart,
  AttachMoney,
  People,
  Refresh,
  ArrowForward,
  Star,
  Rocket,
  AutoAwesome,
  Flag
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProdutos: 0,
    totalVendas: 0,
    totalReceita: 0,
    totalClientes: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setTimeout(() => {
          setStats({
            totalProdutos: 156,
            totalVendas: 48,
            totalReceita: 12500.50,
            totalClientes: 89,
          });
        }, 800);
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
      }
    };
    fetchStats();
  }, []);

  const topProdutos = [
    { nome: 'Smartphone Pro', vendas: 45, receita: 89999.55, crescimento: '+23%', cor: '#667eea', avaliacao: 4.8 },
    { nome: 'Notebook Ultra', vendas: 29, receita: 104399.71, crescimento: '+15%', cor: '#764ba2', avaliacao: 4.9 },
    { nome: 'Camiseta Premium', vendas: 38, receita: 1899.62, crescimento: '+8%', cor: '#f093fb', avaliacao: 4.5 },
    { nome: 'Arroz Integral', vendas: 25, receita: 649.75, crescimento: '-5%', cor: '#4facfe', avaliacao: 4.2 },
  ];

  const metas = [
    { titulo: 'Faturamento Mensal', atual: 12500, meta: 20000, progresso: 62.5, cor: '#667eea', diasRestantes: 12 },
    { titulo: 'Vendas do Mês', atual: 48, meta: 60, progresso: 80, cor: '#4facfe', diasRestantes: 8 },
    { titulo: 'Clientes Ativos', atual: 89, meta: 100, progresso: 89, cor: '#38ef7d', diasRestantes: 15 },
    { titulo: 'Ticket Médio', atual: 278, meta: 350, progresso: 79.4, cor: '#f093fb', diasRestantes: 10 },
  ];

  const cards = [
    {
      title: 'Receita Total',
      value: `R$ ${stats.totalReceita.toFixed(2)}`,
      change: '+12.5%',
      trend: 'up',
      icon: <AttachMoney sx={{ fontSize: 28 }} />,
      gradient: 'linear-gradient(135deg, #11998e, #38ef7d)',
      bgGradient: 'linear-gradient(135deg, rgba(17, 153, 142, 0.2), rgba(56, 239, 125, 0.2))',
      subtext: 'Últimos 30 dias',
      onClick: () => navigate('/relatorios')
    },
    {
      title: 'Produtos',
      value: stats.totalProdutos,
      change: '+5.2%',
      trend: 'up',
      icon: <Inventory sx={{ fontSize: 28 }} />,
      gradient: 'linear-gradient(135deg, #667eea, #764ba2)',
      bgGradient: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2))',
      subtext: 'Em estoque',
      onClick: () => navigate('/produtos')
    },
    {
      title: 'Vendas',
      value: stats.totalVendas,
      change: '+18.7%',
      trend: 'up',
      icon: <ShoppingCart sx={{ fontSize: 28 }} />,
      gradient: 'linear-gradient(135deg, #f093fb, #f5576c)',
      bgGradient: 'linear-gradient(135deg, rgba(240, 147, 251, 0.2), rgba(245, 87, 108, 0.2))',
      subtext: 'Este mês',
      onClick: () => navigate('/vendas')
    },
    {
      title: 'Clientes',
      value: stats.totalClientes,
      change: '+8.3%',
      trend: 'up',
      icon: <People sx={{ fontSize: 28 }} />,
      gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)',
      bgGradient: 'linear-gradient(135deg, rgba(79, 172, 254, 0.2), rgba(0, 242, 254, 0.2))',
      subtext: 'Ativos',
      onClick: () => navigate('/categorias')
    }
  ];

  return (
    <PageWrapper>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: 2 }}>
              <Rocket sx={{ fontSize: 35, color: '#667eea' }} />
              Olá, {user?.nome || 'Usuário'}! 👋
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <AutoAwesome sx={{ fontSize: 18, color: '#f093fb' }} />
              Bem-vindo ao seu painel - {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </Typography>
          </Box>
          <Tooltip title="Atualizar">
            <IconButton sx={{ bgcolor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)', transform: 'rotate(180deg)' }, transition: 'all 0.5s ease' }} onClick={() => window.location.reload()}>
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {cards.map((card, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
            <Box onClick={card.onClick} sx={{ cursor: 'pointer', p: 0.5, background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden', '&:hover': { transform: 'translateY(-8px) scale(1.02)', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)', borderColor: 'rgba(255, 255, 255, 0.2)' }, transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
              <Box sx={{ p: 3, background: 'rgba(255,255,255,0.05)', borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
                <Box sx={{ position: 'absolute', top: -50, right: -50, width: 150, height: 150, borderRadius: '50%', background: card.gradient, opacity: 0.1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>{card.title}</Typography>
                    <Typography variant="h4" sx={{ mt: 1, fontWeight: 700, color: 'white' }}>{typeof card.value === 'number' ? card.value.toLocaleString() : card.value}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                      <Chip size="small" label={card.change} icon={card.trend === 'up' ? <TrendingUp sx={{ fontSize: 14 }} /> : <TrendingDown sx={{ fontSize: 14 }} />} sx={{ bgcolor: card.trend === 'up' ? 'rgba(17, 153, 142, 0.3)' : 'rgba(245, 87, 108, 0.3)', color: card.trend === 'up' ? '#38ef7d' : '#f5576c', fontWeight: 600 }} />
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>{card.subtext}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ width: 56, height: 56, borderRadius: 3, background: card.bgGradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{card.icon}</Box>
                </Box>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Metas */}
      <Paper sx={{ p: 3, mb: 4, background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4 }}>
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Flag sx={{ color: '#f5576c' }} />
          Metas do Mês
          <Chip size="small" label="Em andamento" sx={{ ml: 2, bgcolor: 'rgba(56, 239, 125, 0.2)', color: '#38ef7d' }} />
        </Typography>
        <Grid container spacing={3}>
          {metas.map((meta, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
              <Box sx={{ textAlign: 'center', p: 2, borderRadius: 3, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 30px rgba(0,0,0,0.2)' } }}>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>{meta.titulo}</Typography>
                <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>{meta.titulo.includes('Faturamento') || meta.titulo.includes('Ticket') ? `R$ ${meta.atual}` : meta.atual}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                  <LinearProgress variant="determinate" value={meta.progresso} sx={{ flex: 1, height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.05)', '& .MuiLinearProgress-bar': { bgcolor: meta.cor, borderRadius: 3 } }} />
                  <Typography variant="caption" sx={{ color: meta.cor, fontWeight: 600 }}>{meta.progresso}%</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)' }}>Meta: {meta.titulo.includes('Faturamento') || meta.titulo.includes('Ticket') ? `R$ ${meta.meta}` : meta.meta}</Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)' }}>⏳ {meta.diasRestantes} dias</Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Gráfico e Top Produtos */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Box sx={{ p: 3, background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>📊 Vendas dos Últimos 7 Dias</Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Comparativo de vendas diárias</Typography>
              </Box>
              <Button size="small" endIcon={<ArrowForward />} sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.2)', '&:hover': { borderColor: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.1)' } }} variant="outlined" onClick={() => navigate('/vendas')}>
                Ver detalhes
              </Button>
            </Box>
            <Box sx={{ height: 200, display: 'flex', alignItems: 'flex-end', gap: 2, pt: 2 }}>
              {[30, 45, 28, 52, 38, 65, 42].map((value, index) => (
                <Box key={index} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Box sx={{ width: '100%', height: `${(value / 70) * 100}%`, minHeight: 20, background: index === 5 ? 'linear-gradient(180deg, #667eea, #764ba2)' : 'rgba(102, 126, 234, 0.3)', borderRadius: '8px 8px 0 0', transition: 'all 0.3s ease', '&:hover': { background: 'linear-gradient(180deg, #667eea, #764ba2)', transform: 'scaleY(1.05)', boxShadow: '0 8px 30px rgba(102, 126, 234, 0.4)' } }} />
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', mt: 1 }}>{['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'][index]}</Typography>
                </Box>
              ))}
            </Box>
            <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.1)' }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
              <Box sx={{ textAlign: 'center' }}><Typography variant="h6" sx={{ fontWeight: 600, color: 'white' }}>R$ 8.450,00</Typography><Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>Total da semana</Typography></Box>
              <Box sx={{ textAlign: 'center' }}><Typography variant="h6" sx={{ fontWeight: 600, color: '#38ef7d' }}>+23.5%</Typography><Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>Crescimento</Typography></Box>
              <Box sx={{ textAlign: 'center' }}><Typography variant="h6" sx={{ fontWeight: 600, color: '#667eea' }}>48</Typography><Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>Total de vendas</Typography></Box>
              <Box sx={{ textAlign: 'center' }}><Typography variant="h6" sx={{ fontWeight: 600, color: '#f093fb' }}>R$ 278,00</Typography><Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>Ticket Médio</Typography></Box>
            </Box>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ p: 3, background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>🏆 Top Produtos</Typography>
              <Chip label="Destaque" size="small" sx={{ bgcolor: 'rgba(245, 87, 108, 0.3)', color: '#f5576c', border: '1px solid rgba(245, 87, 108, 0.2)' }} />
            </Box>
            {topProdutos.map((prod, index) => (
              <Box key={index} sx={{ p: 2, mb: 1.5, borderRadius: 3, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.3s ease', '&:hover': { background: 'rgba(255,255,255,0.1)', transform: 'translateX(8px)', borderColor: 'rgba(255,255,255,0.1)', cursor: 'pointer' } }} onClick={() => navigate('/produtos')}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ width: 32, height: 32, borderRadius: 2, background: `linear-gradient(135deg, ${prod.cor}, ${prod.cor}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Star sx={{ fontSize: 16, color: 'white' }} /></Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>{prod.nome}</Typography>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>{prod.vendas} vendas</Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)' }}>•</Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>⭐ {prod.avaliacao}</Typography>
                    </Box>
                  </Box>
                  <Chip size="small" label={`#${index + 1}`} sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)' }} />
                </Box>
              </Box>
            ))}
          </Box>
        </Grid>
      </Grid>
    </PageWrapper>
  );
};

export default Dashboard;