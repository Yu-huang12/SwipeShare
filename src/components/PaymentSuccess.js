import React, { useEffect } from 'react';
import { Container, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function PaymentSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to orders page after 3 seconds
    const timer = setTimeout(() => {
      navigate('/my-orders');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Payment Successful!
        </Typography>
        <Typography>
          Redirecting to your orders...
        </Typography>
      </Box>
    </Container>
  );
}

export default PaymentSuccess; 