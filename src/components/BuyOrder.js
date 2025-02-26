import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { 
  Container, 
  Button, 
  Typography, 
  Box, 
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import styled from '@emotion/styled';

function BuyOrder() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    restaurant: '',
    mealTime: '',
    price: 10.00,
    status: 'pending'
  });

  // Move handleSubmit inside the component
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create the order
      const orderRef = await addDoc(collection(db, 'orders'), {
        ...formData,
        buyerUid: currentUser.uid,
        createdAt: serverTimestamp()
      });

      // Create a notification for the seller
      await addDoc(collection(db, 'notifications'), {
        type: 'new_order',
        orderId: orderRef.id,
        sellerUid: formData.sellerUid,
        buyerUid: currentUser.uid,
        restaurant: formData.restaurant,
        mealTime: formData.mealTime,
        status: 'unread',
        createdAt: serverTimestamp()
      });

      navigate('/my-orders');
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      {/* Form JSX */}
    </Container>
  );
}

export default BuyOrder; 