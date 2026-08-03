# UML Diagrams & System Architecture

This document contains the **UML Class Diagram**, **Activity Flowchart**, and **Sequence Diagram** for the Stock Trading Platform application.

---

## 1. Class Diagram (PlantUML)

```plantuml
@startuml
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
        - Map<String, PortfolioItem> items
        + addStock(symbol: String, qty: int, price: double): void
        + removeStock(symbol: String, qty: int): double
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

    enum TransactionType {
        BUY
        SELL
    }
}

package "com.stocktrading.service" {
    interface IStockMarketService {
        + getAllStocks(): List<Stock>
        + buyStock(user: User, symbol: String, quantity: int): Transaction
        + sellStock(user: User, symbol: String, quantity: int): Transaction
    }

    class StockMarketService implements IStockMarketService {
        - Map<String, Stock> stockMap
        - PortfolioService portfolioService
        - FileManager fileManager
    }
}

package "com.stocktrading.thread" {
    class MarketSimulatorThread implements Runnable {
        - boolean running
        - List<MarketUpdateListener> listeners
        + run(): void
        + stopSimulator(): void
    }

    interface MarketUpdateListener {
        + onMarketUpdated(stocks: List<Stock>): void
    }
}

User "1" -- "1" Portfolio
Portfolio "1" *-- "*" PortfolioItem
StockMarketService --> Stock
MarketSimulatorThread --> MarketUpdateListener
StockMarketService --> Transaction
Transaction --> TransactionType
@enduml
```

---

## 2. Buy Stock Flowchart

```
[User Selects Stock in MarketPanel]
               │
               ▼
   [Enter Quantity & Click Buy]
               │
               ▼
  [Validate Quantity > 0 ?]
          /        \
       No/          \Yes
        ▼            ▼
[Show Error]    [Check Stock Available Qty >= Input]
                     /        \
                  No/          \Yes
                   ▼            ▼
           [Show Error]    [Check Wallet Balance >= Total Cost]
                                /        \
                             No/          \Yes
                              ▼            ▼
                      [Show Error]    [Execute Trade]
                                           │
                                           ├─► Deduct Wallet Balance
                                           ├─► Deduct Stock Quantity
                                           ├─► Add to User Portfolio
                                           ├─► Create Transaction Record
                                           └─► Save Data to File (.dat)
                                           │
                                           ▼
                                 [Show Success Dialog]
```

---

## 3. Market Simulator Sequence Diagram

```
MarketSimulatorThread        StockMarketService           MarketPanel (GUI)
       │                             │                            │
       │ (Loop every 10 seconds)     │                            │
       ├────────────────────────────►│                            │
       │ randomizePrices()           │                            │
       │                             ├─► Calculate -5% to +5%     │
       │                             ├─► Update Stock Prices      │
       │                             ├─► Save stocks.dat          │
       │                             │                            │
       │ onMarketUpdated(stocks)     │                            │
       ├─────────────────────────────────────────────────────────►│
       │                             │                            │ refreshTableData()
       │                             │                            │ SwingUtilities.invokeLater()
```
