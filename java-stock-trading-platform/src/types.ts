export interface User {
  id: string;
  name: string;
  email: string;
  walletBalance: number;
  isAdmin: boolean;
  watchlist: string[];
}

export interface Stock {
  symbol: string;
  companyName: string;
  currentPrice: number;
  previousPrice: number;
  dayHigh: number;
  dayLow: number;
  availableQuantity: number;
  sector: string;
  history: number[];
}

export interface PortfolioItem {
  stockSymbol: string;
  companyName: string;
  quantity: number;
  averageBuyPrice: number;
}

export interface Transaction {
  transactionId: string;
  userId: string;
  stockSymbol: string;
  quantity: number;
  price: number;
  type: 'BUY' | 'SELL' | 'DEPOSIT' | 'WITHDRAW';
  timestamp: string;
  totalAmount: number;
}

export interface JavaSourceFile {
  path: string;
  name: string;
  package: string;
  category: 'model' | 'service' | 'ui' | 'util' | 'exception' | 'thread' | 'database' | 'main' | 'config';
  code: string;
  description: string;
  oopConcepts: string[];
}
