import React, { useEffect, useState } from 'react';
import { 
  Typography, 
  Grid, 
  Paper, 
  Box,
  Card,
  CardContent,
  Skeleton,
  useTheme
} from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { api } from '../services/mockApi';
import { Claim, DashboardMetrics } from '../types';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const StatCard = ({ title, value, icon, trend, color }: any) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography color="textSecondary" gutterBottom variant="overline">
            {title}
          </Typography>
          <Typography variant="h4" component="div">
            {value}
          </Typography>
          {trend && (
            <Typography variant="subtitle2" sx={{ color: trend >= 0 ? 'success.main' : 'error.main' }}>
              {trend >= 0 ? '+' : ''}{trend}% from last month
            </Typography>
          )}
        </Box>
        <Box sx={{ 
          backgroundColor: `${color}.light`,
          borderRadius: '50%',
          padding: 1,
          display: 'flex'
        }}>
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [metricsData, claimsData] = await Promise.all([
          api.fetchDashboardMetrics(),
          api.fetchClaims()
        ]);
        setMetrics(metricsData);
        setClaims(claimsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const claimAmountData = claims.map(claim => ({
    name: claim.claimantName,
    amount: claim.claimAmount
  })).slice(0, 10); // Show only top 10 claims

  const claimTypeData = metrics ? Object.entries(metrics.claimsByType)
    .map(([name, value]) => ({ name, value })) : [];
  
  const claimStatusData = metrics ? Object.entries(metrics.claimsByStatus)
    .map(([name, value]) => ({ name, value })) : [];

  const claimTrendData = claims
    .sort((a, b) => new Date(a.claimDate).getTime() - new Date(b.claimDate).getTime())
    .map(claim => ({
      date: new Date(claim.claimDate).toLocaleDateString(),
      amount: claim.claimAmount
    }));

  return (
    <Box sx={{ py: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Dashboard Overview
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="TOTAL CLAIMS"
            value={metrics?.totalClaims || 0}
            icon={<AssignmentIcon sx={{ color: 'primary.main' }} />}
            trend={12}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="APPROVED CLAIMS"
            value={metrics?.claimsByStatus?.Approved || 0}
            icon={<CheckCircleIcon sx={{ color: 'success.main' }} />}
            trend={8}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="PENDING REVIEW"
            value={metrics?.claimsByStatus?.['Under Review'] || 0}
            icon={<TrendingUpIcon sx={{ color: 'warning.main' }} />}
            trend={-5}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="REJECTED CLAIMS"
            value={metrics?.claimsByStatus?.Denied || 0}
            icon={<ErrorIcon sx={{ color: 'error.main' }} />}
            trend={2}
            color="error"
          />
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" gutterBottom>Claims Trend</Typography>
            <ResponsiveContainer>
              <LineChart data={claimTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke={theme.palette.primary.main}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" gutterBottom>Claims by Type</Typography>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={claimTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {claimTypeData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

const DashboardSkeleton = () => (
  <Box sx={{ py: 3 }}>
    <Skeleton variant="text" width={300} height={40} sx={{ mb: 4 }} />
    <Grid container spacing={3}>
      {[1, 2, 3, 4].map((item) => (
        <Grid item xs={12} sm={6} md={3} key={item}>
          <Skeleton variant="rectangular" height={120} />
        </Grid>
      ))}
      <Grid item xs={12} md={8}>
        <Skeleton variant="rectangular" height={400} />
      </Grid>
      <Grid item xs={12} md={4}>
        <Skeleton variant="rectangular" height={400} />
      </Grid>
    </Grid>
  </Box>
);

export default Dashboard;