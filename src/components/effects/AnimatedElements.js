import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { Card, Button, Box } from '@mui/material';

export const AnimatedCard = styled(motion(Card))`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(184, 134, 11, 0.1);
  overflow: hidden;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #B8860B, #DAA520, #FFD700);
    transform: scaleX(0);
    transform-origin: 0 0;
    transition: transform 0.3s ease;
  }

  &:hover::before {
    transform: scaleX(1);
  }
`;

export const ShimmerButton = styled(motion(Button))`
  position: relative;
  overflow: hidden;
  background: linear-gradient(45deg, #B8860B, #DAA520);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      120deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    animation: shimmer 2s infinite;
  }

  @keyframes shimmer {
    100% {
      left: 100%;
    }
  }
`;

export const ScrollReveal = styled(motion(Box))`
  width: 100%;
`;

// Animation variants
export const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      duration: 0.4
    }
  },
  hover: {
    y: -10,
    boxShadow: "0 20px 25px -5px rgba(184, 134, 11, 0.1), 0 10px 10px -5px rgba(184, 134, 11, 0.04)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  },
  tap: {
    scale: 0.98,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  }
};

export const buttonVariants = {
  hover: {
    scale: 1.05,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  },
  tap: {
    scale: 0.95
  }
};

export const scrollRevealVariants = {
  hidden: { 
    opacity: 0,
    y: 50
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.6, -0.05, 0.01, 0.99]
    }
  }
}; 