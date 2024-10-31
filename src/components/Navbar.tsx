import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DescriptionIcon from '@mui/icons-material/Description';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  const navItems = [
    { label: 'Home', path: '/', icon: <HomeIcon />, showAlways: true },
    { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon />, requireAuth: true },
    { label: 'Claims', path: '/claims', icon: <DescriptionIcon />, requireAuth: true },
    { label: 'Submit Claim', path: '/submit-claim', icon: <AddCircleIcon />, requireAuth: true },
    { label: 'Admin', path: '/admin', icon: <AdminPanelSettingsIcon />, requireAdmin: true }
  ];

  const isActiveRoute = (path: string) => location.pathname === path;

  const renderNavItems = () => {
    return navItems.map((item) => {
      if ((!isAuthenticated && !item.showAlways) || (item.requireAdmin && user?.role !== 'admin')) {
        return null;
      }

      return isMobile ? (
        <ListItem
          key={item.path}
          disablePadding
          sx={{
            borderRadius: 1,
            mx: 1,
            backgroundColor: isActiveRoute(item.path) ? 'primary.main' : 'transparent',
            color: isActiveRoute(item.path) ? 'white' : 'inherit',
            '&:hover': {
              backgroundColor: isActiveRoute(item.path) ? 'primary.dark' : 'action.hover',
            },
          }}
        >
          <ListItemIcon 
            sx={{ 
              color: isActiveRoute(item.path) ? 'white' : 'inherit',
              minWidth: 40,
              ml: 1 
            }}
          >
            {item.icon}
          </ListItemIcon>
          <ListItemText 
            primary={item.label}
            onClick={() => {
              navigate(item.path);
              handleDrawerToggle();
            }}
            sx={{ cursor: 'pointer' }}
          />
        </ListItem>
      ) : (
        <Button
          key={item.path}
          component={RouterLink}
          to={item.path}
          color="inherit"
          startIcon={item.icon}
          sx={{
            mx: 1,
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              width: isActiveRoute(item.path) ? '100%' : '0%',
              height: '2px',
              bottom: 0,
              left: 0,
              backgroundColor: 'white',
              transition: 'width 0.3s ease-in-out',
            },
            '&:hover::after': {
              width: '100%',
            },
          }}
        >
          {item.label}
        </Button>
      );
    });
  };

  return (
    <AppBar position="sticky" elevation={0} sx={{ backgroundColor: 'primary.main' }}>
      <Toolbar>
        {isMobile && (
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 700,
            letterSpacing: 1,
          }}
        >
          Insurance Analytics
        </Typography>

        {!isMobile && <Box sx={{ display: 'flex', alignItems: 'center' }}>{renderNavItems()}</Box>}

        {isAuthenticated ? (
          <Box sx={{ ml: 2 }}>
            <Tooltip title="Account settings">
              <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>
                  {user?.username.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              sx={{ mt: 1 }}
            >
              <MenuItem onClick={handleMenuClose}>
                <AccountCircleIcon sx={{ mr: 1 }} /> Profile
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <LogoutIcon sx={{ mr: 1 }} /> Logout
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Button
            color="inherit"
            component={RouterLink}
            to="/login"
            startIcon={<AccountCircleIcon />}
          >
            Login
          </Button>
        )}

        <Drawer
          variant="temporary"
          anchor="left"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
          }}
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Menu
            </Typography>
            <List>{renderNavItems()}</List>
          </Box>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;