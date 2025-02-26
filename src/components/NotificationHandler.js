import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { onMessage } from 'firebase/messaging';
import { messaging } from '../firebase';
import { useNavigate } from 'react-router-dom';

function NotificationHandler() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = onMessage(messaging, (payload) => {
      // Show notification
      new Notification(payload.notification.title, {
        body: payload.notification.body,
        icon: '/logo192.png'
      });

      // Play sound
      const audio = new Audio('/notification-sound.mp3');
      audio.play();
    });

    return () => unsubscribe();
  }, [currentUser]);

  return null;
}

export default NotificationHandler; 