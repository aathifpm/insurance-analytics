import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  Paper,
  Grid,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Box,
  Card,
  CardContent,
  Divider,
  IconButton,
  Tooltip,
  CircularProgress,
  Stack
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DescriptionIcon from '@mui/icons-material/Description';
import TimelineIcon from '@mui/icons-material/Timeline';
import { api } from '../services/mockApi';
import { mlApi, FraudDetectionResponse } from '../services/mlApi';
import { Claim } from '../types';
import { useAuth } from '../contexts/AuthContext';
import FraudAnalysis from '../components/FraudAnalysis';

const ClaimDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [claim, setClaim] = useState<Claim | null>(null);
  const [fraudAnalysis, setFraudAnalysis] = useState<FraudDetectionResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchClaimDetails = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const claimData = await api.fetchClaimById(id);
        setClaim(claimData);
      } catch (err) {
        setError('Failed to fetch claim details');
      } finally {
        setIsLoading(false);
      }
    };
    fetchClaimDetails();
  }, [id]);

  const analyzeClaim = async () => {
    if (!claim) return;
    setIsAnalyzing(true);
    try {
      const analysisData = {
        insurance_type: claim.claimType,
        months_as_customer: 12,
        age: 35,
        policy_deductable: 500,
        policy_annual_premium: 1000,
        claim_amount: claim.claimAmount,
        previous_claims: 0,
        policy_duration_months: 24,
        umbrella_limit: 0,
        policy_state: 'Active',
        incident_severity: 'Minor',
        incident_type: 'Other',
        collision_type: 'NA',
        insured_sex: 'M'
      };
      const analysis = await mlApi.analyzeClaim(analysisData);
      setFraudAnalysis(analysis);
      setShowApprovalDialog(false);
    } catch (err) {
      setError('Failed to analyze claim');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleStatusUpdate = async (newStatus: Claim['status']) => {
    if (!claim) return;
    
    if (newStatus === 'Approved' && !fraudAnalysis) {
      setShowApprovalDialog(true);
      return;
    }

    try {
      const updatedClaim = await api.updateClaimStatus(claim.id, newStatus);
      setClaim(updatedClaim);
    } catch (err) {
      setError('Failed to update claim status');
    }
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

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!claim) {
    return (
      <Alert severity="error">
        Claim not found or failed to load
      </Alert>
    );
  }

  return (
    <Box sx={{ py: 3 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/claims')}
        sx={{ mb: 3 }}
      >
        Back to Claims
      </Button>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4">Claim #{claim.id}</Typography>
            <Chip
              label={claim.status}
              color={getStatusColor(claim.status) as any}
              size="medium"
            />
          </Box>
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <Box>
                  <Typography color="textSecondary" variant="overline">Policy Number</Typography>
                  <Typography variant="h6">{claim.policyNumber}</Typography>
                </Box>
                <Box>
                  <Typography color="textSecondary" variant="overline">Claimant Name</Typography>
                  <Typography variant="h6">{claim.claimantName}</Typography>
                </Box>
                <Box>
                  <Typography color="textSecondary" variant="overline">Claim Type</Typography>
                  <Typography variant="h6">{claim.claimType}</Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <Box>
                  <Typography color="textSecondary" variant="overline">Claim Amount</Typography>
                  <Typography variant="h6">${claim.claimAmount.toFixed(2)}</Typography>
                </Box>
                <Box>
                  <Typography color="textSecondary" variant="overline">Claim Date</Typography>
                  <Typography variant="h6">{new Date(claim.claimDate).toLocaleDateString()}</Typography>
                </Box>
                <Box>
                  <Typography color="textSecondary" variant="overline">Documents</Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {claim.documents.map((doc, index) => (
                      <Chip
                        key={index}
                        label={doc}
                        icon={<DescriptionIcon />}
                        variant="outlined"
                        sx={{ mt: 1 }}
                      />
                    ))}
                  </Box>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {user?.role === 'admin' && (
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <TimelineIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Claim Analysis & Actions</Typography>
            </Box>

            <Stack spacing={3}>
              <Box>
                <Button
                  variant="contained"
                  color="info"
                  onClick={analyzeClaim}
                  disabled={isAnalyzing}
                  startIcon={isAnalyzing ? <CircularProgress size={20} /> : null}
                >
                  {isAnalyzing ? 'Analyzing...' : 'Run Fraud Analysis'}
                </Button>
              </Box>

              {fraudAnalysis && <FraudAnalysis analysis={fraudAnalysis} />}

              <Box>
                <Typography variant="subtitle1" gutterBottom>Update Status</Typography>
                {fraudAnalysis?.riskLevel === 'HIGH' && (
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    This claim has been flagged as high risk. Please review carefully before approval.
                  </Alert>
                )}
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleStatusUpdate('Under Review')}
                  >
                    Mark as Under Review
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleStatusUpdate('Approved')}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleStatusUpdate('Denied')}
                  >
                    Deny
                  </Button>
                </Stack>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      )}

      <Dialog open={showApprovalDialog} onClose={() => setShowApprovalDialog(false)}>
        <DialogTitle>Fraud Analysis Required</DialogTitle>
        <DialogContent>
          <Typography>
            Please run a fraud analysis before approving this claim.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowApprovalDialog(false)}>Cancel</Button>
          <Button onClick={analyzeClaim} variant="contained" color="primary">
            Run Analysis
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClaimDetails;