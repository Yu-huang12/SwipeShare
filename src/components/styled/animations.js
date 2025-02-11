import { keyframes } from '@emotion/react';

export const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const scaleIn = keyframes`
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
`;

export const slideIn = keyframes`
  from {
    transform: translateX(-20px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

export const ripple = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.4;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.2;
  }
  100% {
    transform: scale(1);
    opacity: 0.4;
  }
`; 