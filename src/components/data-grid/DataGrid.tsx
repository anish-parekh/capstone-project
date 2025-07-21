import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Table, 
  TableHead, 
  TableBody, 
  TableRow, 
  TableCell, 
  Typography
} from '@mui/material';
import { EnhancedPaper } from '../common';
import type { Column, ColumnFilter, ColumnWidth, SortConfig, TradeRow } from '../../types';
import { calculateColumnWidth } from '../../utils/dataUtils';
import ColumnSelector from './ColumnSelector';
import HeaderCell from './HeaderCell';
import DataRow from './DataRow';
import { FilterPopover, ClearAllFilters } from './FilterComponents';

interface DataGridProps {
  data: TradeRow[];
  columns: Column[];
}

const DataGrid: React.FC<DataGridProps> = ({ data, columns }) => {
  // Column visibility state
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    columns.map(column => column.id)
  );

  // Sorting state
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: null
  });

  // Filtering state
  const [filters, setFilters] = useState<ColumnFilter[]>([]);
  const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLElement | null>(null);
  const [currentFilterColumn, setCurrentFilterColumn] = useState<string>('');
  const [filterValue, setFilterValue] = useState('');

  // Column resize state
  const [columnWidths, setColumnWidths] = useState<ColumnWidth[]>(
    columns.map(column => ({ 
      id: column.id, 
      width: calculateColumnWidth(column.label)
    }))
  );

  // Initialize global variables if needed
  useEffect(() => {
    window.resizingColumnId = null;
    window.startX = null;
    window.startWidth = null;
    window.columnWidths = {};
  }, []);

  // Cleanup effect to remove event listeners when component unmounts
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
    };
  }, []);

  // Column visibility handlers
  const handleColumnToggle = (columnId: string) => {
    setVisibleColumns(prevColumns => {
      if (prevColumns.includes(columnId)) {
        return prevColumns.filter(id => id !== columnId);
      } else {
        return [...prevColumns, columnId];
      }
    });
  };

  const selectAllColumns = () => {
    setVisibleColumns(columns.map(column => column.id));
  };

  const clearAllColumns = () => {
    setVisibleColumns([]);
  };

  // Sorting handlers
  const handleSort = (columnId: string) => {
    setSortConfig(prevConfig => {
      if (prevConfig.key === columnId) {
        // Cycle through: ascending -> descending -> no sort
        if (prevConfig.direction === 'asc') {
          return { key: columnId, direction: 'desc' };
        } else if (prevConfig.direction === 'desc') {
          return { key: null, direction: null };
        } else {
          return { key: columnId, direction: 'asc' };
        }
      } else {
        // New column, start with ascending
        return { key: columnId, direction: 'asc' };
      }
    });
  };

  // Filtering handlers
  const handleFilterClick = (event: React.MouseEvent<HTMLElement>, columnId: string) => {
    setFilterAnchorEl(event.currentTarget);
    setCurrentFilterColumn(columnId);
    
    // Set initial filter value if there's an existing filter
    const existingFilter = filters.find(filter => filter.id === columnId);
    if (existingFilter) {
      setFilterValue(existingFilter.value);
    } else {
      setFilterValue('');
    }
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleFilterApply = (value: string) => {
    if (value.trim() === '') {
      // Remove filter if value is empty
      setFilters(prevFilters => prevFilters.filter(filter => filter.id !== currentFilterColumn));
    } else {
      // Update existing filter or add new one
      setFilters(prevFilters => {
        const newFilters = prevFilters.filter(filter => filter.id !== currentFilterColumn);
        return [...newFilters, { id: currentFilterColumn, value: value.trim() }];
      });
    }
  };

  const handleFilterClear = (columnId: string) => {
    setFilters(prevFilters => prevFilters.filter(filter => filter.id !== columnId));
  };

  const handleClearAllFilters = () => {
    setFilters([]);
  };

  // Column resize handlers
  const handleResizeStart = (e: React.MouseEvent<HTMLDivElement>, columnId: string, currentWidth: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Store values in global variables for access in event handlers
    window.resizingColumnId = columnId;
    window.startX = e.clientX;
    window.startWidth = currentWidth;
    window.setColumnWidths = (id: string, width: number) => {
      setColumnWidths(prevWidths => 
        prevWidths.map(col => col.id === id ? { ...col, width } : col)
      );
    };
    window.forceUpdate = () => {}; // Empty function as placeholder
    
    // Add event listeners for mousemove and mouseup
    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
  };

  const handleResizeMove = (e: MouseEvent) => {
    if (!window.resizingColumnId || !window.startX || !window.startWidth) return;
    
    const diff = e.clientX - window.startX;
    const newWidth = Math.max(100, window.startWidth + diff); // Minimum width of 100px
    
    // Store the current width in a global variable for immediate access
    if (!window.columnWidths) window.columnWidths = {};
    window.columnWidths[window.resizingColumnId] = newWidth;
    
    // Update the state
    window.setColumnWidths(window.resizingColumnId, newWidth);
    
    // Force re-render
    if (window.forceUpdate) window.forceUpdate();
  };

  const handleResizeEnd = () => {
    window.resizingColumnId = null;
    window.startX = null;
    window.startWidth = null;
    
    // Remove event listeners
    document.removeEventListener('mousemove', handleResizeMove);
    document.removeEventListener('mouseup', handleResizeEnd);
    
    // Force re-render one last time
    if (window.forceUpdate) window.forceUpdate();
  };

  // Get column width
  const getColumnWidth = (columnId: string): number => {
    const column = columnWidths.find(col => col.id === columnId);
    return column ? column.width : 150; // Default width
  };

  // Get filtered and sorted data
  const getProcessedData = () => {
    // First apply filters
    let filteredData = [...data];
    
    if (filters.length > 0) {
      filteredData = filteredData.filter(row => {
        // Item passes if it matches all active filters
        return filters.every(filter => {
          const cellValue = row[filter.id as keyof typeof row];
          
          // Handle different data types
          if (cellValue === null || cellValue === undefined) {
            return false;
          }
          
          const stringValue = String(cellValue).toLowerCase();
          const filterValue = filter.value.toLowerCase();
          
          return stringValue.includes(filterValue);
        });
      });
    }
    
    // Then apply sorting
    if (sortConfig.key && sortConfig.direction) {
      filteredData.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof typeof a];
        const bValue = b[sortConfig.key as keyof typeof b];
        
        // Handle different data types
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
        } else {
          const aString = String(aValue).toLowerCase();
          const bString = String(bValue).toLowerCase();
          
          if (sortConfig.direction === 'asc') {
            return aString.localeCompare(bString);
          } else {
            return bString.localeCompare(aString);
          }
        }
      });
    }
    
    return filteredData;
  };

  // Get active filter for a column
  const getColumnFilter = (columnId: string) => {
    return filters.find(filter => filter.id === columnId);
  };

  // Check if a column is being sorted
  const isSortedColumn = (columnId: string) => {
    return sortConfig.key === columnId && sortConfig.direction !== null;
  };

  // Get visible column configurations
  const visibleColumnConfigs = columns.filter(col => visibleColumns.includes(col.id));
  
  // Get processed data (filtered and sorted)
  const processedData = getProcessedData();
  
  // Count active filters
  const activeFilterCount = filters.length;

  return (
    <EnhancedPaper sx={{ width: '100%', mb: 2, overflow: 'hidden' }}>
      {/* Table controls */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        p: 1.5, 
        borderBottom: '1px solid rgba(224, 224, 224, 0.4)', 
        backgroundColor: '#f8fafc'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e293b', mr: 1.5, fontSize: '0.9rem' }}>
            Results ({processedData.length})
          </Typography>
          
          <ClearAllFilters 
            filterCount={activeFilterCount}
            onClearAll={handleClearAllFilters}
          />
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <ColumnSelector 
            columns={columns}
            visibleColumns={visibleColumns}
            onColumnToggle={handleColumnToggle}
            onSelectAll={selectAllColumns}
            onClearAll={clearAllColumns}
          />
        </Box>
        
        {/* Filter popover */}
        <FilterPopover 
          anchorEl={filterAnchorEl}
          currentFilterColumn={currentFilterColumn}
          filterValue={filterValue}
          onFilterClose={handleFilterClose}
          onFilterValueChange={setFilterValue}
          onFilterApply={handleFilterApply}
          columns={columns}
        />
      </Box>
      
      {/* Scrollable table container */}
      <Box sx={{ 
        width: '100%', 
        height: '350px',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 1,
        border: '1px solid rgba(224, 224, 224, 0.4)',
      }}>
        <Box sx={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflowX: 'auto',
          overflowY: 'auto',
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
          }
        }}>
          <Table 
            stickyHeader 
            sx={{ 
              minWidth: '150%',
              '& .MuiTableHead-root': {
                position: 'sticky',
                top: 0,
                zIndex: 3,
              },
              '& .MuiTableCell-stickyHeader': {
                backgroundColor: '#1e293b',
              }
            }} 
            size="medium" 
            aria-label="workflow table"
          >
            <TableHead sx={{ position: 'sticky', top: 0, zIndex: 5 }}>
              <TableRow sx={{ height: '42px' }}>
                <TableCell 
                  padding="checkbox" 
                  align="center" 
                  sx={{ 
                    width: 40, 
                    backgroundColor: '#1e293b', 
                    color: '#ffffff', 
                    fontWeight: 600,
                    borderBottom: 'none',
                    py: 1,
                    position: 'sticky',
                    top: 0,
                    zIndex: 4
                  }}
                >
                  #
                </TableCell>
                {visibleColumnConfigs.map((column) => (
                  <HeaderCell 
                    key={column.id}
                    column={column}
                    isSorted={isSortedColumn(column.id)}
                    sortDirection={sortConfig.key === column.id ? sortConfig.direction : null}
                    onSort={handleSort}
                    filter={getColumnFilter(column.id)}
                    onFilterClick={handleFilterClick}
                    onFilterClear={handleFilterClear}
                    columnWidth={getColumnWidth(column.id)}
                    isResizing={window.resizingColumnId === column.id}
                    onResizeStart={handleResizeStart}
                  />
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {processedData.map((row, index) => (
                <DataRow 
                  key={row.id}
                  row={row}
                  index={index}
                  visibleColumns={visibleColumnConfigs}
                  getColumnWidth={getColumnWidth}
                />
              ))}
              
              {processedData.length === 0 && (
                <TableRow>
                  <TableCell 
                    colSpan={visibleColumnConfigs.length + 1}
                    align="center"
                    sx={{ py: 6 }}
                  >
                    <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 500 }}>
                      No matching records found
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94a3b8', mt: 1 }}>
                      Try adjusting your filters or search criteria
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      </Box>
    </EnhancedPaper>
  );
};

export default DataGrid;
