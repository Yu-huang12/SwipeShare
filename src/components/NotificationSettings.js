import React, { useState } from 'react';
import { Box, Typography, FormControlLabel, Switch } from '@mui/material';
import { requestNotificationPermission } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

function NotificationSettings() {
  const { currentUser } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const handleEnableNotifications = async () => {
    try {
      await requestNotificationPermission(currentUser);
      setNotificationsEnabled(true);
    } catch (error) {
      console.error('Error enabling notifications:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h6">Notification Settings</Typography>
      <FormControlLabel
        control={
          <Switch
            checked={notificationsEnabled}
            onChange={handleEnableNotifications}
          />
        }
        label="Enable Push Notifications"
      />
    </Box>
  );
}

export default NotificationSettings; 