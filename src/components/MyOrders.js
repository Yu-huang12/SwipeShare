import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, CardContent, Button, Chip, Grid } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import Chat from './Chat';
import { AnimatedCard } from './styled/AnimatedCard';
import LoadingAnimation from './styled/LoadingAnimation';
import { StyledButton } from './styled/StyledButton';
import { slideIn } from './styled/animations';
import styled from '@emotion/styled';

const AnimatedChip = styled(Chip)`
  transition: all 0.3s ease;
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
`;

const AnimatedGrid = styled(Grid)`
  animation: ${slideIn} 0.3s ease-out;
  animation-delay: ${props => props.index * 0.1}s;
  opacity: 0;
  animation-fill-mode: forwards;
`;

function MyOrders() {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [loading, setLoading] = useState(true);

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
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  if (loading) {
    return <LoadingAnimation message="Loading your orders..." />;
  }

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
          {orders.map((order, index) => (
            <AnimatedGrid item xs={12} key={order.id} index={index}>
              <AnimatedCard>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">
                      {order.restaurant}
                    </Typography>
                    <AnimatedChip
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
                    <StyledButton
                      variant="outlined"
                      color="error"
                      onClick={() => handleCancelOrder(order.id)}
                      sx={{ mt: 2 }}
                    >
                      Cancel Order
                    </StyledButton>
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
              </AnimatedCard>
            </AnimatedGrid>
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