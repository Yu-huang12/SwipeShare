import React, { useState } from 'react';
import { 
  Container, 
  Button, 
  Typography, 
  Box, 
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';

const GradientText = styled(Typography)`
  background: linear-gradient(45deg, #A67C52, #D2691E);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: 'Playfair Display', serif;
`;

const StyledFormControl = styled(FormControl)`
  // ... keep existing styles
`;

function SellOrder() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    restaurant: '',
    mealTime: '',
    availableUntil: '',
    price: 10.00,
    status: 'available'
  });

  const restaurants = ["Browns", "GBC"];
  const mealTimes = ["breakfast", "lunch"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'available_meals'), {
        ...formData,
        sellerUid: currentUser.uid,
        createdAt: serverTimestamp()
      });
      navigate('/my-sales');
    } catch (error) {
      console.error('Error creating meal listing:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 6 }}>
        <GradientText variant="h3" gutterBottom align="center">
          List Meal Swipe
        </GradientText>

        <Paper elevation={0} sx={{ p: 4, borderRadius: 2 }}>
          <form onSubmit={handleSubmit}>
            <StyledFormControl fullWidth margin="normal">
              <InputLabel>Select Restaurant</InputLabel>
              <Select
                value={formData.restaurant}
                label="Select Restaurant"
                onChange={(e) => setFormData({ ...formData, restaurant: e.target.value })}
                required
              >
                {restaurants.map((restaurant) => (
                  <MenuItem key={restaurant} value={restaurant}>
                    {restaurant}
                  </MenuItem>
                ))}
              </Select>
            </StyledFormControl>

            <StyledFormControl fullWidth margin="normal">
              <InputLabel>Meal Time</InputLabel>
              <Select
                value={formData.mealTime}
                label="Meal Time"
                onChange={(e) => setFormData({ ...formData, mealTime: e.target.value })}
                required
              >
                {mealTimes.map((time) => (
                  <MenuItem key={time} value={time}>
                    {time === 'breakfast' ? 'Breakfast (7:30 AM - 10:00 AM)' : 'Lunch (11:00 AM - 4:30 PM)'}
                  </MenuItem>
                ))}
              </Select>
            </StyledFormControl>

            <TextField
              fullWidth
              margin="normal"
              label="Available Until"
              type="time"
              value={formData.availableUntil}
              onChange={(e) => setFormData({ ...formData, availableUntil: e.target.value })}
              InputLabelProps={{
                shrink: true,
              }}
              required
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 3 }}
            >
              List Meal Swipe
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}

export default SellOrder; 