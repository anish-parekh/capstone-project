import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { DataGrid, allColumns } from '../data-grid';
import { TradeIdSearch, CounterpartySearch } from '.';
import { generateMockData } from '../../utils/dataUtils';
import type { TradeRow } from '../../types';
import SearchResultsModal from './SearchResultsModal';

// Generate sample data
const sampleRows: TradeRow[] = generateMockData(50);

const SearchPage: React.FC = () => {
  // Page state
  const [activeTab, setActiveTab] = useState<'tradeId' | 'counterparty'>('tradeId');
  const [sourceSystem, setSourceSystem] = useState('');
  const [tradeId, setTradeId] = useState('');
  const [counterparty, setCounterparty] = useState('');
  const [WCISId, setWCISId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Mock data for the modal based on the image
  const mockModalResults = [
    {
      selected: true,
      underlyingTradeID: '13984780',
      underlyingBook: 'METALS_BOOK',
      status: 'VALIDATED',
      productType: 'asianswap',
      externalSystem: 'ENDUR',
      description: 'asianswap/20221231'
    },
    {
      selected: true,
      underlyingTradeID: '01_87833997_0',
      underlyingBook: 'GBP_GBP',
      status: 'INOPICS',
      productType: 'FXSWAP',
      externalSystem: 'CMR',
      description: 'FX_FORWARDS/20025'
    },
    {
      selected: true,
      underlyingTradeID: '01_79437846_0',
      underlyingBook: 'GBP_JES',
      status: 'INOPICS',
      productType: 'FXFWD',
      externalSystem: 'CMR',
      description: 'FX_FORWARDS/20027'
    },
    {
      selected: true,
      underlyingTradeID: '01_79437878_0',
      underlyingBook: 'GBP_JES',
      status: 'INOPICS',
      productType: 'FXFWD',
      externalSystem: 'CMR',
      description: 'FX_FORWARDS/20028'
    },
    {
      selected: true,
      underlyingTradeID: '01_80091409_0',
      underlyingBook: 'CHF_CHF',
      status: 'INOPICS',
      productType: 'FXFWD',
      externalSystem: 'CMR',
      description: 'FX_FORWARDS/20028'
    },
    {
      selected: true,
      underlyingTradeID: '01_69325336_0',
      underlyingBook: 'EUR_PSI',
      status: 'INOPICS',
      productType: 'FXFWD',
      externalSystem: 'CMR',
      description: 'FX_FORWARDS/20027'
    },
    {
      selected: true,
      underlyingTradeID: '01_69325462_0',
      underlyingBook: 'EUR_PSI',
      status: 'INOPICS',
      productType: 'FXFWD',
      externalSystem: 'CMR',
      description: 'FX_FORWARDS/20026'
    },
    {
      selected: true,
      underlyingTradeID: '01_79437624_0',
      underlyingBook: 'GBP_JES',
      status: 'INOPICS',
      productType: 'FXFWD',
      externalSystem: 'CMR',
      description: 'FX_FORWARDS/20026'
    },
    {
      selected: true,
      underlyingTradeID: '01_79437383_0',
      underlyingBook: 'GBP_JES',
      status: 'INOPICS',
      productType: 'FXFWD',
      externalSystem: 'CMR',
      description: 'FX_FORWARDS/20024'
    },
    {
      selected: true,
      underlyingTradeID: '01_79437379_0',
      underlyingBook: 'GBP_JES',
      status: 'INOPICS',
      productType: 'FXFWD',
      externalSystem: 'CMR',
      description: 'FX_FORWARDS/20025'
    },
    {
      selected: true,
      underlyingTradeID: '01_69258904_0',
      underlyingBook: 'CHF_CHF',
      status: 'INOPICS',
      productType: 'FXFWD',
      externalSystem: 'CMR',
      description: 'FX_FORWARDS/20025'
    }
  ];
  
  const handleSearch = () => {
    // In a real app, this would trigger an API call
    console.log('Searching with:', { sourceSystem, tradeId, counterparty });
    // Open the modal with search results
    setIsModalOpen(true);
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
      {/* Search Results Modal */}
      <SearchResultsModal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        results={mockModalResults}
        searchType={activeTab}
        searchValue={activeTab === 'tradeId' ? tradeId : counterparty}
      />
      
      {/* Tabs at the top */}
      <Box sx={{ 
        display: 'flex', 
        width: '100%', 
        backgroundColor: '#1e2738',
        mb: 1.5,
        borderTopLeftRadius: '4px',
        borderTopRightRadius: '4px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <Box 
          onClick={() => setActiveTab('tradeId')}
          sx={{
            flex: 1,
            p: 1,
            textAlign: 'center',
            color: '#fff',
            cursor: 'pointer',
            borderBottom: activeTab === 'tradeId' ? '2px solid #ffffff' : 'none',
            borderRight: '1px solid rgba(255, 255, 255, 0.3)',
            fontWeight: activeTab === 'tradeId' ? 700 : 400,
            position: 'relative',
            transition: 'all 0.3s ease',
            ...(activeTab === 'tradeId' && {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            }),
            '&:hover': {
              backgroundColor: activeTab === 'tradeId' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.1)',
              transform: 'translateY(-1px)',
            },
            '&:after': activeTab === 'tradeId' ? {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              height: '2px',
              backgroundColor: '#ffffff',
              boxShadow: '0 0 8px rgba(255, 255, 255, 0.7)',
            } : {}
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 0.5 }}>
            <Box component="span" sx={{ fontSize: '0.8rem' }}>Trade ID Search</Box>
          </Box>
        </Box>
        <Box 
          onClick={() => setActiveTab('counterparty')}
          sx={{
            flex: 1,
            p: 1,
            textAlign: 'center',
            color: '#fff',
            cursor: 'pointer',
            borderBottom: activeTab === 'counterparty' ? '2px solid #ffffff' : 'none',
            fontWeight: activeTab === 'counterparty' ? 700 : 400,
            position: 'relative',
            transition: 'all 0.3s ease',
            ...(activeTab === 'counterparty' && {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            }),
            '&:hover': {
              backgroundColor: activeTab === 'counterparty' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.1)',
              transform: 'translateY(-1px)',
            },
            '&:after': activeTab === 'counterparty' ? {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              height: '2px',
              backgroundColor: '#ffffff',
              boxShadow: '0 0 8px rgba(255, 255, 255, 0.7)',
            } : {}
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 0.5 }}>
            <Box component="span" sx={{ fontSize: '0.8rem' }}>Counterparty Search</Box>
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
          
          <Box sx={{ mt: 0.5, px: 1.5, py: 0.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>Results ({sampleRows.length})</Typography>
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
          
          <Box sx={{ mt: 0.5, px: 1.5, py: 0.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>Results ({sampleRows.length})</Typography>
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
