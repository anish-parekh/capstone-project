import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Popover,
  InputAdornment
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
// Define the structure for our trade data based on the image
interface TradeResult {
  selected?: boolean;
  proposedAction?: string;
  underlyingTradeID: string;
  underlyingBook: string;
  status: string;
  productType: string;
  externalSystem: string;
  description: string;
}

interface SearchResultsModalProps {
  open: boolean;
  onClose: () => void;
  results: TradeResult[];
  searchType: 'tradeId' | 'counterparty';
  searchValue: string; // The counterparty name or trade ID that was searched
}

const SearchResultsModal: React.FC<SearchResultsModalProps> = ({ open, onClose, results, searchType, searchValue }) => {
  // State to track selected rows
  const [selectedRowIds, setSelectedRowIds] = React.useState<string[]>([]);
  // State for sorting
  const [sortConfig, setSortConfig] = React.useState<{column: string | null, direction: 'asc' | 'desc' | null}>({column: null, direction: null});
  // State for filtering
  const [filters, setFilters] = React.useState<{[key: string]: string}>({});
  // State for filter popover
  const [filterAnchorEl, setFilterAnchorEl] = React.useState<HTMLElement | null>(null);
  const [filterColumn, setFilterColumn] = React.useState<string>('');

  // Handle row selection
  const handleRowSelect = (id: string) => {
    setSelectedRowIds(prevSelected => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter(rowId => rowId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };
  
  // Handle sorting
  const handleSort = (column: string) => {
    setSortConfig(prev => {
      if (prev.column === column) {
        // Cycle through: asc -> desc -> none
        if (prev.direction === 'asc') {
          return { column, direction: 'desc' as const };
        } else if (prev.direction === 'desc') {
          return { column: null, direction: null };
        } else {
          return { column, direction: 'asc' as const };
        }
      } else {
        return { column, direction: 'asc' as const };
      }
    });
  };

  // Handle filter click
  const handleFilterClick = (event: React.MouseEvent<HTMLElement>, column: string) => {
    setFilterAnchorEl(event.currentTarget);
    setFilterColumn(column);
  };

  // Handle filter close
  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  // Handle filter apply
  const handleFilterApply = (value: string) => {
    if (value.trim() === '') {
      // Remove filter if value is empty
      const newFilters = {...filters};
      delete newFilters[filterColumn];
      setFilters(newFilters);
    } else {
      // Add or update filter
      setFilters(prev => ({
        ...prev,
        [filterColumn]: value.trim()
      }));
    }
    setFilterAnchorEl(null);
  };
  
  // Get filtered and sorted data
  const processedResults = React.useMemo(() => {
    let filteredData = [...results];
    
    // Apply filters
    if (Object.keys(filters).length > 0) {
      filteredData = filteredData.filter(row => {
        return Object.entries(filters).every(([key, value]) => {
          const cellValue = (row as any)[key];
          if (cellValue === undefined || cellValue === null) return false;
          return String(cellValue).toLowerCase().includes(value.toLowerCase());
        });
      });
    }
    
    // Apply sorting
    if (sortConfig.column && sortConfig.direction) {
      filteredData.sort((a, b) => {
        const aValue = (a as any)[sortConfig.column!];
        const bValue = (b as any)[sortConfig.column!];
        
        if (aValue === bValue) return 0;
        
        if (sortConfig.direction === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }
    
    return filteredData;
  }, [results, filters, sortConfig]);
  
  // Initialize selection state from results
  React.useEffect(() => {
    const initialSelection = results
      .filter(row => row.selected)
      .map(row => row.underlyingTradeID);
    setSelectedRowIds(initialSelection);
  }, [results]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      PaperProps={{
        sx: {
          borderRadius: '6px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          maxHeight: '85vh',
          height: '85vh'
        }
      }}
    >
      <DialogTitle sx={{ 
        backgroundColor: '#1e293b', 
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        py: 1.5
      }}>
        <Typography variant="h6">
          {searchType === 'tradeId' ? `Trade ID: ${searchValue}` : `Counterparty: ${searchValue}`}
        </Typography>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column', height: 'calc(100% - 60px)' }}>
        {/* DataGrid for search results */}
        <Box sx={{ flex: 1, height: 'calc(100% - 120px)', p: 1.5 }}>

          
          <Box sx={{ 
            border: '1px solid #ddd',
            borderRadius: '4px',
            overflow: 'auto',
            maxHeight: '400px',
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
            <Table stickyHeader sx={{ 
              minWidth: '800px',
              '& .MuiTableHead-root': {
                position: 'sticky',
                top: 0,
                zIndex: 3,
              },
              '& .MuiTableCell-stickyHeader': {
                backgroundColor: '#1e293b',
              }
            }}>
              <TableHead>
                <TableRow>
                  <TableCell 
                    padding="checkbox" 
                    sx={{ 
                      backgroundColor: '#1e293b', 
                      color: 'white',
                      py: 1.5
                    }}
                  >
                    <Checkbox 
                      size="small" 
                      sx={{ color: 'white' }}
                    />
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      backgroundColor: '#1e293b', 
                      color: 'white', 
                      fontWeight: 600, 
                      fontSize: '0.85rem', 
                      py: 1.5,
                      cursor: 'pointer',
                      position: 'relative'
                    }}
                    onClick={() => handleSort('proposedAction')}
                  >
                    Proposed Action
                    {sortConfig.column === 'proposedAction' && (
                      <Box component="span" sx={{ pl: 0.5, display: 'inline-block' }}>
                        {sortConfig.direction === 'asc' ? '▲' : '▼'}
                      </Box>
                    )}
                    <IconButton 
                      size="small" 
                      sx={{ ml: 1, p: 0, color: 'white' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFilterClick(e, 'proposedAction');
                      }}
                    >
                      <FilterListIcon sx={{ fontSize: '0.9rem' }} />
                    </IconButton>
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      backgroundColor: '#1e293b', 
                      color: 'white', 
                      fontWeight: 600, 
                      fontSize: '0.85rem', 
                      py: 1.5,
                      cursor: 'pointer'
                    }}
                    onClick={() => handleSort('underlyingTradeID')}
                  >
                    Underlying Trade ID
                    {sortConfig.column === 'underlyingTradeID' && (
                      <Box component="span" sx={{ pl: 0.5, display: 'inline-block' }}>
                        {sortConfig.direction === 'asc' ? '▲' : '▼'}
                      </Box>
                    )}
                    <IconButton 
                      size="small" 
                      sx={{ ml: 1, p: 0, color: 'white' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFilterClick(e, 'underlyingTradeID');
                      }}
                    >
                      <FilterListIcon sx={{ fontSize: '0.9rem' }} />
                    </IconButton>
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      backgroundColor: '#1e293b', 
                      color: 'white', 
                      fontWeight: 600, 
                      fontSize: '0.85rem', 
                      py: 1.5,
                      cursor: 'pointer'
                    }}
                    onClick={() => handleSort('underlyingBook')}
                  >
                    Underlying Book
                    {sortConfig.column === 'underlyingBook' && (
                      <Box component="span" sx={{ pl: 0.5, display: 'inline-block' }}>
                        {sortConfig.direction === 'asc' ? '▲' : '▼'}
                      </Box>
                    )}
                    <IconButton 
                      size="small" 
                      sx={{ ml: 1, p: 0, color: 'white' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFilterClick(e, 'underlyingBook');
                      }}
                    >
                      <FilterListIcon sx={{ fontSize: '0.9rem' }} />
                    </IconButton>
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      backgroundColor: '#1e293b', 
                      color: 'white', 
                      fontWeight: 600, 
                      fontSize: '0.85rem', 
                      py: 1.5,
                      cursor: 'pointer'
                    }}
                    onClick={() => handleSort('status')}
                  >
                    Status
                    {sortConfig.column === 'status' && (
                      <Box component="span" sx={{ pl: 0.5, display: 'inline-block' }}>
                        {sortConfig.direction === 'asc' ? '▲' : '▼'}
                      </Box>
                    )}
                    <IconButton 
                      size="small" 
                      sx={{ ml: 1, p: 0, color: 'white' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFilterClick(e, 'status');
                      }}
                    >
                      <FilterListIcon sx={{ fontSize: '0.9rem' }} />
                    </IconButton>
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      backgroundColor: '#1e293b', 
                      color: 'white', 
                      fontWeight: 600, 
                      fontSize: '0.85rem', 
                      py: 1.5,
                      cursor: 'pointer'
                    }}
                    onClick={() => handleSort('productType')}
                  >
                    Product Type
                    {sortConfig.column === 'productType' && (
                      <Box component="span" sx={{ pl: 0.5, display: 'inline-block' }}>
                        {sortConfig.direction === 'asc' ? '▲' : '▼'}
                      </Box>
                    )}
                    <IconButton 
                      size="small" 
                      sx={{ ml: 1, p: 0, color: 'white' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFilterClick(e, 'productType');
                      }}
                    >
                      <FilterListIcon sx={{ fontSize: '0.9rem' }} />
                    </IconButton>
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      backgroundColor: '#1e293b', 
                      color: 'white', 
                      fontWeight: 600, 
                      fontSize: '0.85rem', 
                      py: 1.5,
                      cursor: 'pointer'
                    }}
                    onClick={() => handleSort('externalSystem')}
                  >
                    External System
                    {sortConfig.column === 'externalSystem' && (
                      <Box component="span" sx={{ pl: 0.5, display: 'inline-block' }}>
                        {sortConfig.direction === 'asc' ? '▲' : '▼'}
                      </Box>
                    )}
                    <IconButton 
                      size="small" 
                      sx={{ ml: 1, p: 0, color: 'white' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFilterClick(e, 'externalSystem');
                      }}
                    >
                      <FilterListIcon sx={{ fontSize: '0.9rem' }} />
                    </IconButton>
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      backgroundColor: '#1e293b', 
                      color: 'white', 
                      fontWeight: 600, 
                      fontSize: '0.85rem', 
                      py: 1.5,
                      cursor: 'pointer'
                    }}
                    onClick={() => handleSort('description')}
                  >
                    Description
                    {sortConfig.column === 'description' && (
                      <Box component="span" sx={{ pl: 0.5, display: 'inline-block' }}>
                        {sortConfig.direction === 'asc' ? '▲' : '▼'}
                      </Box>
                    )}
                    <IconButton 
                      size="small" 
                      sx={{ ml: 1, p: 0, color: 'white' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFilterClick(e, 'description');
                      }}
                    >
                      <FilterListIcon sx={{ fontSize: '0.9rem' }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {processedResults.map((row) => {
                  const isSelected = selectedRowIds.includes(row.underlyingTradeID);
                  return (
                    <TableRow key={row.underlyingTradeID} sx={{ 
                      '&:nth-of-type(even)': { backgroundColor: 'rgba(0, 0, 0, 0.02)' },
                      '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                      backgroundColor: isSelected ? 'rgba(25, 118, 210, 0.08)' : 'inherit'
                    }}>
                      <TableCell padding="checkbox">
                        <Checkbox 
                          size="small" 
                          checked={isSelected}
                          onChange={() => handleRowSelect(row.underlyingTradeID)}
                        />
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.85rem' }}>{row.proposedAction || ''}</TableCell>
                      <TableCell sx={{ fontSize: '0.85rem' }}>{row.underlyingTradeID}</TableCell>
                      <TableCell sx={{ fontSize: '0.85rem' }}>{row.underlyingBook}</TableCell>
                      <TableCell sx={{ fontSize: '0.85rem' }}>{row.status}</TableCell>
                      <TableCell sx={{ fontSize: '0.85rem' }}>{row.productType}</TableCell>
                      <TableCell sx={{ fontSize: '0.85rem' }}>{row.externalSystem}</TableCell>
                      <TableCell sx={{ fontSize: '0.85rem' }}>{row.description}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
        </Box>

        {/* Bottom pricing options */}
        <Box sx={{ 
          p: 2, 
          backgroundColor: '#f8f8f8', 
          borderTop: '1px solid #ddd',
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'flex-start',
            gap: 3,
            justifyContent: 'space-between'
          }}>
            {/* Left side - Pricing Description */}
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                border: '1px solid #ddd',
                borderRadius: '4px',
                p: 1.5,
                flex: 1,
                backgroundColor: '#fff'
              }}
            >
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 600, 
                  color: '#333', 
                  mb: 1,
                  borderBottom: '1px solid #eee',
                  pb: 0.5
                }}
              >
                Pricing Description
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                {/* Combobox with Single Pricing option */}
                <Box sx={{ width: '140px' }}>
                  <FormControl fullWidth size="small">
                    <Select
                      value="single-pricing"
                      sx={{ 
                        fontSize: '0.85rem', 
                        height: '32px',
                        '& .MuiSelect-select': { padding: '4px 8px' }
                      }}
                    >
                      <MenuItem value="single-pricing">Single Pricing</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                {/* Text box inline */}
                <Box sx={{ flex: 1, minWidth: '120px' }}>
                  <TextField 
                    fullWidth 
                    size="small" 
                    placeholder="Additional notes" 
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: '32px',
                        fontSize: '0.85rem',
                      }
                    }}
                  />
                </Box>

                {/* Price button */}
                <Button variant="outlined" sx={{ 
                  py: 0.5, 
                  px: 1.5, 
                  textTransform: 'none', 
                  fontSize: '0.85rem',
                  minWidth: '60px',
                  height: '32px',
                  color: '#333',
                  borderColor: '#ccc'
                }}>
                  Price
                </Button>
              </Box>
            </Box>

            {/* Right side - KVA Calculation */}
            <Box 
              sx={{ 
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid #ddd',
                borderRadius: '4px',
                p: 1.5,
                minWidth: '300px',
                backgroundColor: '#fff'
              }}
            >
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 600, 
                  color: '#333',
                  mb: 1,
                  borderBottom: '1px solid #eee',
                  pb: 0.5
                }}
              >
                KVA Calculation
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <FormControlLabel
                  control={<Checkbox size="small" />}
                  label="SACCR"
                  sx={{ 
                    '& .MuiFormControlLabel-label': { 
                      fontSize: '0.85rem' 
                    },
                    m: 0
                  }}
                />

                <Button variant="outlined" sx={{ 
                  py: 0.5, 
                  px: 1.5, 
                  textTransform: 'none', 
                  fontSize: '0.85rem',
                  minWidth: '80px',
                  height: '32px',
                  color: '#333',
                  borderColor: '#ccc'
                }}>
                  Algo Data
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Filter Popover */}
        <Popover
          open={!!filterAnchorEl}
          anchorEl={filterAnchorEl}
          onClose={handleFilterClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <Box sx={{ p: 2, width: 280 }}>
            <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
              Filter {filterColumn}
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Filter value..."
              defaultValue={filters[filterColumn] || ''}
              autoFocus
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => handleFilterApply('')}
                      edge="end"
                      title="Clear filter"
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleFilterApply((e.target as HTMLInputElement).value);
                }
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1.5 }}>
              <Button 
                onClick={handleFilterClose} 
                size="small"
                sx={{ mr: 1 }}
              >
                Cancel
              </Button>
              <Button
                onClick={(e) => {
                  const input = e.currentTarget.closest('.MuiPopover-root')?.querySelector('input');
                  if (input) handleFilterApply(input.value);
                }}
                variant="contained"
                size="small"
                color="primary"
              >
                Apply
              </Button>
            </Box>
          </Box>
        </Popover>
      </DialogContent>


    </Dialog>
  );
};

export default SearchResultsModal;
