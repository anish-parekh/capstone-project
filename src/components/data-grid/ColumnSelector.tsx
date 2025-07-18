import React from 'react';
import { 
  Box, 
  Popover, 
  Typography, 
  FormGroup, 
  FormControlLabel, 
  Checkbox, 
  Divider, 
  IconButton, 
  Tooltip 
} from '@mui/material';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import { SecondaryButton } from '../common/EnhancedUIStyles';
import type { Column } from '../../types';

interface ColumnSelectorProps {
  columns: Column[];
  visibleColumns: string[];
  onColumnToggle: (columnId: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
}

const ColumnSelector: React.FC<ColumnSelectorProps> = ({
  columns,
  visibleColumns,
  onColumnToggle,
  onSelectAll,
  onClearAll
}) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handleColumnSelectorClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleColumnSelectorClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Tooltip title="Select columns to display" arrow placement="left">
        <IconButton 
          onClick={handleColumnSelectorClick} 
          size="small"
          sx={{ 
            backgroundColor: 'rgba(100, 116, 139, 0.08)',
            '&:hover': {
              backgroundColor: 'rgba(100, 116, 139, 0.16)'
            },
            transition: 'all 0.2s ease'
          }}
        >
          <ViewColumnIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleColumnSelectorClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          elevation: 3,
          sx: { borderRadius: 2 }
        }}
      >
        <Box sx={{ p: 3, maxHeight: 400, overflowY: 'auto', width: 280 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1e293b' }}>
            Column Display
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <SecondaryButton size="small" onClick={onSelectAll} sx={{ px: 2 }}>
              Select All
            </SecondaryButton>
            <SecondaryButton size="small" onClick={onClearAll} sx={{ px: 2 }}>
              Clear All
            </SecondaryButton>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <FormGroup>
            {columns.map((column) => (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={visibleColumns.includes(column.id)}
                    onChange={() => onColumnToggle(column.id)}
                    size="small"
                    sx={{
                      color: '#64748b',
                      '&.Mui-checked': {
                        color: '#1e293b',
                      },
                    }}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ color: '#334155' }}>
                    {column.label}
                  </Typography>
                }
                key={column.id}
                sx={{ mb: 0.5 }}
              />
            ))}
          </FormGroup>
        </Box>
      </Popover>
    </>
  );
};

export default ColumnSelector;
