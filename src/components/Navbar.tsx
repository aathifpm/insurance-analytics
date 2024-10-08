import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Insurance Analytics
        </Typography>
        <Box>
          <Button color="inherit" component={RouterLink} to="/">Home</Button>
          {isAuthenticated && (
            <>
              <Button color="inherit" component={RouterLink} to="/dashboard">Dashboard</Button>
              <Button color="inherit" component={RouterLink} to="/claims">Claims</Button>
              <Button color="inherit" component={RouterLink} to="/submit-claim">Submit Claim</Button>
              {user?.role === 'admin' && (
                <Button color="inherit" component={RouterLink} to="/admin">Admin</Button>
              )}
              <Button color="inherit" onClick={logout}>Logout</Button>
            </>
          )}
          {!isAuthenticated && (
            <Button color="inherit" component={RouterLink} to="/login">Login</Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;