import { Box, Tab, Tabs, Paper, TextField, Button, Typography, Select, MenuItem, FormControl, Table, TableBody, TableCell, TableHead, TableRow, IconButton, Checkbox, Popover, FormControlLabel, FormGroup, Tooltip } from '@mui/material';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TabPanel, a11yProps } from './TabPanel';

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

  const renderDataTable = () => {
    // Get the visible column configurations
    const visibleColumnConfigs = allColumns.filter(col => visibleColumns.includes(col.id));
    
    return (
      <Box sx={{ width: '100%', backgroundColor: '#ffffff', mb: 2, border: '1px solid rgba(224, 224, 224, 1)', borderRadius: 1, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        {/* Column selector controls */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1.5, borderBottom: '1px solid #e0e0e0', backgroundColor: '#f9f9f9' }}>
          <Tooltip title="Select columns to display">
            <IconButton onClick={handleColumnSelectorClick} size="small">
              <ViewColumnIcon />
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
          >
            <Box sx={{ p: 2, maxHeight: 400, overflowY: 'auto', width: 250 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Column Display</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Button size="small" onClick={selectAllColumns}>Select All</Button>
                <Button size="small" onClick={clearAllColumns}>Clear All</Button>
              </Box>
              <FormGroup>
                {allColumns.map((column) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={visibleColumns.includes(column.id)}
                        onChange={() => handleColumnToggle(column.id)}
                        size="small"
                      />
                    }
                    label={column.label}
                    key={column.id}
                  />
                ))}
              </FormGroup>
            </Box>
          </Popover>
        </Box>
        
        {/* Scrollable table container */}
        <Box sx={{ 
          width: '100%', 
          height: '400px',
          position: 'relative',
          backgroundColor: '#ffffff'
        }}>
          <Box sx={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflowX: 'scroll',
            overflowY: 'scroll',
            backgroundColor: '#ffffff',
            '&::-webkit-scrollbar': {
              width: '12px',
              height: '12px',
              backgroundColor: '#f5f5f5'
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#c1c1c1',
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: '#a8a8a8'
              }
            },
            '&::-webkit-scrollbar-track': {
              borderRadius: '4px',
              backgroundColor: '#f5f5f5'
            }
          }}>
            <Table stickyHeader sx={{ minWidth: '150%', backgroundColor: '#ffffff' }} size="small" aria-label="workflow table">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#444444' }}>
                <TableCell padding="checkbox" align="center" sx={{ width: 40, color: '#ffffff', fontWeight: 600 }}>#</TableCell>
                {visibleColumnConfigs.map((column) => (
                  <TableCell 
                  key={column.id} 
                  align={column.align as "left" | "center" | "right" | "justify" | "inherit" | undefined}
                  sx={{ color: '#ffffff', fontWeight: 600 }}
                >
                  {column.label}
                </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sampleRows.map((row) => (
                  <TableRow key={row.id}>
                  <TableCell padding="checkbox" align="center">
                    <Checkbox size="small" />
                  </TableCell>
                  {visibleColumnConfigs.map((column) => (
                    <TableCell 
                      key={`${row.id}-${column.id}`}
                      align={column.align as "left" | "center" | "right" | "justify" | "inherit" | undefined}
                    >
                      {row[column.id as keyof typeof row]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="search tabs"
          sx={{ 
            backgroundColor: '#222222',
            '& .MuiTabs-indicator': {
              backgroundColor: '#ffffff',
              height: 3
            }
          }}
          TabIndicatorProps={{
            style: { backgroundColor: '#ffffff' }
          }}
        >
          <Tab 
            label="Trade ID Search" 
            {...a11yProps(0)} 
            sx={{ 
              color: tabValue === 0 ? '#ffffff' : 'rgba(255,255,255,0.7)',
              fontWeight: tabValue === 0 ? 'bold' : 'normal',
              '&.Mui-selected': { color: '#ffffff' },
              '&:hover': { color: '#ffffff' }
            }} 
          />
          <Tab 
            label="Counterparty Search" 
            {...a11yProps(1)} 
            sx={{ 
              color: tabValue === 1 ? '#ffffff' : 'rgba(255,255,255,0.7)',
              fontWeight: tabValue === 1 ? 'bold' : 'normal',
              '&.Mui-selected': { color: '#ffffff' },
              '&:hover': { color: '#ffffff' }
            }} 
          />
        </Tabs>
      </Box>

      {/* Trade ID Search Tab */}
      <TabPanel value={tabValue} index={0}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="animate__animated animate__fadeIn"
        >
          <Paper elevation={1} sx={{ p: 2, mb: 2, borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* First row with labels */}
            <Box sx={{ display: 'flex', gap: 4, ml: 1 }}>
              <Typography variant="body1" sx={{ minWidth: 120, fontWeight: 500, color: '#333333' }}>Source System</Typography>
              <Typography variant="body1" sx={{ minWidth: 120, ml: 8, fontWeight: 500, color: '#333333' }}>Trade ID</Typography>
            </Box>
            
            {/* Second row with inputs and buttons */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <FormControl size="small" sx={{ minWidth: 180 }}>
                <Select
                  value={sourceSystem}
                  displayEmpty
                  onChange={(e) => setSourceSystem(e.target.value)}
                  sx={{ height: 36 }}
                >
                  <MenuItem value=""><em>Select System</em></MenuItem>
                  <MenuItem value="system1">System 1</MenuItem>
                  <MenuItem value="system2">System 2</MenuItem>
                  <MenuItem value="system3">System 3</MenuItem>
                </Select>
              </FormControl>
              
              <TextField 
                size="small"
                variant="outlined" 
                value={tradeId}
                onChange={(e) => setTradeId(e.target.value)}
                placeholder="Enter Trade ID"
                sx={{ minWidth: 180 }}
              />
              
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={handleTradeIdSearch}
                  sx={{ 
                    ml: 'auto', 
                    px: 3, 
                    py: 0.5, 
                    bgcolor: '#222222', 
                    '&:hover': { bgcolor: '#444444' },
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.15)',
                    transition: 'all 0.3s ease'
                  }}
                  className="animate__animated animate__pulse"
                >
                  Submit
                </Button>
              </motion.div>
            </Box>
          </Box>
        </Paper>
        </motion.div>

        <Paper elevation={1} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Tasks
          </Typography>
          {renderDataTable()}
        </Paper>
      </TabPanel>

      {/* Counterparty Search Tab */}
      <TabPanel value={tabValue} index={1}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="animate__animated animate__fadeIn"
        >
          <Paper elevation={1} sx={{ p: 2, mb: 2, borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 120 }}>
              <Typography variant="body1" sx={{ fontWeight: 500, color: '#333333' }}>Source System</Typography>
              <FormControl size="small" sx={{ mt: 1 }}>
                <Select
                  value={sourceSystem}
                  displayEmpty
                  onChange={(e) => setSourceSystem(e.target.value)}
                  sx={{ height: 36, minWidth: 120 }}
                >
                  <MenuItem value=""><em>Select System</em></MenuItem>
                  <MenuItem value="CIRC">CIRC</MenuItem>
                  <MenuItem value="system2">System 2</MenuItem>
                  <MenuItem value="system3">System 3</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
              <Typography variant="body1" sx={{ fontWeight: 500, color: '#333333' }}>Counterparty</Typography>
              <TextField 
                size="small"
                variant="outlined" 
                value={counterparty}
                onChange={(e) => setCounterparty(e.target.value)}
                defaultValue="The Boeing Company"
                sx={{ mt: 1 }}
                placeholder="Enter counterparty name"
              />
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 120 }}>
              <Typography variant="body1" sx={{ fontWeight: 500, color: '#333333' }}>WCIS ID</Typography>
              <TextField 
                size="small"
                variant="outlined" 
                sx={{ mt: 1 }}
              />
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'flex-end', mt: 3 }}>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={handleCounterpartySearch}
                  sx={{ 
                    minHeight: 36, 
                    px: 3, 
                    bgcolor: '#222222', 
                    '&:hover': { bgcolor: '#444444' },
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.15)',
                    transition: 'all 0.3s ease'
                  }}
                  className="animate__animated animate__pulse"
                >
                  Submit
                </Button>
              </motion.div>
            </Box>
          </Box>
        </Paper>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="animate__animated animate__fadeIn"
        >
          <Paper elevation={1} sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#222222', mb: 1 }} gutterBottom>
              Tasks
            </Typography>
            {renderDataTable()}
          </Paper>
        </motion.div>
      </TabPanel>
    </Box>
  );
}
