# Stock Trading Platform Desktop Application (Core Java & Swing)

A desktop stock market simulation application built with **Core Java 17**, **Java Swing**, and **Object-Oriented Programming (OOP)** principles for an academic Java course.

---

## 🚀 Key Features

1. **Authentication & User Profiles**:
   - Secure Login and Registration system with input validation.
   - User profile management & password change functionality.
   - Admin Panel for stock creation and market controls.

2. **Real-time Stock Market**:
   - View stocks with symbol, company name, current price, day high/low, and volume.
   - Live Search by stock symbol or company name.
   - Custom sorting (by Price, Company Name, Gainers, Losers).
   - Watchlist toggling for quick stock tracking.

3. **Trading Engine**:
   - **Buy Stocks**: Validates wallet balance, available quantity, updates user portfolio, deducts balance, and logs transactions.
   - **Sell Stocks**: Validates holdings, calculates realized profit/loss, credits wallet balance, and logs transactions.

4. **Portfolio & Wallet Management**:
   - Real-time Portfolio Valuation, Total Investment, Un-realized Profit/Loss, and Return % calculations.
   - Wallet deposit and withdrawal operations with transaction audit logs.

5. **Multithreaded Market Simulator**:
   - Background thread (`MarketSimulatorThread`) updates stock prices every **10 seconds**.
   - Price change range: **-5.00% to +5.00%** using standard deviation random generators.
   - Event-driven UI auto-refresh via `MarketUpdateListener` observer pattern.

6. **File I/O Persistence & JDBC**:
   - Binary object serialization & CSV fallbacks for `users.dat`, `stocks.dat`, `portfolio.dat`, `transactions.dat`.
   - Auto-saves state after every trade/deposit. Auto-loads state on application launch.
   - Optional MySQL JDBC integration included in `DatabaseConnection.java`.

7. **Export Capabilities**:
   - Export full transaction history to `.csv` or `.txt` reports.

---

## 🛠️ Project Package Structure

```
com.stocktrading
├── model
│   ├── User.java                   // Represents application user
│   ├── Stock.java                  // Stock ticker model with price history
│   ├── PortfolioItem.java          // Owned stock quantity & buy average
│   ├── Portfolio.java              // Aggregate user portfolio & profit calculation
│   ├── Transaction.java            // Trade ledger record
│   └── TransactionType.java        // Enum: BUY, SELL
├── service
│   ├── IAuthenticationService.java // Service contract for auth
│   ├── AuthenticationService.java  // Auth implementation
│   ├── IStockMarketService.java    // Service contract for trading & search
│   ├── StockMarketService.java     // Market engine implementation
│   ├── IPortfolioService.java      // Service contract for portfolio calculations
│   ├── PortfolioService.java       // Portfolio calculator
│   ├── IWalletService.java         // Service contract for wallet ops
│   └── WalletService.java          // Wallet manager
├── database
│   └── DatabaseConnection.java     // Singleton JDBC manager for MySQL
├── exception
│   ├── StockException.java         // Base custom exception
│   ├── InsufficientBalanceException.java
│   ├── InsufficientStockQuantityException.java
│   ├── StockNotFoundException.java
│   ├── AuthenticationException.java
│   ├── DuplicateUserException.java
│   └── InvalidInputException.java
├── util
│   ├── FileManager.java            // Serialization & File I/O
│   ├── ValidationUtil.java         // Input regex & range validation
│   ├── FormatUtil.java             // Currency & percentage formatting
│   └── ExporterUtil.java           // CSV report exporter
├── thread
│   ├── MarketSimulatorThread.java  // Multithreaded 10-second price ticker
│   └── MarketUpdateListener.java   // Observer interface for UI refresh
├── ui
│   ├── MainFrame.java              // Primary Swing JFrame window
│   ├── MarketPanel.java            // Stock market JTable view
│   ├── PortfolioPanel.java         // Holdings JTable view
│   ├── WalletPanel.java            // Deposit / Withdraw view
│   ├── TransactionPanel.java       // Audit log view
│   ├── WatchlistPanel.java         // Watchlist view
│   ├── AdminPanel.java             // Admin stock creation view
│   └── LoginDialog.java            // Modal login / registration
└── main
    └── Main.java                   // Application entry point
```

---

## 🧠 OOP Concepts Demonstrated

| OOP Concept | Implementation Location | Description |
| :--- | :--- | :--- |
| **Classes & Objects** | `User.java`, `Stock.java`, `Portfolio.java` | Real-world domain entities modeled with properties and behaviors. |
| **Encapsulation** | All model classes | Private instance variables with public getters, setters, and validation guards. |
| **Inheritance** | Custom Exceptions | `InsufficientBalanceException extends StockException`, `StockException extends Exception`. |
| **Polymorphism** | Service Interfaces (`IStockMarketService`) | Multiple implementation options (File-backed service vs JDBC service). |
| **Abstraction** | Interfaces in `com.stocktrading.service` | Hides underlying storage details from UI panels. |
| **Method Overloading** | `StockMarketService.java` | `searchStocks(String query)` and `searchStocks(String query, String sector)`. |
| **Method Overriding** | Model classes | Custom `toString()`, `equals()`, `hashCode()`, and interface implementation methods. |
| **Exception Handling** | `com.stocktrading.exception` | Custom checked exceptions for granular error reporting. |
| **Collections Framework**| `ArrayList`, `HashMap`, `LinkedList`, `Comparator` | Used for stock indexing, transaction ledgers, and dynamic sorting. |
| **File Handling** | `FileManager.java` | ObjectOutputStream / ObjectInputStream for persistent binary storage. |
| **Multithreading** | `MarketSimulatorThread.java` | Thread sleeping every 10,000ms to update market prices asynchronously. |

---

## 🖥️ How to Run in IntelliJ IDEA / Eclipse

1. **Clone or Import Project**:
   - Open IntelliJ IDEA -> `File` -> `Open...` -> Select directory containing `pom.xml`.
2. **Set JDK**:
   - Ensure Project SDK is set to **Java 17** or higher (`File` -> `Project Structure` -> `Project`).
3. **Build Maven**:
   - Run `mvn clean compile` or click Maven sync button in IntelliJ.
4. **Run Application**:
   - Locate `com.stocktrading.main.Main.java`.
   - Right-click `Main.java` and select **Run 'Main.main()'**.

---

## 💻 How to Run from Command Line (Terminal)

```bash
# Navigate to source directory
cd java_src

# Compile Java files
javac -d bin -sourcepath src/main/java src/main/java/com/stocktrading/main/Main.java

# Run the application
java -cp bin com.stocktrading.main.Main
```

### Or using Maven:
```bash
mvn compile exec:java -Dexec.mainClass="com.stocktrading.main.Main"
```

---

## 🔑 Default Credentials

- **Admin Account**:
  - Email: `admin@stocktrading.com`
  - Password: `admin`
- **Sample Trader Account**:
  - Email: `trader@stocktrading.com`
  - Password: `password123`
