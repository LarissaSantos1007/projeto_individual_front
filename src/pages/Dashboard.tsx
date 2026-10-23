import React, { useState, useEffect, useCallback } from 'react';
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
  Paper,
  Card,
  CardContent,
  CircularProgress,
  Avatar
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
  Flag,
  EmojiEvents,
  Speed,
  Bolt,
  Timeline
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import { showSuccess } from '../utils/toastUtils';
import GradientText from '../components/GradientText';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalProdutos: 0,
    totalVendas: 0,
    totalReceita: 0,
    totalClientes: 0,
  });

  const dadosIniciais = {
    totalProdutos: 18,
    totalVendas: 48,
    totalReceita: 12500.50,
    totalClientes: 89,
  };

  const fetchStats = useCallback(async () => {
    if (stats.totalProdutos > 0 && !loading) {
      return;
    }
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setStats(dadosIniciais);
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  }, [stats.totalProdutos, loading]);

  const handleRefresh = useCallback(async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const novosDados = {
        totalProdutos: Math.floor(Math.random() * 10) + 15,
        totalVendas: Math.floor(Math.random() * 20) + 40,
        totalReceita: Math.random() * 8000 + 8000,
        totalClientes: Math.floor(Math.random() * 30) + 70,
      };
      setStats(novosDados);
      showSuccess('📊 Dados recarregados com sucesso!');
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, []);

  const topProdutos = [
    { nome: 'Smartphone Pro', vendas: 45, receita: 89999.55, crescimento: '+23%', cor: '#667eea', avaliacao: 4.8 },
    { nome: 'Notebook Ultra', vendas: 29, receita: 104399.71, crescimento: '+15%', cor: '#764ba2', avaliacao: 4.9 },
    { nome: 'Monitor 4K Curvo', vendas: 38, receita: 49399.62, crescimento: '+32%', cor: '#4facfe', avaliacao: 4.7 },
    { nome: 'Fone Bluetooth Pro', vendas: 34, receita: 6799.30, crescimento: '+18%', cor: '#f093fb', avaliacao: 4.3 },
    { nome: 'Teclado Mecânico RGB', vendas: 28, receita: 9799.72, crescimento: '+42%', cor: '#38ef7d', avaliacao: 4.6 },
    { nome: 'Mouse Gamer Wireless', vendas: 22, receita: 2857.78, crescimento: '+11%', cor: '#f5576c', avaliacao: 4.4 },
  ];

  const metas = [
    { titulo: 'Faturamento Mensal', atual: 12500, meta: 20000, progresso: 62.5, cor: '#667eea', diasRestantes: 12, icone: <AttachMoney sx={{ fontSize: 18 }} /> },
    { titulo: 'Vendas do Mês', atual: 48, meta: 60, progresso: 80, cor: '#4facfe', diasRestantes: 8, icone: <ShoppingCart sx={{ fontSize: 18 }} /> },
    { titulo: 'Clientes Ativos', atual: 89, meta: 100, progresso: 89, cor: '#38ef7d', diasRestantes: 15, icone: <People sx={{ fontSize: 18 }} /> },
    { titulo: 'Ticket Médio', atual: 278, meta: 350, progresso: 79.4, cor: '#f093fb', diasRestantes: 10, icone: <AttachMoney sx={{ fontSize: 18 }} /> },
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
      color: '#38ef7d',
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
      color: '#764ba2',
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
      color: '#f5576c',
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
      color: '#4facfe',
      onClick: () => navigate('/categorias')
    }
  ];

  return (
    <PageWrapper>
      {/* Header */}
      <Box sx={{ mb: 4, animation: 'fadeInDown 0.6s ease-out' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ animation: 'float 3s ease-in-out infinite' }}>
                <Rocket sx={{ fontSize: 35, color: '#667eea' }} />
              </Box>
              <GradientText variant="h4" sx={{ fontWeight: 700 }}>
                Olá, {user?.nome || 'Usuário'}! 👋
              </GradientText>
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.6)', mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <AutoAwesome sx={{ fontSize: 18, color: '#f093fb' }} />
              Bem-vindo ao seu painel - {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </Typography>
          </Box>
          <Tooltip title="Recarregar dados">
            <IconButton 
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.08)', 
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                color: 'white', 
                border: '1px solid rgba(255,255,255,0.1)',
                transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                '&:hover': { 
                  bgcolor: 'rgba(255,255,255,0.15)', 
                  transform: 'rotate(180deg) scale(1.1)',
                  borderColor: 'rgba(255,255,255,0.2)'
                } 
              }} 
              onClick={handleRefresh}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : <Refresh />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {cards.map((card, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
            <Box 
              onClick={card.onClick} 
              sx={{ 
                cursor: 'pointer', 
                p: 1, 
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 4, 
                overflow: 'hidden',
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                '&:hover': { 
                  transform: 'translateY(-8px) scale(1.02)', 
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                  borderColor: 'rgba(255, 255, 255, 0.15)'
                }
              }}
            >
              <Box sx={{ p: 3, background: 'rgba(255,255,255,0.03)', borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
                <Box sx={{ 
                  position: 'absolute', 
                  top: -50, 
                  right: -50, 
                  width: 150, 
                  height: 150, 
                  borderRadius: '50%', 
                  background: card.gradient, 
                  opacity: 0.08,
                  transition: 'all 0.6s ease',
                  '&:hover': { opacity: 0.15, transform: 'scale(1.5)' }
                }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
                      {card.title}
                    </Typography>
                    <Typography variant="h4" sx={{ mt: 1, fontWeight: 700, color: 'white' }}>
                      {typeof card.value === 'number' ? card.value.toLocaleString() : card.value}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                      <Chip 
                        size="small" 
                        label={card.change} 
                        icon={card.trend === 'up' ? <TrendingUp sx={{ fontSize: 14 }} /> : <TrendingDown sx={{ fontSize: 14 }} />} 
                        sx={{ 
                          bgcolor: card.trend === 'up' ? 'rgba(17, 153, 142, 0.25)' : 'rgba(245, 87, 108, 0.25)', 
                          color: card.trend === 'up' ? '#38ef7d' : '#f5576c', 
                          fontWeight: 600,
                          backdropFilter: 'blur(10px)',
                          WebkitBackdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255,255,255,0.05)'
                        }} 
                      />
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>{card.subtext}</Typography>
                    </Box>
                  </Box>
                  <Avatar
                    sx={{
                      width: 56,
                      height: 56,
                      background: card.bgGradient,
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}
                  >
                    {card.icon}
                  </Avatar>
                </Box>
                <Box sx={{ mt: 2, position: 'relative' }}>
                  <LinearProgress
                    variant="determinate"
                    value={Math.random() * 60 + 40}
                    sx={{
                      height: 4,
                      borderRadius: 2,
                      bgcolor: 'rgba(255,255,255,0.05)',
                      '& .MuiLinearProgress-bar': {
                        background: card.gradient,
                        borderRadius: 2
                      }
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Metas */}
      <Paper sx={{ 
        p: 3, 
        mb: 4, 
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 4,
        animation: 'fadeInUp 0.6s ease-out 0.3s both'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <EmojiEvents sx={{ color: '#FFB300', fontSize: 28 }} />
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
            Metas do Mês
          </Typography>
          <Chip 
            size="small" 
            label="🚀 Em andamento" 
            sx={{ 
              bgcolor: 'rgba(56, 239, 125, 0.15)', 
              color: '#38ef7d',
              border: '1px solid rgba(56, 239, 125, 0.2)'
            }} 
          />
          <Chip 
            size="small" 
            label={new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            sx={{ 
              bgcolor: 'rgba(102, 126, 234, 0.15)', 
              color: '#667eea',
              border: '1px solid rgba(102, 126, 234, 0.2)'
            }} 
          />
        </Box>
        <Grid container spacing={3}>
          {metas.map((meta, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
              <Box sx={{ 
                textAlign: 'center', 
                p: 2.5, 
                borderRadius: 3, 
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.05)',
                transition: 'all 0.3s ease',
                animation: `fadeInUp 0.6s ease-out ${0.4 + index * 0.1}s both`,
                '&:hover': { 
                  transform: 'translateY(-6px)', 
                  boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
                  borderColor: 'rgba(255,255,255,0.1)'
                }
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
                  <Box sx={{ color: meta.cor }}>{meta.icone}</Box>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>{meta.titulo}</Typography>
                </Box>
                <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
                  {meta.titulo.includes('Faturamento') || meta.titulo.includes('Ticket') ? `R$ ${meta.atual}` : meta.atual}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center', mt: 1 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={meta.progresso} 
                    sx={{ 
                      flex: 1, 
                      height: 8, 
                      borderRadius: 4, 
                      bgcolor: 'rgba(255,255,255,0.05)',
                      '& .MuiLinearProgress-bar': { 
                        bgcolor: meta.cor, 
                        borderRadius: 4,
                        background: `linear-gradient(90deg, ${meta.cor}, ${meta.cor}88)`
                      } 
                    }} 
                  />
                  <Typography variant="caption" sx={{ color: meta.cor, fontWeight: 700 }}>{meta.progresso}%</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)' }}>
                    Meta: {meta.titulo.includes('Faturamento') || meta.titulo.includes('Ticket') ? `R$ ${meta.meta}` : meta.meta}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)' }}>
                    ⏳ {meta.diasRestantes} dias
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Gráfico e Top Produtos */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Box sx={{ 
            p: 3, 
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 4,
            transition: 'all 0.3s ease',
            animation: 'fadeInUp 0.6s ease-out 0.5s both',
            '&:hover': { borderColor: 'rgba(255,255,255,0.15)' }
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>📊 Vendas dos Últimos 7 Dias</Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>Comparativo de vendas diárias</Typography>
              </Box>
              <Button 
                size="small" 
                endIcon={<ArrowForward />} 
                sx={{ 
                  color: 'rgba(255,255,255,0.7)',
                  borderColor: 'rgba(255,255,255,0.15)',
                  '&:hover': { 
                    borderColor: 'rgba(255,255,255,0.3)',
                    background: 'rgba(255,255,255,0.05)'
                  } 
                }} 
                variant="outlined" 
                onClick={() => navigate('/vendas')}
              >
                Ver detalhes
              </Button>
            </Box>
            <Box sx={{ height: 220, display: 'flex', alignItems: 'flex-end', gap: 2, pt: 2 }}>
              {[30, 45, 28, 52, 38, 65, 42].map((value, index) => (
                <Box key={index} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: '100%',
                      height: `${(value / 70) * 100}%`,
                      minHeight: 20,
                      background: index === 5 
                        ? 'linear-gradient(180deg, #667eea, #764ba2)' 
                        : 'rgba(102, 126, 234, 0.2)',
                      borderRadius: '8px 8px 0 0',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'linear-gradient(180deg, #667eea, #764ba2)',
                        transform: 'scaleY(1.05)',
                        boxShadow: '0 8px 30px rgba(102, 126, 234, 0.4)'
                      }
                    }}
                  />
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', mt: 1 }}>
                    {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'][index]}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.6rem' }}>
                    R$ {value * 100}
                  </Typography>
                </Box>
              ))}
            </Box>
            <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.05)' }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
              {[
                { label: 'Total da semana', value: 'R$ 8.450,00', color: 'white' },
                { label: 'Crescimento', value: '+23.5%', color: '#38ef7d' },
                { label: 'Total de vendas', value: '48', color: '#667eea' },
                { label: 'Ticket Médio', value: 'R$ 278,00', color: '#f093fb' }
              ].map((item, i) => (
                <Box key={i} sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: item.color }}>{item.value}</Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>{item.label}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ 
            p: 3, 
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 4, 
            height: '100%',
            transition: 'all 0.3s ease',
            animation: 'fadeInUp 0.6s ease-out 0.6s both',
            '&:hover': { borderColor: 'rgba(255,255,255,0.15)' }
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                🏆 Top Produtos
              </Typography>
              <Chip 
                label="⭐ Destaque" 
                size="small" 
                sx={{ 
                  bgcolor: 'rgba(255, 183, 77, 0.15)', 
                  color: '#FFB300',
                  border: '1px solid rgba(255, 183, 77, 0.2)'
                }} 
              />
            </Box>
            {topProdutos.map((prod, index) => (
              <Box 
                key={index} 
                sx={{ 
                  p: 2, 
                  mb: 1.5, 
                  borderRadius: 3, 
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  transition: 'all 0.3s ease',
                  animation: `fadeInUp 0.6s ease-out ${0.7 + index * 0.1}s both`,
                  '&:hover': { 
                    background: 'rgba(255,255,255,0.08)', 
                    transform: 'translateX(8px)',
                    borderColor: 'rgba(255,255,255,0.1)'
                  }
                }} 
                onClick={() => navigate('/produtos')}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: 2,
                      background: `linear-gradient(135deg, ${prod.cor}, ${prod.cor}66)`,
                      color: 'white',
                      fontSize: '0.75rem',
                      fontWeight: 700
                    }}
                  >
                    #{index + 1}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>{prod.nome}</Typography>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>{prod.vendas} vendas</Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.2)' }}>•</Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>⭐ {prod.avaliacao}</Typography>
                    </Box>
                  </Box>
                  <Chip 
                    size="small" 
                    label={prod.crescimento} 
                    sx={{ 
                      height: 20,
                      fontSize: '0.6rem',
                      bgcolor: prod.crescimento.startsWith('+') ? 'rgba(17, 153, 142, 0.2)' : 'rgba(245, 87, 108, 0.2)',
                      color: prod.crescimento.startsWith('+') ? '#38ef7d' : '#f5576c'
                    }} 
                  />
                </Box>
                <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)' }}>
                    💰 R$ {prod.receita.toFixed(2)}
                  </Typography>
                  <Chip
                    size="small"
                    label={prod.crescimento}
                    sx={{
                      height: 16,
                      fontSize: '0.5rem',
                      bgcolor: prod.crescimento.startsWith('+') ? 'rgba(17, 153, 142, 0.2)' : 'rgba(245, 87, 108, 0.2)',
                      color: prod.crescimento.startsWith('+') ? '#38ef7d' : '#f5576c'
                    }}
                  />
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