import React from 'react';
import { Container, Typography, Box, Button, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import ChatIcon from '@mui/icons-material/Chat';
import SecurityIcon from '@mui/icons-material/Security';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const FeatureIcon = styled(Box)`
  color: #A67C52;
  transition: all 0.3s ease;
  
  svg {
    font-size: 48px;
  }
`;

const FeatureCard = styled(Paper)`
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.6s ease-out;
  animation-delay: ${props => props.delay}s;
  opacity: 0;
  animation-fill-mode: forwards;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 30px rgba(166, 124, 82, 0.12);
    
    ${FeatureIcon} {
      color: #D2691E;
      transform: scale(1.1);
    }
  }
`;

const GradientText = styled(Typography)`
  background: linear-gradient(45deg, #A67C52, #D2691E);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: 'Playfair Display', serif;
`;

const features = [
  {
    icon: <RestaurantMenuIcon />,
    title: 'Elegant Dining Experience',
    description: 'Connect with fellow students to share dining experiences efficiently'
  },
  {
    icon: <ChatIcon />,
    title: 'Seamless Communication',
    description: 'Chat directly with buyers and sellers through our refined messaging system'
  },
  {
    icon: <SecurityIcon />,
    title: 'Secure Platform',
    description: 'Safe and verified transactions between university students'
  }
];

function Home() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  return (
    <Box
      sx={{
        minHeight: '90vh',
        pt: 12,
        pb: 6,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 10 }}>
          <GradientText
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 3,
              fontSize: { xs: '2.5rem', md: '3.5rem' }
            }}
          >
            Welcome to SwipeShare
          </GradientText>
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ 
              mb: 5,
              fontFamily: 'Inter',
              maxWidth: '800px',
              mx: 'auto'
            }}
          >
            Experience the elegance of shared dining on campus
          </Typography>
          {!currentUser && (
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/login')}
              sx={{
                py: 2,
                px: 6,
                fontSize: '1.1rem',
                fontFamily: 'Playfair Display'
              }}
            >
              Begin Your Journey
            </Button>
          )}
        </Box>

        <Grid container spacing={4} justifyContent="center">
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <FeatureCard
                delay={0.2 * (index + 1)}
                sx={{
                  p: 4,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <FeatureIcon sx={{ mb: 3 }}>
                  {feature.icon}
                </FeatureIcon>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    mb: 2,
                    fontFamily: 'Playfair Display',
                    color: '#4A4036'
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography 
                  color="text.secondary"
                  sx={{ 
                    fontFamily: 'Inter',
                    lineHeight: 1.7
                  }}
                >
                  {feature.description}
                </Typography>
              </FeatureCard>
            </Grid>
          ))}
        </Grid>

        {currentUser && (
          <Box sx={{ mt: 10, textAlign: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/create-order')}
              sx={{
                mr: 3,
                py: 2,
                px: 6,
                fontSize: '1.1rem',
                fontFamily: 'Playfair Display'
              }}
            >
              Create Order
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/available-orders')}
              sx={{
                py: 2,
                px: 6,
                fontSize: '1.1rem',
                fontFamily: 'Playfair Display'
              }}
            >
              Browse Orders
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default Home; 