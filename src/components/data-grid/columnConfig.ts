import type { Column } from '../../types';

// Define all available columns for the data grid
export const allColumns: Column[] = [
  { id: 'tradeId', label: 'Trade ID', align: 'left' },
  { id: 'counterparty', label: 'Counterparty', align: 'left' },
  { id: 'tradeDate', label: 'Trade Date', align: 'center' },
  { id: 'effectiveDate', label: 'Effective Date', align: 'center' },
  { id: 'instrumentType', label: 'Instrument Type', align: 'left' },
  { id: 'instrumentId', label: 'Instrument ID', align: 'left' },
  { id: 'notional', label: 'Notional', align: 'right' },
  { id: 'currency', label: 'Currency', align: 'center' },
  { id: 'status', label: 'Status', align: 'center' },
  { id: 'trader', label: 'Trader', align: 'left' },
  { id: 'book', label: 'Book', align: 'left' },
  { id: 'assetClass', label: 'Asset Class', align: 'left' },
  { id: 'cva', label: 'CVA', align: 'right' },
  { id: 'dva', label: 'DVA', align: 'right' },
  { id: 'fva', label: 'FVA', align: 'right' },
  { id: 'fca', label: 'FCA', align: 'right' },
  { id: 'fba', label: 'FBA', align: 'right' },
  { id: 'estimatedCharge', label: 'Estimated Charge', align: 'right' },
  { id: 'roe', label: 'ROE', align: 'right' },
  { id: 'cqr', label: 'CQR', align: 'right' },
  { id: 'pricingDescription', label: 'Pricing Description', align: 'left' },
  { id: 'sourceSystem', label: 'Source System', align: 'left' },
];
