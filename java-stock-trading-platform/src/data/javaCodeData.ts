import { JavaSourceFile } from '../types';

export const INITIAL_JAVA_FILES: JavaSourceFile[] = [
  {
    path: 'com/stocktrading/model/User.java',
    name: 'User.java',
    package: 'com.stocktrading.model',
    category: 'model',
    description: 'Encapsulates user account details, wallet balance, and watchlist.',
    oopConcepts: ['Encapsulation', 'Serializable', 'Constructors', 'Methods'],
    code: `package com.stocktrading.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * Represents a user in the stock trading system.
 * Demonstrates Encapsulation, Constructors, and Serializable interface.
 */
public class User implements Serializable {
    private static final long serialVersionUID = 1L;

    private String id;
    private String name;
    private String email;
    private String password;
    private double walletBalance;
    private boolean isAdmin;
    private List<String> watchlist;

    public User() {
        this.watchlist = new ArrayList<>();
    }

    public User(String id, String name, String email, String password, double walletBalance, boolean isAdmin) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.walletBalance = walletBalance;
        this.isAdmin = isAdmin;
        this.watchlist = new ArrayList<>();
    }

    // Getters and Setters (Encapsulation)
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public double getWalletBalance() { return walletBalance; }
    public void setWalletBalance(double walletBalance) { this.walletBalance = walletBalance; }

    public boolean isAdmin() { return isAdmin; }
    public void setAdmin(boolean admin) { isAdmin = admin; }

    public List<String> getWatchlist() {
        if (watchlist == null) watchlist = new ArrayList<>();
        return watchlist;
    }

    public void deposit(double amount) {
        if (amount > 0) this.walletBalance += amount;
    }

    public boolean withdraw(double amount) {
        if (amount > 0 && this.walletBalance >= amount) {
            this.walletBalance -= amount;
            return true;
        }
        return false;
    }

    public boolean toggleWatchlist(String symbol) {
        if (getWatchlist().contains(symbol)) {
            watchlist.remove(symbol);
            return false;
        } else {
            watchlist.add(symbol);
            return true;
        }
    }
}`
  },
  {
    path: 'com/stocktrading/model/Stock.java',
    name: 'Stock.java',
    package: 'com.stocktrading.model',
    category: 'model',
    description: 'Represents a stock asset with price history, sector, and quantity.',
    oopConcepts: ['Encapsulation', 'Comparable Interface', 'Method Overriding'],
    code: `package com.stocktrading.model;

import java.io.Serializable;
import java.util.Objects;

public class Stock implements Serializable, Comparable<Stock> {
    private static final long serialVersionUID = 1L;

    private String symbol;
    private String companyName;
    private double currentPrice;
    private double previousPrice;
    private double dayHigh;
    private double dayLow;
    private int availableQuantity;
    private String sector;

    public Stock(String symbol, String companyName, double currentPrice, int availableQuantity, String sector) {
        this.symbol = symbol;
        this.companyName = companyName;
        this.currentPrice = currentPrice;
        this.previousPrice = currentPrice;
        this.dayHigh = currentPrice;
        this.dayLow = currentPrice;
        this.availableQuantity = availableQuantity;
        this.sector = sector;
    }

    public String getSymbol() { return symbol; }
    public String getCompanyName() { return companyName; }
    public double getCurrentPrice() { return currentPrice; }

    public void setCurrentPrice(double currentPrice) {
        this.previousPrice = this.currentPrice;
        this.currentPrice = Math.max(0.01, currentPrice);
        if (this.currentPrice > dayHigh) dayHigh = this.currentPrice;
        if (this.currentPrice < dayLow || dayLow == 0) dayLow = this.currentPrice;
    }

    public double getChangePercentage() {
        if (previousPrice == 0) return 0.0;
        return ((currentPrice - previousPrice) / previousPrice) * 100.0;
    }

    @Override
    public int compareTo(Stock o) {
        return this.symbol.compareTo(o.symbol);
    }
}`
  },
  {
    path: 'com/stocktrading/model/Portfolio.java',
    name: 'Portfolio.java',
    package: 'com.stocktrading.model',
    category: 'model',
    description: 'Manages user stock holdings and market valuations using HashMap collection.',
    oopConcepts: ['Collections (HashMap)', 'Business Logic Methods', 'Method Overloading'],
    code: `package com.stocktrading.model;

import java.io.Serializable;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

public class Portfolio implements Serializable {
    private static final long serialVersionUID = 1L;

    private String userId;
    private Map<String, PortfolioItem> holdings = new HashMap<>();

    public Portfolio(String userId) {
        this.userId = userId;
    }

    public Collection<PortfolioItem> getHoldings() {
        return holdings.values();
    }

    public void buyStock(String symbol, String companyName, int quantity, double price) {
        symbol = symbol.toUpperCase();
        if (holdings.containsKey(symbol)) {
            holdings.get(symbol).addShares(quantity, price);
        } else {
            holdings.put(symbol, new PortfolioItem(symbol, companyName, quantity, price));
        }
    }

    public double getCurrentMarketValue(Map<String, Stock> liveStocks) {
        double total = 0;
        for (PortfolioItem item : holdings.values()) {
            Stock stock = liveStocks.get(item.getStockSymbol());
            double price = (stock != null) ? stock.getCurrentPrice() : item.getAverageBuyPrice();
            total += item.getQuantity() * price;
        }
        return total;
    }
}`
  },
  {
    path: 'com/stocktrading/service/IStockMarketService.java',
    name: 'IStockMarketService.java',
    package: 'com.stocktrading.service',
    category: 'service',
    description: 'Abstraction interface defining core trading operations and search functions.',
    oopConcepts: ['Abstraction', 'Interfaces', 'Polymorphism'],
    code: `package com.stocktrading.service;

import com.stocktrading.exception.*;
import com.stocktrading.model.*;

import java.util.Comparator;
import java.util.List;
import java.util.Map;

public interface IStockMarketService {
    List<Stock> getAllStocks();
    Stock getStockBySymbol(String symbol) throws StockNotFoundException;
    List<Stock> searchStocks(String query);
    List<Stock> searchStocks(String query, String sector);

    Transaction buyStock(User user, String symbol, int quantity)
            throws StockNotFoundException, InsufficientStockQuantityException, InsufficientBalanceException, InvalidInputException;

    Transaction sellStock(User user, String symbol, int quantity)
            throws StockNotFoundException, InsufficientStockQuantityException, InvalidInputException;

    void updateStockPricesRandomly();
}`
  },
  {
    path: 'com/stocktrading/service/StockMarketService.java',
    name: 'StockMarketService.java',
    package: 'com.stocktrading.service',
    category: 'service',
    description: 'Core trading engine executing trades, validating constraints, and maintaining data.',
    oopConcepts: ['Interface Implementation', 'Synchronization', 'Method Overloading'],
    code: `package com.stocktrading.service;

import com.stocktrading.exception.*;
import com.stocktrading.model.*;
import com.stocktrading.util.FileManager;

import java.util.*;
import java.util.concurrent.ThreadLocalRandom;

public class StockMarketService implements IStockMarketService {
    private Map<String, Stock> stockMap;
    private List<Transaction> transactions;
    private FileManager fileManager;
    private PortfolioService portfolioService;

    public StockMarketService(FileManager fileManager, PortfolioService portfolioService) {
        this.fileManager = fileManager;
        this.portfolioService = portfolioService;
        this.stockMap = fileManager.loadStocks();
        this.transactions = fileManager.loadTransactions();
    }

    @Override
    public synchronized Transaction buyStock(User user, String symbol, int quantity)
            throws StockNotFoundException, InsufficientStockQuantityException, InsufficientBalanceException, InvalidInputException {
        if (quantity <= 0) throw new InvalidInputException("Quantity must be greater than zero.");

        Stock stock = getStockBySymbol(symbol);
        if (stock.getAvailableQuantity() < quantity) {
            throw new InsufficientStockQuantityException(stock.getSymbol(), quantity, stock.getAvailableQuantity());
        }

        double totalCost = stock.getCurrentPrice() * quantity;
        if (user.getWalletBalance() < totalCost) {
            throw new InsufficientBalanceException(totalCost, user.getWalletBalance());
        }

        user.withdraw(totalCost);
        stock.reduceQuantity(quantity);

        Portfolio portfolio = portfolioService.getUserPortfolio(user);
        portfolio.buyStock(stock.getSymbol(), stock.getCompanyName(), quantity, stock.getCurrentPrice());

        Transaction tx = new Transaction(UUID.randomUUID().toString(), user.getId(), stock.getSymbol(), quantity, stock.getCurrentPrice(), TransactionType.BUY);
        transactions.add(tx);

        fileManager.saveStocks(stockMap);
        fileManager.saveTransactions(transactions);
        portfolioService.savePortfolios();

        return tx;
    }

    @Override
    public synchronized void updateStockPricesRandomly() {
        for (Stock stock : stockMap.values()) {
            double changePercent = ThreadLocalRandom.current().nextDouble(-0.05, 0.05);
            stock.setCurrentPrice(stock.getCurrentPrice() * (1 + changePercent));
        }
        fileManager.saveStocks(stockMap);
    }
}`
  },
  {
    path: 'com/stocktrading/thread/MarketSimulatorThread.java',
    name: 'MarketSimulatorThread.java',
    package: 'com.stocktrading.thread',
    category: 'thread',
    description: 'Background worker thread running every 10 seconds to update market prices.',
    oopConcepts: ['Multithreading', 'Runnable Interface', 'Observer Pattern'],
    code: `package com.stocktrading.thread;

import com.stocktrading.model.Stock;
import com.stocktrading.service.IStockMarketService;

import java.util.ArrayList;
import java.util.List;

public class MarketSimulatorThread implements Runnable {
    private final IStockMarketService marketService;
    private final List<MarketUpdateListener> listeners = new ArrayList<>();
    private volatile boolean running = true;

    public MarketSimulatorThread(IStockMarketService marketService) {
        this.marketService = marketService;
    }

    public void addListener(MarketUpdateListener listener) {
        synchronized (listeners) { listeners.add(listener); }
    }

    @Override
    public void run() {
        while (running) {
            try {
                Thread.sleep(10000); // 10 Seconds
                marketService.updateStockPricesRandomly();
                List<Stock> updated = marketService.getAllStocks();

                synchronized (listeners) {
                    for (MarketUpdateListener l : listeners) l.onMarketUpdated(updated);
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            }
        }
    }
}`
  },
  {
    path: 'com/stocktrading/exception/InsufficientBalanceException.java',
    name: 'InsufficientBalanceException.java',
    package: 'com.stocktrading.exception',
    category: 'exception',
    description: 'Custom checked exception thrown when a user attempts a trade exceeding wallet balance.',
    oopConcepts: ['Inheritance (extends Exception)', 'Custom Checked Exception'],
    code: `package com.stocktrading.exception;

public class InsufficientBalanceException extends StockException {
    private final double requiredAmount;
    private final double availableBalance;

    public InsufficientBalanceException(double requiredAmount, double availableBalance) {
        super(String.format("Insufficient wallet balance! Required: $%.2f, Available: $%.2f", requiredAmount, availableBalance));
        this.requiredAmount = requiredAmount;
        this.availableBalance = availableBalance;
    }

    public double getRequiredAmount() { return requiredAmount; }
    public double getAvailableBalance() { return availableBalance; }
}`
  },
  {
    path: 'com/stocktrading/util/FileManager.java',
    name: 'FileManager.java',
    package: 'com.stocktrading.util',
    category: 'util',
    description: 'Handles Object Serialization to save and load .dat files.',
    oopConcepts: ['File I/O', 'Object Serialization', 'Generics'],
    code: `package com.stocktrading.util;

import java.io.*;
import java.util.*;

public class FileManager {
    private static final String DATA_DIR = "data/";

    public synchronized void saveUsers(List<User> users) {
        saveObject(DATA_DIR + "users.dat", users);
    }

    public synchronized List<User> loadUsers() {
        Object obj = loadObject(DATA_DIR + "users.dat");
        return (obj instanceof List) ? (List<User>) obj : new ArrayList<>();
    }

    private void saveObject(String path, Object data) {
        try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(path))) {
            oos.writeObject(data);
        } catch (IOException e) {
            System.err.println("File Save Error: " + e.getMessage());
        }
    }
}`
  },
  {
    path: 'com/stocktrading/main/Main.java',
    name: 'Main.java',
    package: 'com.stocktrading.main',
    category: 'main',
    description: 'Application entry point initializing components, thread, and GUI window.',
    oopConcepts: ['Main Method', 'SwingUtilities.invokeLater', 'Daemon Threads'],
    code: `package com.stocktrading.main;

import com.stocktrading.service.*;
import com.stocktrading.thread.MarketSimulatorThread;
import com.stocktrading.ui.*;
import com.stocktrading.util.FileManager;

import javax.swing.*;

public class Main {
    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            FileManager fileManager = new FileManager();
            AuthenticationService authService = new AuthenticationService(fileManager);
            PortfolioService portfolioService = new PortfolioService(fileManager);
            StockMarketService marketService = new StockMarketService(fileManager, portfolioService);
            WalletService walletService = new WalletService(fileManager, marketService.getAllTransactions());

            MarketSimulatorThread simulatorThread = new MarketSimulatorThread(marketService);
            Thread worker = new Thread(simulatorThread);
            worker.setDaemon(true);
            worker.start();

            MainFrame mainFrame = new MainFrame(authService, marketService, portfolioService, walletService, simulatorThread);
            mainFrame.setVisible(true);
        });
    }
}`
  }
];
