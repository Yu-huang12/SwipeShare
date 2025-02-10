import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Card, CardContent, Button, Grid } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, updateDoc, doc } from 'firebase/firestore';

function AvailableOrders() {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, 'orders'),
      where('status', '==', 'pending'),
      where('createdBy', '!=', currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const orderData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(orderData);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleAcceptOrder = async (orderId) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: 'accepted',
        acceptedBy: currentUser.uid,
        acceptedAt: new Date()
      });
    } catch (error) {
      console.error('Error accepting order:', error);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Available Orders
        </Typography>

        <Grid container spacing={3}>
          {orders.map((order) => (
            <Grid item xs={12} sm={6} key={order.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {order.restaurant}
                  </Typography>

                  <Typography variant="body1" gutterBottom>
                    Items: {order.items}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Notes: {order.notes}
                  </Typography>
                  <Typography variant="h6" color="primary" gutterBottom>
                    $10.00
                  </Typography>

                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => handleAcceptOrder(order.id)}
                  >
                    Accept Order
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}

          {orders.length === 0 && (
            <Grid item xs={12}>
              <Typography variant="body1" color="text.secondary" align="center">
                No available orders at the moment.
              </Typography>
            </Grid>
          )}
        </Grid>
      </Box>
    </Container>
  );
}

export default AvailableOrders; 