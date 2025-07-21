import type { Column } from '../../types';

// Define columns for the search results modal based on the image
export const modalColumns: Column[] = [
  { id: 'selected', label: '', align: 'center' },
  { id: 'proposedAction', label: 'Proposed Action', align: 'left' },
  { id: 'underlyingTradeID', label: 'Underlying Trade ID', align: 'left' },
  { id: 'underlyingBook', label: 'Underlying Book', align: 'left' },
  { id: 'status', label: 'Status', align: 'center' },
  { id: 'productType', label: 'Product Type', align: 'left' },
  { id: 'externalSystem', label: 'External System', align: 'left' },
  { id: 'description', label: 'Description', align: 'left' },
];

// These columns use the mapped field names in the TradeRow format
export const mappedModalColumns: Column[] = [
  { id: 'selected', label: '', align: 'center' },
  { id: 'proposedAction', label: 'Proposed Action', align: 'left' },
  { id: 'tradeId', label: 'Underlying Trade ID', align: 'left' },
  { id: 'book', label: 'Underlying Book', align: 'left' },
  { id: 'status', label: 'Status', align: 'center' },
  { id: 'instrumentType', label: 'Product Type', align: 'left' },
  { id: 'sourceSystem', label: 'External System', align: 'left' },
  { id: 'pricingDescription', label: 'Description', align: 'left' },
];
