import React from 'react';
import { Box, Container } from '@mui/material';
import WaveBackground from './WaveBackground';

interface PageWrapperProps {
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  sx?: any;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ 
  children, 
  maxWidth = 'xl',
  sx = {}
}) => {
  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      <WaveBackground />
      <Box sx={{ position: 'relative', zIndex: 1, py: 4 }}>
        <Container maxWidth={maxWidth} sx={sx}>
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default PageWrapper;