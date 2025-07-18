import React from 'react';
import { 
  Box, 
  Popover, 
  Typography, 
  TextField, 
  InputAdornment, 
  IconButton, 
  Tooltip,
  Badge
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import ClearIcon from '@mui/icons-material/Clear';
import { PrimaryButton, SecondaryButton } from '../common/EnhancedUIStyles';
import type { ColumnFilter, Column } from '../../types';

interface FilterPopoverProps {
  anchorEl: HTMLElement | null;
  currentFilterColumn: string;
  filterValue: string;
  onFilterClose: () => void;
  onFilterValueChange: (value: string) => void;
  onFilterApply: (value: string) => void;
  columns: Column[];
}

export const FilterPopover: React.FC<FilterPopoverProps> = ({
  anchorEl,
  currentFilterColumn,
  filterValue,
  onFilterClose,
  onFilterValueChange,
  onFilterApply,
  columns
}) => {
  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onFilterClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      PaperProps={{
        elevation: 3,
        sx: { borderRadius: 2 }
      }}
    >
      <Box sx={{ p: 3, width: 300 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1e293b' }}>
          Filter {columns.find(col => col.id === currentFilterColumn)?.label}
        </Typography>
        
        <TextField
          fullWidth
          size="small"
          placeholder="Enter filter value"
          value={filterValue}
          onChange={(e) => onFilterValueChange(e.target.value)}
          sx={{ mb: 2 }}
          autoFocus
          InputProps={{
            endAdornment: filterValue ? (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => onFilterValueChange('')}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ) : null
          }}
        />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <SecondaryButton 
            size="small" 
            onClick={onFilterClose}
          >
            Cancel
          </SecondaryButton>
          
          <PrimaryButton 
            size="small" 
            onClick={() => {
              onFilterApply(filterValue);
              onFilterClose();
            }}
            startIcon={<FilterListIcon />}
          >
            Apply Filter
          </PrimaryButton>
        </Box>
      </Box>
    </Popover>
  );
};

interface FilterIconProps {
  columnId: string;
  hasFilter: boolean;
  filterValue?: string;
  onClick: (event: React.MouseEvent<HTMLElement>, columnId: string) => void;
  onClear?: (columnId: string) => void;
}

export const FilterIcon: React.FC<FilterIconProps> = ({
  columnId,
  hasFilter,
  filterValue,
  onClick,
  onClear
}) => {
  return (
    <>
      {hasFilter ? (
        <Tooltip title={`Filter: ${filterValue}`} arrow>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton 
              size="small" 
              onClick={(e) => {
                e.stopPropagation();
                if (onClear) onClear(columnId);
              }}
              sx={{ 
                color: '#ef4444', 
                p: 0.5,
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
              }}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
            <Badge 
              color="primary" 
              variant="dot"
              sx={{ '& .MuiBadge-badge': { backgroundColor: '#10b981' } }}
            >
              <IconButton 
                size="small" 
                onClick={(e) => {
                  e.stopPropagation();
                  onClick(e, columnId);
                }}
                sx={{ 
                  color: '#10b981', 
                  p: 0.5,
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                }}
              >
                <FilterListIcon fontSize="small" />
              </IconButton>
            </Badge>
          </Box>
        </Tooltip>
      ) : (
        <Tooltip title={`Filter column`} arrow>
          <IconButton 
            size="small" 
            onClick={(e) => {
              e.stopPropagation();
              onClick(e, columnId);
            }}
            sx={{ 
              color: 'rgba(255, 255, 255, 0.5)', 
              p: 0.5,
              '&:hover': { 
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'rgba(255, 255, 255, 0.8)'
              }
            }}
          >
            <FilterListIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </>
  );
};

interface ClearAllFiltersProps {
  filterCount: number;
  onClearAll: () => void;
}

export const ClearAllFilters: React.FC<ClearAllFiltersProps> = ({ filterCount, onClearAll }) => {
  if (filterCount === 0) return null;
  
  return (
    <Tooltip title="Clear all filters" arrow>
      <IconButton 
        size="small" 
        onClick={onClearAll}
        sx={{ 
          ml: 1,
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.2)' },
        }}
      >
        <FilterAltOffIcon fontSize="small" sx={{ color: '#ef4444' }} />
      </IconButton>
    </Tooltip>
  );
};
