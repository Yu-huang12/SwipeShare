import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  Box, 
  Avatar, 
  Grid,
  Divider,
  CircularProgress,
  Chip,
  Card,
  CardContent,
  Button,
  Switch,
  FormControlLabel,
  TextField,
  Alert
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { doc, getDoc, collection, query, where, getDocs, updateDoc, setDoc } from 'firebase/firestore';
import { AnimatedCard } from './styled/AnimatedCard';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import StarIcon from '@mui/icons-material/Star';
import { requestNotificationPermission } from '../firebase';

function Profile() {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    ordersCreated: 0,
    ordersAccepted: 0,
    completedOrders: 0
  });
  const [loading, setLoading] = useState(true);
  const [isSeller, setIsSeller] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [sellerInfo, setSellerInfo] = useState({
    calId: '',
    phoneNumber: '',
    notificationsEnabled: false
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Fetch user profile
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setProfile(userDoc.data());
        }

        // Fetch orders statistics
        const createdOrdersQuery = query(
          collection(db, 'orders'),
          where('createdBy', '==', currentUser.uid)
        );
        const acceptedOrdersQuery = query(
          collection(db, 'orders'),
          where('acceptedBy', '==', currentUser.uid)
        );

        const [createdOrders, acceptedOrders] = await Promise.all([
          getDocs(createdOrdersQuery),
          getDocs(acceptedOrdersQuery)
        ]);

        const completedOrders = [
          ...createdOrders.docs,
          ...acceptedOrders.docs
        ].filter(doc => doc.data().status === 'completed').length;

        setStats({
          ordersCreated: createdOrders.size,
          ordersAccepted: acceptedOrders.size,
          completedOrders
        });

        // Fetch user's seller status
        const userData = userDoc.data();
        setIsSeller(userData.isSeller || false);
        setSellerInfo({
          calId: userData.calId || '',
          phoneNumber: userData.phoneNumber || '',
          notificationsEnabled: userData.notificationsEnabled || false
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [currentUser]);

  const handleSellerRegistration = async () => {
    try {
      setError('');
      setSuccess('');

      // Validate Cal ID format (10 digits)
      if (!/^\d{10}$/.test(sellerInfo.calId)) {
        setError('Please enter a valid 10-digit Cal ID');
        return;
      }

      // Validate phone number format
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(sellerInfo.phoneNumber)) {
        setError('Please enter a valid 10-digit phone number');
        return;
      }

      const userDocRef = doc(db, 'users', currentUser.uid);
      
      // First check if document exists
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        // Create new user document if it doesn't exist
        await setDoc(userDocRef, {
          email: currentUser.email,
          displayName: currentUser.displayName,
          isSeller: true,
          calId: sellerInfo.calId,
          phoneNumber: sellerInfo.phoneNumber,
          notificationsEnabled: sellerInfo.notificationsEnabled,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      } else {
        // Update existing document
        await updateDoc(userDocRef, {
          isSeller: true,
          calId: sellerInfo.calId,
          phoneNumber: sellerInfo.phoneNumber,
          notificationsEnabled: sellerInfo.notificationsEnabled,
          updatedAt: new Date()
        });
      }

      // If notifications are enabled, request permission
      if (sellerInfo.notificationsEnabled) {
        await requestNotificationPermission(currentUser);
      }

      setIsSeller(true);
      setSuccess('Successfully registered as a seller!');
    } catch (error) {
      console.error('Error registering as seller:', error);
      setError('Failed to register as seller. Please try again.');
    }
  };

  const handleUnregister = async () => {
    try {
      setError('');
      setSuccess('');

      await updateDoc(doc(db, 'users', currentUser.uid), {
        isSeller: false,
        updatedAt: new Date()
      });

      setIsSeller(false);
      setSuccess('Successfully unregistered as a seller');
    } catch (error) {
      console.error('Error unregistering:', error);
      setError('Failed to unregister. Please try again.');
    }
  };

  // Add Stripe Connect button for sellers
  const handleStripeConnect = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/create-connect-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser.uid,
          email: currentUser.email
        })
      });
      
      const data = await response.json();
      // Redirect to Stripe Connect onboarding
      window.location.href = data.accountLink;
    } catch (error) {
      console.error('Error connecting Stripe:', error);
      setError('Failed to connect payment account');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 8 }}>
          <Typography>Loading...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 6 }}>
        <Typography variant="h4" gutterBottom align="center">
          Profile
        </Typography>

        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Box sx={{ ml: 2 }}>
                <Typography variant="h6">
                  {currentUser.displayName || 'User'}
                </Typography>
                <Typography color="textSecondary">
                  {currentUser.email}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              Seller Registration
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}

            {!isSeller ? (
              <Box>
                <TextField
                  fullWidth
                  label="Cal ID"
                  value={sellerInfo.calId}
                  onChange={(e) => setSellerInfo({ ...sellerInfo, calId: e.target.value })}
                  margin="normal"
                  required
                  helperText="Enter your 10-digit Cal ID"
                  inputProps={{
                    maxLength: 10,
                    pattern: "\\d{10}"
                  }}
                />

                <TextField
                  fullWidth
                  label="Phone Number"
                  value={sellerInfo.phoneNumber}
                  onChange={(e) => setSellerInfo({ ...sellerInfo, phoneNumber: e.target.value })}
                  margin="normal"
                  required
                  helperText="Enter your phone number for buyer contact"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={sellerInfo.notificationsEnabled}
                      onChange={(e) => setSellerInfo({ 
                        ...sellerInfo, 
                        notificationsEnabled: e.target.checked 
                      })}
                    />
                  }
                  label="Enable Notifications"
                  sx={{ mt: 2 }}
                />

                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleSellerRegistration}
                  sx={{ mt: 3 }}
                >
                  Register as Seller
                </Button>
              </Box>
            ) : (
              <Box>
                <Alert severity="info" sx={{ mb: 3 }}>
                  You are registered as a seller. You will receive notifications for new meal requests.
                </Alert>

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleStripeConnect}
                  sx={{ mb: 2 }}
                >
                  Connect Payment Account
                </Button>

                <Button
                  variant="outlined"
                  color="error"
                  fullWidth
                  onClick={handleUnregister}
                >
                  Unregister as Seller
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

export default Profile; 