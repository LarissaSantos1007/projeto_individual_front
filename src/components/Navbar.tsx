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
  useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  Category,
  Inventory,
  ShoppingCart,
  Assessment,
  Logout,
  Login,
  PersonAdd,
  Store,
  Person
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const { user, isAuthenticated, logout } = useAuth();

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <Dashboard /> },
    { label: 'Categorias', path: '/categorias', icon: <Category /> },
    { label: 'Produtos', path: '/produtos', icon: <Inventory /> },
    { label: 'Movimentações', path: '/movimentacoes', icon: <ShoppingCart /> },
    { label: 'Vendas', path: '/vendas', icon: <Store /> },
    { label: 'Relatórios', path: '/relatorios', icon: <Assessment /> },
  ];

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleClose();
  };

  const toggleDrawer = (open: boolean) => {
    setDrawerOpen(open);
  };

  const drawerList = () => (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        {menuItems.map((item) => (
          <ListItem 
            key={item.path} 
            component={Link} 
            to={item.path}
            onClick={() => toggleDrawer(false)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {isMobile && isAuthenticated && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={() => toggleDrawer(true)}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}

            <Typography
              variant="h6"
              noWrap
              component={Link}
              to={isAuthenticated ? '/dashboard' : '/login'}
              sx={{
                mr: 2,
                display: 'flex',
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
                flexGrow: isMobile ? 1 : 0,
              }}
            >
              SISTEMA
            </Typography>

            {!isMobile && isAuthenticated && (
              <Box sx={{ flexGrow: 1, display: 'flex', ml: 2 }}>
                {menuItems.map((item) => (
                  <Button
                    key={item.path}
                    component={Link}
                    to={item.path}
                    color="inherit"
                    sx={{ mx: 1 }}
                    startIcon={item.icon}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
            )}

            <Box sx={{ flexGrow: 0 }}>
              {isAuthenticated ? (
                <div>
                  <Tooltip title="Configurações">
                    <IconButton onClick={handleMenu} color="inherit">
                      <Avatar sx={{ width: 32, height: 32, bgcolor: '#1976d2' }}>
                        {user?.nome?.[0]?.toUpperCase() || 'U'}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem disabled>
                      <Box>
                        {/* CORREÇÃO: Remover fontWeight como prop */}
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {user?.nome || 'Usuário'}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {user?.email || ''}
                        </Typography>
                      </Box>
                    </MenuItem>
                    <MenuItem divider />
                    <MenuItem onClick={() => { navigate('/perfil'); handleClose(); }}>
                      <ListItemIcon>
                        <Person fontSize="small" />
                      </ListItemIcon>
                      Perfil
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      <ListItemIcon>
                        <Logout fontSize="small" />
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
                    color="inherit"
                    startIcon={<Login />}
                    variant="outlined"
                    sx={{ borderColor: 'rgba(255,255,255,0.3)' }}
                  >
                    Login
                  </Button>
                  <Button
                    component={Link}
                    to="/cadastro"
                    color="inherit"
                    startIcon={<PersonAdd />}
                  >
                    Cadastro
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
      >
        {drawerList()}
      </Drawer>
    </>
  );
};

export default Navbar;