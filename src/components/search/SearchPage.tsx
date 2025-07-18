import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { DataGrid, allColumns } from '../data-grid';
import { TradeIdSearch, CounterpartySearch } from '.';
import { generateMockData } from '../../utils/dataUtils';
import type { TradeRow } from '../../types';

// Generate sample data
const sampleRows: TradeRow[] = generateMockData(50);

const SearchPage: React.FC = () => {
  // Page state
  const [activeTab, setActiveTab] = useState<'tradeId' | 'counterparty'>('tradeId');
  const [sourceSystem, setSourceSystem] = useState('');
  const [tradeId, setTradeId] = useState('');
  const [counterparty, setCounterparty] = useState('');
  const [WCISId, setWCISId] = useState('');
  
  const handleSearch = () => {
    // In a real app, this would trigger an API call
    console.log('Searching with:', { sourceSystem, tradeId, counterparty });
  };
  
  const handleClear = () => {
    if (activeTab === 'tradeId') {
      setTradeId('');
      setSourceSystem('');
    } else {
      setCounterparty('');
      setSourceSystem('');
      setWCISId('');
    }
  };

  return (
    <Box>
      {/* Tabs at the top */}
      <Box sx={{ 
        display: 'flex', 
        width: '100%', 
        backgroundColor: '#1e2738',
        mb: 3,
        borderTopLeftRadius: '4px',
        borderTopRightRadius: '4px',
      }}>
        <Box 
          onClick={() => setActiveTab('tradeId')}
          sx={{
            flex: 1,
            p: 1.5,
            textAlign: 'center',
            color: '#fff',
            cursor: 'pointer',
            borderBottom: activeTab === 'tradeId' ? '3px solid #fff' : 'none',
            borderRight: '1px solid rgba(255, 255, 255, 0.3)',
            fontWeight: activeTab === 'tradeId' ? 700 : 400,
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: activeTab === 'tradeId' ? 'transparent' : 'rgba(255, 255, 255, 0.1)',
            }
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
            <Box component="span" sx={{ fontSize: '0.9rem' }}>Trade ID Search</Box>
          </Box>
        </Box>
        <Box 
          onClick={() => setActiveTab('counterparty')}
          sx={{
            flex: 1,
            p: 1.5,
            textAlign: 'center',
            color: '#fff',
            cursor: 'pointer',
            borderBottom: activeTab === 'counterparty' ? '3px solid #fff' : 'none',
            fontWeight: activeTab === 'counterparty' ? 700 : 400,
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: activeTab === 'counterparty' ? 'transparent' : 'rgba(255, 255, 255, 0.1)',
            }
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
            <Box component="span" sx={{ fontSize: '0.9rem' }}>Counterparty Search</Box>
          </Box>
        </Box>
      </Box>
      
      {/* Trade ID Search Panel */}
      {activeTab === 'tradeId' && (
        <Box>
          <TradeIdSearch 
            sourceSystem={sourceSystem}
            tradeId={tradeId}
            onSourceSystemChange={setSourceSystem}
            onTradeIdChange={setTradeId}
            onSearch={handleSearch}
            onClear={handleClear}
          />
          
          <Box sx={{ mt: 1, px: 2, py: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>Results ({sampleRows.length})</Typography>
            </Box>
            <DataGrid 
              data={sampleRows}
              columns={allColumns}
            />
          </Box>
        </Box>
      )}
      
      {/* Counterparty Search Panel */}
      {activeTab === 'counterparty' && (
        <Box>
          <CounterpartySearch 
            counterparty={counterparty}
            onCounterpartyChange={setCounterparty}
            sourceSystem={sourceSystem}
            onSourceSystemChange={setSourceSystem}
            WCISId={WCISId}
            onWCISIdChange={setWCISId}
            onSearch={handleSearch}
            onClear={handleClear}
          />
          
          <Box sx={{ mt: 1, px: 2, py: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>Results ({sampleRows.length})</Typography>
            </Box>
            <DataGrid 
              data={sampleRows}
              columns={allColumns}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default SearchPage;
