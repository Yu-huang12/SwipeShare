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
  Chip
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { AnimatedCard } from './styled/AnimatedCard';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import StarIcon from '@mui/icons-material/Star';

function Profile() {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    ordersCreated: 0,
    ordersAccepted: 0,
    completedOrders: 0
  });
  const [loading, setLoading] = useState(true);

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

        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [currentUser]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Paper
          sx={{
            p: 4,
            background: 'rgba(19, 47, 76, 0.4)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Avatar
              src={currentUser.photoURL}
              sx={{
                width: 120,
                height: 120,
                border: '4px solid rgba(108, 99, 255, 0.5)',
                boxShadow: '0 4px 14px 0 rgba(108, 99, 255, 0.39)',
              }}
            />
            <Box sx={{ ml: 3 }}>
              <Typography variant="h4" gutterBottom>
                {profile?.displayName || currentUser.displayName}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {currentUser.email}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Member since {profile?.createdAt?.toDate().toLocaleDateString()}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.1)' }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <AnimatedCard>
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <FastfoodIcon sx={{ fontSize: 40, color: '#6C63FF', mb: 2 }} />
                  <Typography variant="h4" gutterBottom>
                    {stats.ordersCreated}
                  </Typography>
                  <Typography color="text.secondary">
                    Orders Created
                  </Typography>
                </Box>
              </AnimatedCard>
            </Grid>
            <Grid item xs={12} md={4}>
              <AnimatedCard>
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <LocalDiningIcon sx={{ fontSize: 40, color: '#FF6584', mb: 2 }} />
                  <Typography variant="h4" gutterBottom>
                    {stats.ordersAccepted}
                  </Typography>
                  <Typography color="text.secondary">
                    Orders Accepted
                  </Typography>
                </Box>
              </AnimatedCard>
            </Grid>
            <Grid item xs={12} md={4}>
              <AnimatedCard>
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <StarIcon sx={{ fontSize: 40, color: '#FFD700', mb: 2 }} />
                  <Typography variant="h4" gutterBottom>
                    {stats.completedOrders}
                  </Typography>
                  <Typography color="text.secondary">
                    Completed Orders
                  </Typography>
                </Box>
              </AnimatedCard>
            </Grid>
          </Grid>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Favorite Restaurants
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip 
                label="Ladle & Leaf"
                sx={{ 
                  background: 'linear-gradient(45deg, #6C63FF 30%, #FF6584 90%)',
                  color: 'white'
                }}
              />
              {/* Add more restaurants as they're added to the system */}
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default Profile; 