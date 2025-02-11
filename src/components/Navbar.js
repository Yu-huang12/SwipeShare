import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Button, 
  Typography, 
  Box, 
  Avatar, 
  IconButton, 
  Menu, 
  MenuItem 
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const glow = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const NavButton = styled(Button)`
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(45deg, #6C63FF, #FF6584);
    transition: width 0.3s ease;
  }

  &:hover {
    transform: translateY(-2px);
    
    &::before {
      width: 100%;
    }
  }

  &.active {
    &::before {
      width: 100%;
    }
    background: rgba(108, 99, 255, 0.1);
  }
`;

const LogoText = styled(Typography)`
  background: linear-gradient(45deg, #6C63FF, #FF6584, #6C63FF);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${glow} 5s ease infinite;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const ProfileAvatar = styled(Avatar)`
  transition: all 0.3s ease;
  border: 2px solid transparent;
  background-clip: padding-box;

  &::before {
    content: '';
    position: absolute;
    top: -2px;
    right: -2px;
    bottom: -2px;
    left: -2px;
    background: linear-gradient(45deg, #6C63FF, #FF6584);
    border-radius: 50%;
    z-index: -1;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: scale(1.1);
    
    &::before {
      opacity: 1;
    }
  }
`;

const StyledMenu = styled(Menu)`
  .MuiPaper-root {
    background: rgba(19, 47, 76, 0.95);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.1);
    transform-origin: top right;
    animation: menuAnimation 0.2s ease;

    @keyframes menuAnimation {
      from {
        opacity: 0;
        transform: scale(0.95) translateY(-10px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }
  }
`;

const StyledMenuItem = styled(MenuItem)`
  transition: all 0.2s ease;
  position: relative;
  
  &:hover {
    background: rgba(108, 99, 255, 0.1);
    padding-left: 24px;
  }

  &::before {
    content: '';
    position: absolute;
    left: 0;
    width: 3px;
    height: 0;
    background: linear-gradient(45deg, #6C63FF, #FF6584);
    transition: height 0.2s ease;
  }

  &:hover::before {
    height: 100%;
  }
`;

function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <AppBar 
      position="static" 
      sx={{ 
        background: 'rgba(19, 47, 76, 0.4)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}
    >
      <Toolbar>
        <LogoText 
          variant="h6" 
          component="div" 
          sx={{ flexGrow: 1, fontWeight: 700 }}
          onClick={() => navigate('/')}
        >
          SwipeShare
        </LogoText>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {currentUser ? (
            <>
              <NavButton 
                color="inherit" 
                onClick={() => navigate('/create-order')}
                className={isActive('/create-order') ? 'active' : ''}
              >
                Create Order
              </NavButton>
              <NavButton 
                color="inherit" 
                onClick={() => navigate('/available-orders')}
                className={isActive('/available-orders') ? 'active' : ''}
              >
                Available Orders
              </NavButton>
              <NavButton 
                color="inherit" 
                onClick={() => navigate('/my-orders')}
                className={isActive('/my-orders') ? 'active' : ''}
              >
                My Orders
              </NavButton>
              <IconButton onClick={handleMenu} sx={{ p: 0 }}>
                <ProfileAvatar 
                  src={currentUser.photoURL} 
                  sx={{ width: 35, height: 35 }}
                />
              </IconButton>
              <StyledMenu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <StyledMenuItem onClick={() => {
                  navigate('/profile');
                  handleClose();
                }}>
                  Profile
                </StyledMenuItem>
                <StyledMenuItem onClick={handleLogout}>
                  Logout
                </StyledMenuItem>
              </StyledMenu>
            </>
          ) : (
            <NavButton 
              color="inherit" 
              onClick={() => navigate('/login')}
              variant="outlined"
              sx={{ 
                borderColor: 'rgba(108, 99, 255, 0.5)',
                '&:hover': { 
                  borderColor: '#6C63FF',
                  background: 'rgba(108, 99, 255, 0.1)' 
                }
              }}
            >
              Login
            </NavButton>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar; 