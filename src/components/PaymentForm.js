import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Stack
} from '@mui/material';
import { getFunctions, httpsCallable, connectFunctionsEmulator } from 'firebase/functions';
import { useAuth } from '../contexts/AuthContext';

function PaymentForm({ open, onClose, amount, orderId, onSuccess }) {
  const { currentUser } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  
  // Initialize functions with region
  const functions = getFunctions(undefined, 'us-central1');

  const handlePayment = async () => {
    try {
      setProcessing(true);
      setError(null);

      const createStripeCheckout = httpsCallable(functions, 'createStripeCheckout');
      const { data } = await createStripeCheckout({
        amount: amount,
        orderId: orderId
      });

      window.location.assign(data.url);
    } catch (err) {
      console.error('Payment error:', err);
      setError('Failed to process payment. Please try again.');
      setProcessing(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Payment Details
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Total Amount: ${amount?.toFixed(2)}
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Stack spacing={2}>
            <Typography>
              You will be redirected to a secure payment page to complete your purchase.
            </Typography>
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={processing}>
          Cancel
        </Button>
        <Button 
          onClick={handlePayment}
          variant="contained"
          disabled={processing}
        >
          {processing ? 'Processing...' : 'Proceed to Payment'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PaymentForm; 