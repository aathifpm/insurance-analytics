import React, { useEffect, useState } from 'react';
import { Typography, Grid, Paper } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { api } from '../services/mockApi';
import { Claim, DashboardMetrics } from '../types';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [claims, setClaims] = useState<Claim[]>([]);

  useEffect(() => {
    api.fetchDashboardMetrics().then(setMetrics);
    api.fetchClaims().then(setClaims);
  }, []);

  if (!metrics) return <Typography>Loading...</Typography>;

  const claimAmountData = claims.map(claim => ({
    name: claim.claimantName,
    amount: claim.claimAmount
  }));

  const claimTypeData = Object.entries(metrics.claimsByType).map(([name, value]) => ({ name, value }));
  const claimStatusData = Object.entries(metrics.claimsByStatus).map(([name, value]) => ({ name, value }));

  const claimTrendData = claims
    .sort((a, b) => new Date(a.claimDate).getTime() - new Date(b.claimDate).getTime())
    .map(claim => ({
      date: claim.claimDate,
      amount: claim.claimAmount
    }));

  return (
    <div>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      <Grid container spacing={3}>
        {/* Existing metric cards */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ padding: 2, height: 300 }}>
            <Typography variant="h6" gutterBottom>Claim Amounts</Typography>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={claimAmountData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ padding: 2, height: 300 }}>
            <Typography variant="h6" gutterBottom>Claim Types</Typography>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={claimTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {claimTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ padding: 2, height: 300 }}>
            <Typography variant="h6" gutterBottom>Claim Status Distribution</Typography>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={claimStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {claimStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ padding: 2, height: 300 }}>
            <Typography variant="h6" gutterBottom>Claim Trend</Typography>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={claimTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="amount" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;