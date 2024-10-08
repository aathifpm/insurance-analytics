import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Paper, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/mockApi';

const ClaimForm: React.FC = () => {
  const [formData, setFormData] = useState({
    policyNumber: '',
    claimantName: '',
    claimType: '',
    claimAmount: '',
    claimDate: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newClaim = await api.submitClaim({
        ...formData,
        claimAmount: Number(formData.claimAmount),
        documents: []
      });
      if (file) {
        try {
          await api.uploadDocument(newClaim.id, file);
        } catch (uploadError) {
          console.error('Error uploading document:', uploadError);
          // Optionally, you can show an error message to the user here
        }
      }
      navigate('/claims');
    } catch (error) {
      console.error('Error submitting claim:', error);
      // Optionally, you can show an error message to the user here
    }
  };

  return (
    <Paper sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>Submit a Claim</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Policy Number"
              name="policyNumber"
              value={formData.policyNumber}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Claimant Name"
              name="claimantName"
              value={formData.claimantName}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Claim Type"
              name="claimType"
              value={formData.claimType}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Claim Amount"
              name="claimAmount"
              type="number"
              value={formData.claimAmount}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Claim Date"
              name="claimDate"
              type="date"
              value={formData.claimDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <input
              accept="image/*,application/pdf"
              style={{ display: 'none' }}
              id="raised-button-file"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="raised-button-file">
              <Button variant="contained" component="span">
                Upload Document
              </Button>
            </label>
            {file && <Box mt={2}>Selected file: {file.name}</Box>}
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Submit Claim
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default ClaimForm;