// Common types used throughout the application

// Column definition type
export interface Column {
  id: string;
  label: string;
  align?: 'left' | 'center' | 'right';
}

// Column filter type
export interface ColumnFilter {
  id: string;
  value: string;
}

// Column width type
export interface ColumnWidth {
  id: string;
  width: number;
}

// Sort configuration type
export interface SortConfig {
  key: string | null;
  direction: 'asc' | 'desc' | null;
}

// Row data type (for trade data)
export interface TradeRow {
  id: string;
  tradeId: string;
  counterparty: string;
  tradeDate: string;
  effectiveDate: string;
  instrumentType: string;
  instrumentId: string;
  notional: number;
  currency: string;
  status: string;
  trader: string;
  book: string;
  assetClass: string;
  cva: number;
  dva: number;
  fva: number;
  fca: number;
  fba: number;
  estimatedCharge: number;
  roe: number;
  cqr: number;
  pricingDescription: string;
  sourceSystem: string;
  [key: string]: any; // Allow indexing with string
}

// Extend Window interface for column resize functionality
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
