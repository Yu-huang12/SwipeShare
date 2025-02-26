import React, { useEffect } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function PaymentCancel() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Payment Cancelled
        </Typography>
        <Typography sx={{ mb: 4 }}>
          Your payment was cancelled. No charges were made.
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/request-meal')}
        >
          Try Again
        </Button>
      </Box>
    </Container>
  );
}

export default PaymentCancel; 