import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Container
} from '@mui/material';
import {
  TrendingUp,
  Inventory,
  ShoppingCart,
  AttachMoney
} from '@mui/icons-material';
// CORREÇÃO: Remover importações incorretas
import ProdutoCard from '../components/ProdutoCard';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProdutos: 0,
    totalVendas: 0,
    totalMovimentacoes: 0,
    totalReceita: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Simular dados
        setStats({
          totalProdutos: 150,
          totalVendas: 45,
          totalMovimentacoes: 89,
          totalReceita: 12500.50
        });
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    {
      title: 'Total de Produtos',
      value: stats.totalProdutos,
      icon: <Inventory sx={{ fontSize: 40 }} />,
      color: '#1976d2'
    },
    {
      title: 'Total de Vendas',
      value: stats.totalVendas,
      icon: <ShoppingCart sx={{ fontSize: 40 }} />,
      color: '#2e7d32'
    },
    {
      title: 'Movimentações',
      value: stats.totalMovimentacoes,
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      color: '#ed6c02'
    },
    {
      title: 'Receita Total',
      value: `R$ ${stats.totalReceita.toFixed(2)}`,
      icon: <AttachMoney sx={{ fontSize: 40 }} />,
      color: '#9c27b0'
    }
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {cards.map((card, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      {card.title}
                    </Typography>
                    <Typography variant="h5">
                      {card.value}
                    </Typography>
                  </Box>
                  <Box sx={{ color: card.color }}>
                    {card.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}

        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Produtos em Destaque
            </Typography>
            <ProdutoCard />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;