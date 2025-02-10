import React, { useState, useEffect, useRef } from 'react';
import { 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Box, 
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider 
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  addDoc, 
  onSnapshot,
  doc,
  serverTimestamp 
} from 'firebase/firestore';

function Chat({ orderId }) {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Fetch messages
    const q = query(
      collection(db, 'messages'),
      where('orderId', '==', orderId),
      orderBy('createdAt')
    );

    const unsubscribeMessages = onSnapshot(q, (snapshot) => {
      const messageData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(messageData);
      scrollToBottom();
    });

    return () => {
      unsubscribeMessages();
    };
  }, [orderId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await addDoc(collection(db, 'messages'), {
        orderId,
        text: newMessage,
        senderId: currentUser.uid,
        createdAt: serverTimestamp()
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp.toDate()).toLocaleTimeString();
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 2, height: '70vh', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" gutterBottom>
          Chat - Order #{orderId}
        </Typography>
        
        <List sx={{ flexGrow: 1, overflow: 'auto', mb: 2 }}>
          {messages.map((message) => (
            <React.Fragment key={message.id}>
              <ListItem
                sx={{
                  justifyContent: message.senderId === currentUser.uid ? 'flex-end' : 'flex-start'
                }}
              >
                <Paper
                  sx={{
                    p: 1,
                    backgroundColor: message.senderId === currentUser.uid ? '#e3f2fd' : '#f5f5f5',
                    maxWidth: '70%'
                  }}
                >
                  <ListItemText
                    primary={message.text}
                    secondary={formatTime(message.createdAt)}
                  />
                </Paper>
              </ListItem>
              <div ref={messagesEndRef} />
            </React.Fragment>
          ))}
        </List>

        <Divider />
        
        <Box component="form" onSubmit={handleSend} sx={{ mt: 2, display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            size="small"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <Button type="submit" variant="contained">
            Send
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default Chat; 