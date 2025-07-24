import React from 'react';
import { Box } from '@mui/material';
import type { BoxProps } from '@mui/material';

interface ScrollableContainerProps extends BoxProps {
  maxHeight?: string | number;
}

/**
 * A reusable component that provides consistent scrollable container styling
 * with custom scrollbars across the application
 */
const ScrollableContainer: React.FC<ScrollableContainerProps> = ({ 
  children, 
  maxHeight = '400px',
  ...boxProps 
}) => {
  return (
    <Box
      {...boxProps}
      sx={{
        border: '1px solid #ddd',
        borderRadius: '4px',
        overflow: 'auto',
        maxHeight,
        '&::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#94a3b8',
          borderRadius: '8px',
          '&:hover': {
            backgroundColor: '#64748b'
          }
        },
        '&::-webkit-scrollbar-track': {
          borderRadius: '8px',
          backgroundColor: '#f1f5f9'
        },
        ...(boxProps.sx || {})
      }}
    >
      {children}
    </Box>
  );
};

export default ScrollableContainer;
