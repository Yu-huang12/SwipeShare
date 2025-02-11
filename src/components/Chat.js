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
  Divider,
  Avatar,
  CircularProgress
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
  serverTimestamp,
  getDoc
} from 'firebase/firestore';
import SendIcon from '@mui/icons-material/Send';

function Chat({ orderId }) {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState({});
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const q = query(
        collection(db, 'messages'),
        where('orderId', '==', orderId),
        orderBy('createdAt')
      );

      const unsubscribe = onSnapshot(q, async (snapshot) => {
        const messageData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Fetch user details for each unique sender
        const uniqueSenders = [...new Set(messageData.map(msg => msg.senderId))];
        const userDetails = {};
        
        for (const senderId of uniqueSenders) {
          if (!users[senderId]) {
            const userDoc = await getDoc(doc(db, 'users', senderId));
            if (userDoc.exists()) {
              userDetails[senderId] = userDoc.data();
            }
          }
        }

        setUsers(prev => ({ ...prev, ...userDetails }));
        setMessages(messageData);
        setLoading(false);
        scrollToBottom();
      });

      return () => unsubscribe();
    };

    fetchMessages();
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
    return new Date(timestamp.toDate()).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper 
      sx={{ 
        height: '70vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(19, 47, 76, 0.4)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Typography variant="h6">Chat</Typography>
      </Box>

      <List sx={{ 
        flexGrow: 1, 
        overflow: 'auto', 
        p: 2,
        '&::-webkit-scrollbar': {
          width: '0.4em'
        },
        '&::-webkit-scrollbar-track': {
          background: 'rgba(0,0,0,0.1)'
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(255,255,255,0.2)',
          borderRadius: '4px'
        }
      }}>
        {messages.map((message) => (
          <ListItem
            key={message.id}
            sx={{
              flexDirection: 'column',
              alignItems: message.senderId === currentUser.uid ? 'flex-end' : 'flex-start',
              padding: '4px 0'
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'flex-start',
              flexDirection: message.senderId === currentUser.uid ? 'row-reverse' : 'row',
              gap: 1,
              maxWidth: '80%'
            }}>
              <Avatar 
                src={users[message.senderId]?.photoURL}
                sx={{ width: 32, height: 32 }}
              />
              <Box>
                <Paper
                  sx={{
                    p: 1.5,
                    background: message.senderId === currentUser.uid 
                      ? 'linear-gradient(45deg, #6C63FF 30%, #FF6584 90%)'
                      : 'rgba(255,255,255,0.1)',
                    borderRadius: 2,
                    maxWidth: '100%'
                  }}
                >
                  <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
                    {message.text}
                  </Typography>
                </Paper>
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ 
                    mt: 0.5, 
                    display: 'block',
                    textAlign: message.senderId === currentUser.uid ? 'right' : 'left'
                  }}
                >
                  {formatTime(message.createdAt)}
                </Typography>
              </Box>
            </Box>
          </ListItem>
        ))}
        <div ref={messagesEndRef} />
      </List>

      <Box 
        component="form" 
        onSubmit={handleSend} 
        sx={{ 
          p: 2, 
          borderTop: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          gap: 1
        }}
      >
        <TextField
          fullWidth
          size="small"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              backgroundColor: 'rgba(255,255,255,0.05)'
            }
          }}
        />
        <Button 
          type="submit" 
          variant="contained"
          disabled={!newMessage.trim()}
          sx={{
            borderRadius: 2,
            minWidth: '48px',
            background: 'linear-gradient(45deg, #6C63FF 30%, #FF6584 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #5952FF 30%, #FF4F73 90%)'
            }
          }}
        >
          <SendIcon />
        </Button>
      </Box>
    </Paper>
  );
}

export default Chat; 