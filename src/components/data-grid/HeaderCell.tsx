import React from 'react';
import { Box, TableCell } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import type { Column, ColumnFilter } from '../../types';
import { FilterIcon } from './FilterComponents';

interface HeaderCellProps {
  column: Column;
  isSorted: boolean;
  sortDirection: 'asc' | 'desc' | null;
  onSort: (columnId: string) => void;
  filter: ColumnFilter | undefined;
  onFilterClick: (event: React.MouseEvent<HTMLElement>, columnId: string) => void;
  onFilterClear: (columnId: string) => void;
  columnWidth: number;
  isResizing: boolean;
  onResizeStart: (e: React.MouseEvent<HTMLDivElement>, columnId: string, currentWidth: number) => void;
}

const HeaderCell: React.FC<HeaderCellProps> = ({
  column,
  isSorted,
  sortDirection,
  onSort,
  filter,
  onFilterClick,
  onFilterClear,
  columnWidth,
  isResizing,
  onResizeStart
}) => {
  // Get sort icon based on sort direction
  const getSortIcon = () => {
    if (!isSorted || sortDirection === null) return null;
    
    return sortDirection === 'asc' 
      ? <ArrowUpwardIcon fontSize="small" sx={{ ml: 0.5, fontSize: '0.85rem' }} /> 
      : <ArrowDownwardIcon fontSize="small" sx={{ ml: 0.5, fontSize: '0.85rem' }} />;
  };

  return (
    <TableCell 
      key={column.id} 
      align="left" // Always left-align header cells
      sx={{ 
        backgroundColor: isResizing ? '#334155' : '#1e293b', 
        color: '#ffffff', 
        fontWeight: 600,
        borderBottom: 'none',
        py: 1.5,
        cursor: isResizing ? 'col-resize' : 'pointer',
        userSelect: 'none',
        transition: isResizing ? 'none' : 'background-color 0.2s',
        position: 'sticky',
        top: 0,
        pr: 8, // Increased padding to the right to accommodate the filter icon
        width: `${columnWidth}px`,
        maxWidth: `${columnWidth}px`,
        minWidth: `${columnWidth}px`,
        boxShadow: isResizing ? '0 0 0 2px #3b82f6' : 'none',
        zIndex: isResizing ? 10 : 4,
        '&:hover': {
          backgroundColor: '#334155',
          '& .resize-handle': {
            opacity: 1,
          }
        }
      }}
    >
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'flex-start', // Always left-align header text
          cursor: 'pointer',
          width: 'auto',
          minWidth: 'calc(100% - 40px)', // Leave space for filter icon
          '&:hover': {
            opacity: 0.8
          }
        }}
        onClick={() => onSort(column.id)}
      >
        <Box 
          component="span" 
          sx={{ 
            display: 'inline-block',
            color: isSorted ? '#ffffff' : 'inherit',
            fontWeight: isSorted ? 700 : 600,
            width: 'auto',
            whiteSpace: 'nowrap',
            verticalAlign: 'middle',
          }}
        >
          {column.label}
        </Box>
        <Box sx={{ display: 'inline-flex', ml: 1, verticalAlign: 'middle' }}>
          {getSortIcon()}
        </Box>
      </Box>
      
      {/* Resize handle */}
      <Box 
        className="resize-handle"
        sx={{ 
          position: 'absolute',
          top: 0,
          right: 0,
          width: '5px',
          height: '100%',
          cursor: 'col-resize',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          opacity: 0,
          transition: 'opacity 0.2s',
          zIndex: 3,
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.4)',
          },
          '&:active': {
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
            opacity: 1,
          }
        }}
        onMouseDown={(e) => onResizeStart(e, column.id, columnWidth)}
        onClick={(e) => e.stopPropagation()} // Prevent sorting when resizing
      />
      
      <Box sx={{ 
        position: 'absolute', 
        top: '50%', 
        right: 8, 
        transform: 'translateY(-50%)',
        display: 'flex',
        alignItems: 'center',
        zIndex: 2, // Ensure icons are above text
        backgroundColor: 'rgba(30, 41, 59, 0.8)', // Semi-transparent background
        borderRadius: '4px',
        padding: '2px',
      }}>
        <FilterIcon 
          columnId={column.id}
          hasFilter={!!filter}
          filterValue={filter?.value}
          onClick={onFilterClick}
          onClear={onFilterClear}
        />
      </Box>
    </TableCell>
  );
};

export default HeaderCell;
