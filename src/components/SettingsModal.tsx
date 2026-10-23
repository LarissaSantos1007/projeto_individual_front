import React from 'react';
import {
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

const SettingsModal = ({ open, onClose }: SettingsModalProps) => {
  return (
    <Dialog onClose={onClose} open={open} fullWidth maxWidth="sm">
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Configurações
        <IconButton aria-label="close" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <List sx={{ pt: 0 }}>
        {/* Substituí slotProps por sx para eliminar os erros de tipo */}
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemText 
              primary="Notificações" 
              sx={{ '& .MuiListItemText-primary': { color: 'primary.main', fontWeight: 'bold' } }}
            />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton>
            <ListItemText 
              primary="Tema escuro" 
              secondary="Ativar modo noturno"
              sx={{ 
                '& .MuiListItemText-primary': { color: 'primary.main', fontWeight: 'bold' },
                '& .MuiListItemText-secondary': { color: 'text.secondary' }
              }}
            />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton>
            <ListItemText 
              primary="Idioma" 
              sx={{ '& .MuiListItemText-primary': { color: 'primary.main', fontWeight: 'bold' } }}
            />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton>
            <ListItemText 
              primary="Privacidade" 
              sx={{ '& .MuiListItemText-primary': { color: 'primary.main', fontWeight: 'bold' } }}
            />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton>
            <ListItemText 
              primary="Segurança" 
              sx={{ '& .MuiListItemText-primary': { color: 'primary.main', fontWeight: 'bold' } }}
            />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton>
            <ListItemText 
              primary="Sobre" 
              sx={{ '& .MuiListItemText-primary': { color: 'primary.main', fontWeight: 'bold' } }}
            />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton>
            <ListItemText 
              primary="Versão" 
              secondary="1.0.0"
              sx={{ 
                '& .MuiListItemText-primary': { color: 'primary.main', fontWeight: 'bold' },
                '& .MuiListItemText-secondary': { color: 'text.secondary' }
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Dialog>
  );
};

export default SettingsModal;