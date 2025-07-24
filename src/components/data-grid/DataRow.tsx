import React, { useState } from 'react';
import { TableRow, TableCell, Checkbox } from '@mui/material';
import type { Column, TradeRow } from '../../types';

interface DataRowProps {
  row: TradeRow;
  index: number;
  visibleColumns: Column[];
  getColumnWidth: (columnId: string) => number;
  onRowClick: (row: TradeRow) => void;
}

const DataRow: React.FC<DataRowProps> = ({
  row,
  index,
  visibleColumns,
  getColumnWidth,
  onRowClick
}) => {
  // Add state to track click effect
  const [isClicked, setIsClicked] = useState(false);
  
  // Handle click animation and open popup
  const handleRowClick = () => {
    setIsClicked(true);
    
    // Show the click animation first, then open the popup
    setTimeout(() => {
      setIsClicked(false);
      onRowClick(row); // Open the popup after the click animation
    }, 150);
  };
  
  // Alternate row styling
  const isEven = index % 2 === 0;
  
  return (
    <TableRow 
      key={row.id}
      onClick={handleRowClick}
      sx={{ 
        backgroundColor: isEven ? '#ffffff' : '#f8fafc',
        transition: 'all 0.15s ease',
        transform: isClicked ? 'scale(0.995)' : 'scale(1)',
        boxShadow: isClicked ? 'inset 0 0 0 2px rgba(30, 41, 59, 0.3)' : 'none',
        '&:hover': {
          backgroundColor: '#f1f5f9',
          boxShadow: 'inset 0 0 0 1px rgba(148, 163, 184, 0.2)'
        },
        '&:active': {
          transform: 'scale(0.995)',
          backgroundColor: '#e2e8f0',
          boxShadow: 'inset 0 0 0 2px rgba(30, 41, 59, 0.3)'
        },
        cursor: 'pointer' // Add pointer cursor to indicate clickable row
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
      {visibleColumns.map((column) => {
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
};

export default DataRow;
