import React from 'react';
import { Typography, Button, Grid } from '@mui/material';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div>
      <Typography variant="h3" gutterBottom>Insurance Claiming Analytics</Typography>
      <Grid container spacing={2}>
        <Grid item>
          <Button component={Link} to="/dashboard" variant="contained" color="primary">
            View Dashboard
          </Button>
        </Grid>
        <Grid item>
          <Button component={Link} to="/claims" variant="contained" color="secondary">
            View Claims
          </Button>
        </Grid>
        <Grid item>
          <Button component={Link} to="/submit-claim" variant="contained" color="success">
            Submit a Claim
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default Home;