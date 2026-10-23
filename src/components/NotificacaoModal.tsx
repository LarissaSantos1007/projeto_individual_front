import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  IconButton,
  Divider
} from '@mui/material';
import {
  Close,
  ShoppingCart,
  Inventory,
  People,
  Warning,
  LocalShipping
} from '@mui/icons-material';

interface NotificacaoModalProps {
  open: boolean;
  onClose: () => void;
}

const NotificacaoModal: React.FC<NotificacaoModalProps> = ({ open, onClose }) => {
  const notificacoes = [
    { id: 1, titulo: 'Nova venda realizada', descricao: 'Smartphone Pro - R$ 2.999,99', tempo: 'Há 5 minutos', icone: <ShoppingCart />, cor: '#667eea', lida: false },
    { id: 2, titulo: 'Estoque atualizado', descricao: 'Camiseta Premium +10 unidades', tempo: 'Há 15 minutos', icone: <Inventory />, cor: '#4facfe', lida: false },
    { id: 3, titulo: 'Novo cliente cadastrado', descricao: 'Carlos Lima se cadastrou no sistema', tempo: 'Há 1 hora', icone: <People />, cor: '#38ef7d', lida: true },
    { id: 4, titulo: 'Produto esgotado', descricao: 'Notebook Ultra - Estoque zerado', tempo: 'Há 2 horas', icone: <Warning />, cor: '#f5576c', lida: false },
    { id: 5, titulo: 'Promoção ativada', descricao: 'Desconto de 20% em Eletrônicos', tempo: 'Há 3 horas', icone: <LocalShipping />, cor: '#f093fb', lida: true },
  ];

  const naoLidas = notificacoes.filter(n => !n.lida).length;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 4,
            bgcolor: 'rgba(15, 12, 41, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.05)',
            maxHeight: '80vh'
          }
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>🔔 Notificações</Typography>
          <Chip label={`${naoLidas} não lidas`} size="small" sx={{ bgcolor: 'rgba(245, 87, 108, 0.3)', color: '#f5576c', border: '1px solid rgba(245, 87, 108, 0.2)' }} />
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'rgba(255,255,255,0.5)' }}><Close /></IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 0 }}>
        <List sx={{ p: 0 }}>
          {notificacoes.map((notif, index) => (
            <React.Fragment key={notif.id}>
              <ListItem sx={{ px: 3, py: 2, bgcolor: notif.lida ? 'transparent' : 'rgba(102, 126, 234, 0.05)', transition: 'all 0.3s ease', '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: `${notif.cor}22`, color: notif.cor }}>{notif.icone}</Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ color: 'white', fontWeight: notif.lida ? 400 : 600 }}>{notif.titulo}</Typography>
                      {!notif.lida && <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#667eea' }} />}
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block' }}>{notif.descricao}</Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.6rem' }}>{notif.tempo}</Typography>
                    </>
                  }
                />
              </ListItem>
              {index < notificacoes.length - 1 && <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />}
            </React.Fragment>
          ))}
        </List>
      </DialogContent>
      
      <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.05)', justifyContent: 'center' }}>
        <Button 
          fullWidth 
          variant="contained" 
          sx={{ 
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            cursor: 'pointer',
            '&:hover': { background: 'linear-gradient(135deg, #5a67d8, #6b3fa0)' } 
          }}
          onClick={onClose}
        >
          Marcar todas como lidas
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NotificacaoModal;