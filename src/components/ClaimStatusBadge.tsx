import React from 'react';
import { Chip } from '@mui/material';
import { Claim } from '../types';

interface Props {
  status: Claim['status'];
}

const ClaimStatusBadge: React.FC<Props> = ({ status }) => {
  const getColor = () => {
    switch (status) {
      case 'Submitted':
        return 'default';
      case 'Under Review':
        return 'warning';
      case 'Approved':
        return 'success';
      case 'Denied':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Chip
      label={status}
      color={getColor()}
      size="small"
    />
  );
};

export default ClaimStatusBadge; 