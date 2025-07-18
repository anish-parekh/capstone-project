import { Box, Tab, Tabs, Typography, MenuItem, FormControl, Table, TableBody, TableCell, TableHead, TableRow, IconButton, Checkbox, Popover, FormControlLabel, FormGroup, Tooltip, Divider, InputAdornment, TextField, Badge } from '@mui/material';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterListIcon from '@mui/icons-material/FilterList';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import ClearIcon from '@mui/icons-material/Clear';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TabPanel, a11yProps } from './TabPanel';
import { PrimaryButton, SecondaryButton, EnhancedPaper, EnhancedTextField, EnhancedSelect, GridContainer } from './EnhancedUIStyles';

// Extend Window interface to include our global variables
declare global {
  interface Window {
    resizingColumnId: string | null;
    startX: number | null;
    startWidth: number | null;
    columnWidths: Record<string, number>;
    setColumnWidths: (id: string, width: number) => void;
    forceUpdate: () => void;
  }
}

// Generate mock data for the grid
const generateMockData = (count: number) => {
  const assetClasses = ['Equity', 'Fixed Income', 'Currency', 'Commodity', 'Credit', 'Rates'];
  const counterparties = ['ACME Corp', 'Global Bank', 'Finance Co', 'Trading LLC', 'Hedge Fund X', 'Investment Bank Y', 'Credit Union Z', 'Mutual Fund A', 'Pension Fund B', 'Insurance Co C'];
  const pricingDescriptions = ['Standard', 'Premium', 'Enhanced', 'Basic', 'Complex', 'Legacy', 'Special'];
  const statuses = ['Pending', 'Completed', 'Processing', 'Failed', 'On Hold', 'Reviewing', 'Approved'];
  const payRecs = ['Pay', 'Rec'];
  
  return Array.from({ length: count }, (_, index) => {
    const id = index + 1;
    const assetClass = assetClasses[Math.floor(Math.random() * assetClasses.length)];
    const counterparty = counterparties[Math.floor(Math.random() * counterparties.length)];
    const cqr = parseFloat((Math.random() * 0.5).toFixed(2));
    const curveId = `C-${Math.floor(1000 + Math.random() * 9000)}`;
    const cva = Math.floor(Math.random() * 5000);
    const dva = Math.floor(Math.random() * 3000);
    const estimatedCharge = Math.floor(Math.random() * 10000);
    const fba = Math.floor(Math.random() * 500);
    const fca = Math.floor(Math.random() * 1000);
    const fva = Math.floor(Math.random() * 1500);
    const newTrades = Math.floor(Math.random() * 20);
    const removedTrades = Math.floor(Math.random() * 10);
    const netTotal = newTrades - removedTrades;
    const payRec = payRecs[Math.floor(Math.random() * payRecs.length)];
    const pricingDescription = pricingDescriptions[Math.floor(Math.random() * pricingDescriptions.length)];
    const roe = parseFloat((Math.random() * 0.3).toFixed(2));
    
    // Generate a random time on today's date
    const hours = String(Math.floor(Math.random() * 24)).padStart(2, '0');
    const minutes = String(Math.floor(Math.random() * 60)).padStart(2, '0');
    const startTime = `2025-07-18 ${hours}:${minutes}`;
    
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    return {
      id,
      assetClass,
      counterparty,
      cqr,
      curveId,
      cva,
      dva,
      estimatedCharge,
      fba,
      fca,
      fva,
      netTotal,
      newTrades,
      payRec,
      pricingDescription,
      removedTrades,
      roe,
      startTime,
      status
    };
  });
};

// Generate 50 rows of mock data
const sampleRows = generateMockData(50);

// Define all available columns in the specified order
const allColumns = [
  { id: 'id', label: 'ID', align: 'left' },
  { id: 'assetClass', label: 'Asset Class', align: 'left' },
  { id: 'counterparty', label: 'Counterparty', align: 'left' },
  { id: 'pricingDescription', label: 'Pricing Description', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: 'newTrades', label: 'New Trades', align: 'center' },
  { id: 'removedTrades', label: 'Removed Trades', align: 'center' },
  { id: 'netTotal', label: 'Net/Total', align: 'center' },
  { id: 'cva', label: 'CVA', align: 'right' },
  { id: 'dva', label: 'DVA', align: 'right' },
  { id: 'fva', label: 'FVA', align: 'right' },
  { id: 'fca', label: 'FCA', align: 'right' },
  { id: 'fba', label: 'FBA', align: 'right' },
  { id: 'roe', label: 'ROE', align: 'right' },
  { id: 'estimatedCharge', label: 'Estimated Charge', align: 'right' },
  { id: 'payRec', label: 'Pay/Rec', align: 'left' },
  { id: 'curveId', label: 'Curve ID', align: 'left' },
  { id: 'cqr', label: 'Cqr', align: 'right' },
  { id: 'startTime', label: 'Start Time', align: 'left' },
];

// Define sorting direction type
type SortDirection = 'asc' | 'desc' | null;

// Define filter type
interface ColumnFilter {
  id: string;
  value: string;
}

// Define column width type
interface ColumnWidth {
  id: string;
  width: number;
}

export default function SearchPage() {
  // Page state
  const [tabValue, setTabValue] = useState(0);
  const [sourceSystem, setSourceSystem] = useState('');
  const [tradeId, setTradeId] = useState('');
  const [counterparty, setCounterparty] = useState('');
  
  // Column selector state
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    allColumns.map(column => column.id)
  );
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  
  // Sorting state
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: SortDirection }>({ 
    key: 'id', 
    direction: 'asc' 
  });
  
  // Filtering state
  const [filters, setFilters] = useState<ColumnFilter[]>([]);
  const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLElement | null>(null);
  const [currentFilterColumn, setCurrentFilterColumn] = useState<string>('');
  const [filterValue, setFilterValue] = useState('');
  
  // Calculate initial column widths based on content
  const calculateColumnWidth = (text: string): number => {
    // More generous width calculation to prevent truncation
    // Each character is roughly 10px wide for normal text, 12px for bold text
    // Add extra padding for sort and filter icons (80px)
    const baseWidth = text.length * 12 + 80;
    
    // Minimum width of 120px, no maximum to ensure text fits
    return Math.max(120, baseWidth);
  };
  
  // Column resize state
  const [columnWidths, setColumnWidths] = useState<ColumnWidth[]>(
    allColumns.map(column => ({ 
      id: column.id, 
      width: calculateColumnWidth(column.label)
    }))
  );
  const [forceUpdate, setForceUpdate] = useState<boolean>(false);
  
  // Initialize global variables if needed
  useEffect(() => {
    window.resizingColumnId = null;
    window.startX = null;
    window.startWidth = null;
    window.columnWidths = {};
  }, []);
  
  // Loading state removed to prevent infinite loop

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleTradeIdSearch = () => {
    console.log('Searching for Trade ID:', tradeId, 'in Source System:', sourceSystem);
    // No need to update search results as we're using sampleRows directly
  };

  const handleCounterpartySearch = () => {
    console.log('Searching for Counterparty:', counterparty);
    // No need to update search results as we're using sampleRows directly
  };
  
  // Column selector handlers
  const handleColumnSelectorClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleColumnSelectorClose = () => {
    setAnchorEl(null);
  };

  const handleColumnToggle = (columnId: string) => {
    setVisibleColumns(prev => {
      if (prev.includes(columnId)) {
        return prev.filter(id => id !== columnId);
      } else {
        return [...prev, columnId];
      }
    });
  };
  
  const selectAllColumns = () => {
    setVisibleColumns(allColumns.map(col => col.id));
  };
  
  const clearAllColumns = () => {
    setVisibleColumns([]);
  };
  
  // Sorting handlers
  const handleSort = (columnId: string) => {
    let direction: SortDirection = 'asc';
    
    if (sortConfig.key === columnId) {
      if (sortConfig.direction === 'asc') {
        direction = 'desc';
      } else if (sortConfig.direction === 'desc') {
        direction = null;
      } else {
        direction = 'asc';
      }
    }
    
    setSortConfig({ key: columnId, direction });
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
  // Define these outside the component to avoid recreation on each render
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
    window.forceUpdate = () => setForceUpdate(prev => !prev);
    
    // Add event listeners for mousemove and mouseup
    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
  };
  
  // Cleanup effect to remove event listeners when component unmounts
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
    };
  }, []);
  
  // Get column width
  const getColumnWidth = (columnId: string): number => {
    const column = columnWidths.find(col => col.id === columnId);
    return column ? column.width : 150; // Default width
  };
  
  // Get filtered and sorted data
  const getProcessedData = () => {
    // First apply filters
    let filteredData = [...sampleRows];
    
    if (filters.length > 0) {
      filteredData = filteredData.filter(row => {
        return filters.every(filter => {
          const cellValue = row[filter.id as keyof typeof row];
          if (cellValue === undefined) return false;
          
          // Convert both to lowercase strings for case-insensitive comparison
          const valueStr = String(cellValue).toLowerCase();
          const filterStr = filter.value.toLowerCase();
          
          return valueStr.includes(filterStr);
        });
      });
    }
    
    // Then apply sorting if needed
    if (sortConfig.direction) {
      filteredData.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof typeof a];
        const bValue = b[sortConfig.key as keyof typeof b];
        
        if (aValue === undefined || bValue === undefined) return 0;
        
        // Handle different data types
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
        }
        
        // Convert to strings for comparison
        const aStr = String(aValue).toLowerCase();
        const bStr = String(bValue).toLowerCase();
        
        if (sortConfig.direction === 'asc') {
          return aStr.localeCompare(bStr);
        } else {
          return bStr.localeCompare(aStr);
        }
      });
    }
    
    return filteredData;
  };

  const renderDataTable = () => {
    // Get the visible column configurations
    const visibleColumnConfigs = allColumns.filter(col => visibleColumns.includes(col.id));
    
    // Get processed data (filtered and sorted)
    const processedData = getProcessedData();
    
    // Get active filter for a column
    const getColumnFilter = (columnId: string) => {
      return filters.find(filter => filter.id === columnId);
    };
    
    // Check if a column is being sorted
    const isSortedColumn = (columnId: string) => {
      return sortConfig.key === columnId && sortConfig.direction !== null;
    };
    
    // Get sort direction icon
    const getSortIcon = (columnId: string) => {
      if (sortConfig.key !== columnId || sortConfig.direction === null) {
        return null;
      }
      
      return sortConfig.direction === 'asc' ? 
        <ArrowUpwardIcon fontSize="small" sx={{ ml: 0.5, fontSize: '0.85rem' }} /> : 
        <ArrowDownwardIcon fontSize="small" sx={{ ml: 0.5, fontSize: '0.85rem' }} />;
    };
    
    // Count active filters
    const activeFilterCount = filters.length;
    
    return (
      <EnhancedPaper sx={{ width: '100%', mb: 2, overflow: 'hidden' }}>
        {/* Table controls */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          p: 2, 
          borderBottom: '1px solid rgba(224, 224, 224, 0.4)', 
          backgroundColor: '#f8fafc'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e293b', mr: 2 }}>
              Results ({processedData.length})
            </Typography>
            
            {activeFilterCount > 0 && (
              <Tooltip title="Clear all filters" arrow>
                <IconButton 
                  size="small" 
                  onClick={handleClearAllFilters}
                  sx={{ 
                    ml: 1,
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.2)' },
                  }}
                >
                  <FilterAltOffIcon fontSize="small" sx={{ color: '#ef4444' }} />
                </IconButton>
              </Tooltip>
            )}
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
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
          </Box>
          
          {/* Column selector popover */}
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
                <SecondaryButton size="small" onClick={selectAllColumns} sx={{ px: 2 }}>
                  Select All
                </SecondaryButton>
                <SecondaryButton size="small" onClick={clearAllColumns} sx={{ px: 2 }}>
                  Clear All
                </SecondaryButton>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <FormGroup>
                {allColumns.map((column) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={visibleColumns.includes(column.id)}
                        onChange={() => handleColumnToggle(column.id)}
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
          
          {/* Filter popover */}
          <Popover
            open={Boolean(filterAnchorEl)}
            anchorEl={filterAnchorEl}
            onClose={handleFilterClose}
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
                Filter {allColumns.find(col => col.id === currentFilterColumn)?.label}
              </Typography>
              
              <TextField
                fullWidth
                size="small"
                placeholder="Enter filter value"
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                sx={{ mb: 2 }}
                autoFocus
                InputProps={{
                  endAdornment: filterValue ? (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setFilterValue('')}
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
                  onClick={handleFilterClose}
                >
                  Cancel
                </SecondaryButton>
                
                <PrimaryButton 
                  size="small" 
                  onClick={() => {
                    handleFilterApply(filterValue);
                    handleFilterClose();
                  }}
                  startIcon={<FilterListIcon />}
                >
                  Apply Filter
                </PrimaryButton>
              </Box>
            </Box>
          </Popover>
        </Box>
        
        {/* Scrollable table container */}
        <Box sx={{ 
          width: '100%', 
          height: '400px',
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
              width: '10px',
              height: '10px',
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
                <TableRow sx={{ height: '56px' }}>
                  <TableCell 
                    padding="checkbox" 
                    align="center" 
                    sx={{ 
                      width: 40, 
                      backgroundColor: '#1e293b', 
                      color: '#ffffff', 
                      fontWeight: 600,
                      borderBottom: 'none',
                      py: 1.5,
                      position: 'sticky',
                      top: 0,
                      zIndex: 4
                    }}
                  >
                    #
                  </TableCell>
                  {visibleColumnConfigs.map((column) => {
                    const hasFilter = getColumnFilter(column.id);
                    
                    return (
                      <TableCell 
                        key={column.id} 
                        align="left" // Always left-align header cells
                        sx={{ 
                          backgroundColor: window.resizingColumnId === column.id ? '#334155' : '#1e293b', 
                          color: '#ffffff', 
                          fontWeight: 600,
                          borderBottom: 'none',
                          py: 1.5,
                          cursor: window.resizingColumnId === column.id ? 'col-resize' : 'pointer',
                          userSelect: 'none',
                          transition: window.resizingColumnId ? 'none' : 'background-color 0.2s',
                          position: 'sticky',
                          top: 0,
                          pr: 8, // Increased padding to the right to accommodate the filter icon
                          width: `${getColumnWidth(column.id)}px`,
                          maxWidth: `${getColumnWidth(column.id)}px`,
                          minWidth: `${getColumnWidth(column.id)}px`,
                          boxShadow: window.resizingColumnId === column.id ? '0 0 0 2px #3b82f6' : 'none',
                          zIndex: window.resizingColumnId === column.id ? 10 : 4,
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
                          onClick={() => handleSort(column.id)}
                        >
                          <Box 
                            component="span" 
                            sx={{ 
                              display: 'inline-block',
                              color: isSortedColumn(column.id) ? '#ffffff' : 'inherit',
                              fontWeight: isSortedColumn(column.id) ? 700 : 600,
                              width: 'auto',
                              whiteSpace: 'nowrap',
                              verticalAlign: 'middle',
                            }}
                          >
                            {column.label}
                          </Box>
                          <Box sx={{ display: 'inline-flex', ml: 1, verticalAlign: 'middle' }}>
                            {getSortIcon(column.id)}
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
                          onMouseDown={(e) => handleResizeStart(e, column.id, getColumnWidth(column.id))}
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
                          {hasFilter ? (
                            <Tooltip title={`Filter: ${hasFilter.value}`} arrow>
                              <Box sx={{ display: 'flex', gap: 0.5 }}>
                                <IconButton 
                                  size="small" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleFilterClear(column.id);
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
                                      setFilterValue(hasFilter.value);
                                      handleFilterClick(e, column.id);
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
                            <Tooltip title={`Filter ${column.label}`} arrow>
                              <IconButton 
                                size="small" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setFilterValue('');
                                  handleFilterClick(e, column.id);
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
                        </Box>
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {processedData.map((row, index) => {
                  // Alternate row styling
                  const isEven = index % 2 === 0;
                  
                  return (
                    <TableRow 
                      key={row.id}
                      sx={{ 
                        backgroundColor: isEven ? '#ffffff' : '#f8fafc',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: '#f1f5f9',
                          boxShadow: 'inset 0 0 0 1px rgba(148, 163, 184, 0.2)'
                        }
                      }}
                    >
                      <TableCell 
                        padding="checkbox" 
                        align="center"
                        sx={{ borderBottom: '1px solid rgba(224, 224, 224, 0.4)' }}
                      >
                        <Checkbox 
                          size="small" 
                          sx={{
                            color: '#94a3b8',
                            '&.Mui-checked': {
                              color: '#1e293b',
                            },
                          }}
                        />
                      </TableCell>
                      {visibleColumnConfigs.map((column) => {
                        // Format cell content based on column type
                        const cellValue = row[column.id as keyof typeof row];
                        let formattedValue = cellValue;
                        
                        // Apply special formatting for specific column types
                        if (typeof cellValue === 'number' && ['cva', 'dva', 'fva', 'fca', 'fba', 'estimatedCharge'].includes(column.id)) {
                          formattedValue = `$${cellValue.toLocaleString()}`;
                        } else if (column.id === 'roe' || column.id === 'cqr') {
                          formattedValue = `${(Number(cellValue) * 100).toFixed(2)}%`;
                        }
                        
                        return (
                          <TableCell 
                            key={`${row.id}-${column.id}`}
                            align="center" // Always center-align data cells
                            sx={{ 
                              borderBottom: '1px solid rgba(224, 224, 224, 0.4)',
                              py: 1.5,
                              color: '#334155',
                              width: `${getColumnWidth(column.id)}px`,
                              maxWidth: `${getColumnWidth(column.id)}px`,
                              minWidth: `${getColumnWidth(column.id)}px`,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {formattedValue}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
                
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

  return (
    <Box sx={{ width: '100%' }}>
      <EnhancedPaper sx={{ mb: 3, overflow: 'hidden' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="search tabs"
          variant="fullWidth"
          sx={{ 
            backgroundColor: '#1e293b',
            '& .MuiTabs-indicator': {
              backgroundColor: '#ffffff',
              height: 3,
              borderTopLeftRadius: 3,
              borderTopRightRadius: 3,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            },
            '& .MuiTab-root': {
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                opacity: 0,
                transition: 'opacity 0.3s ease'
              },
              '&:hover::before': {
                opacity: 1
              }
            }
          }}
          TabIndicatorProps={{
            style: { backgroundColor: '#ffffff' }
          }}
        >
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SearchIcon fontSize="small" />
                <Typography variant="body1" sx={{ fontWeight: tabValue === 0 ? 600 : 400 }}>
                  Trade ID Search
                </Typography>
              </Box>
            }
            {...a11yProps(0)} 
            sx={{ 
              color: tabValue === 0 ? '#ffffff' : 'rgba(255,255,255,0.7)',
              fontWeight: tabValue === 0 ? 600 : 400,
              py: 2,
              '&.Mui-selected': { color: '#ffffff' },
              '&:hover': { color: '#ffffff' }
            }} 
          />
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SearchIcon fontSize="small" />
                <Typography variant="body1" sx={{ fontWeight: tabValue === 1 ? 600 : 400 }}>
                  Counterparty Search
                </Typography>
              </Box>
            }
            {...a11yProps(1)} 
            sx={{ 
              color: tabValue === 1 ? '#ffffff' : 'rgba(255,255,255,0.7)',
              fontWeight: tabValue === 1 ? 600 : 400,
              py: 2,
              '&.Mui-selected': { color: '#ffffff' },
              '&:hover': { color: '#ffffff' }
            }} 
          />
        </Tabs>
      </EnhancedPaper>

      {/* Trade ID Search Tab */}
      <TabPanel value={tabValue} index={0}>
        <AnimatePresence>
          <motion.div
            key="trade-id-search"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <EnhancedPaper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1e293b' }}>
                Trade ID Search
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <GridContainer sx={{ gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, alignItems: 'end' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 500, color: '#475569' }}>
                    Source System
                  </Typography>
                  <FormControl fullWidth>
                    <EnhancedSelect
                      value={sourceSystem}
                      displayEmpty
                      onChange={(e) => {
                        // Fix type error by explicitly typing the event value
                        const value = e.target.value as string;
                        setSourceSystem(value);
                      }}
                      size="small"
                      sx={{ width: '100%' }}
                      MenuProps={{
                        PaperProps: {
                          elevation: 3,
                          sx: { borderRadius: 2, mt: 0.5 }
                        }
                      }}
                    >
                      <MenuItem value=""><em>Select System</em></MenuItem>
                      <MenuItem value="system1">System 1</MenuItem>
                      <MenuItem value="system2">System 2</MenuItem>
                      <MenuItem value="system3">System 3</MenuItem>
                    </EnhancedSelect>
                  </FormControl>
                </Box>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 500, color: '#475569' }}>
                    Trade ID
                  </Typography>
                  <EnhancedTextField
                    fullWidth
                    size="small"
                    value={tradeId}
                    onChange={(e) => setTradeId(e.target.value)}
                    placeholder="Enter Trade ID"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon fontSize="small" sx={{ color: '#64748b' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, mt: { xs: 2, md: 0 } }}>
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <PrimaryButton
                      variant="contained"
                      onClick={handleTradeIdSearch}
                      startIcon={<SearchIcon />}
                      sx={{ minWidth: 120 }}
                    >
                      Search
                    </PrimaryButton>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    style={{ marginLeft: '8px' }}
                  >
                    <SecondaryButton
                      variant="outlined"
                      onClick={() => {
                        setTradeId('');
                        setSourceSystem('');
                      }}
                      startIcon={<RefreshIcon />}
                    >
                      Reset
                    </SecondaryButton>
                  </motion.div>
                </Box>
              </GridContainer>
            </EnhancedPaper>
          </motion.div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {renderDataTable()}
        </motion.div>
      </TabPanel>

      {/* Counterparty Search Tab */}
      <TabPanel value={tabValue} index={1}>
        <AnimatePresence>
          <motion.div
            key="counterparty-search"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <EnhancedPaper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1e293b' }}>
                Counterparty Search
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <GridContainer sx={{ gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3, alignItems: 'end' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 500, color: '#475569' }}>
                    Source System
                  </Typography>
                  <FormControl fullWidth>
                    <EnhancedSelect
                      value={sourceSystem}
                      displayEmpty
                      onChange={(e) => {
                        // Fix type error by explicitly typing the event value
                        const value = e.target.value as string;
                        setSourceSystem(value);
                      }}
                      size="small"
                      MenuProps={{
                        PaperProps: {
                          elevation: 3,
                          sx: { borderRadius: 2, mt: 0.5 }
                        }
                      }}
                    >
                      <MenuItem value=""><em>Select System</em></MenuItem>
                      <MenuItem value="system1">System 1</MenuItem>
                      <MenuItem value="system2">System 2</MenuItem>
                      <MenuItem value="system3">System 3</MenuItem>
                    </EnhancedSelect>
                  </FormControl>
                </Box>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 500, color: '#475569' }}>
                    Counterparty
                  </Typography>
                  <EnhancedTextField
                    fullWidth
                    size="small"
                    value={counterparty}
                    onChange={(e) => setCounterparty(e.target.value)}
                    placeholder="Enter counterparty name"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon fontSize="small" sx={{ color: '#64748b' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 500, color: '#475569' }}>
                    WCIS ID
                  </Typography>
                  <EnhancedTextField
                    fullWidth
                    size="small"
                    placeholder="Enter WCIS ID"
                  />
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', gridColumn: { xs: '1', md: 'span 3' } }}>
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <PrimaryButton
                      variant="contained"
                      onClick={handleCounterpartySearch}
                      startIcon={<SearchIcon />}
                    >
                      Search
                    </PrimaryButton>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    style={{ marginLeft: '8px' }}
                  >
                    <SecondaryButton
                      variant="outlined"
                      onClick={() => {
                        setCounterparty('');
                        setSourceSystem('');
                      }}
                      startIcon={<RefreshIcon />}
                    >
                      Reset
                    </SecondaryButton>
                  </motion.div>
                </Box>
              </GridContainer>
            </EnhancedPaper>
          </motion.div>
        </AnimatePresence>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {renderDataTable()}
        </motion.div>
      </TabPanel>
    </Box>
  );
}
