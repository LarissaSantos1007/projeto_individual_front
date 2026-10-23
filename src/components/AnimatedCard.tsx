import React from 'react';
import { Paper, SxProps, Theme } from '@mui/material';

interface AnimatedCardProps {
  children: React.ReactNode;
  sx?: SxProps<Theme>;
  delay?: number;
  onClick?: () => void;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({ 
  children, 
  sx = {}, 
  delay = 0,
  onClick
}) => {
  return (
    <Paper
      elevation={0}
      onClick={onClick}
      sx={{
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 4,
        padding: 3,
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        animation: `fadeInUp 0.6s ease-out ${delay}s both`,
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick ? {
          transform: 'translateY(-8px) scale(1.02)',
          boxShadow: '0 20px 60px rgba(102, 126, 234, 0.2)',
          borderColor: 'rgba(102, 126, 234, 0.2)'
        } : {},
        ...sx
      }}
    >
      {children}
    </Paper>
  );
};

export default AnimatedCard;