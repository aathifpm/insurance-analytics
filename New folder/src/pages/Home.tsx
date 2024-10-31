import React from 'react';
import { 
  Typography, 
  Button, 
  Grid, 
  Box, 
  Paper, 
  Container,
  Card,
  CardContent,
  CardActions,
  useTheme
} from '@mui/material';
import { Link } from 'react-router-dom';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const Home: React.FC = () => {
  const theme = useTheme();

  const cards = [
    {
      title: 'Analytics Dashboard',
      description: 'View comprehensive analytics and insights about claims processing and trends.',
      icon: <AssessmentIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      link: '/dashboard',
      buttonText: 'View Dashboard',
      buttonColor: 'primary'
    },
    {
      title: 'Claims Management',
      description: 'Access and manage all insurance claims in one centralized location.',
      icon: <ListAltIcon sx={{ fontSize: 40, color: theme.palette.secondary.main }} />,
      link: '/claims',
      buttonText: 'View Claims',
      buttonColor: 'secondary'
    },
    {
      title: 'Submit New Claim',
      description: 'Easily submit and process new insurance claims with our streamlined form.',
      icon: <AddCircleIcon sx={{ fontSize: 40, color: theme.palette.success.main }} />,
      link: '/submit-claim',
      buttonText: 'Submit Claim',
      buttonColor: 'success'
    }
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ 
        textAlign: 'center', 
        py: 8,
        background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
        borderRadius: theme.shape.borderRadius,
        mb: 6,
        color: 'white'
      }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Insurance Claims Analytics
        </Typography>
        <Typography variant="h5" sx={{ mb: 4 }}>
          Streamline your claims processing with advanced analytics
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {cards.map((card, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: '0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: theme.shadows[8]
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center', py: 4 }}>
                <Box sx={{ mb: 2 }}>
                  {card.icon}
                </Box>
                <Typography variant="h5" component="h2" gutterBottom>
                  {card.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {card.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                <Button 
                  component={Link} 
                  to={card.link} 
                  variant="contained" 
                  color={card.buttonColor as any}
                  size="large"
                >
                  {card.buttonText}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home;