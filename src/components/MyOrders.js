import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Card, CardContent, Button, Chip, Grid } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import Chat from './Chat';

function MyOrders() {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  useEffect(() => {
    const q = query(
      collection(db, 'orders'),
      where('createdBy', '==', currentUser.uid)
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'accepted': return 'info';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: 'cancelled'
      });
    } catch (error) {
      console.error('Error cancelling order:', error);
    }
  };

  const handleOpenChat = (orderId) => {
    setSelectedOrderId(orderId);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          My Orders
        </Typography>

        <Grid container spacing={3}>
          {orders.map((order) => (
            <Grid item xs={12} key={order.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">
                      {order.restaurant}
                    </Typography>
                    <Chip
                      label={order.status.toUpperCase()}
                      color={getStatusColor(order.status)}
                    />
                  </Box>

                  <Typography variant="body1" gutterBottom>
                    Items: {order.items}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Notes: {order.notes}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    $10.00
                  </Typography>

                  {order.status === 'pending' && (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleCancelOrder(order.id)}
                      sx={{ mt: 2 }}
                    >
                      Cancel Order
                    </Button>
                  )}

                  {(order.status === 'accepted' || order.status === 'completed') && (
                    <Button
                      variant="outlined"
                      onClick={() => handleOpenChat(order.id)}
                      sx={{ mt: 2 }}
                    >
                      Chat with {order.acceptedBy === currentUser.uid ? 'Buyer' : 'Seller'}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}

          {orders.length === 0 && (
            <Grid item xs={12}>
              <Typography variant="body1" color="text.secondary" align="center">
                You haven't created any orders yet.
              </Typography>
            </Grid>
          )}
        </Grid>

        {selectedOrderId && (
          <Box sx={{ mt: 4 }}>
            <Chat orderId={selectedOrderId} />
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default MyOrders; 