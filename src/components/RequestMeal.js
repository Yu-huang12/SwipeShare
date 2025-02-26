import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { db } from '../firebase';
import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function RequestMeal() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    restaurant: '',
    mealTime: '',
    status: 'pending'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create the order request
      const orderRef = await addDoc(collection(db, 'meal_requests'), {
        ...formData,
        buyerUid: currentUser.uid,
        price: 10.00,
        createdAt: serverTimestamp()
      });

      // Create notifications for all registered sellers
      const sellersSnapshot = await getDocs(collection(db, 'users'));
      sellersSnapshot.forEach(async (sellerDoc) => {
        const sellerData = sellerDoc.data();
        if (sellerData.isSeller) {
          await addDoc(collection(db, 'notifications'), {
            type: 'new_request',
            requestId: orderRef.id,
            sellerUid: sellerDoc.id,
            buyerUid: currentUser.uid,
            restaurant: formData.restaurant,
            mealTime: formData.mealTime,
            status: 'unread',
            createdAt: serverTimestamp()
          });
        }
      });

      navigate('/my-orders');
    } catch (error) {
      console.error('Error creating meal request:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 6 }}>
        <Typography variant="h4" gutterBottom align="center">
          Request a Meal
        </Typography>

        <Card>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Select Restaurant</InputLabel>
                <Select
                  value={formData.restaurant}
                  label="Select Restaurant"
                  onChange={(e) => setFormData({ ...formData, restaurant: e.target.value })}
                  required
                >
                  <MenuItem value="Browns">Browns</MenuItem>
                  <MenuItem value="GBC">GBC</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel>Meal Time</InputLabel>
                <Select
                  value={formData.mealTime}
                  label="Meal Time"
                  onChange={(e) => setFormData({ ...formData, mealTime: e.target.value })}
                  required
                >
                  <MenuItem value="breakfast">Breakfast</MenuItem>
                  <MenuItem value="lunch">Lunch</MenuItem>
                </Select>
              </FormControl>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 3 }}
              >
                Request Meal ($10.00)
              </Button>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

export default RequestMeal; 