import React, { useState } from 'react';
import { Layers, GitBranch, ArrowRight, CheckCircle2, Copy, Check } from 'lucide-react';

export const UmlDiagrams: React.FC = () => {
  const [activeDiagram, setActiveDiagram] = useState<'class' | 'flow' | 'sequence'>('class');
  const [copiedPlantUml, setCopiedPlantUml] = useState(false);

  const plantUmlCode = `@startuml
package "com.stocktrading.model" {
    class User {
        - String id
        - String name
        - String email
        - String password
        - double walletBalance
        - boolean isAdmin
        + deposit(amount: double): void
        + withdraw(amount: double): void
    }

    class Stock {
        - String symbol
        - String companyName
        - double currentPrice
        - double previousPrice
        - int availableQuantity
        - String sector
        + updatePrice(changePercent: double): void
    }

    class PortfolioItem {
        - String stockSymbol
        - int quantity
        - double averageBuyPrice
    }

    class Portfolio {
        - String userId
        - Map<String, PortfolioItem> holdings
        + buyStock(symbol, name, qty, price): void
        + sellStock(symbol, qty): boolean
    }

    class Transaction {
        - String transactionId
        - String userId
        - String stockSymbol
        - int quantity
        - double price
        - TransactionType type
        - LocalDateTime timestamp
    }
}

package "com.stocktrading.service" {
    interface IStockMarketService {
        + getAllStocks(): List<Stock>
        + buyStock(user, symbol, quantity): Transaction
        + sellStock(user, symbol, quantity): Transaction
    }

    class StockMarketService implements IStockMarketService
}

User "1" -- "1" Portfolio
Portfolio "1" *-- "*" PortfolioItem
StockMarketService --> Stock
StockMarketService --> Transaction
@enduml`;

  const copyCode = () => {
    navigator.clipboard.writeText(plantUmlCode);
    setCopiedPlantUml(true);
    setTimeout(() => setCopiedPlantUml(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Diagram Selector Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[#1E293B] border border-slate-700 text-slate-100">
        <div className="flex items-center gap-3">
          <Layers className="w-5 h-5 text-purple-400" />
          <div>
            <h3 className="font-bold text-sm">System Architecture & UML Diagrams</h3>
            <p className="text-xs text-slate-400">Visualizing Class Relationships, Buy Stock Flow, and Thread Sequence</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {[
            { id: 'class', label: 'UML Class Diagram' },
            { id: 'flow', label: 'Buy Stock Flowchart' },
            { id: 'sequence', label: 'Thread Sequence Diagram' }
          ].map(d => (
            <button
              key={d.id}
              onClick={() => setActiveDiagram(d.id as any)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeDiagram === d.id ? 'bg-purple-600 text-white shadow' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* CLASS DIAGRAM */}
      {activeDiagram === 'class' && (
        <div className="space-y-6">
          <div className="p-6 bg-[#0F172A] border border-slate-700 rounded-xl space-y-6">
            <h4 className="font-bold text-sm text-purple-400">Class Relationships & Package Hierarchy</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-4 rounded-lg bg-[#1E293B] border border-slate-700 space-y-2">
                <div className="font-bold text-blue-400 text-sm">User</div>
                <div className="text-slate-400 border-t border-slate-700 pt-2 space-y-1 text-[11px]">
                  <div>- id: String</div>
                  <div>- email: String</div>
                  <div>- walletBalance: double</div>
                  <div>- watchlist: List&lt;String&gt;</div>
                </div>
                <div className="text-purple-300 border-t border-slate-700 pt-2 space-y-1 text-[11px]">
                  <div>+ deposit(amount): void</div>
                  <div>+ withdraw(amount): boolean</div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-[#1E293B] border border-slate-700 space-y-2">
                <div className="font-bold text-emerald-400 text-sm">Portfolio & PortfolioItem</div>
                <div className="text-slate-400 border-t border-slate-700 pt-2 space-y-1 text-[11px]">
                  <div>- holdings: Map&lt;String, PortfolioItem&gt;</div>
                  <div>- quantity: int</div>
                  <div>- averageBuyPrice: double</div>
                </div>
                <div className="text-purple-300 border-t border-slate-700 pt-2 space-y-1 text-[11px]">
                  <div>+ buyStock(symbol, qty, price)</div>
                  <div>+ getCurrentMarketValue()</div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-[#1E293B] border border-slate-700 space-y-2">
                <div className="font-bold text-amber-400 text-sm">Stock & Transaction</div>
                <div className="text-slate-400 border-t border-slate-700 pt-2 space-y-1 text-[11px]">
                  <div>- symbol: String</div>
                  <div>- currentPrice: double</div>
                  <div>- type: TransactionType</div>
                </div>
                <div className="text-purple-300 border-t border-slate-700 pt-2 space-y-1 text-[11px]">
                  <div>+ getChangePercentage()</div>
                  <div>+ reduceQuantity(qty)</div>
                </div>
              </div>
            </div>

            {/* PlantUML Raw Code */}
            <div className="pt-4 border-t border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400">PlantUML Source Code (Ready for IntelliJ / Eclipse PlantUML plugin)</span>
                <button
                  onClick={copyCode}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded font-medium flex items-center gap-1"
                >
                  {copiedPlantUml ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copiedPlantUml ? 'Copied PlantUML' : 'Copy PlantUML Code'}
                </button>
              </div>
              <pre className="p-4 bg-[#1E293B] border border-slate-700 rounded-lg text-[11px] font-mono text-slate-300 overflow-x-auto max-h-48">
                {plantUmlCode}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* FLOWCHART */}
      {activeDiagram === 'flow' && (
        <div className="p-6 bg-[#0F172A] border border-slate-700 rounded-xl space-y-6 text-xs font-mono">
          <h4 className="font-bold text-sm text-emerald-400 font-sans">Buy Stock Execution Logic Flowchart</h4>
          <div className="flex flex-col items-center space-y-3 max-w-xl mx-auto">
            <div className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold">Start: User Selects Stock in MarketPanel</div>
            <ArrowRight className="w-4 h-4 text-slate-500 rotate-90" />
            <div className="px-4 py-2 bg-slate-800 border border-slate-700 text-slate-200 rounded-lg">Enter Buy Quantity & Click Confirm</div>
            <ArrowRight className="w-4 h-4 text-slate-500 rotate-90" />
            <div className="px-4 py-2 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-lg text-center">
              Validate Quantity &gt; 0 and Available Market Stock &gt;= Quantity?
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 rotate-90" />
            <div className="px-4 py-2 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-lg text-center">
              Validate User Wallet Balance &gt;= (Quantity * Current Price)?
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 rotate-90" />
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl space-y-1 w-full text-left">
              <div className="font-bold text-sm">Execute Trade in StockMarketService.java:</div>
              <div>1. Deduct wallet balance (user.withdraw(cost))</div>
              <div>2. Reduce available stock quantity in market</div>
              <div>3. Add position to user portfolio (portfolio.buyStock())</div>
              <div>4. Record transaction in audit log (new Transaction())</div>
              <div>5. Persist to data files (fileManager.saveStocks(), saveTransactions())</div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 rotate-90" />
            <div className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold">End: Refresh Market & Portfolio JTables</div>
          </div>
        </div>
      )}

      {/* SEQUENCE DIAGRAM */}
      {activeDiagram === 'sequence' && (
        <div className="p-6 bg-[#0F172A] border border-slate-700 rounded-xl space-y-6 text-xs font-mono">
          <h4 className="font-bold text-sm text-blue-400 font-sans">Multithreaded Market Price Simulator Sequence</h4>
          <div className="space-y-4 max-w-2xl mx-auto">
            <div className="grid grid-cols-3 text-center font-bold text-sm">
              <div className="p-2 bg-slate-800 text-blue-400 rounded">MarketSimulatorThread</div>
              <div className="p-2 bg-slate-800 text-purple-400 rounded">StockMarketService</div>
              <div className="p-2 bg-slate-800 text-emerald-400 rounded">MainFrame (Swing GUI)</div>
            </div>
            <div className="border-l-2 border-dashed border-slate-700 pl-4 py-2 space-y-3">
              <div className="text-slate-400">1. Thread.sleep(10000) — Waits 10 Seconds</div>
              <div className="text-purple-300">2. Calls updateStockPricesRandomly() — Fluctuate -5% to +5%</div>
              <div className="text-slate-400">3. Saves updated price map to stocks.dat via FileManager</div>
              <div className="text-emerald-300">4. Invokes onMarketUpdated(stocks) callback</div>
              <div className="text-emerald-400 font-bold">5. SwingUtilities.invokeLater() refreshes JTable models instantly</div>
            </div>
          </div>
        </div>
      )}

      {/* OOP CONCEPT MAPPING TABLE */}
      <div className="p-6 bg-[#1E293B] border border-slate-700 rounded-xl space-y-4">
        <h4 className="font-bold text-sm text-slate-100 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> OOP Concepts Implementation Matrix
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-800 text-slate-300 font-semibold uppercase text-[10px]">
              <tr>
                <th className="px-3 py-2">OOP Concept</th>
                <th className="px-3 py-2">Java File Location</th>
                <th className="px-3 py-2">Technical Explanation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700 text-slate-300">
              <tr>
                <td className="px-3 py-2 font-bold text-purple-400">Encapsulation</td>
                <td className="px-3 py-2 font-mono">User.java, Stock.java</td>
                <td className="px-3 py-2">Private instance variables with guarded public getters, setters, and validation checks.</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-bold text-purple-400">Inheritance</td>
                <td className="px-3 py-2 font-mono">InsufficientBalanceException.java</td>
                <td className="px-3 py-2">Extends custom base checked exception <code className="text-blue-300">StockException</code>.</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-bold text-purple-400">Polymorphism</td>
                <td className="px-3 py-2 font-mono">IStockMarketService.java</td>
                <td className="px-3 py-2">UI panels program against service interfaces; concrete storage implementations can be swapped cleanly.</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-bold text-purple-400">Abstraction</td>
                <td className="px-3 py-2 font-mono">IAuthenticationService.java</td>
                <td className="px-3 py-2">Defines interface contracts hiding binary serialization and database logic from Swing views.</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-bold text-purple-400">Multithreading</td>
                <td className="px-3 py-2 font-mono">MarketSimulatorThread.java</td>
                <td className="px-3 py-2">Implements Runnable to execute continuous background price fluctuations every 10 seconds.</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-bold text-purple-400">Collections Framework</td>
                <td className="px-3 py-2 font-mono">Portfolio.java, StockMarketService.java</td>
                <td className="px-3 py-2">Uses ArrayList for stock lists, HashMap for fast O(1) stock symbol lookups, and Comparator for sorting.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
