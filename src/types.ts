// Define column type
export interface Column {
  id: string;
  label: string;
  align?: 'left' | 'right' | 'center';
}

// Define sorting direction type
export type SortDirection = 'asc' | 'desc' | null;

// Define sort configuration
export interface SortConfig {
  key: string | null;
  direction: SortDirection;
}

// Define filter type
export interface ColumnFilter {
  id: string;
  value: string;
}

// Define column width type
export interface ColumnWidth {
  id: string;
  width: number;
}

// Define trade row data structure
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
}

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
