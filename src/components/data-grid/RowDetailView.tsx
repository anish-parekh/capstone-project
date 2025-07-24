import React from 'react';
import { Box, Typography } from '@mui/material';
import type { TradeRow } from '../../types';

interface RowDetailViewProps {
  data: TradeRow | null;
}

/**
 * Component for displaying detailed information about a row
 * in a clean, organized format
 */
const RowDetailView: React.FC<RowDetailViewProps> = ({ data }) => {
  if (!data) {
    return (
      <Typography variant="body1" color="text.secondary" align="center">
        No data to display
      </Typography>
    );
  }

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 3 }}>
      {Object.entries(data || {}).map(([key, value]) => 
        // Skip the id key which is just for internal use
        key !== 'id' ? (
          <Box key={key} sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5, textTransform: 'capitalize' }}>
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {value?.toString() || '—'}
            </Typography>
          </Box>
        ) : null
      )}
    </Box>
  );
};

export default RowDetailView;
