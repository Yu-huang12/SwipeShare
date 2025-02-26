import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Button, 
  Typography, 
  Box, 
  Avatar, 
  IconButton, 
  Menu, 
  MenuItem,
  Badge,
  Tooltip,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useScrollTrigger,
  Slide,
  Container,
  Divider
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import DiamondIcon from '@mui/icons-material/Diamond';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const StyledAppBar = styled(AppBar)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &.scrolled {
    background: rgba(255, 255, 255, 0.98);
    box-shadow: 0 4px 20px rgba(184, 134, 11, 0.1);
  }
`;

const LogoText = styled(motion.div)`
  background: linear-gradient(
    90deg, 
    #B8860B 0%, 
    #DAA520 25%, 
    #FFD700 50%, 
    #DAA520 75%, 
    #B8860B 100%
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 8s linear infinite;
  cursor: pointer;
  font-family: 'Montserrat', sans-serif;
  font-weight: 800;
  font-size: 1.6rem;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  gap: 12px;

  svg {
    font-size: 32px;
    transform-origin: center;
    animation: plateRotate 30s linear infinite;
  }

  @keyframes shimmer {
    0% { background-position: 0% center; }
    100% { background-position: 200% center; }
  }

  @keyframes plateRotate {
    0% { transform: rotate(0deg); }
    25% { transform: rotate(5deg); }
    75% { transform: rotate(-5deg); }
    100% { transform: rotate(0deg); }
  }
`;

const NavIconButton = styled(IconButton)`
  position: relative;
  transition: all 0.3s ease;
  color: #1A1A1A;
  
  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(184, 134, 11, 0.1);
    border-radius: 50%;
    transform: scale(0);
    transition: transform 0.3s ease;
  }

  &:hover {
    color: #B8860B;
    
    &::after {
      transform: scale(1);
    }
  }
`;

const StyledBadge = styled(Badge)`
  .MuiBadge-badge {
    background: linear-gradient(45deg, #B8860B, #DAA520);
    color: white;
  }
`;

const MenuIconButton = styled(IconButton)`
  color: #B8860B;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(184, 134, 11, 0.08);
  }

  svg {
    font-size: 28px;
  }
`;

function HideOnScroll({ children }) {
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const restaurantInfo = [
  {
    name: "Browns",
    hours: {
      breakfast: "7:30 AM - 10:30 AM",
      lunch: "11:00 AM - 2:30 PM"
    },
    location: "2400 Durant Avenue",
    shortName: "Browns"
  },
  {
    name: "Golden Bear Cafe",
    hours: {
      breakfast: "8:00 AM - 11:00 AM",
      lunch: "11:00 AM - 3:00 PM"
    },
    location: "Lower Sproul Plaza",
    shortName: "GBC"
  }
];

function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const scrollTrigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });
  const [selectedRestaurant, setSelectedRestaurant] = useState(restaurantInfo[0]);
  const currentMealTime = getCurrentMealTime();

  useEffect(() => {
    if (!currentUser) return;

    // Listen for new notifications
    const q = query(
      collection(db, 'notifications'),
      where('sellerUid', '==', currentUser.uid),
      where('status', '==', 'unread'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newNotifications = [];
      snapshot.forEach((doc) => {
        newNotifications.push({ id: doc.id, ...doc.data() });
      });
      setNotifications(newNotifications);

      // Play sound for new notifications
      if (newNotifications.length > 0) {
        playNotificationSound();
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Add notification sound
  const playNotificationSound = () => {
    const audio = new Audio('/notification-sound.mp3');
    audio.play();
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const menuItems = [
    { 
      text: 'Create Listing', 
      icon: <AddCircleOutlineIcon />, 
      path: '/create-listing',
      description: 'Create a meal listing (for sellers)',
      show: currentUser
    },
    { 
      text: 'Request Meal', 
      icon: <RestaurantIcon />, 
      path: '/request-meal',
      description: 'Request a meal'
    },
    { 
      text: 'My Orders', 
      icon: <PersonIcon />, 
      path: '/my-orders',
      description: 'View your orders and fulfillments'
    },
    { 
      text: 'Admin View', 
      icon: <AdminPanelSettingsIcon />, 
      path: '/admin',
      description: 'View registered sellers'
    }
  ];

  function getCurrentMealTime() {
    const hour = new Date().getHours();
    if (hour >= 7 && hour < 11) return 'breakfast';
    if (hour >= 11 && hour < 15) return 'lunch';
    return null;
  }

  const drawerContent = (
    <Box sx={{ width: 280 }}>
      <Box 
        sx={{ 
          p: 2.5, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(184, 134, 11, 0.1)',
        }}
      >
        <LogoText
          onClick={() => {
            navigate('/');
            handleDrawerToggle();
          }}
          sx={{ 
            fontSize: '1.4rem',
            cursor: 'pointer',
          }}
        >
          <RestaurantIcon sx={{ 
            color: '#DAA520',
            filter: 'drop-shadow(0 2px 4px rgba(184, 134, 11, 0.3))',
            fontSize: 24
          }} />
          SwipeShare
        </LogoText>
        <IconButton 
          onClick={handleDrawerToggle}
          sx={{ 
            color: '#B8860B',
            '&:hover': { 
              background: 'rgba(184, 134, 11, 0.08)' 
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Restaurant Selection */}
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(184, 134, 11, 0.1)' }}>
        {restaurantInfo.map((restaurant) => (
          <Button
            key={restaurant.name}
            fullWidth
            sx={{
              justifyContent: 'flex-start',
              py: 1.5,
              px: 2,
              mb: 1,
              borderRadius: 1,
              backgroundColor: selectedRestaurant.name === restaurant.name 
                ? 'rgba(184, 134, 11, 0.08)'
                : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(184, 134, 11, 0.12)'
              }
            }}
            onClick={() => setSelectedRestaurant(restaurant)}
          >
            <Box>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  color: selectedRestaurant.name === restaurant.name 
                    ? '#B8860B' 
                    : 'inherit',
                  fontWeight: selectedRestaurant.name === restaurant.name 
                    ? 600 
                    : 500
                }}
              >
                {restaurant.shortName || restaurant.name}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                {restaurant.location}
              </Typography>
            </Box>
          </Button>
        ))}
      </Box>

      {/* Current Hours */}
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(184, 134, 11, 0.1)' }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Current Hours
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box>
            <Typography 
              variant="body2" 
              sx={{ 
                color: currentMealTime === 'breakfast' ? '#B8860B' : 'text.secondary',
                fontWeight: currentMealTime === 'breakfast' ? 600 : 400
              }}
            >
              Breakfast: {selectedRestaurant.hours.breakfast}
            </Typography>
          </Box>
          <Box>
            <Typography 
              variant="body2" 
              sx={{ 
                color: currentMealTime === 'lunch' ? '#B8860B' : 'text.secondary',
                fontWeight: currentMealTime === 'lunch' ? 600 : 400
              }}
            >
              Lunch: {selectedRestaurant.hours.lunch}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Navigation Menu */}
      <List sx={{ pt: 1 }}>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => {
              navigate(item.path);
              handleDrawerToggle();
            }}
            sx={{
              my: 0.5,
              mx: 1,
              borderRadius: 1,
              bgcolor: location.pathname === item.path ? 'rgba(184, 134, 11, 0.08)' : 'transparent',
              '&:hover': {
                bgcolor: 'rgba(184, 134, 11, 0.12)',
              }
            }}
          >
            <ListItemIcon 
              sx={{ 
                color: location.pathname === item.path ? '#B8860B' : 'inherit',
                minWidth: 40
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text}
              secondary={item.description}
              sx={{
                '& .MuiTypography-root': {
                  color: location.pathname === item.path ? '#B8860B' : 'inherit',
                  fontWeight: location.pathname === item.path ? 600 : 500,
                  fontSize: '0.95rem'
                }
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <HideOnScroll>
        <StyledAppBar 
          position="fixed" 
          elevation={0}
          className={scrollTrigger ? 'scrolled' : ''}
        >
          <Container maxWidth="lg">
            <Toolbar sx={{ justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <MenuIconButton
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 2, display: { sm: 'none' } }}
                >
                  <MenuIcon />
                </MenuIconButton>
                <LogoText
                  onClick={() => navigate('/')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <RestaurantIcon sx={{ 
                    color: '#DAA520',
                    filter: 'drop-shadow(0 2px 4px rgba(184, 134, 11, 0.3))'
                  }} />
                  SwipeShare
                </LogoText>
              </Box>

              <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 3 }}>
                {currentUser && menuItems.map((item) => (
                  <Tooltip key={item.text} title={item.text} arrow>
                    <Button
                      component={motion.button}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate(item.path)}
                      sx={{
                        color: location.pathname === item.path ? '#B8860B' : '#1A1A1A',
                        fontWeight: location.pathname === item.path ? 600 : 500,
                        '&:hover': { color: '#B8860B' }
                      }}
                      startIcon={item.icon}
                    >
                      {item.text}
                    </Button>
                  </Tooltip>
                ))}
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {currentUser ? (
                  <>
                    <Tooltip title="Notifications" arrow>
                      <NavIconButton onClick={handleNotificationClick}>
                        <StyledBadge badgeContent={notifications.length} color="primary">
                          <NotificationsIcon />
                        </StyledBadge>
                      </NavIconButton>
                    </Tooltip>
                    <Tooltip title="Profile" arrow>
                      <NavIconButton onClick={handleMenu}>
                        <Avatar
                          src={currentUser.photoURL}
                          sx={{
                            width: 35,
                            height: 35,
                            border: '2px solid #B8860B',
                            transition: 'transform 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.1)',
                            }
                          }}
                        />
                      </NavIconButton>
                    </Tooltip>
                  </>
                ) : (
                  <Button
                    variant="contained"
                    onClick={() => navigate('/login')}
                    sx={{
                      background: 'linear-gradient(45deg, #B8860B, #DAA520)',
                      color: 'white',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #996515, #B8860B)',
                      }
                    }}
                  >
                    Login
                  </Button>
                )}
              </Box>
            </Toolbar>
          </Container>
        </StyledAppBar>
      </HideOnScroll>
      <Toolbar /> {/* Spacer */}

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box',
            width: 280,
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(10px)',
            borderRight: '1px solid rgba(184, 134, 11, 0.1)',
            boxShadow: '4px 0 20px rgba(0, 0, 0, 0.08)',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            mt: 1.5,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(184, 134, 11, 0.1)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          }
        }}
      >
        <MenuItem onClick={() => { navigate('/profile'); handleClose(); }}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={handleNotificationClose}
        PaperProps={{
          sx: {
            mt: 1.5,
            minWidth: 300,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(184, 134, 11, 0.1)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          }
        }}
      >
        {notifications.length === 0 ? (
          <MenuItem sx={{ color: 'text.secondary' }}>
            No new notifications
          </MenuItem>
        ) : (
          notifications.map((notification, index) => (
            <MenuItem key={index} onClick={handleNotificationClose}>
              {notification.message}
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
}

export default Navbar; 