import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField
} from '@mui/material';
import { Download, Assessment, TrendingUp, TrendingDown } from '@mui/icons-material';

const RelatoriosPage = () => {
  const [periodo, setPeriodo] = useState('mensal');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  const stats = [
    { title: 'Total de Vendas', value: 'R$ 12.500,00', change: '+15%', icon: <TrendingUp color="success" /> },
    { title: 'Total de Produtos', value: '150', change: '+5%', icon: <TrendingUp color="success" /> },
    { title: 'Ticket Médio', value: 'R$ 278,00', change: '-2%', icon: <TrendingDown color="error" /> },
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Relatórios
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Período</InputLabel>
              <Select
                value={periodo}
                label="Período"
                onChange={(e) => setPeriodo(e.target.value)}
              >
                <MenuItem value="diario">Diário</MenuItem>
                <MenuItem value="semanal">Semanal</MenuItem>
                <MenuItem value="mensal">Mensal</MenuItem>
                <MenuItem value="anual">Anual</MenuItem>
                <MenuItem value="personalizado">Personalizado</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              fullWidth
              label="Data Início"
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              fullWidth
              label="Data Fim"
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Button 
              fullWidth 
              variant="contained" 
              startIcon={<Assessment />}
              sx={{ height: 56 }}
            >
              Gerar Relatório
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        {stats.map((stat, index) => (
          <Grid key={index} size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      {stat.title}
                    </Typography>
                    <Typography variant="h5">
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color={stat.change.startsWith('+') ? 'success.main' : 'error.main'}>
                      {stat.change} em relação ao período anterior
                    </Typography>
                  </Box>
                  <Box>
                    {stat.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Vendas por Categoria</Typography>
              <Button size="small" startIcon={<Download />}>
                Exportar
              </Button>
            </Box>
            <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography color="textSecondary">Gráfico de Vendas por Categoria</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Produtos Mais Vendidos</Typography>
              <Button size="small" startIcon={<Download />}>
                Exportar
              </Button>
            </Box>
            <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography color="textSecondary">Lista de Produtos Mais Vendidos</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default RelatoriosPage;