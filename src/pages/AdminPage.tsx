import React, { useEffect, useState } from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { api } from '../services/mockApi';
import { Claim } from '../types';

const AdminPage: React.FC = () => {
  const [pendingClaims, setPendingClaims] = useState<Claim[]>([]);

  useEffect(() => {
    const fetchPendingClaims = async () => {
      const claims = await api.fetchPendingClaims();
      setPendingClaims(claims);
    };
    fetchPendingClaims();
  }, []);

  const handleReview = async (claimId: string, decision: 'approve' | 'deny') => {
    await api.reviewClaim(claimId, decision);
    setPendingClaims(pendingClaims.filter(claim => claim.id !== claimId));
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Admin: Review Applicants</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Claimant Name</TableCell>
              <TableCell>Claim Type</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pendingClaims.map((claim) => (
              <TableRow key={claim.id}>
                <TableCell>{claim.id}</TableCell>
                <TableCell>{claim.claimantName}</TableCell>
                <TableCell>{claim.claimType}</TableCell>
                <TableCell>${claim.claimAmount.toFixed(2)}</TableCell>
                <TableCell>{claim.claimDate}</TableCell>
                <TableCell>
                  <Button onClick={() => handleReview(claim.id, 'approve')} color="primary" variant="contained" style={{marginRight: '10px'}}>
                    Approve
                  </Button>
                  <Button onClick={() => handleReview(claim.id, 'deny')} color="secondary" variant="contained">
                    Deny
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AdminPage;