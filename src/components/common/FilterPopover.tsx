import React, { useState } from 'react';
import { 
  Popover, 
  Box, 
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Typography
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

interface FilterPopoverProps {
  anchorEl: HTMLElement | null;
  column: string;
  initialValue: string;
  onClose: () => void;
  onApply: (value: string) => void;
  onClear?: () => void;
  title?: string;
}

/**
 * Reusable filter popover component for tables
 */
const FilterPopover: React.FC<FilterPopoverProps> = ({
  anchorEl,
  column,
  initialValue,
  onClose,
  onApply,
  onClear,
  title
}) => {
  const [filterValue, setFilterValue] = useState(initialValue);
  const open = Boolean(anchorEl);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onApply(filterValue);
      onClose();
    }
  };
  
  const handleClear = () => {
    setFilterValue('');
    if (onClear) onClear();
    onClose();
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      sx={{
        '& .MuiPopover-paper': {
          width: 300,
          p: 2,
        }
      }}
    >
      <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
        {title || `Filter by ${column}`}
      </Typography>
      
      <TextField
        fullWidth
        variant="outlined"
        size="small"
        value={filterValue}
        onChange={(e) => setFilterValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter filter value..."
        autoFocus
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
          endAdornment: filterValue ? (
            <InputAdornment position="end">
              <IconButton
                aria-label="clear filter"
                onClick={() => setFilterValue('')}
                edge="end"
                size="small"
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : null,
        }}
      />
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
        <Button
          onClick={handleClear}
          variant="outlined"
          size="small"
          color="secondary"
        >
          Clear
        </Button>
        <Button
          onClick={() => {
            onApply(filterValue);
            onClose();
          }}
          variant="contained"
          size="small"
          color="primary"
        >
          Apply
        </Button>
      </Box>
    </Popover>
  );
};

export default FilterPopover;
