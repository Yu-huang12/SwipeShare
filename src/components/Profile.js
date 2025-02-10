import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Avatar } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

function Profile() {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (userDoc.exists()) {
        setProfile(userDoc.data());
      } else {
        // Create initial profile using Google data
        const newProfile = {
          displayName: currentUser.displayName,
          email: currentUser.email,
          photoURL: currentUser.photoURL,
          createdAt: new Date(),
          completedOrders: 0
        };
        
        await setDoc(doc(db, 'users', currentUser.uid), newProfile);
        setProfile(newProfile);
      }
    };
    
    if (currentUser) {
      fetchProfile();
    }
  }, [currentUser]);

  if (!profile) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography>Loading profile...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Profile
        </Typography>
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar
              src={profile.photoURL}
              alt={profile.displayName}
              sx={{ width: 80, height: 80, mr: 2 }}
            />
            <Box>
              <Typography variant="h6">{profile.displayName}</Typography>
              <Typography color="text.secondary">{profile.email}</Typography>
            </Box>
          </Box>
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1">
              Orders Completed: {profile.completedOrders}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Member since: {profile.createdAt.toDate().toLocaleDateString()}
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default Profile; 