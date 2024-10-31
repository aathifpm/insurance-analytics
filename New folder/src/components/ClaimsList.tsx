import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Grid,
  Pagination,
  Box,
  Chip,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  useTheme,
  SelectChangeEvent,
  CircularProgress,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { api } from '../services/mockApi';
import { Claim } from '../types';

const ClaimsList: React.FC = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    dateFrom: '',
    dateTo: '',
    amountMin: '',
    amountMax: ''
  });
  const navigate = useNavigate();
  const theme = useTheme();

  const fetchClaims = async () => {
    setIsLoading(true);
    setError('');
    try {
      const result = await api.fetchClaims();
      setClaims(result);
      setTotalCount(result.length);
    } catch (err) {
      setError('Failed to fetch claims. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = event.target;
    setFilters(prev => ({ ...prev, [name as string]: value }));
    setPage(1);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      'Submitted': 'info',
      'Under Review': 'warning',
      'Approved': 'success',
      'Denied': 'error'
    };
    return statusColors[status] || 'default';
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      status: '',
      dateFrom: '',
      dateTo: '',
      amountMin: '',
      amountMax: ''
    });
    setPage(1);
  };

  return (
    <Box sx={{ py: 3 }}>
      <Card sx={{ mb: 3, backgroundColor: theme.palette.primary.main, color: 'white' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4">Claims Management</Typography>
            <Box>
              <Tooltip title="Toggle Filters">
                <IconButton onClick={() => setShowFilters(!showFilters)} sx={{ color: 'white' }}>
                  <FilterListIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Refresh">
                <IconButton onClick={fetchClaims} sx={{ color: 'white' }}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
      )}

      {showFilters && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Search"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
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
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                onClick={resetFilters}
                sx={{ height: '56px' }}
              >
                Reset Filters
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}

      <TableContainer component={Paper} sx={{ position: 'relative' }}>
        {isLoading && (
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            zIndex: 1
          }}>
            <CircularProgress />
          </Box>
        )}
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: theme.palette.grey[100] }}>
              <TableCell>ID</TableCell>
              <TableCell>Policy Number</TableCell>
              <TableCell>Claimant Name</TableCell>
              <TableCell>Claim Type</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {claims.map((claim) => (
              <TableRow 
                key={claim.id}
                hover
                sx={{ '&:hover': { backgroundColor: theme.palette.action.hover } }}
              >
                <TableCell>{claim.id}</TableCell>
                <TableCell>{claim.policyNumber}</TableCell>
                <TableCell>{claim.claimantName}</TableCell>
                <TableCell>{claim.claimType}</TableCell>
                <TableCell>${claim.claimAmount.toFixed(2)}</TableCell>
                <TableCell>{new Date(claim.claimDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Chip 
                    label={claim.status} 
                    color={getStatusColor(claim.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="View Details">
                    <IconButton onClick={() => navigate(`/claims/${claim.id}`)}>
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={Math.ceil(totalCount / 10)}
          page={page}
          onChange={handlePageChange}
          color="primary"
          size="large"
        />
      </Box>
    </Box>
  );
};

export default ClaimsList;