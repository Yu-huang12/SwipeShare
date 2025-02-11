import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

const pulse = keyframes`
  0% { opacity: 0.6; }
  50% { opacity: 0.8; }
  100% { opacity: 0.6; }
`;

const LoadingContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

function LoadingAnimation({ message = 'Loading...' }) {
  return (
    <LoadingContainer>
      <CircularProgress
        sx={{
          color: 'primary.main',
          mb: 2
        }}
      />
      <Typography color="text.secondary" variant="body1">
        {message}
      </Typography>
    </LoadingContainer>
  );
}

export default LoadingAnimation; 