import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Tabs, Tab, Card, CardContent, Grid, Button, Chip } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs, orderBy, updateDoc, doc } from 'firebase/firestore';
import Chat from './Chat';
import { AnimatedCard } from './styled/AnimatedCard';
import LoadingAnimation from './styled/LoadingAnimation';
import { StyledButton } from './styled/StyledButton';
import { slideIn } from './styled/animations';
import styled from '@emotion/styled';
import { ScrollReveal, cardVariants, buttonVariants } from './effects/AnimatedElements';
import ScrollAnimationWrapper from './effects/ScrollAnimationWrapper';
import { motion } from 'framer-motion';
import { ShimmerButton } from './effects/AnimatedElements';

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
  const [tab, setTab] = useState(0);
  const [myOrders, setMyOrders] = useState([]);
  const { currentUser } = useAuth();
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const q = query(
        collection(db, 'orders'),
        where(tab === 0 ? 'buyerUid' : 'sellerUid', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      const orders = [];
      snapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() });
      });
      setMyOrders(orders);
      setLoading(false);
    };

    fetchOrders();
  }, [tab, currentUser]);

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
      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          My Orders
        </Typography>
        
        <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)} centered>
          <Tab label="Purchases" />
          <Tab label="Sales" />
        </Tabs>

        <Grid container spacing={3} sx={{ mt: 3 }}>
          {myOrders.map((order) => (
            <Grid item xs={12} key={order.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">
                      {order.restaurant} - {order.mealTime}
                    </Typography>
                    <AnimatedChip 
                      label={order.status.toUpperCase()}
                      color={order.status === 'pending' ? 'warning' : 
                             order.status === 'completed' ? 'success' : 
                             order.status === 'cancelled' ? 'error' : 'default'}
                    />
                  </Box>
                  <Typography>
                    Date: {order.createdAt.toDate().toLocaleDateString()}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    $10.00
                  </Typography>
                  {order.status === 'pending' && (
                    <Button
                      variant="contained"
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
                      Chat
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {selectedOrderId && (
        <Box sx={{ mt: 4 }}>
          <Chat orderId={selectedOrderId} />
        </Box>
      )}
    </Container>
  );
}

export default MyOrders; 