import React, { useState } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Button, 
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import GoogleIcon from '@mui/icons-material/Google';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

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

const AnimatedBox = styled(Box)`
  animation: ${fadeIn} 0.6s ease-out;
`;

const gradientAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const GradientText = styled(Typography)`
  background: linear-gradient(45deg, #6C63FF, #FF6584, #6C63FF);
  background-size: 200% 200%;
  animation: ${gradientAnimation} 5s ease infinite;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
`;

function Login() {
  const { setCurrentUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await signInWithPopup(auth, googleProvider);
      setCurrentUser(result.user);
      navigate('/');
    } catch (error) {
      console.error('Error signing in with Google:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <AnimatedBox
        sx={{
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 5,
            width: '100%',
            background: 'rgba(19, 47, 76, 0.4)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 4,
          }}
        >
          <GradientText variant="h3" component="h1" gutterBottom>
            Welcome to SwipeShare
          </GradientText>
          
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Connect with fellow students to share meal swipes
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Button
            variant="contained"
            size="large"
            onClick={handleGoogleSignIn}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <GoogleIcon />}
            sx={{
              py: 1.5,
              px: 4,
              background: 'linear-gradient(45deg, #6C63FF 30%, #FF6584 90%)',
              boxShadow: '0 3px 5px 2px rgba(108, 99, 255, .3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #5952FF 30%, #FF4F73 90%)',
              },
              '&:disabled': {
                background: 'rgba(255,255,255,0.12)',
              }
            }}
          >
            {loading ? 'Signing in...' : 'Sign in with Google'}
          </Button>

          <Box sx={{ mt: 4 }}>
            <Typography variant="body2" color="text.secondary">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </Typography>
          </Box>
        </Paper>
      </AnimatedBox>
    </Container>
  );
}

export default Login; 