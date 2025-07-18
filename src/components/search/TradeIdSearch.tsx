import React from 'react';
import { Box, MenuItem, InputAdornment, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import { PrimaryButton, SecondaryButton, EnhancedTextField, EnhancedSelect } from '../common';

interface TradeIdSearchProps {
  sourceSystem: string;
  tradeId: string;
  onSourceSystemChange: (value: string) => void;
  onTradeIdChange: (value: string) => void;
  onSearch: () => void;
  onClear: () => void;
}

const TradeIdSearch: React.FC<TradeIdSearchProps> = ({
  sourceSystem,
  tradeId,
  onSourceSystemChange,
  onTradeIdChange,
  onSearch,
  onClear
}) => {
  return (
    <Box sx={{ bgcolor: '#ffffff' }}>
      <Box sx={{ p: 2 }}>
        <Typography sx={{ fontSize: '1rem', fontWeight: 500, mb: 2 }}>Trade ID Search</Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <Box>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, mb: 0.5, color: '#555' }}>Source System</Typography>
              <EnhancedSelect
                value={sourceSystem}
                onChange={(e) => onSourceSystemChange(e.target.value as string)}
                displayEmpty
                fullWidth
                size="small"
                sx={{ 
                  height: '32px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ccc',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#999',
                  },
                  '& .MuiSelect-select': {
                    padding: '4px 14px',
                    fontSize: '0.875rem',
                  }
                }}
              >
                <MenuItem value="">
                  <em>Select System</em>
                </MenuItem>
                <MenuItem value="System A">System A</MenuItem>
                <MenuItem value="System B">System B</MenuItem>
                <MenuItem value="System C">System C</MenuItem>
              </EnhancedSelect>
            </Box>
            
            <Box>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, mb: 0.5, color: '#555' }}>Trade ID</Typography>
              <EnhancedTextField
                placeholder="Enter Trade ID"
                value={tradeId}
                onChange={(e) => onTradeIdChange(e.target.value)}
                fullWidth
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: '32px',
                    fontSize: '0.875rem',
                    '& fieldset': {
                      borderColor: '#ccc',
                    },
                    '&:hover fieldset': {
                      borderColor: '#999',
                    },
                  },
                  '& .MuiOutlinedInput-input': {
                    padding: '4px 14px',
                  }
                }}
              />
            </Box>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
          <SecondaryButton
            onClick={onClear}
            size="small"
            sx={{ 
              textTransform: 'none', 
              fontWeight: 400,
              fontSize: '0.75rem',
              padding: '4px 10px',
              color: '#333',
              borderColor: '#ccc',
              backgroundColor: '#f8f8f8',
              '&:hover': {
                backgroundColor: '#f0f0f0',
                borderColor: '#bbb',
              }
            }}
          >
            Reset
          </SecondaryButton>
          <PrimaryButton
            onClick={onSearch}
            disabled={!tradeId.trim()}
            size="small"
            startIcon={<SearchIcon sx={{ fontSize: '0.875rem', color: '#fff' }} />}
            sx={{ 
              textTransform: 'none', 
              fontWeight: 400,
              fontSize: '0.75rem',
              padding: '4px 10px',
              backgroundColor: '#333',
              color: '#ffffff',
              '&:hover': {
                backgroundColor: '#444',
              },
              '&.Mui-disabled': {
                backgroundColor: '#999',
                color: '#e0e0e0',
                opacity: 0.7,
              }
            }}
          >
            Search
          </PrimaryButton>
        </Box>
      </Box>
    </Box>
  );
};

export default TradeIdSearch;
