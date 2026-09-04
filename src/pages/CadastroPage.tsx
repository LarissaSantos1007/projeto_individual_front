import { TextField, Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CadastroPage = () => {
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    alert('Cadastro realizado!');
    navigate('/');
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>Cadastro</Typography>
      <form onSubmit={handleSubmit}>
        <TextField label="Nome" fullWidth margin="normal" variant="outlined" />
        <TextField label="Email" fullWidth margin="normal" variant="outlined" />
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
          Cadastrar
        </Button>
      </form>
    </Box>
  );
};

export default CadastroPage;