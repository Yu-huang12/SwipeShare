import styled from '@emotion/styled';
import { Card } from '@mui/material';
import { fadeIn, ripple } from './animations';

export const AnimatedCard = styled(Card)`
  animation: ${fadeIn} 0.3s ease-out;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(45deg, rgba(108, 99, 255, 0.1), rgba(255, 101, 132, 0.1));
      animation: ${ripple} 1s infinite;
    }
  }

  &:active {
    transform: translateY(-2px);
  }
`; 