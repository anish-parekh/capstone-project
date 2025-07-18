import React from 'react';
import { TableRow, TableCell, Checkbox } from '@mui/material';
import type { Column, TradeRow } from '../../types';

interface DataRowProps {
  row: TradeRow;
  index: number;
  visibleColumns: Column[];
  getColumnWidth: (columnId: string) => number;
}

const DataRow: React.FC<DataRowProps> = ({
  row,
  index,
  visibleColumns,
  getColumnWidth
}) => {
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
