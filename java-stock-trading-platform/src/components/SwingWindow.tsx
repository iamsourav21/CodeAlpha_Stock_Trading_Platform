import React, { useState, useEffect } from 'react';
import { User, Stock, PortfolioItem, Transaction } from '../types';
import {
  TrendingUp, TrendingDown, DollarSign, Wallet, RefreshCw, Search,
  Play, Pause, Plus, Minus, FileText, Download, Shield, UserCheck, Star,
  CheckCircle, AlertCircle, Eye, Settings, HelpCircle, Activity
} from 'lucide-react';

interface SwingWindowProps {
  users: User[];
  stocks: Stock[];
  portfolioItems: PortfolioItem[];
  transactions: Transaction[];
  currentUser: User;
  onLogin: (email: string) => void;
  onRegister: (name: string, email: string, deposit: number) => void;
  onBuyStock: (symbol: string, quantity: number) => { success: boolean; message: string };
  onSellStock: (symbol: string, quantity: number) => { success: boolean; message: string };
  onDeposit: (amount: number) => { success: boolean; message: string };
  onWithdraw: (amount: number) => { success: boolean; message: string };
  onAddStock: (stock: Omit<Stock, 'previousPrice' | 'dayHigh' | 'dayLow' | 'history'>) => { success: boolean; message: string };
  onToggleWatchlist: (symbol: string) => void;
  onTriggerPriceTick: () => void;
  isSimulating: boolean;
  setIsSimulating: (sim: boolean) => void;
  simIntervalSeconds: number;
}

export const SwingWindow: React.FC<SwingWindowProps> = ({
  users,
  stocks,
  portfolioItems,
  transactions,
  currentUser,
  onLogin,
  onRegister,
  onBuyStock,
  onSellStock,
  onDeposit,
  onWithdraw,
  onAddStock,
  onToggleWatchlist,
  onTriggerPriceTick,
  isSimulating,
  setIsSimulating,
  simIntervalSeconds
}) => {
  const [activeTab, setActiveTab] = useState<'market' | 'portfolio' | 'wallet' | 'transactions' | 'watchlist' | 'admin' | 'profile'>('market');
  const [swingTheme, setSwingTheme] = useState<'nimbus' | 'flatlaf-dark' | 'flatlaf-light' | 'metal'>('flatlaf-dark');

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('All Sectors');

  // Dialog Modals
  const [showBuyModal, setShowBuyModal] = useState<Stock | null>(null);
  const [buyQty, setBuyQty] = useState('10');
  const [showSellModal, setShowSellModal] = useState<PortfolioItem | null>(null);
  const [sellQty, setSellQty] = useState('5');
  const [depositAmt, setDepositAmt] = useState('1000');
  const [withdrawAmt, setWithdrawAmt] = useState('500');

  // Alert Dialog
  const [alertDialog, setAlertDialog] = useState<{ title: string; message: string; isError?: boolean } | null>(null);

  // Admin Stock Form
  const [adminSymbol, setAdminSymbol] = useState('');
  const [adminCompany, setAdminCompany] = useState('');
  const [adminPrice, setAdminPrice] = useState('100');
  const [adminQty, setAdminQty] = useState('1000');
  const [adminSector, setAdminSector] = useState('Technology');

  // Profile Form
  const [profileName, setProfileName] = useState(currentUser.name);
  const [profileEmail, setProfileEmail] = useState(currentUser.email);

  // Filtered stocks
  const filteredStocks = stocks.filter(s => {
    const matchesSearch = s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.companyName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSector = selectedSector === 'All Sectors' || s.sector === selectedSector;
    return matchesSearch && matchesSector;
  });

  // Calculate portfolio totals
  const totalInvestment = portfolioItems.reduce((acc, item) => acc + (item.quantity * item.averageBuyPrice), 0);
  const totalMarketValue = portfolioItems.reduce((acc, item) => {
    const currentStock = stocks.find(s => s.symbol === item.stockSymbol);
    const price = currentStock ? currentStock.currentPrice : item.averageBuyPrice;
    return acc + (item.quantity * price);
  }, 0);
  const totalProfitLoss = totalMarketValue - totalInvestment;
  const returnPercentage = totalInvestment > 0 ? (totalProfitLoss / totalInvestment) * 100 : 0;

  const handleBuySubmit = () => {
    if (!showBuyModal) return;
    const qty = parseInt(buyQty, 10);
    if (isNaN(qty) || qty <= 0) {
      setAlertDialog({ title: 'Invalid Input', message: 'Please enter a valid positive integer quantity.', isError: true });
      return;
    }
    const result = onBuyStock(showBuyModal.symbol, qty);
    setShowBuyModal(null);
    setAlertDialog({ title: result.success ? 'Trade Executed' : 'Trade Failed', message: result.message, isError: !result.success });
  };

  const handleSellSubmit = () => {
    if (!showSellModal) return;
    const qty = parseInt(sellQty, 10);
    if (isNaN(qty) || qty <= 0) {
      setAlertDialog({ title: 'Invalid Input', message: 'Please enter a valid positive integer quantity.', isError: true });
      return;
    }
    const result = onSellStock(showSellModal.stockSymbol, qty);
    setShowSellModal(null);
    setAlertDialog({ title: result.success ? 'Sale Completed' : 'Sale Failed', message: result.message, isError: !result.success });
  };

  const handleDepositSubmit = () => {
    const amt = parseFloat(depositAmt);
    if (isNaN(amt) || amt <= 0) {
      setAlertDialog({ title: 'Invalid Amount', message: 'Please enter a valid positive deposit amount.', isError: true });
      return;
    }
    const result = onDeposit(amt);
    setAlertDialog({ title: result.success ? 'Deposit Successful' : 'Deposit Error', message: result.message, isError: !result.success });
    setDepositAmt('1000');
  };

  const handleWithdrawSubmit = () => {
    const amt = parseFloat(withdrawAmt);
    if (isNaN(amt) || amt <= 0) {
      setAlertDialog({ title: 'Invalid Amount', message: 'Please enter a valid positive withdrawal amount.', isError: true });
      return;
    }
    const result = onWithdraw(amt);
    setAlertDialog({ title: result.success ? 'Withdrawal Successful' : 'Withdrawal Error', message: result.message, isError: !result.success });
    setWithdrawAmt('500');
  };

  const handleAddStockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(adminPrice);
    const qty = parseInt(adminQty, 10);
    if (!adminSymbol || !adminCompany || isNaN(price) || isNaN(qty)) {
      setAlertDialog({ title: 'Input Error', message: 'Please complete all fields with valid numbers.', isError: true });
      return;
    }
    const res = onAddStock({
      symbol: adminSymbol.toUpperCase(),
      companyName: adminCompany,
      currentPrice: price,
      availableQuantity: qty,
      sector: adminSector
    });
    setAlertDialog({ title: res.success ? 'Admin Action' : 'Error', message: res.message, isError: !res.success });
    if (res.success) {
      setAdminSymbol('');
      setAdminCompany('');
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const userTx = transactions.filter(t => t.userId === currentUser.id);
    if (userTx.length === 0) {
      setAlertDialog({ title: 'Export Info', message: 'No transaction history available to export.' });
      return;
    }
    const csvContent = "data:text/csv;charset=utf-8,"
      + "TransactionID,Type,Symbol,Quantity,Price,TotalAmount,Timestamp\n"
      + userTx.map(t => `${t.transactionId},${t.type},${t.stockSymbol},${t.quantity},${t.price},${t.totalAmount},${t.timestamp}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `transactions_${currentUser.id.substring(0, 6)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setAlertDialog({ title: 'Export Complete', message: 'Transaction history downloaded as CSV file!' });
  };

  // Theme styling helpers
  const isDark = swingTheme === 'flatlaf-dark' || swingTheme === 'nimbus';
  const themeBg = isDark ? 'bg-[#0F172A] text-slate-200' : 'bg-slate-100 text-slate-800';
  const headerBg = isDark ? 'bg-[#1E293B] border-slate-700' : 'bg-slate-200 border-slate-300';
  const cardBg = isDark ? 'bg-[#1E293B] border-slate-700' : 'bg-white border-slate-200';
  const tableHeaderBg = isDark ? 'bg-slate-800/90 text-slate-400 border-slate-700' : 'bg-slate-200 text-slate-700 border-slate-300';
  const tableRowHover = isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50';

  return (
    <div className={`rounded-xl shadow-2xl border transition-colors duration-200 overflow-hidden ${themeBg} ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>
      {/* Swing Frame Title Bar */}
      <div className={`flex items-center justify-between px-4 py-2 border-b select-none ${headerBg}`}>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center text-white text-xs font-bold font-mono">
            ☕
          </div>
          <span className="text-xs font-semibold tracking-wide">
            com.stocktrading.ui.MainFrame — Java Swing Desktop App
          </span>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={swingTheme}
            onChange={e => setSwingTheme(e.target.value as any)}
            className={`text-xs px-2 py-0.5 rounded border ${isDark ? 'bg-slate-800 border-slate-600 text-slate-200' : 'bg-white border-slate-300 text-slate-700'}`}
          >
            <option value="nimbus">Swing Theme: Nimbus</option>
            <option value="flatlaf-dark">Swing Theme: FlatLaf Dark</option>
            <option value="flatlaf-light">Swing Theme: FlatLaf Light</option>
            <option value="metal">Swing Theme: Java Metal</option>
          </select>

          <div className="flex items-center gap-1.5 ml-2">
            <span className="w-3 h-3 rounded-full bg-amber-500/80 hover:bg-amber-500 inline-block cursor-pointer"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 hover:bg-emerald-500 inline-block cursor-pointer"></span>
            <span className="w-3 h-3 rounded-full bg-rose-500/80 hover:bg-rose-500 inline-block cursor-pointer"></span>
          </div>
        </div>
      </div>

      {/* Swing Menu Bar */}
      <div className={`flex items-center gap-4 px-4 py-1 text-xs border-b ${isDark ? 'bg-slate-800/80 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'}`}>
        <div className="relative group cursor-pointer font-medium hover:text-blue-500 py-1">
          Account
          <div className={`absolute top-full left-0 hidden group-hover:block w-48 shadow-lg border rounded-md py-1 z-30 ${isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-800'}`}>
            <div className="px-3 py-1 text-xs text-slate-400 font-semibold uppercase">Switch User</div>
            {users.map(u => (
              <button
                key={u.id}
                onClick={() => onLogin(u.email)}
                className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between ${currentUser.email === u.email ? 'bg-blue-500/10 text-blue-500 font-bold' : isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}
              >
                <span>{u.name} {u.isAdmin && '(Admin)'}</span>
                {currentUser.email === u.email && <CheckCircle className="w-3 h-3 text-blue-500" />}
              </button>
            ))}
          </div>
        </div>

        <div className="relative group cursor-pointer font-medium hover:text-blue-500 py-1">
          View
          <div className={`absolute top-full left-0 hidden group-hover:block w-44 shadow-lg border rounded-md py-1 z-30 ${isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-800'}`}>
            <button onClick={() => onTriggerPriceTick()} className="w-full text-left px-3 py-1.5 text-xs hover:bg-blue-500/10 hover:text-blue-500">
              Refresh Market Prices
            </button>
            <button onClick={() => setIsSimulating(!isSimulating)} className="w-full text-left px-3 py-1.5 text-xs hover:bg-blue-500/10 hover:text-blue-500 flex items-center justify-between">
              <span>{isSimulating ? 'Pause 10s Simulator' : 'Start 10s Simulator'}</span>
              {isSimulating ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {currentUser.isAdmin && (
          <button onClick={() => setActiveTab('admin')} className="font-medium text-purple-500 hover:text-purple-600 py-1 flex items-center gap-1">
            <Shield className="w-3 h-3" /> Admin Panel
          </button>
        )}

        <button onClick={() => setAlertDialog({ title: 'About Java Application', message: 'Stock Trading Platform Desktop Application v1.0.0\nBuilt with Core Java 17, Java Swing, and Multithreaded Market Simulator.' })} className="font-medium hover:text-blue-500 py-1 ml-auto flex items-center gap-1">
          <HelpCircle className="w-3 h-3" /> Help
        </button>
      </div>

      {/* Main Tab Bar */}
      <div className={`flex border-b overflow-x-auto ${isDark ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-200/50 border-slate-300'}`}>
        {[
          { id: 'market', label: '📈 Stock Market' },
          { id: 'portfolio', label: '💼 My Portfolio' },
          { id: 'wallet', label: '💳 Wallet' },
          { id: 'transactions', label: '📜 Transaction Log' },
          { id: 'watchlist', label: `⭐ Watchlist (${currentUser.watchlist.length})` },
          currentUser.isAdmin ? { id: 'admin', label: '🛡️ Admin Panel' } : null,
          { id: 'profile', label: '👤 Account Profile' }
        ].filter(Boolean).map(tab => (
          <button
            key={tab!.id}
            onClick={() => setActiveTab(tab!.id as any)}
            className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 -mb-px ${
              activeTab === tab!.id
                ? 'border-blue-600 text-blue-600 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {tab!.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="p-5 min-h-[460px]">
        {/* MARKET TAB */}
        {activeTab === 'market' && (
          <div className="space-y-4">
            {/* Search and Filters */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-1 min-w-[240px]">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search stocks by symbol or company name..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className={`w-full text-xs pl-9 pr-3 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-300'}`}
                  />
                </div>
                <select
                  value={selectedSector}
                  onChange={e => setSelectedSector(e.target.value)}
                  className={`text-xs px-3 py-2 rounded-lg border outline-none ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-300'}`}
                >
                  {['All Sectors', 'Technology', 'Consumer Cyclical', 'Semiconductors', 'Automotive', 'Financial Services', 'Consumer Staples', 'Entertainment'].map(sec => (
                    <option key={sec} value={sec}>{sec}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onTriggerPriceTick()}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Manual Tick
                </button>
                <button
                  onClick={() => setIsSimulating(!isSimulating)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg text-white flex items-center gap-1 ${isSimulating ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                >
                  {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  {isSimulating ? 'Pause Ticker' : 'Auto 10s Ticker'}
                </button>
              </div>
            </div>

            {/* Stocks Table */}
            <div className={`overflow-x-auto rounded-lg border ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
              <table className="w-full text-xs text-left">
                <thead className={`font-semibold uppercase tracking-wider ${tableHeaderBg}`}>
                  <tr>
                    <th className="px-4 py-3">Symbol</th>
                    <th className="px-4 py-3">Company Name</th>
                    <th className="px-4 py-3">Sector</th>
                    <th className="px-4 py-3 text-right">Price</th>
                    <th className="px-4 py-3 text-right">Change</th>
                    <th className="px-4 py-3 text-right">Change %</th>
                    <th className="px-4 py-3 text-right">Available Qty</th>
                    <th className="px-4 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredStocks.map(stock => {
                    const isPositive = stock.currentPrice >= stock.previousPrice;
                    const changeAmt = stock.currentPrice - stock.previousPrice;
                    const changePct = stock.previousPrice > 0 ? (changeAmt / stock.previousPrice) * 100 : 0;
                    const inWatchlist = currentUser.watchlist.includes(stock.symbol);

                    return (
                      <tr key={stock.symbol} className={`transition-colors ${tableRowHover}`}>
                        <td className="px-4 py-2.5 font-bold font-mono text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                          <button onClick={() => onToggleWatchlist(stock.symbol)} title="Toggle Watchlist">
                            <Star className={`w-3.5 h-3.5 ${inWatchlist ? 'fill-amber-400 text-amber-400' : 'text-slate-400 hover:text-amber-400'}`} />
                          </button>
                          {stock.symbol}
                        </td>
                        <td className="px-4 py-2.5 font-medium">{stock.companyName}</td>
                        <td className="px-4 py-2.5 text-slate-500">{stock.sector}</td>
                        <td className="px-4 py-2.5 text-right font-mono font-bold">${stock.currentPrice.toFixed(2)}</td>
                        <td className={`px-4 py-2.5 text-right font-mono font-semibold ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                          {isPositive ? '+' : ''}${changeAmt.toFixed(2)}
                        </td>
                        <td className={`px-4 py-2.5 text-right font-mono font-semibold ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] ${isPositive ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`}>
                            {isPositive ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                            {isPositive ? '+' : ''}{changePct.toFixed(2)}%
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-right font-mono">{stock.availableQuantity.toLocaleString()}</td>
                        <td className="px-4 py-2.5 text-center">
                          <button
                            onClick={() => setShowBuyModal(stock)}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium text-xs shadow-sm transition-transform active:scale-95"
                          >
                            Buy Stock
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PORTFOLIO TAB */}
        {activeTab === 'portfolio' && (
          <div className="space-y-5">
            {/* Metric Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className={`p-4 rounded-xl border ${cardBg}`}>
                <div className="text-xs text-slate-400 font-medium">Total Portfolio Value</div>
                <div className="text-2xl font-bold font-mono mt-1 text-slate-900 dark:text-white">
                  ${totalMarketValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
              <div className={`p-4 rounded-xl border ${cardBg}`}>
                <div className="text-xs text-slate-400 font-medium">Total Cost Basis</div>
                <div className="text-2xl font-bold font-mono mt-1 text-slate-900 dark:text-white">
                  ${totalInvestment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
              <div className={`p-4 rounded-xl border ${cardBg}`}>
                <div className="text-xs text-slate-400 font-medium">Unrealized Profit / Loss</div>
                <div className={`text-2xl font-bold font-mono mt-1 ${totalProfitLoss >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {totalProfitLoss >= 0 ? '+' : ''}${totalProfitLoss.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
              <div className={`p-4 rounded-xl border ${cardBg}`}>
                <div className="text-xs text-slate-400 font-medium">Overall Return %</div>
                <div className={`text-2xl font-bold font-mono mt-1 ${returnPercentage >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {returnPercentage >= 0 ? '+' : ''}{returnPercentage.toFixed(2)}%
                </div>
              </div>
            </div>

            {/* Holdings Table */}
            <div className={`overflow-x-auto rounded-lg border ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
              <table className="w-full text-xs text-left">
                <thead className={`font-semibold uppercase tracking-wider ${tableHeaderBg}`}>
                  <tr>
                    <th className="px-4 py-3">Symbol</th>
                    <th className="px-4 py-3">Company</th>
                    <th className="px-4 py-3 text-right">Shares Owned</th>
                    <th className="px-4 py-3 text-right">Avg Buy Price</th>
                    <th className="px-4 py-3 text-right">Current Price</th>
                    <th className="px-4 py-3 text-right">Market Value</th>
                    <th className="px-4 py-3 text-right">Unrealized P&L</th>
                    <th className="px-4 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {portfolioItems.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                        No stocks in your portfolio yet. Go to the Stock Market tab to buy shares!
                      </td>
                    </tr>
                  ) : (
                    portfolioItems.map(item => {
                      const stock = stocks.find(s => s.symbol === item.stockSymbol);
                      const currentPrice = stock ? stock.currentPrice : item.averageBuyPrice;
                      const holdingValue = item.quantity * currentPrice;
                      const holdingCost = item.quantity * item.averageBuyPrice;
                      const holdingPL = holdingValue - holdingCost;
                      const isPos = holdingPL >= 0;

                      return (
                        <tr key={item.stockSymbol} className={`transition-colors ${tableRowHover}`}>
                          <td className="px-4 py-3 font-bold font-mono text-blue-600 dark:text-blue-400">{item.stockSymbol}</td>
                          <td className="px-4 py-3 font-medium">{item.companyName}</td>
                          <td className="px-4 py-3 text-right font-mono font-bold">{item.quantity}</td>
                          <td className="px-4 py-3 text-right font-mono">${item.averageBuyPrice.toFixed(2)}</td>
                          <td className="px-4 py-3 text-right font-mono font-bold">${currentPrice.toFixed(2)}</td>
                          <td className="px-4 py-3 text-right font-mono font-bold">${holdingValue.toFixed(2)}</td>
                          <td className={`px-4 py-3 text-right font-mono font-bold ${isPos ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                            {isPos ? '+' : ''}${holdingPL.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => setShowSellModal(item)}
                              className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded font-medium text-xs shadow-sm"
                            >
                              Sell Shares
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* WALLET TAB */}
        {activeTab === 'wallet' && (
          <div className="max-w-2xl mx-auto space-y-6 py-4">
            <div className={`p-6 rounded-2xl border text-center ${cardBg} shadow-lg`}>
              <div className="text-sm font-semibold uppercase tracking-wider text-slate-400">Available Wallet Balance</div>
              <div className="text-4xl font-extrabold font-mono mt-2 text-emerald-600 dark:text-emerald-400">
                ${currentUser.walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`p-5 rounded-xl border ${cardBg} space-y-3`}>
                <h4 className="font-bold text-sm flex items-center gap-2 text-emerald-600">
                  <Plus className="w-4 h-4" /> Deposit Funds
                </h4>
                <div>
                  <label className="text-xs text-slate-500 font-medium">Amount ($ USD)</label>
                  <input
                    type="number"
                    value={depositAmt}
                    onChange={e => setDepositAmt(e.target.value)}
                    className={`w-full text-sm px-3 py-2 rounded-lg border mt-1 outline-none font-mono ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300'}`}
                  />
                </div>
                <button
                  onClick={handleDepositSubmit}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow transition-colors"
                >
                  Deposit to Wallet
                </button>
              </div>

              <div className={`p-5 rounded-xl border ${cardBg} space-y-3`}>
                <h4 className="font-bold text-sm flex items-center gap-2 text-rose-600">
                  <Minus className="w-4 h-4" /> Withdraw Funds
                </h4>
                <div>
                  <label className="text-xs text-slate-500 font-medium">Amount ($ USD)</label>
                  <input
                    type="number"
                    value={withdrawAmt}
                    onChange={e => setWithdrawAmt(e.target.value)}
                    className={`w-full text-sm px-3 py-2 rounded-lg border mt-1 outline-none font-mono ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300'}`}
                  />
                </div>
                <button
                  onClick={handleWithdrawSubmit}
                  className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg shadow transition-colors"
                >
                  Withdraw from Wallet
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TRANSACTIONS TAB */}
        {activeTab === 'transactions' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-500" /> Transaction Audit Log
              </h3>
              <button
                onClick={handleExportCSV}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow"
              >
                <Download className="w-3.5 h-3.5" /> Export History (.CSV)
              </button>
            </div>

            <div className={`overflow-x-auto rounded-lg border ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
              <table className="w-full text-xs text-left">
                <thead className={`font-semibold uppercase tracking-wider ${tableHeaderBg}`}>
                  <tr>
                    <th className="px-4 py-3">Transaction ID</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Symbol</th>
                    <th className="px-4 py-3 text-right">Quantity</th>
                    <th className="px-4 py-3 text-right">Unit Price</th>
                    <th className="px-4 py-3 text-right">Total Amount</th>
                    <th className="px-4 py-3 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {transactions.filter(t => t.userId === currentUser.id).length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                        No transactions recorded yet.
                      </td>
                    </tr>
                  ) : (
                    transactions.filter(t => t.userId === currentUser.id).map(tx => (
                      <tr key={tx.transactionId} className={`transition-colors ${tableRowHover}`}>
                        <td className="px-4 py-2.5 font-mono text-slate-400">{tx.transactionId.substring(0, 10)}...</td>
                        <td className="px-4 py-2.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            tx.type === 'BUY' ? 'bg-emerald-500/10 text-emerald-600' :
                            tx.type === 'SELL' ? 'bg-rose-500/10 text-rose-600' :
                            'bg-blue-500/10 text-blue-600'
                          }`}>
                            {tx.type}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 font-bold font-mono">{tx.stockSymbol}</td>
                        <td className="px-4 py-2.5 text-right font-mono">{tx.quantity}</td>
                        <td className="px-4 py-2.5 text-right font-mono">${tx.price.toFixed(2)}</td>
                        <td className="px-4 py-2.5 text-right font-mono font-bold">${tx.totalAmount.toFixed(2)}</td>
                        <td className="px-4 py-2.5 text-right font-mono text-slate-400">{tx.timestamp}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* WATCHLIST TAB */}
        {activeTab === 'watchlist' && (
          <div className="space-y-4">
            <h3 className="font-bold text-sm">⭐ Saved Watchlist</h3>
            <div className={`overflow-x-auto rounded-lg border ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
              <table className="w-full text-xs text-left">
                <thead className={`font-semibold uppercase tracking-wider ${tableHeaderBg}`}>
                  <tr>
                    <th className="px-4 py-3">Symbol</th>
                    <th className="px-4 py-3">Company</th>
                    <th className="px-4 py-3 text-right">Price</th>
                    <th className="px-4 py-3 text-right">Change %</th>
                    <th className="px-4 py-3 text-right">Day High</th>
                    <th className="px-4 py-3 text-right">Day Low</th>
                    <th className="px-4 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {currentUser.watchlist.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                        Your watchlist is empty. Click the star icon on any stock in the Stock Market tab to save it here!
                      </td>
                    </tr>
                  ) : (
                    stocks.filter(s => currentUser.watchlist.includes(s.symbol)).map(s => {
                      const changeAmt = s.currentPrice - s.previousPrice;
                      const changePct = s.previousPrice > 0 ? (changeAmt / s.previousPrice) * 100 : 0;
                      const isPos = changeAmt >= 0;

                      return (
                        <tr key={s.symbol} className={`transition-colors ${tableRowHover}`}>
                          <td className="px-4 py-2.5 font-bold font-mono text-blue-600 dark:text-blue-400">{s.symbol}</td>
                          <td className="px-4 py-2.5 font-medium">{s.companyName}</td>
                          <td className="px-4 py-2.5 text-right font-mono font-bold">${s.currentPrice.toFixed(2)}</td>
                          <td className={`px-4 py-2.5 text-right font-mono font-semibold ${isPos ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {isPos ? '+' : ''}{changePct.toFixed(2)}%
                          </td>
                          <td className="px-4 py-2.5 text-right font-mono text-slate-400">${s.dayHigh.toFixed(2)}</td>
                          <td className="px-4 py-2.5 text-right font-mono text-slate-400">${s.dayLow.toFixed(2)}</td>
                          <td className="px-4 py-2.5 text-center">
                            <button
                              onClick={() => onToggleWatchlist(s.symbol)}
                              className="px-2.5 py-1 text-xs bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 rounded"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ADMIN TAB */}
        {activeTab === 'admin' && currentUser.isAdmin && (
          <div className="max-w-2xl mx-auto space-y-6 py-2">
            <div className={`p-6 rounded-2xl border ${cardBg} shadow-lg space-y-4`}>
              <h3 className="font-bold text-base flex items-center gap-2 text-purple-600">
                <Shield className="w-5 h-5" /> Admin Stock Creator & Market Controls
              </h3>

              <form onSubmit={handleAddStockSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-medium text-slate-500">Stock Symbol</label>
                  <input
                    type="text"
                    placeholder="e.g. NFLX"
                    value={adminSymbol}
                    onChange={e => setAdminSymbol(e.target.value)}
                    className={`w-full p-2 rounded border mt-1 font-mono uppercase ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300'}`}
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-500">Company Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Netflix Inc."
                    value={adminCompany}
                    onChange={e => setAdminCompany(e.target.value)}
                    className={`w-full p-2 rounded border mt-1 ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300'}`}
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-500">Initial Price ($ USD)</label>
                  <input
                    type="number"
                    value={adminPrice}
                    onChange={e => setAdminPrice(e.target.value)}
                    className={`w-full p-2 rounded border mt-1 font-mono ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300'}`}
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-500">Initial Available Quantity</label>
                  <input
                    type="number"
                    value={adminQty}
                    onChange={e => setAdminQty(e.target.value)}
                    className={`w-full p-2 rounded border mt-1 font-mono ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300'}`}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="font-medium text-slate-500">Sector</label>
                  <select
                    value={adminSector}
                    onChange={e => setAdminSector(e.target.value)}
                    className={`w-full p-2 rounded border mt-1 ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300'}`}
                  >
                    {['Technology', 'Consumer Cyclical', 'Semiconductors', 'Automotive', 'Financial Services', 'Consumer Staples', 'Entertainment'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2 pt-2">
                  <button type="submit" className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg shadow">
                    Add New Stock to Market
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="max-w-md mx-auto py-6 space-y-4">
            <div className={`p-6 rounded-2xl border ${cardBg} shadow-lg space-y-4`}>
              <h3 className="font-bold text-base flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-blue-500" /> Account Profile Details
              </h3>
              <div className="text-xs space-y-3">
                <div>
                  <label className="text-slate-400 font-medium">User ID</label>
                  <div className="font-mono text-slate-500 mt-0.5">{currentUser.id}</div>
                </div>
                <div>
                  <label className="text-slate-400 font-medium">Name</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={e => setProfileName(e.target.value)}
                    className={`w-full p-2 rounded border mt-1 ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300'}`}
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-medium">Email Address</label>
                  <input
                    type="email"
                    value={profileEmail}
                    onChange={e => setProfileEmail(e.target.value)}
                    className={`w-full p-2 rounded border mt-1 ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300'}`}
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-medium">Account Role</label>
                  <div className="font-bold text-blue-500 mt-0.5">{currentUser.isAdmin ? 'System Administrator' : 'Trader'}</div>
                </div>
                <button
                  onClick={() => setAlertDialog({ title: 'Profile Updated', message: 'User profile details saved successfully.' })}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow"
                >
                  Save Profile Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Swing Frame Status Bar */}
      <div className={`flex items-center justify-between px-4 py-2 text-[11px] font-mono border-t ${headerBg}`}>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            User: <strong className="font-semibold text-blue-600 dark:text-blue-400">{currentUser.name}</strong>
          </span>
          <span>
            Wallet: <strong className="font-semibold text-emerald-600 dark:text-emerald-400">${currentUser.walletBalance.toFixed(2)}</strong>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-slate-500">
            <Activity className="w-3 h-3 text-emerald-500" /> Market Simulator Thread: {isSimulating ? `Active (${simIntervalSeconds}s ticker)` : 'Paused'}
          </span>
        </div>
      </div>

      {/* BUY MODAL */}
      {showBuyModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className={`w-full max-w-sm rounded-xl p-5 border shadow-2xl space-y-4 ${cardBg}`}>
            <h3 className="font-bold text-base flex items-center justify-between">
              <span>Buy {showBuyModal.companyName} ({showBuyModal.symbol})</span>
            </h3>
            <div className="text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Current Market Price:</span>
                <span className="font-bold font-mono">${showBuyModal.currentPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Available Stock Qty:</span>
                <span className="font-mono">{showBuyModal.availableQuantity} shares</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Your Wallet Balance:</span>
                <span className="font-bold font-mono text-emerald-600">${currentUser.walletBalance.toFixed(2)}</span>
              </div>

              <div className="pt-2">
                <label className="font-semibold text-slate-500">Quantity to Purchase:</label>
                <input
                  type="number"
                  value={buyQty}
                  onChange={e => setBuyQty(e.target.value)}
                  className={`w-full p-2 rounded border mt-1 font-mono text-sm ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300'}`}
                />
              </div>

              <div className="pt-2 flex justify-between font-bold text-sm">
                <span>Total Trade Cost:</span>
                <span className="font-mono text-blue-500">${(showBuyModal.currentPrice * (parseInt(buyQty, 10) || 0)).toFixed(2)}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button onClick={() => setShowBuyModal(null)} className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700">
                Cancel
              </button>
              <button onClick={handleBuySubmit} className="px-4 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded shadow">
                Confirm Purchase
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SELL MODAL */}
      {showSellModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className={`w-full max-w-sm rounded-xl p-5 border shadow-2xl space-y-4 ${cardBg}`}>
            <h3 className="font-bold text-base">
              Sell {showSellModal.companyName} ({showSellModal.stockSymbol})
            </h3>
            <div className="text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Shares Currently Owned:</span>
                <span className="font-bold font-mono">{showSellModal.quantity} shares</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Average Buy Price:</span>
                <span className="font-mono">${showSellModal.averageBuyPrice.toFixed(2)}</span>
              </div>

              <div className="pt-2">
                <label className="font-semibold text-slate-500">Quantity to Sell:</label>
                <input
                  type="number"
                  value={sellQty}
                  onChange={e => setSellQty(e.target.value)}
                  className={`w-full p-2 rounded border mt-1 font-mono text-sm ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300'}`}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button onClick={() => setShowSellModal(null)} className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700">
                Cancel
              </button>
              <button onClick={handleSellSubmit} className="px-4 py-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded shadow">
                Confirm Sale
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ALERT DIALOG */}
      {alertDialog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className={`w-full max-w-sm rounded-xl p-5 border shadow-2xl space-y-4 text-center ${cardBg}`}>
            <div className={`w-10 h-10 rounded-full mx-auto flex items-center justify-center ${alertDialog.isError ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
              {alertDialog.isError ? <AlertCircle className="w-6 h-6" /> : <CheckCircle className="w-6 h-6" />}
            </div>
            <h4 className="font-bold text-base">{alertDialog.title}</h4>
            <p className="text-xs text-slate-500 whitespace-pre-line">{alertDialog.message}</p>
            <button
              onClick={() => setAlertDialog(null)}
              className="w-full py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
            >
              OK (JOptionPane)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
