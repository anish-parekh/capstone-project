import React from 'react';
import { Box, Typography, IconButton, Select, MenuItem, FormControl } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import type { SelectChangeEvent } from '@mui/material';

interface DataTablePaginationProps {
  page: number;
  rowsPerPage: number;
  totalRows: number;
  rowsPerPageOptions?: number[];
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newRowsPerPage: number) => void;
}

/**
 * Reusable pagination component for data tables
 */
const DataTablePagination: React.FC<DataTablePaginationProps> = ({
  page,
  rowsPerPage,
  totalRows,
  rowsPerPageOptions = [10, 25, 50, 100],
  onPageChange,
  onRowsPerPageChange
}) => {
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  
  const handleRowsPerPageChange = (event: SelectChangeEvent<number>) => {
    const newRowsPerPage = Number(event.target.value);
    onRowsPerPageChange(newRowsPerPage);
    // Reset to first page when changing rows per page
    onPageChange(0);
  };

  const displayRange = {
    from: totalRows === 0 ? 0 : page * rowsPerPage + 1,
    to: Math.min(totalRows, (page + 1) * rowsPerPage)
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      py: 1,
      px: 2,
      borderTop: '1px solid #e0e0e0',
      backgroundColor: '#fafafa'
    }}>
      {/* Rows per page dropdown */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
          Rows per page:
        </Typography>
        <FormControl size="small" sx={{ minWidth: 80 }}>
          <Select
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            size="small"
            sx={{ height: 32 }}
          >
            {rowsPerPageOptions.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Page navigation */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          {displayRange.from}-{displayRange.to} of {totalRows}
        </Typography>
        
        <IconButton 
          size="small" 
          onClick={() => onPageChange(page - 1)}
          disabled={page === 0}
          sx={{ ml: 1 }}
        >
          <ChevronLeftIcon fontSize="small" />
        </IconButton>
        
        <IconButton 
          size="small" 
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages - 1}
        >
          <ChevronRightIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default DataTablePagination;
