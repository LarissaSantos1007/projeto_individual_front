import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Paper,
  Fade
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Login as LoginIcon,
  Storefront
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setEmail('');
    setSenha('');
    setError('');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, senha);
      navigate('/dashboard');
    } catch (err: any) {
      const message = typeof err?.message === 'string' ? err.message : '';
      if (message.includes('401') || message.includes('inválidos')) {
        setError('❌ Email ou senha incorretos');
      } else if (message.includes('404') || message.includes('não encontrado')) {
        setError('❌ Usuário não encontrado');
      } else {
        setError(`❌ ${message || 'Erro ao fazer login. Tente novamente.'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePassword = () => setShowPassword(!showPassword);

  const fillTestData = () => {
    setEmail('admin@infotech.com');
    setSenha('admin123');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(145deg, #0f0c29 0%, #1a1a3e 50%, #24243e 100%)',
        position: 'relative',
        overflow: 'hidden',
        padding: 2
      }}
    >
      {/* Fundo com ondas suaves */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '50%',
          background: 'linear-gradient(180deg, transparent 0%, rgba(102, 126, 234, 0.03) 100%)',
          borderRadius: '50% 50% 0 0',
          transform: 'scaleX(2)'
        }}
      />

      {/* Partículas discretas */}
      {[...Array(15)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            width: `${Math.random() * 2 + 1}px`,
            height: `${Math.random() * 2 + 1}px`,
            borderRadius: '50%',
            background: `rgba(255, 255, 255, ${Math.random() * 0.1 + 0.02})`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `float${i} ${Math.random() * 20 + 15}s ease-in-out infinite`,
            '@keyframes float0': { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: `translateY(-${Math.random() * 100 + 50}px)` } },
            '@keyframes float1': { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: `translateY(-${Math.random() * 80 + 30}px)` } },
            '@keyframes float2': { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: `translateY(-${Math.random() * 120 + 60}px)` } },
          }}
        />
      ))}

      {/* Container do Login */}
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Fade in={true} timeout={600}>
          <Paper
            elevation={0}
            sx={{
              padding: { xs: 3, sm: 4 },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.04)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              boxShadow: '0 30px 60px rgba(0, 0, 0, 0.5)',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.08)'
              }
            }}
          >
            {/* Logo */}
            <Box
              sx={{
                width: 70,
                height: 70,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
                boxShadow: '0 8px 30px rgba(102, 126, 234, 0.3)',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)'
                }
              }}
            >
              <Storefront sx={{ fontSize: 32, color: 'white' }} />
            </Box>

            {/* Título */}
            <Typography
              component="h1"
              variant="h4"
              sx={{
                fontWeight: 700,
                color: 'white',
                mb: 0.5,
                letterSpacing: '-0.5px'
              }}
            >
              Bem-vindo 👋
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255,255,255,0.4)',
                mb: 3,
                fontWeight: 300
              }}
            >
              Faça login para acessar o sistema
            </Typography>

            {/* Erro */}
            {error && (
              <Fade in={!!error} timeout={400}>
                <Alert
                  severity="error"
                  sx={{
                    width: '100%',
                    mb: 2,
                    borderRadius: 2,
                    background: 'rgba(211, 47, 47, 0.12)',
                    border: '1px solid rgba(211, 47, 47, 0.15)',
                    color: '#ff8a80',
                    '& .MuiAlert-icon': { color: '#ff8a80' },
                    fontSize: '0.9rem'
                  }}
                >
                  {error}
                </Alert>
              </Fade>
            )}

            {/* Formulário */}
            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              {/* Email */}
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                type="email"
                autoComplete="off"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                placeholder="Digite seu email"
                sx={{
                  mb: 1.5,
                  '& .MuiInputBase-root': {
                    color: 'white',
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.06)'
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'rgba(255,255,255,0.06)'
                    }
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255,255,255,0.08)',
                      transition: 'all 0.3s ease'
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255,255,255,0.15)'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#667eea'
                    }
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
                    ),
                    inputProps: {
                      autoComplete: 'new-password'
                    }
                  }
                }}
              />

              {/* Senha */}
              <TextField
                margin="normal"
                required
                fullWidth
                name="senha"
                label="Senha"
                type={showPassword ? 'text' : 'password'}
                id="senha"
                autoComplete="off"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                disabled={loading}
                placeholder="Digite sua senha"
                sx={{
                  mb: 2.5,
                  '& .MuiInputBase-root': {
                    color: 'white',
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.06)'
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'rgba(255,255,255,0.06)'
                    }
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255,255,255,0.08)',
                      transition: 'all 0.3s ease'
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255,255,255,0.15)'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#667eea'
                    }
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
                          onClick={handleTogglePassword}
                          edge="end"
                          sx={{
                            color: 'rgba(255,255,255,0.3)',
                            '&:hover': { color: 'white' }
                          }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                    inputProps: {
                      autoComplete: 'new-password'
                    }
                  }
                }}
              />

              {/* Botão Entrar */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  py: 1.6,
                  mb: 1.5,
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
                  '&:active': {
                    transform: 'scale(0.98)'
                  }
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Entrar'}
              </Button>

              {/* Dados de teste */}
              <Button
                fullWidth
                variant="text"
                size="small"
                onClick={fillTestData}
                sx={{
                  color: 'rgba(255,255,255,0.35)',
                  textTransform: 'none',
                  mb: 2,
                  fontSize: '0.8rem',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: '#667eea',
                    background: 'rgba(102, 126, 234, 0.05)'
                  }
                }}
              >
                ⚡ Usar dados de teste
              </Button>

              {/* Links */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  pt: 1.5,
                  borderTop: '1px solid rgba(255,255,255,0.04)'
                }}
              >
                <Link
                  to="/esqueci-senha"
                  style={{
                    color: 'rgba(255,255,255,0.3)',
                    textDecoration: 'none',
                    fontSize: '0.8rem',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#667eea';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'rgba(255,255,255,0.3)';
                  }}
                >
                  🔐 Esqueceu a senha?
                </Link>
                <Link
                  to="/cadastro"
                  style={{
                    color: '#667eea',
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#5a67d8';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#667eea';
                  }}
                >
                  Criar conta →
                </Link>
              </Box>
            </Box>
          </Paper>
        </Fade>

        {/* Footer */}
        <Typography
          variant="caption"
          sx={{
            mt: 3,
            display: 'block',
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.06)',
            fontSize: '0.6rem',
            letterSpacing: '0.5px'
          }}
        >
          © 2024 Sistema Gestão
        </Typography>
      </Container>
    </Box>
  );
};

export default LoginPage;