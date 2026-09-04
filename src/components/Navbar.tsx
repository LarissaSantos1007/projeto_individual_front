import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Avatar,
  Tooltip,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Badge,
  Divider
} from '@mui/material';
import {
  Menu as MenuIcon,
  Category,
  Inventory,
  ShoppingCart,
  Assessment,
  Logout,
  Login,
  PersonAdd,
  Store,
  Person,
  Home,
  Notifications,
  Settings,
  AutoAwesome
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const { user, isAuthenticated, logout } = useAuth();

  // ✅ MENU ITEMS
  const menuItems = [
    { 
      label: 'Início',
      path: '/dashboard', 
      icon: <Home sx={{ color: '#667eea' }} />,
      description: 'Visão geral'
    },
    { 
      label: 'Categorias', 
      path: '/categorias', 
      icon: <Category sx={{ color: '#4facfe' }} />,
      description: 'Gerenciar categorias'
    },
    { 
      label: 'Produtos', 
      path: '/produtos', 
      icon: <Inventory sx={{ color: '#38ef7d' }} />,
      description: 'Gerenciar produtos'
    },
    { 
      label: 'Movimentações', 
      path: '/movimentacoes', 
      icon: <ShoppingCart sx={{ color: '#f093fb' }} />,
      description: 'Controle de estoque'
    },
    { 
      label: 'Vendas', 
      path: '/vendas', 
      icon: <Store sx={{ color: '#f5576c' }} />,
      description: 'Registro de vendas'
    },
    { 
      label: 'Relatórios', 
      path: '/relatorios', 
      icon: <Assessment sx={{ color: '#4facfe' }} />,
      description: 'Análises e métricas'
    },
  ];

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // ✅ LOGOUT - LIMPA TUDO E REDIRECIONA
  const handleLogout = () => {
    logout();
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    navigate('/login');
    handleClose();
  };

  const toggleDrawer = (open: boolean) => {
    setDrawerOpen(open);
  };

  const getInitials = (nome: string) => {
    if (!nome) return 'U';
    const names = nome.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  const getAvatarColor = (nome: string) => {
    if (!nome) return '#667eea';
    const colors = [
      '#667eea', '#764ba2', '#4facfe', '#00f2fe',
      '#11998e', '#38ef7d', '#f093fb', '#f5576c',
      '#FF6B6B', '#FF9F43', '#6C5CE7', '#00B894'
    ];
    let hash = 0;
    for (let i = 0; i < nome.length; i++) {
      hash = nome.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const avatarColor = getAvatarColor(user?.nome || '');
  const initials = getInitials(user?.nome || '');

  const drawerList = () => (
    <Box sx={{ width: 280 }} role="presentation">
      <Box 
        sx={{ 
          p: 3, 
          borderBottom: '1px solid',
          borderColor: 'rgba(255,255,255,0.05)',
          background: 'linear-gradient(135deg, #0f0c29, #302b63)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Box
          sx={{
            position: 'relative',
            mb: 2
          }}
        >
          <Avatar
            sx={{
              width: 80,
              height: 80,
              background: `linear-gradient(135deg, ${avatarColor}, ${avatarColor}88)`,
              fontSize: 32,
              fontWeight: 700,
              boxShadow: '0 8px 30px rgba(102, 126, 234, 0.4)',
              border: '3px solid rgba(255,255,255,0.1)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
                border: '3px solid #667eea'
              }
            }}
          >
            {initials}
          </Avatar>
          <Box
            sx={{
              position: 'absolute',
              bottom: 2,
              right: 2,
              width: 16,
              height: 16,
              borderRadius: '50%',
              background: '#38ef7d',
              border: '2px solid #0f0c29',
              boxShadow: '0 0 20px rgba(56, 239, 125, 0.5)'
            }}
          />
        </Box>
        
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'white' }}>
          {user?.nome || 'Usuário'}
        </Typography>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
          {user?.email || 'usuario@email.com'}
        </Typography>
      </Box>

      <List sx={{ p: 2 }}>
        {menuItems.map((item) => (
          <ListItem 
            key={item.path} 
            component={Link} 
            to={item.path}
            onClick={() => toggleDrawer(false)}
            sx={{
              borderRadius: 3,
              mb: 0.5,
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: 'rgba(102, 126, 234, 0.1)',
                transform: 'translateX(8px)'
              }
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText 
              primary={item.label}
              secondary={item.description}
              sx={{
                '& .MuiListItemText-primary': {
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  color: 'white'
                },
                '& .MuiListItemText-secondary': {
                  fontSize: '0.75rem',
                  color: 'rgba(255,255,255,0.3)'
                }
              }}
            />
          </ListItem>
        ))}
      </List>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />

      <List sx={{ p: 2 }}>
        <ListItem 
          sx={{ 
            borderRadius: 3,
            mb: 0.5,
            '&:hover': {
              bgcolor: 'rgba(102, 126, 234, 0.1)',
              transform: 'translateX(8px)'
            }
          }}
        >
          <ListItemIcon><Person sx={{ color: '#667eea' }} /></ListItemIcon>
          <ListItemText 
            primary="Meu Perfil"
            sx={{
              '& .MuiListItemText-primary': {
                fontWeight: 500,
                fontSize: '0.9rem',
                color: 'white'
              }
            }}
          />
        </ListItem>
        <ListItem 
          sx={{ 
            borderRadius: 3,
            mb: 0.5,
            '&:hover': {
              bgcolor: 'rgba(102, 126, 234, 0.1)',
              transform: 'translateX(8px)'
            }
          }}
        >
          <ListItemIcon><Settings sx={{ color: '#4facfe' }} /></ListItemIcon>
          <ListItemText 
            primary="Configurações"
            sx={{
              '& .MuiListItemText-primary': {
                fontWeight: 500,
                fontSize: '0.9rem',
                color: 'white'
              }
            }}
          />
        </ListItem>
      </List>

      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'rgba(255,255,255,0.05)', mt: 'auto' }}>
        <Button
          fullWidth
          variant="contained"
          color="error"
          startIcon={<Logout />}
          onClick={handleLogout}
          sx={{ 
            borderRadius: 3,
            textTransform: 'none',
            fontWeight: 600,
            background: 'linear-gradient(135deg, #f093fb, #f5576c)',
            '&:hover': {
              background: 'linear-gradient(135deg, #d47ae8, #e0485c)'
            }
          }}
        >
          Sair
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        sx={{ 
          bgcolor: 'rgba(15, 12, 41, 0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          boxShadow: '0 4px 30px rgba(0,0,0,0.3)'
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ py: 1 }}>
            {isMobile && isAuthenticated && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={() => toggleDrawer(true)}
                sx={{ mr: 2, color: 'white' }}
              >
                <MenuIcon />
              </IconButton>
            )}

            <Box 
              component={Link} 
              to={isAuthenticated ? '/dashboard' : '/login'}
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                textDecoration: 'none',
                color: 'inherit',
                flexGrow: isMobile ? 1 : 0,
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 1.5,
                  boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)'
                }}
              >
                <AutoAwesome sx={{ color: 'white', fontSize: 20 }} />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: { xs: 'none', sm: 'block' },
                  letterSpacing: '-0.5px'
                }}
              >
                Sistema Gestão
              </Typography>
            </Box>

            {!isMobile && isAuthenticated && (
              <Box sx={{ flexGrow: 1, display: 'flex', ml: 3, gap: 0.5 }}>
                {menuItems.map((item) => (
                  <Button
                    key={item.path}
                    component={Link}
                    to={item.path}
                    sx={{
                      px: 2,
                      py: 1,
                      color: 'rgba(255,255,255,0.7)',
                      fontWeight: 500,
                      fontSize: '0.875rem',
                      textTransform: 'none',
                      borderRadius: 3,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.05)',
                        color: 'white',
                        transform: 'translateY(-2px)'
                      }
                    }}
                    startIcon={item.icon}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {isAuthenticated && (
                <>
                  <Tooltip title="Notificações">
                    <IconButton sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      <Badge badgeContent={3} color="error">
                        <Notifications />
                      </Badge>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Configurações">
                    <IconButton sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      <Settings />
                    </IconButton>
                  </Tooltip>
                </>
              )}

              {isAuthenticated ? (
                <div>
                  <Tooltip title="Perfil">
                    <IconButton onClick={handleMenu} sx={{ p: 0.5 }}>
                      <Avatar 
                        sx={{ 
                          width: 40,
                          height: 40,
                          background: `linear-gradient(135deg, ${avatarColor}, ${avatarColor}88)`,
                          fontWeight: 700,
                          fontSize: 16,
                          boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
                          border: '2px solid rgba(255,255,255,0.1)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'scale(1.05)',
                            border: '2px solid #667eea'
                          }
                        }}
                      >
                        {initials}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    sx={{
                      '& .MuiPaper-root': {
                        mt: 1.5,
                        borderRadius: 3,
                        bgcolor: 'rgba(15, 12, 41, 0.95)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                        minWidth: 240,
                        p: 1
                      }
                    }}
                  >
                    <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        sx={{
                          width: 50,
                          height: 50,
                          background: `linear-gradient(135deg, ${avatarColor}, ${avatarColor}88)`,
                          fontWeight: 700,
                          fontSize: 18,
                          boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
                          border: '2px solid rgba(255,255,255,0.1)'
                        }}
                      >
                        {initials}
                      </Avatar>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: 'white' }}>
                          {user?.nome || 'Usuário'}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                          {user?.email || ''}
                        </Typography>
                      </Box>
                    </Box>

                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)', my: 1 }} />

                    <MenuItem onClick={() => { navigate('/perfil'); handleClose(); }} sx={{ borderRadius: 2, color: 'rgba(255,255,255,0.8)' }}>
                      <ListItemIcon>
                        <Person fontSize="small" sx={{ color: '#667eea' }} />
                      </ListItemIcon>
                      Meu Perfil
                    </MenuItem>
                    <MenuItem onClick={() => { navigate('/configuracoes'); handleClose(); }} sx={{ borderRadius: 2, color: 'rgba(255,255,255,0.8)' }}>
                      <ListItemIcon>
                        <Settings fontSize="small" sx={{ color: '#4facfe' }} />
                      </ListItemIcon>
                      Configurações
                    </MenuItem>

                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)', my: 1 }} />

                    <MenuItem 
                      onClick={handleLogout} 
                      sx={{ 
                        borderRadius: 2,
                        color: '#f5576c',
                        '&:hover': {
                          bgcolor: 'rgba(245, 87, 108, 0.1)'
                        }
                      }}
                    >
                      <ListItemIcon>
                        <Logout fontSize="small" sx={{ color: '#f5576c' }} />
                      </ListItemIcon>
                      Sair
                    </MenuItem>
                  </Menu>
                </div>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    component={Link}
                    to="/login"
                    variant="contained"
                    startIcon={<Login />}
                    sx={{
                      borderRadius: 3,
                      textTransform: 'none',
                      fontWeight: 600,
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5a67d8, #6b3fa0)'
                      }
                    }}
                  >
                    Entrar
                  </Button>
                  <Button
                    component={Link}
                    to="/cadastro"
                    variant="outlined"
                    startIcon={<PersonAdd />}
                    sx={{
                      borderRadius: 3,
                      textTransform: 'none',
                      fontWeight: 600,
                      borderColor: 'rgba(255,255,255,0.2)',
                      color: 'rgba(255,255,255,0.8)',
                      '&:hover': {
                        borderColor: '#667eea',
                        background: 'rgba(102, 126, 234, 0.1)'
                      }
                    }}
                  >
                    Cadastrar
                  </Button>
                </Box>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => toggleDrawer(false)}
        sx={{
          '& .MuiPaper-root': {
            borderRadius: '0 20px 20px 0',
            width: 280,
            bgcolor: 'rgba(15, 12, 41, 0.98)',
            backdropFilter: 'blur(20px)',
            borderRight: '1px solid rgba(255,255,255,0.05)'
          }
        }}
      >
        {drawerList()}
      </Drawer>
    </>
  );
};

export default Navbar;