import React, { useState, useEffect } from 'react';
import { User, Stock, PortfolioItem, Transaction } from './types';
import { SwingWindow } from './components/SwingWindow';
import { CodeExplorer } from './components/CodeExplorer';
import { UmlDiagrams } from './components/UmlDiagrams';
import { JavaDocGuide } from './components/JavaDocGuide';
import { DataPersistenceView } from './components/DataPersistenceView';
import { Monitor, Code2, Layers, HardDrive, BookOpen, Sparkles, Coffee } from 'lucide-react';

const INITIAL_USERS: User[] = [
  {
    id: 'user-001',
    name: 'Admin User',
    email: 'admin@stocktrading.com',
    walletBalance: 50000.0,
    isAdmin: true,
    watchlist: ['AAPL', 'NVDA']
  },
  {
    id: 'user-002',
    name: 'John Doe',
    email: 'trader@stocktrading.com',
    walletBalance: 10000.0,
    isAdmin: false,
    watchlist: ['AAPL', 'GOOGL', 'TSLA']
  }
];

const INITIAL_STOCKS: Stock[] = [
  { symbol: 'AAPL', companyName: 'Apple Inc.', currentPrice: 185.50, previousPrice: 185.50, dayHigh: 185.50, dayLow: 185.50, availableQuantity: 5000, sector: 'Technology', history: [180, 182, 184, 185.50] },
  { symbol: 'MSFT', companyName: 'Microsoft Corp.', currentPrice: 415.20, previousPrice: 415.20, dayHigh: 415.20, dayLow: 415.20, availableQuantity: 3500, sector: 'Technology', history: [410, 412, 415.20] },
  { symbol: 'GOOGL', companyName: 'Alphabet Inc.', currentPrice: 175.80, previousPrice: 175.80, dayHigh: 175.80, dayLow: 175.80, availableQuantity: 4200, sector: 'Technology', history: [170, 172, 175.80] },
  { symbol: 'AMZN', companyName: 'Amazon.com Inc.', currentPrice: 182.30, previousPrice: 182.30, dayHigh: 182.30, dayLow: 182.30, availableQuantity: 4800, sector: 'Consumer Cyclical', history: [178, 180, 182.30] },
  { symbol: 'NVDA', companyName: 'NVIDIA Corporation', currentPrice: 128.90, previousPrice: 128.90, dayHigh: 128.90, dayLow: 128.90, availableQuantity: 6000, sector: 'Semiconductors', history: [120, 125, 128.90] },
  { symbol: 'TSLA', companyName: 'Tesla Inc.', currentPrice: 225.40, previousPrice: 225.40, dayHigh: 225.40, dayLow: 225.40, availableQuantity: 3000, sector: 'Automotive', history: [220, 222, 225.40] },
  { symbol: 'JPM', companyName: 'JPMorgan Chase & Co.', currentPrice: 205.10, previousPrice: 205.10, dayHigh: 205.10, dayLow: 205.10, availableQuantity: 2500, sector: 'Financial Services', history: [200, 203, 205.10] },
  { symbol: 'V', companyName: 'Visa Inc.', currentPrice: 272.60, previousPrice: 272.60, dayHigh: 272.60, dayLow: 272.60, availableQuantity: 2200, sector: 'Financial Services', history: [268, 270, 272.60] },
  { symbol: 'WMT', companyName: 'Walmart Inc.', currentPrice: 68.40, previousPrice: 68.40, dayHigh: 68.40, dayLow: 68.40, availableQuantity: 8000, sector: 'Consumer Staples', history: [65, 67, 68.40] },
  { symbol: 'DIS', companyName: 'The Walt Disney Co.', currentPrice: 96.80, previousPrice: 96.80, dayHigh: 96.80, dayLow: 96.80, availableQuantity: 3400, sector: 'Entertainment', history: [94, 95, 96.80] }
];

const INITIAL_PORTFOLIO: PortfolioItem[] = [
  { stockSymbol: 'AAPL', companyName: 'Apple Inc.', quantity: 15, averageBuyPrice: 175.00 },
  { stockSymbol: 'NVDA', companyName: 'NVIDIA Corporation', quantity: 30, averageBuyPrice: 115.00 }
];

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    transactionId: 'TX-984021-A',
    userId: 'user-002',
    stockSymbol: 'AAPL',
    quantity: 15,
    price: 175.00,
    type: 'BUY',
    timestamp: '2026-08-01 10:15:30',
    totalAmount: 2625.00
  },
  {
    transactionId: 'TX-984022-B',
    userId: 'user-002',
    stockSymbol: 'NVDA',
    quantity: 30,
    price: 115.00,
    type: 'BUY',
    timestamp: '2026-08-01 11:20:12',
    totalAmount: 3450.00
  }
];

export default function App() {
  const [mainTab, setMainTab] = useState<'simulator' | 'code' | 'uml' | 'files' | 'guide'>('simulator');

  // Application state
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[1]); // Default Trader
  const [stocks, setStocks] = useState<Stock[]>(INITIAL_STOCKS);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>(INITIAL_PORTFOLIO);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);

  // 10-Second Multithreaded Market Simulator State
  const [isSimulating, setIsSimulating] = useState<boolean>(true);

  // Price Tick Simulator Effect (runs every 10 seconds)
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      triggerPriceTick();
    }, 10000);

    return () => clearInterval(interval);
  }, [isSimulating]);

  const triggerPriceTick = () => {
    setStocks(prevStocks =>
      prevStocks.map(stock => {
        // Random fluctuation between -5% and +5%
        const changePercent = (Math.random() * 0.10) - 0.05;
        const newPrice = Math.max(0.01, stock.currentPrice * (1 + changePercent));
        const dayHigh = Math.max(stock.dayHigh, newPrice);
        const dayLow = Math.min(stock.dayLow === 0 ? newPrice : stock.dayLow, newPrice);

        return {
          ...stock,
          previousPrice: stock.currentPrice,
          currentPrice: parseFloat(newPrice.toFixed(2)),
          dayHigh: parseFloat(dayHigh.toFixed(2)),
          dayLow: parseFloat(dayLow.toFixed(2)),
          history: [...stock.history, parseFloat(newPrice.toFixed(2))].slice(-20)
        };
      })
    );
  };

  // Auth
  const handleLogin = (email: string) => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      setCurrentUser(user);
    }
  };

  const handleRegister = (name: string, email: string, deposit: number) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      walletBalance: deposit,
      isAdmin: false,
      watchlist: []
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
  };

  // Trading logic
  const handleBuyStock = (symbol: string, quantity: number) => {
    const stock = stocks.find(s => s.symbol === symbol);
    if (!stock) return { success: false, message: 'Stock not found.' };

    if (stock.availableQuantity < quantity) {
      return { success: false, message: `Insufficient stock in market! Requested: ${quantity}, Available: ${stock.availableQuantity}` };
    }

    const totalCost = stock.currentPrice * quantity;
    if (currentUser.walletBalance < totalCost) {
      return { success: false, message: `Insufficient wallet balance! Required: $${totalCost.toFixed(2)}, Available: $${currentUser.walletBalance.toFixed(2)}` };
    }

    // 1. Deduct wallet
    const updatedBalance = currentUser.walletBalance - totalCost;
    setCurrentUser(prev => ({ ...prev, walletBalance: updatedBalance }));
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, walletBalance: updatedBalance } : u));

    // 2. Reduce stock quantity in market
    setStocks(prev => prev.map(s => s.symbol === symbol ? { ...s, availableQuantity: s.availableQuantity - quantity } : s));

    // 3. Add to portfolio
    setPortfolioItems(prev => {
      const existing = prev.find(item => item.stockSymbol === symbol);
      if (existing) {
        const totalOldCost = existing.quantity * existing.averageBuyPrice;
        const totalNewCost = quantity * stock.currentPrice;
        const newTotalQty = existing.quantity + quantity;
        const newAvgPrice = (totalOldCost + totalNewCost) / newTotalQty;
        return prev.map(item => item.stockSymbol === symbol ? { ...item, quantity: newTotalQty, averageBuyPrice: newAvgPrice } : item);
      } else {
        return [...prev, { stockSymbol: symbol, companyName: stock.companyName, quantity, averageBuyPrice: stock.currentPrice }];
      }
    });

    // 4. Log transaction
    const newTx: Transaction = {
      transactionId: `TX-${Math.floor(100000 + Math.random() * 900000)}`,
      userId: currentUser.id,
      stockSymbol: symbol,
      quantity,
      price: stock.currentPrice,
      type: 'BUY',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      totalAmount: totalCost
    };
    setTransactions(prev => [newTx, ...prev]);

    return { success: true, message: `Purchased ${quantity} shares of ${symbol} for $${totalCost.toFixed(2)}` };
  };

  const handleSellStock = (symbol: string, quantity: number) => {
    const stock = stocks.find(s => s.symbol === symbol);
    const item = portfolioItems.find(p => p.stockSymbol === symbol);

    if (!item || item.quantity < quantity) {
      return { success: false, message: `You do not own ${quantity} shares of ${symbol}.` };
    }

    const price = stock ? stock.currentPrice : item.averageBuyPrice;
    const totalProceeds = price * quantity;

    // 1. Credit wallet balance
    const updatedBalance = currentUser.walletBalance + totalProceeds;
    setCurrentUser(prev => ({ ...prev, walletBalance: updatedBalance }));
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, walletBalance: updatedBalance } : u));

    // 2. Add quantity back to market
    if (stock) {
      setStocks(prev => prev.map(s => s.symbol === symbol ? { ...s, availableQuantity: s.availableQuantity + quantity } : s));
    }

    // 3. Deduct from portfolio
    setPortfolioItems(prev => {
      return prev.map(i => {
        if (i.stockSymbol === symbol) {
          const remaining = i.quantity - quantity;
          return remaining > 0 ? { ...i, quantity: remaining } : null;
        }
        return i;
      }).filter(Boolean) as PortfolioItem[];
    });

    // 4. Log transaction
    const newTx: Transaction = {
      transactionId: `TX-${Math.floor(100000 + Math.random() * 900000)}`,
      userId: currentUser.id,
      stockSymbol: symbol,
      quantity,
      price,
      type: 'SELL',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      totalAmount: totalProceeds
    };
    setTransactions(prev => [newTx, ...prev]);

    return { success: true, message: `Sold ${quantity} shares of ${symbol} for $${totalProceeds.toFixed(2)}` };
  };

  // Wallet ops
  const handleDeposit = (amount: number) => {
    const updatedBalance = currentUser.walletBalance + amount;
    setCurrentUser(prev => ({ ...prev, walletBalance: updatedBalance }));
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, walletBalance: updatedBalance } : u));

    const newTx: Transaction = {
      transactionId: `TX-${Math.floor(100000 + Math.random() * 900000)}`,
      userId: currentUser.id,
      stockSymbol: 'CASH',
      quantity: 1,
      price: amount,
      type: 'DEPOSIT',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      totalAmount: amount
    };
    setTransactions(prev => [newTx, ...prev]);

    return { success: true, message: `Deposited $${amount.toFixed(2)} into wallet.` };
  };

  const handleWithdraw = (amount: number) => {
    if (currentUser.walletBalance < amount) {
      return { success: false, message: `Insufficient wallet balance! Available: $${currentUser.walletBalance.toFixed(2)}` };
    }

    const updatedBalance = currentUser.walletBalance - amount;
    setCurrentUser(prev => ({ ...prev, walletBalance: updatedBalance }));
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, walletBalance: updatedBalance } : u));

    const newTx: Transaction = {
      transactionId: `TX-${Math.floor(100000 + Math.random() * 900000)}`,
      userId: currentUser.id,
      stockSymbol: 'CASH',
      quantity: 1,
      price: amount,
      type: 'WITHDRAW',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      totalAmount: amount
    };
    setTransactions(prev => [newTx, ...prev]);

    return { success: true, message: `Withdrew $${amount.toFixed(2)} from wallet.` };
  };

  // Admin add stock
  const handleAddStock = (newStockData: Omit<Stock, 'previousPrice' | 'dayHigh' | 'dayLow' | 'history'>) => {
    if (stocks.some(s => s.symbol === newStockData.symbol)) {
      return { success: false, message: `Stock symbol ${newStockData.symbol} already exists.` };
    }

    const newStock: Stock = {
      ...newStockData,
      previousPrice: newStockData.currentPrice,
      dayHigh: newStockData.currentPrice,
      dayLow: newStockData.currentPrice,
      history: [newStockData.currentPrice]
    };

    setStocks(prev => [...prev, newStock]);
    return { success: true, message: `Added stock ${newStock.symbol} (${newStock.companyName}) to the market!` };
  };

  // Watchlist toggle
  const handleToggleWatchlist = (symbol: string) => {
    const updatedWatchlist = currentUser.watchlist.includes(symbol)
      ? currentUser.watchlist.filter(s => s !== symbol)
      : [...currentUser.watchlist, symbol];

    setCurrentUser(prev => ({ ...prev, watchlist: updatedWatchlist }));
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, watchlist: updatedWatchlist } : u));
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200 font-sans selection:bg-blue-600 selection:text-white pb-12 flex flex-col">
      {/* App Header */}
      <header className="border-b border-slate-700 bg-[#1E293B] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shadow-md shadow-blue-500/20">
              <div className="w-4 h-4 border-2 border-white transform rotate-45"></div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-extrabold tracking-tight text-white">
                  JavaTrade<span className="text-blue-400">Pro</span>
                </h1>
                <span className="text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full font-semibold">
                  Java 17 + Swing OOP
                </span>
              </div>
              <p className="text-xs text-slate-400">Multithreaded Stock Market, Binary Persistence & UML Diagrams</p>
            </div>
          </div>

          {/* Wallet Balance & Market Status */}
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Wallet Balance</span>
              <span className="text-base font-mono text-emerald-400 font-bold tracking-tight">
                ${currentUser.walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="h-8 w-[1px] bg-slate-700 hidden sm:block"></div>
            <div className="flex items-center gap-2 bg-[#0F172A] px-3 py-1.5 rounded-lg border border-slate-700">
              <span className={`w-2 h-2 rounded-full ${isSimulating ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
              <span className="text-xs font-semibold text-slate-300">
                {isSimulating ? 'Market Live' : 'Market Paused'}
              </span>
            </div>
          </div>

          {/* Navigation Mode Tabs */}
          <div className="flex items-center gap-1.5 bg-[#0F172A] p-1 rounded-xl border border-slate-700 text-xs w-full lg:w-auto overflow-x-auto">
            {[
              { id: 'simulator', label: 'Desktop App Simulator', icon: Monitor },
              { id: 'code', label: 'Java Code Explorer', icon: Code2 },
              { id: 'uml', label: 'UML & Flowcharts', icon: Layers },
              { id: 'files', label: 'File Persistence (.dat)', icon: HardDrive },
              { id: 'guide', label: 'Setup Guide & JavaDoc', icon: BookOpen }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setMainTab(tab.id as any)}
                  className={`px-3.5 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                    mainTab === tab.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main View Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 flex-1 w-full">
        {mainTab === 'simulator' && (
          <SwingWindow
            users={users}
            stocks={stocks}
            portfolioItems={portfolioItems}
            transactions={transactions}
            currentUser={currentUser}
            onLogin={handleLogin}
            onRegister={handleRegister}
            onBuyStock={handleBuyStock}
            onSellStock={handleSellStock}
            onDeposit={handleDeposit}
            onWithdraw={handleWithdraw}
            onAddStock={handleAddStock}
            onToggleWatchlist={handleToggleWatchlist}
            onTriggerPriceTick={triggerPriceTick}
            isSimulating={isSimulating}
            setIsSimulating={setIsSimulating}
            simIntervalSeconds={10}
          />
        )}

        {mainTab === 'code' && <CodeExplorer />}

        {mainTab === 'uml' && <UmlDiagrams />}

        {mainTab === 'files' && (
          <DataPersistenceView
            users={users}
            stocks={stocks}
            portfolioItems={portfolioItems}
            transactions={transactions}
          />
        )}

        {mainTab === 'guide' && <JavaDocGuide />}
      </main>
    </div>
  );
}
