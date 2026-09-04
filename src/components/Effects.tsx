import React from 'react';
import { Box } from '@mui/material';

export const ParticleBackground = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)'
      }}
    >
      {/* Ondas Animadas */}
      <Box
        sx={{
          position: 'absolute',
          bottom: '-10px',
          left: 0,
          width: '200%',
          height: '350px',
          background: 'rgba(102, 126, 234, 0.12)',
          borderRadius: '50% 50% 0 0',
          animation: 'wave1 10s ease-in-out infinite',
          transform: 'translateX(-25%)',
          '@keyframes wave1': {
            '0%, 100%': { transform: 'translateX(-25%) scaleY(1)' },
            '50%': { transform: 'translateX(0%) scaleY(1.5)' }
          }
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '-10px',
          left: 0,
          width: '200%',
          height: '280px',
          background: 'rgba(118, 75, 162, 0.10)',
          borderRadius: '50% 50% 0 0',
          animation: 'wave2 12s ease-in-out infinite',
          transform: 'translateX(-15%)',
          '@keyframes wave2': {
            '0%, 100%': { transform: 'translateX(-15%) scaleY(1)' },
            '50%': { transform: 'translateX(-35%) scaleY(1.4)' }
          }
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '-10px',
          left: 0,
          width: '200%',
          height: '200px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '50% 50% 0 0',
          animation: 'wave3 14s ease-in-out infinite',
          transform: 'translateX(-30%)',
          '@keyframes wave3': {
            '0%, 100%': { transform: 'translateX(-30%) scaleY(1)' },
            '50%': { transform: 'translateX(15%) scaleY(1.6)' }
          }
        }}
      />

      {/* Estrelas/Partículas */}
      {[...Array(30)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            width: `${Math.random() * 4 + 2}px`,
            height: `${Math.random() * 4 + 2}px`,
            borderRadius: '50%',
            background: `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.3})`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `twinkle ${Math.random() * 5 + 3}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
            '@keyframes twinkle': {
              '0%, 100%': { opacity: 0.2, transform: 'scale(1)' },
              '50%': { opacity: 1, transform: 'scale(1.5)' }
            }
          }}
        />
      ))}

      {/* Círculos Flutuantes */}
      {[...Array(6)].map((_, i) => (
        <Box
          key={`circle-${i}`}
          sx={{
            position: 'absolute',
            width: `${Math.random() * 200 + 50}px`,
            height: `${Math.random() * 200 + 50}px`,
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(102, 126, 234, ${Math.random() * 0.05 + 0.02}) 0%, transparent 70%)`,
            top: `${Math.random() * 80 + 10}%`,
            left: `${Math.random() * 80 + 10}%`,
            animation: `floatCircle ${Math.random() * 15 + 10}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
            '@keyframes floatCircle': {
              '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
              '25%': { transform: `translate(${Math.random() * 50 - 25}px, ${Math.random() * 30 - 15}px) scale(1.1)` },
              '50%': { transform: `translate(${Math.random() * 30 - 15}px, ${Math.random() * 50 - 25}px) scale(0.9)` },
              '75%': { transform: `translate(${Math.random() * 40 - 20}px, ${Math.random() * 20 - 10}px) scale(1.05)` }
            }
          }}
        />
      ))}
    </Box>
  );
};

// Componente Glassmorphism Card
export const GlassCard = ({ children, ...props }: any) => {
  return (
    <Box
      sx={{
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(20px)',
        borderRadius: 4,
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        '&:hover': {
          transform: 'translateY(-8px) scale(1.02)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          borderColor: 'rgba(255, 255, 255, 0.2)'
        },
        ...props.sx
      }}
      {...props}
    >
      {children}
    </Box>
  );
};