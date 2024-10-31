import React from 'react';
import { Paper, Typography, Box, Chip, LinearProgress } from '@mui/material';
import { FraudDetectionResponse } from '../services/mlApi';

interface FraudAnalysisProps {
  analysis: FraudDetectionResponse;
}

const FraudAnalysis: React.FC<FraudAnalysisProps> = ({ analysis }) => {
  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'LOW': return 'success';
      case 'MEDIUM': return 'warning';
      case 'HIGH': return 'error';
      default: return 'default';
    }
  };

  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>Fraud Analysis Results</Typography>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2">Risk Level</Typography>
        <Chip 
          label={analysis.riskLevel}
          color={getRiskColor(analysis.riskLevel) as any}
          sx={{ mt: 1 }}
        />
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2">Fraud Probability</Typography>
        <LinearProgress 
          variant="determinate" 
          value={analysis.probability * 100}
          color={getRiskColor(analysis.riskLevel) as any}
          sx={{ mt: 1, height: 10, borderRadius: 5 }}
        />
        <Typography variant="caption">
          {(analysis.probability * 100).toFixed(1)}%
        </Typography>
      </Box>

      {analysis.featureContributions.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2">Key Risk Factors</Typography>
          <Box sx={{ mt: 1 }}>
            {analysis.featureContributions.map((feature, index) => (
              <Chip
                key={index}
                label={`${feature.feature}: ${(feature.contribution * 100).toFixed(1)}%`}
                size="small"
                sx={{ m: 0.5 }}
              />
            ))}
          </Box>
        </Box>
      )}

      {analysis.anomalyIndicators.length > 0 && (
        <Box>
          <Typography variant="subtitle2">Anomaly Indicators</Typography>
          <Box sx={{ mt: 1 }}>
            {analysis.anomalyIndicators.map((indicator, index) => (
              <Typography key={index} color="error" variant="body2">
                • {indicator}
              </Typography>
            ))}
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default FraudAnalysis; 