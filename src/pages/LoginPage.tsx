import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Divider
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Waves
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const WaveBackground = () => {
  return (
    <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, overflow: 'hidden', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
      <Box sx={{ position: 'absolute', bottom: '-10px', left: 0, width: '200%', height: '300px', background: 'rgba(102, 126, 234, 0.15)', borderRadius: '50% 50% 0 0', animation: 'wave1 8s ease-in-out infinite', transform: 'translateX(-25%)', '@keyframes wave1': { '0%, 100%': { transform: 'translateX(-25%) scaleY(1)' }, '50%': { transform: 'translateX(0%) scaleY(1.4)' } } }} />
      <Box sx={{ position: 'absolute', bottom: '-10px', left: 0, width: '200%', height: '250px', background: 'rgba(102, 126, 234, 0.10)', borderRadius: '50% 50% 0 0', animation: 'wave2 10s ease-in-out infinite', transform: 'translateX(-15%)', '@keyframes wave2': { '0%, 100%': { transform: 'translateX(-15%) scaleY(1)' }, '50%': { transform: 'translateX(-35%) scaleY(1.3)' } } }} />
      <Box sx={{ position: 'absolute', bottom: '-10px', left: 0, width: '200%', height: '200px', background: 'rgba(118, 75, 162, 0.08)', borderRadius: '50% 50% 0 0', animation: 'wave3 12s ease-in-out infinite', transform: 'translateX(-30%)', '@keyframes wave3': { '0%, 100%': { transform: 'translateX(-30%) scaleY(1)' }, '50%': { transform: 'translateX(10%) scaleY(1.5)' } } }} />
      {[...Array(20)].map((_, i) => (<Box key={i} sx={{ position: 'absolute', width: `${Math.random() * 6 + 2}px`, height: `${Math.random() * 6 + 2}px`, borderRadius: '50%', background: `rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1})`, bottom: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, animation: `float ${Math.random() * 20 + 10}s ease-in-out infinite`, animationDelay: `${Math.random() * 10}s`, '@keyframes float': { '0%, 100%': { transform: 'translateY(0) translateX(0)', opacity: 0.3 }, '50%': { transform: `translateY(-${Math.random() * 100 + 50}px) translateX(${Math.random() * 30 - 15}px)`, opacity: 0.8 } } }} />))}
    </Box>
  );
};

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
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login(email, senha);
      navigate('/dashboard');
    } catch (err: any) {
      if (err.message.includes('401') || err.message.includes('inválidos')) {
        setError('Email ou senha incorretos. Verifique seus dados.');
      } else if (err.message.includes('404')) {
        setError('Usuário não encontrado. Faça o cadastro primeiro.');
      } else {
        setError(err.message || 'Erro ao fazer login. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePassword = () => setShowPassword(!showPassword);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      <WaveBackground />
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1, py: 4 }}>
        <Paper elevation={20} sx={{ padding: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 4, background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.2)', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)', width: '100%' }}>
          <Box sx={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2, boxShadow: '0 8px 30px rgba(102, 126, 234, 0.4)', animation: 'floatLogo 3s ease-in-out infinite', '@keyframes floatLogo': { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-10px)' } } }}>
            <Waves sx={{ fontSize: 40, color: 'white' }} />
          </Box>
          <Typography component="h1" variant="h4" sx={{ fontWeight: 700, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 1 }}>Sistema de Gestão</Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom sx={{ mb: 3 }}>Faça login para acessar o sistema</Typography>

          {error && <Alert severity="error" sx={{ width: '100%', mb: 2, borderRadius: 2, background: 'rgba(211, 47, 47, 0.1)', border: '1px solid rgba(211, 47, 47, 0.2)' }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', mt: 1 }}>
            <TextField margin="normal" required fullWidth id="email" label="Email" name="email" type="email" autoComplete="email" autoFocus value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} placeholder="Digite seu email" sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2, transition: 'all 0.3s ease', '&:hover': { boxShadow: '0 4px 20px rgba(102, 126, 234, 0.1)' }, '&.Mui-focused': { boxShadow: '0 4px 30px rgba(102, 126, 234, 0.2)' } } }} slotProps={{ input: { startAdornment: <InputAdornment position="start"><Email sx={{ color: '#667eea' }} /></InputAdornment> } }} />
            
            <TextField margin="normal" required fullWidth name="senha" label="Senha" type={showPassword ? 'text' : 'password'} id="senha" autoComplete="current-password" value={senha} onChange={(e) => setSenha(e.target.value)} disabled={loading} placeholder="Digite sua senha" sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 2, transition: 'all 0.3s ease', '&:hover': { boxShadow: '0 4px 20px rgba(102, 126, 234, 0.1)' }, '&.Mui-focused': { boxShadow: '0 4px 30px rgba(102, 126, 234, 0.2)' } } }} slotProps={{ input: { startAdornment: <InputAdornment position="start"><Lock sx={{ color: '#667eea' }} /></InputAdornment>, endAdornment: <InputAdornment position="end"><IconButton onClick={handleTogglePassword} edge="end">{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment> } }} />

            <Button type="submit" fullWidth variant="contained" size="large" disabled={loading} sx={{ py: 1.8, mb: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: 2, textTransform: 'none', fontSize: '1.1rem', fontWeight: 600, boxShadow: '0 8px 30px rgba(102, 126, 234, 0.3)', transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)', background: 'linear-gradient(135deg, #5a67d8 0%, #6b3fa0 100%)' } }}>
              {loading ? <CircularProgress size={28} color="inherit" /> : 'Entrar'}
            </Button>

            <Divider sx={{ my: 3, position: 'relative' }}>
              <Typography variant="caption" color="textSecondary" sx={{ px: 2, background: 'white' }}>ou</Typography>
            </Divider>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
              <Link to="/esqueci-senha" style={{ color: '#667eea', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>Esqueceu a senha?</Link>
              <Link to="/cadastro" style={{ color: '#667eea', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600 }}>Criar conta →</Link>
            </Box>
          </Box>
        </Paper>
        <Typography variant="caption" sx={{ mt: 3, display: 'block', textAlign: 'center', color: 'rgba(255, 255, 255, 0.6)', letterSpacing: '0.5px', fontWeight: 300 }}>© 2024 Sistema de Gestão - Todos os direitos reservados</Typography>
      </Container>
    </Box>
  );
};

export default LoginPage;