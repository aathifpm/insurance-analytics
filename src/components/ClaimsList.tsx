import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TextField, Select, MenuItem, InputLabel, FormControl, Button, Grid, Pagination, SelectChangeEvent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/mockApi';
import { Claim } from '../types';

const ClaimsList: React.FC = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    dateFrom: '',
    dateTo: '',
    amountMin: '',
    amountMax: ''
  });
  const navigate = useNavigate();

  const fetchClaims = async () => {
    const result = await api.fetchClaims();
    setClaims(result);
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = event.target;
    setFilters(prev => ({ ...prev, [name as string]: value }));
    setPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Claims List</Typography>
      <Grid container spacing={2} sx={{ marginBottom: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="Search"
            name="search"
            variant="outlined"
            value={filters.search}
            onChange={handleFilterChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={filters.status}
              onChange={(event: SelectChangeEvent<string>) => handleFilterChange(event as any)}
              label="Status"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Submitted">Submitted</MenuItem>
              <MenuItem value="Under Review">Under Review</MenuItem>
              <MenuItem value="Approved">Approved</MenuItem>
              <MenuItem value="Denied">Denied</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="Date From"
            name="dateFrom"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={filters.dateFrom}
            onChange={handleFilterChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="Date To"
            name="dateTo"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={filters.dateTo}
            onChange={handleFilterChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="Min Amount"
            name="amountMin"
            type="number"
            value={filters.amountMin}
            onChange={handleFilterChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="Max Amount"
            name="amountMax"
            type="number"
            value={filters.amountMax}
            onChange={handleFilterChange}
          />
        </Grid>
      </Grid>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Policy Number</TableCell>
              <TableCell>Claimant Name</TableCell>
              <TableCell>Claim Type</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {claims.map((claim) => (
              <TableRow key={claim.id} onClick={() => navigate(`/claims/${claim.id}`)} style={{ cursor: 'pointer' }}>
                <TableCell>{claim.id}</TableCell>
                <TableCell>{claim.policyNumber}</TableCell>
                <TableCell>{claim.claimantName}</TableCell>
                <TableCell>{claim.claimType}</TableCell>
                <TableCell>${claim.claimAmount.toFixed(2)}</TableCell>
                <TableCell>{claim.claimDate}</TableCell>
                <TableCell>{claim.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination
        count={Math.ceil(totalCount / 10)}
        page={page}
        onChange={handlePageChange}
        sx={{ marginTop: 2, display: 'flex', justifyContent: 'center' }}
      />
    </div>
  );
};

export default ClaimsList;