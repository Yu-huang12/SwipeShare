import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip
} from '@mui/material';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

function AdminView() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const q = query(
          collection(db, 'users'),
          where('isSeller', '==', true)
        );
        
        const querySnapshot = await getDocs(q);
        const sellersData = [];
        querySnapshot.forEach((doc) => {
          sellersData.push({ id: doc.id, ...doc.data() });
        });
        
        setSellers(sellersData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching sellers:', error);
        setLoading(false);
      }
    };

    fetchSellers();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 8 }}>
          <Typography>Loading sellers...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Registered Sellers
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Cal ID</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Notifications</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sellers.map((seller) => (
                <TableRow key={seller.id}>
                  <TableCell>{seller.displayName}</TableCell>
                  <TableCell>{seller.email}</TableCell>
                  <TableCell>{seller.calId}</TableCell>
                  <TableCell>{seller.phoneNumber}</TableCell>
                  <TableCell>
                    <Chip 
                      label={seller.notificationsEnabled ? "Enabled" : "Disabled"}
                      color={seller.notificationsEnabled ? "success" : "default"}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {sellers.length === 0 && (
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">
              No registered sellers found
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default AdminView; 