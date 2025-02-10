import React from 'react';
import { Container, Typography, Button, Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Home() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to SwipeShare
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Connect with students to share meal swipes at your campus dining locations
        </Typography>

        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
          {currentUser ? (
            <>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/create-order')}
              >
                Need Food?
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/available-orders')}
              >
                Have Meal Swipes?
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/login')}
            >
              Get Started
            </Button>
          )}
        </Box>

        <Box sx={{ mt: 6, display: 'flex', gap: 3, justifyContent: 'center' }}>
          <Paper elevation={3} sx={{ p: 3, maxWidth: 300 }}>
            <Typography variant="h6" gutterBottom>
              Need Food?
            </Typography>
            <Typography>
              Create an order and connect with students who have extra meal swipes.
            </Typography>
          </Paper>
          <Paper elevation={3} sx={{ p: 3, maxWidth: 300 }}>
            <Typography variant="h6" gutterBottom>
              Have Meal Swipes?
            </Typography>
            <Typography>
              Help fellow students and earn money by sharing your unused meal swipes.
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
}

export default Home; 