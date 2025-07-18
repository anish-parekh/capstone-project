import type { TradeRow } from '../types';

// Generate mock data for the grid
export const generateMockData = (count: number): TradeRow[] => {
  const assetClasses = ['Equity', 'Fixed Income', 'Currency', 'Commodity', 'Credit', 'Rates'];
  const counterparties = ['ACME Corp', 'Global Bank', 'Finance Co', 'Trading LLC', 'Hedge Fund X', 'Investment Bank Y', 'Credit Union Z', 'Mutual Fund A', 'Pension Fund B', 'Insurance Co C'];
  const pricingDescriptions = ['Standard', 'Premium', 'Enhanced', 'Basic', 'Complex', 'Legacy', 'Special'];
  const statuses = ['Pending', 'Completed', 'Processing', 'Failed', 'On Hold', 'Reviewing', 'Approved'];
  
  return Array.from({ length: count }, (_, i) => {
    const id = `TR-${(i + 1).toString().padStart(6, '0')}`;
    const notional = Math.floor(Math.random() * 10000000) + 100000;
    const cva = Math.floor(Math.random() * 50000) + 1000;
    const dva = Math.floor(Math.random() * 30000) + 500;
    const fva = Math.floor(Math.random() * 20000) + 300;
    const fca = Math.floor(Math.random() * 15000) + 200;
    const fba = Math.floor(Math.random() * 10000) + 100;
    
    return {
      id: `row-${i}`,
      tradeId: id,
      counterparty: counterparties[Math.floor(Math.random() * counterparties.length)],
      tradeDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
      effectiveDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
      instrumentType: Math.random() > 0.5 ? 'Swap' : 'Option',
      instrumentId: `INST-${Math.floor(Math.random() * 10000)}`,
      notional,
      currency: Math.random() > 0.3 ? 'USD' : (Math.random() > 0.5 ? 'EUR' : 'GBP'),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      trader: `Trader ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
      book: `Book-${Math.floor(Math.random() * 100)}`,
      assetClass: assetClasses[Math.floor(Math.random() * assetClasses.length)],
      cva,
      dva,
      fva,
      fca,
      fba,
      estimatedCharge: cva + dva + fva + fca + fba,
      roe: Math.random() * 0.2,
      cqr: Math.random() * 0.5,
      pricingDescription: pricingDescriptions[Math.floor(Math.random() * pricingDescriptions.length)],
      sourceSystem: Math.random() > 0.5 ? 'System A' : (Math.random() > 0.5 ? 'System B' : 'System C'),
    };
  });
};

// Calculate column width based on content
export const calculateColumnWidth = (text: string): number => {
  // More generous width calculation to prevent truncation
  // Each character is roughly 10px wide for normal text, 12px for bold text
  // Add extra padding for sort and filter icons (80px)
  const baseWidth = text.length * 12 + 80;
  
  // Minimum width of 120px, no maximum to ensure text fits
  return Math.max(120, baseWidth);
};
