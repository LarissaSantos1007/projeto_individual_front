import React from 'react';
import { Typography, Box, Button, Paper } from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import PageWrapper from '../components/PageWrapper';

const ReposicaoPage = () => {
  return (
    <PageWrapper>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
          🔄 Reposição de Estoque
        </Typography>
        <Button
          variant="contained"
          startIcon={<ShoppingCart />}
          sx={{
            background: 'linear-gradient(135deg, #f093fb, #f5576c)',
            '&:hover': {
              background: 'linear-gradient(135deg, #d47ae8, #e0485c)'
            }
          }}
        >
          Solicitar Reposição
        </Button>
      </Box>

      <Paper
        sx={{
          p: 3,
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 4,
          textAlign: 'center',
          color: 'rgba(255,255,255,0.5)'
        }}
      >
        <Typography variant="body1">
          Lista de produtos para reposição em desenvolvimento...
        </Typography>
      </Paper>
    </PageWrapper>
  );
};

export default ReposicaoPage;