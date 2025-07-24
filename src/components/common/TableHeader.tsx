import React from 'react';
import { 
  TableCell, 
  TableSortLabel, 
  Box, 
  IconButton 
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';

export interface SortConfig {
  column: string | null;
  direction: 'asc' | 'desc' | null;
}

interface TableHeaderProps {
  label: string;
  column: string;
  sortConfig: SortConfig;
  onSort: (column: string) => void;
  onFilter?: (event: React.MouseEvent<HTMLElement>, column: string) => void;
}

/**
 * Reusable table header component with sort and filter functionality
 */
const TableHeader: React.FC<TableHeaderProps> = ({
  label,
  column,
  sortConfig,
  onSort,
  onFilter
}) => {
  const isSorted = sortConfig.column === column;
  
  return (
    <TableCell 
      sx={{ 
        backgroundColor: '#1e293b', 
        color: 'white', 
        fontWeight: 600, 
        fontSize: '0.85rem', 
        py: 1.5,
        cursor: 'pointer'
      }}
      onClick={() => onSort(column)}
    >
      {label}
      {isSorted && (
        <Box component="span" sx={{ pl: 0.5, display: 'inline-block' }}>
          {sortConfig.direction === 'asc' ? '▲' : '▼'}
        </Box>
      )}
      {onFilter && (
        <IconButton 
          size="small" 
          sx={{ ml: 1, p: 0, color: 'white' }}
          onClick={(e) => {
            e.stopPropagation();
            onFilter(e, column);
          }}
        >
          <FilterListIcon sx={{ fontSize: '0.9rem' }} />
        </IconButton>
      )}
    </TableCell>
  );
};

export default TableHeader;
