import React, { useState } from 'react';
import {
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Grid,
  Divider,
  Fade
} from '@mui/material';
import {
  Person,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  PersonAdd,
  ArrowBack,
  CheckCircle
} from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';
import { showSuccess, showError } from '../utils/toastUtils';
import PageWrapper from '../components/PageWrapper';

const CadastroPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!formData.nome || !formData.email || !formData.senha) {
      showError('Preencha todos os campos obrigatórios');
      setLoading(false);
      return;
    }

    if (formData.senha !== formData.confirmarSenha) {
      showError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    if (formData.senha.length < 6) {
      showError('A senha deve ter pelo menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/auth/register', {
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha
      });

      if (response.data.success) {
        showSuccess('✅ Cadastro realizado com sucesso!');
        setSuccess('Cadastro realizado com sucesso! Redirecionando para o login...');
        setFormData({ nome: '', email: '', senha: '', confirmarSenha: '' });

        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        showError(response.data.message || 'Erro ao cadastrar');
      }

    } catch (err: any) {
      if (err.response?.status === 409) {
        showError('Este email já está cadastrado');
      } else {
        showError(err.response?.data?.message || 'Erro ao cadastrar');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(145deg, #0f0c29 0%, #1a1a3e 50%, #24243e 100%)',
        padding: 2
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4 },
          maxWidth: 500,
          width: '100%',
          borderRadius: 4,
          background: 'rgba(255, 255, 255, 0.04)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          boxShadow: '0 30px 60px rgba(0, 0, 0, 0.5)',
          color: 'white'
        }}
      >
        {/* Cabeçalho */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton
            onClick={() => navigate('/login')}
            sx={{
              color: 'rgba(255,255,255,0.4)',
              transition: 'all 0.3s ease',
              '&:hover': {
                color: 'white',
                background: 'rgba(255,255,255,0.05)',
                transform: 'scale(1.1)'
              }
            }}
          >
            <ArrowBack />
          </IconButton>
          <Box sx={{ ml: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
              Criar Conta
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
              Preencha os dados para se cadastrar
            </Typography>
          </Box>
        </Box>

        {/* Alertas */}
        {error && (
          <Fade in={!!error} timeout={400}>
            <Alert
              severity="error"
              sx={{
                mb: 2,
                borderRadius: 2,
                background: 'rgba(211, 47, 47, 0.12)',
                border: '1px solid rgba(211, 47, 47, 0.15)',
                color: '#ff8a80',
                '& .MuiAlert-icon': { color: '#ff8a80' }
              }}
            >
              {error}
            </Alert>
          </Fade>
        )}

        {success && (
          <Fade in={!!success} timeout={400}>
            <Alert
              severity="success"
              sx={{
                mb: 2,
                borderRadius: 2,
                background: 'rgba(17, 153, 142, 0.12)',
                border: '1px solid rgba(17, 153, 142, 0.15)',
                color: '#69db7c',
                '& .MuiAlert-icon': { color: '#69db7c' }
              }}
            >
              {success}
            </Alert>
          </Fade>
        )}

        {/* Formulário */}
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                required
                fullWidth
                label="Nome completo"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                disabled={loading}
                placeholder="Digite seu nome completo"
                sx={{
                  '& .MuiInputBase-root': {
                    color: 'white',
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    borderRadius: 2,
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.06)' },
                    '&.Mui-focused': { backgroundColor: 'rgba(255,255,255,0.06)' }
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.08)' },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
                    '&.Mui-focused fieldset': { borderColor: '#667eea' }
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255,255,255,0.4)',
                    '&.Mui-focused': { color: '#667eea' }
                  }
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 20 }} />
                      </InputAdornment>
                    )
                  }
                }}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                required
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                placeholder="seu@email.com"
                sx={{
                  '& .MuiInputBase-root': {
                    color: 'white',
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    borderRadius: 2,
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.06)' },
                    '&.Mui-focused': { backgroundColor: 'rgba(255,255,255,0.06)' }
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.08)' },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
                    '&.Mui-focused fieldset': { borderColor: '#667eea' }
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255,255,255,0.4)',
                    '&.Mui-focused': { color: '#667eea' }
                  }
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 20 }} />
                      </InputAdornment>
                    )
                  }
                }}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                required
                fullWidth
                label="Senha"
                name="senha"
                type={showPassword ? 'text' : 'password'}
                value={formData.senha}
                onChange={handleChange}
                disabled={loading}
                placeholder="Mínimo 6 caracteres"
                helperText="A senha deve ter pelo menos 6 caracteres"
                sx={{
                  '& .MuiInputBase-root': {
                    color: 'white',
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    borderRadius: 2,
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.06)' },
                    '&.Mui-focused': { backgroundColor: 'rgba(255,255,255,0.06)' }
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.08)' },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
                    '&.Mui-focused fieldset': { borderColor: '#667eea' }
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255,255,255,0.4)',
                    '&.Mui-focused': { color: '#667eea' }
                  },
                  '& .MuiFormHelperText-root': {
                    color: 'rgba(255,255,255,0.3)'
                  }
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: 'rgba(255,255,255,0.3)' }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                }}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                required
                fullWidth
                label="Confirmar senha"
                name="confirmarSenha"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmarSenha}
                onChange={handleChange}
                disabled={loading}
                placeholder="Digite a senha novamente"
                sx={{
                  '& .MuiInputBase-root': {
                    color: 'white',
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    borderRadius: 2,
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.06)' },
                    '&.Mui-focused': { backgroundColor: 'rgba(255,255,255,0.06)' }
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.08)' },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
                    '&.Mui-focused fieldset': { borderColor: '#667eea' }
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255,255,255,0.4)',
                    '&.Mui-focused': { color: '#667eea' }
                  }
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                          sx={{ color: 'rgba(255,255,255,0.3)' }}
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                }}
              />
            </Grid>
          </Grid>

          {/* Botão Cadastrar */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={24} color="inherit" /> : <PersonAdd />}
            sx={{
              mt: 3,
              py: 1.6,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              boxShadow: '0 8px 25px rgba(102, 126, 234, 0.25)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 35px rgba(102, 126, 234, 0.35)',
                background: 'linear-gradient(135deg, #5a67d8 0%, #6b3fa0 100%)'
              },
              '&:active': { transform: 'scale(0.98)' }
            }}
          >
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </Button>

          {/* Divisor */}
          <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.05)' }}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.2)', px: 2 }}>
              Já tem uma conta?
            </Typography>
          </Divider>

          {/* Botão Login */}
          <Button
            fullWidth
            variant="outlined"
            component={Link}
            to="/login"
            sx={{
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500,
              borderColor: 'rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.6)',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: '#667eea',
                color: '#667eea',
                background: 'rgba(102, 126, 234, 0.05)',
                transform: 'scale(1.02)'
              }
            }}
          >
            Fazer login
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default CadastroPage;