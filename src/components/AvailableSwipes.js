import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent,
  Button,
  Grid 
} from '@mui/material';
import { db } from '../firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function AvailableSwipes() {
  const [availableSwipes, setAvailableSwipes] = useState([]);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAvailableSwipes = async () => {
      const q = query(
        collection(db, 'available_meals'),
        where('status', '==', 'available'),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      const swipes = [];
      snapshot.forEach((doc) => {
        swipes.push({ id: doc.id, ...doc.data() });
      });
      setAvailableSwipes(swipes);
    };

    fetchAvailableSwipes();
  }, []);

  const handleBuy = (swipe) => {
    navigate(`/buy-meal/${swipe.id}`);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Available Meal Swipes
        </Typography>
        <Grid container spacing={3}>
          {availableSwipes.map((swipe) => (
            <Grid item xs={12} sm={6} key={swipe.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">
                    {swipe.restaurant}
                  </Typography>
                  <Typography color="textSecondary">
                    {swipe.mealTime.charAt(0).toUpperCase() + swipe.mealTime.slice(1)}
                  </Typography>
                  <Typography>
                    Available until: {swipe.availableUntil}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    $10.00
                  </Typography>
                  <Button 
                    variant="contained" 
                    fullWidth 
                    onClick={() => handleBuy(swipe)}
                    sx={{ mt: 2 }}
                  >
                    Buy Now
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}

export default AvailableSwipes; 