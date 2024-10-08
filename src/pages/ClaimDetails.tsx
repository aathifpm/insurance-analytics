import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Paper, Grid, Button, Chip } from '@mui/material';
import { api } from '../services/mockApi';
import { Claim } from '../types';
import { useAuth } from '../contexts/AuthContext';

const ClaimDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [claim, setClaim] = useState<Claim | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (id) {
      api.fetchClaimById(id).then(setClaim);
    }
  }, [id]);

  const handleStatusUpdate = async (newStatus: Claim['status']) => {
    if (claim) {
      const updatedClaim = await api.updateClaimStatus(claim.id, newStatus);
      setClaim(updatedClaim);
    }
  };

  if (!claim) return <Typography>Loading...</Typography>;

  return (
    <Paper sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>Claim Details</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography><strong>Policy Number:</strong> {claim.policyNumber}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography><strong>Claimant Name:</strong> {claim.claimantName}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography><strong>Claim Type:</strong> {claim.claimType}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography><strong>Claim Amount:</strong> ${claim.claimAmount.toFixed(2)}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography><strong>Claim Date:</strong> {claim.claimDate}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography><strong>Status:</strong> <Chip label={claim.status} color="primary" /></Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography><strong>Documents:</strong></Typography>
          {claim.documents.map((doc, index) => (
            <Chip key={index} label={doc} sx={{ margin: 0.5 }} />
          ))}
        </Grid>
        {user?.role === 'admin' && (
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>Update Status</Typography>
            <Button variant="contained" color="primary" onClick={() => handleStatusUpdate('Under Review')} sx={{ marginRight: 1 }}>
              Mark as Under Review
            </Button>
            <Button variant="contained" color="success" onClick={() => handleStatusUpdate('Approved')} sx={{ marginRight: 1 }}>
              Approve
            </Button>
            <Button variant="contained" color="error" onClick={() => handleStatusUpdate('Denied')}>
              Deny
            </Button>
          </Grid>
        )}
      </Grid>
      <Button onClick={() => navigate('/claims')} sx={{ marginTop: 2 }}>Back to Claims List</Button>
    </Paper>
  );
};

export default ClaimDetails;