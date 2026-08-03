import React, { useState } from 'react';
import { User, Stock, PortfolioItem, Transaction } from '../types';
import { Database, FileText, CheckCircle2, HardDrive, RefreshCw } from 'lucide-react';

interface DataPersistenceViewProps {
  users: User[];
  stocks: Stock[];
  portfolioItems: PortfolioItem[];
  transactions: Transaction[];
}

export const DataPersistenceView: React.FC<DataPersistenceViewProps> = ({
  users,
  stocks,
  portfolioItems,
  transactions
}) => {
  const [selectedFile, setSelectedFile] = useState<'users' | 'stocks' | 'portfolio' | 'transactions'>('stocks');

  return (
    <div className="space-y-6">
      {/* File Inspector Header */}
      <div className="p-6 rounded-xl bg-[#1E293B] border border-slate-700 text-slate-100 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base flex items-center gap-2 text-emerald-400">
              <HardDrive className="w-5 h-5" /> File I/O Persistence Inspector (FileManager.java)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Data is automatically loaded on app boot and saved after every trade transaction via <code className="text-emerald-300">ObjectOutputStream</code> into binary <code className="text-emerald-300">.dat</code> files.
            </p>
          </div>
        </div>

        {/* File Select Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-700">
          {[
            { id: 'stocks', name: 'stocks.dat', size: `${stocks.length} records` },
            { id: 'users', name: 'users.dat', size: `${users.length} records` },
            { id: 'portfolio', name: 'portfolio.dat', size: `${portfolioItems.length} holdings` },
            { id: 'transactions', name: 'transactions.dat', size: `${transactions.length} trades` }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setSelectedFile(f.id as any)}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 ${
                selectedFile === f.id ? 'bg-emerald-600 text-white shadow' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{f.name}</span>
              <span className="text-[10px] opacity-75 font-mono">({f.size})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Raw Data File Content Viewer */}
      <div className="p-6 bg-[#0F172A] border border-slate-700 rounded-xl space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between text-slate-400 border-b border-slate-700 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold">data/{selectedFile}.dat</span>
            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">Serialized Binary Output</span>
          </div>
          <span className="text-[11px] text-slate-500">Auto-saved via ObjectOutputStream</span>
        </div>

        <pre className="p-4 bg-[#1E293B] border border-slate-700 rounded-lg text-slate-300 overflow-x-auto max-h-[400px]">
          {selectedFile === 'stocks' && JSON.stringify(stocks, null, 2)}
          {selectedFile === 'users' && JSON.stringify(users.map(u => ({ ...u, password: '***' })), null, 2)}
          {selectedFile === 'portfolio' && JSON.stringify(portfolioItems, null, 2)}
          {selectedFile === 'transactions' && JSON.stringify(transactions, null, 2)}
        </pre>
      </div>
    </div>
  );
};
