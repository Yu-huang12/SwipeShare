import React from 'react';
import { Container, Typography, Box, Button, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import ChatIcon from '@mui/icons-material/Chat';
import SecurityIcon from '@mui/icons-material/Security';

function Home() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const features = [
    {
      icon: <FastfoodIcon sx={{ fontSize: 40, color: '#6C63FF' }} />,
      title: 'Easy Meal Sharing',
      description: 'Connect with fellow students to share meal swipes efficiently'
    },
    {
      icon: <ChatIcon sx={{ fontSize: 40, color: '#6C63FF' }} />,
      title: 'Real-time Chat',
      description: 'Communicate directly with buyers and sellers through our chat system'
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40, color: '#6C63FF' }} />,
      title: 'Secure Platform',
      description: 'Safe and verified transactions between university students'
    }
  ];

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #0A1929 0%, #132F4C 100%)',
        minHeight: '90vh',
        pt: 8,
        pb: 6
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 2,
              background: 'linear-gradient(45deg, #6C63FF, #FF6584)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            SwipeShare
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ mb: 4 }}
          >
            Connect, Share, and Save on Campus Dining
          </Typography>
          {!currentUser && (
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/login')}
              sx={{
                background: 'linear-gradient(45deg, #6C63FF 30%, #FF6584 90%)',
                boxShadow: '0 3px 5px 2px rgba(108, 99, 255, .3)',
                height: 48,
                px: 4
              }}
            >
              Get Started
            </Button>
          )}
        </Box>

        <Grid container spacing={4} justifyContent="center">
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper
                sx={{
                  p: 4,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  background: 'rgba(19, 47, 76, 0.4)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)'
                  }
                }}
              >
                {feature.icon}
                <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                  {feature.title}
                </Typography>
                <Typography color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {currentUser && (
          <Box sx={{ mt: 8, textAlign: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/create-order')}
              sx={{
                background: 'linear-gradient(45deg, #6C63FF 30%, #FF6584 90%)',
                boxShadow: '0 3px 5px 2px rgba(108, 99, 255, .3)',
                height: 48,
                px: 4,
                mr: 2
              }}
            >
              Create Order
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/available-orders')}
              sx={{
                borderColor: 'rgba(108, 99, 255, 0.5)',
                height: 48,
                px: 4,
                '&:hover': {
                  borderColor: '#6C63FF',
                  background: 'rgba(108, 99, 255, 0.1)'
                }
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