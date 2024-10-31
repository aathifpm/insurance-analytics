import React, { useEffect, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { api } from '../services/mockApi';

const Notifications: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const checkForUpdates = async () => {
      try {
        const updates = await api.checkForUpdates();
        if (updates.length > 0) {
          setMessage(`${updates.length} claim(s) have been updated.`);
          setOpen(true);
        }
      } catch (error) {
        console.error('Error checking for updates:', error);
      }
    };

    const interval = setInterval(checkForUpdates, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity="info" sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Notifications;