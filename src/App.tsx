import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { CssBaseline, Container } from '@mui/material';
import Home from './pages/Home';
import Dashboard from './components/Dashboard';
import ClaimsList from './components/ClaimsList';
import ClaimForm from './components/ClaimForm';
import ClaimDetails from './pages/ClaimDetails';
import Login from './pages/Login';
import AdminPage from './pages/AdminPage';
import Navbar from './components/Navbar';
import Notifications from './components/Notifications';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  return user?.role === 'admin' ? <>{children}</> : <Navigate to="/dashboard" />;
};

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ marginTop: 3 }}>
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/claims" element={<ProtectedRoute><ClaimsList /></ProtectedRoute>} />
          <Route path="/claims/:id" element={<ProtectedRoute><ClaimDetails /></ProtectedRoute>} />
          <Route path="/submit-claim" element={<ProtectedRoute><ClaimForm /></ProtectedRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
        </Routes>
      </Container>
      {isAuthenticated && <Notifications />}
    </>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <CssBaseline />
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;