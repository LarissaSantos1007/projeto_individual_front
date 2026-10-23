import React from 'react';
import { Typography, TypographyProps } from '@mui/material';

interface GradientTextProps extends TypographyProps {
  children: React.ReactNode;
  gradient?: string;
}

const GradientText: React.FC<GradientTextProps> = ({ 
  children, 
  gradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  ...props 
}) => {
  return (
    <Typography
      {...props}
      sx={{
        ...props.sx,
        background: gradient,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        display: 'inline-block'
      }}
    >
      {children}
    </Typography>
  );
};

export default GradientText;