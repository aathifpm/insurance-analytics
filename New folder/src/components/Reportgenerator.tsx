import React, { useState } from 'react';
import { Button, FormControl, InputLabel, Select, MenuItem, Grid, Typography, Paper } from '@mui/material';
import { api } from '../services/mockApi';

const ReportGenerator: React.FC = () => {
  const [reportType, setReportType] = useState('');

  const generateReport = async () => {
    if (!reportType) return;

    try {
      const reportData = await api.generateReport(reportType);
      console.log('Report data:', reportData);
      
      // Simulating file download
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${reportType}_report.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  return (
    <Paper sx={{ padding: 3, marginTop: 3 }}>
      <Typography variant="h5" gutterBottom>Generate Report</Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Report Type</InputLabel>
            <Select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              label="Report Type"
            >
              <MenuItem value="claimsSummary">Claims Summary</MenuItem>
              <MenuItem value="claimsByType">Claims by Type</MenuItem>
              <MenuItem value="claimsByStatus">Claims by Status</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button
            variant="contained"
            color="primary"
            onClick={generateReport}
            disabled={!reportType}
          >
            Generate Report
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ReportGenerator;