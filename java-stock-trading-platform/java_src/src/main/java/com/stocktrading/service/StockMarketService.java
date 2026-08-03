package com.stocktrading.service;

import com.stocktrading.exception.InsufficientBalanceException;
import com.stocktrading.exception.InsufficientStockQuantityException;
import com.stocktrading.exception.InvalidInputException;
import com.stocktrading.exception.StockNotFoundException;
import com.stocktrading.model.*;
import com.stocktrading.util.FileManager;

import java.util.*;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

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

        if (this.stockMap == null || this.stockMap.isEmpty()) {
            this.stockMap = new HashMap<>();
            seedInitialStocks();
        }
    }

    private void seedInitialStocks() {
        addStockDirect(new Stock("AAPL", "Apple Inc.", 185.50, 5000, "Technology"));
        addStockDirect(new Stock("MSFT", "Microsoft Corp.", 415.20, 3500, "Technology"));
        addStockDirect(new Stock("GOOGL", "Alphabet Inc.", 175.80, 4200, "Technology"));
        addStockDirect(new Stock("AMZN", "Amazon.com Inc.", 182.30, 4800, "Consumer Cyclical"));
        addStockDirect(new Stock("NVDA", "NVIDIA Corporation", 128.90, 6000, "Semiconductors"));
        addStockDirect(new Stock("TSLA", "Tesla Inc.", 225.40, 3000, "Automotive"));
        addStockDirect(new Stock("JPM", "JPMorgan Chase & Co.", 205.10, 2500, "Financial Services"));
        addStockDirect(new Stock("V", "Visa Inc.", 272.60, 2200, "Financial Services"));
        addStockDirect(new Stock("WMT", "Walmart Inc.", 68.40, 8000, "Consumer Staples"));
        addStockDirect(new Stock("DIS", "The Walt Disney Co.", 96.80, 3400, "Entertainment"));
        fileManager.saveStocks(stockMap);
    }

    private void addStockDirect(Stock stock) {
        stockMap.put(stock.getSymbol().toUpperCase(), stock);
    }

    @Override
    public List<Stock> getAllStocks() {
        List<Stock> list = new ArrayList<>(stockMap.values());
        Collections.sort(list);
        return list;
    }

    @Override
    public Map<String, Stock> getStockMap() {
        return stockMap;
    }

    @Override
    public Stock getStockBySymbol(String symbol) throws StockNotFoundException {
        if (symbol == null) throw new StockNotFoundException("null");
        Stock stock = stockMap.get(symbol.toUpperCase());
        if (stock == null) {
            throw new StockNotFoundException(symbol);
        }
        return stock;
    }

    @Override
    public List<Stock> searchStocks(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllStocks();
        }
        String q = query.trim().toLowerCase();
        return stockMap.values().stream()
                .filter(s -> s.getSymbol().toLowerCase().contains(q) || s.getCompanyName().toLowerCase().contains(q))
                .sorted()
                .collect(Collectors.toList());
    }

    @Override
    public List<Stock> searchStocks(String query, String sector) {
        List<Stock> results = searchStocks(query);
        if (sector == null || sector.equalsIgnoreCase("All Sectors")) {
            return results;
        }
        return results.stream()
                .filter(s -> s.getSector().equalsIgnoreCase(sector))
                .collect(Collectors.toList());
    }

    @Override
    public List<Stock> getSortedStocks(Comparator<Stock> comparator) {
        List<Stock> list = getAllStocks();
        list.sort(comparator);
        return list;
    }

    @Override
    public List<Stock> getTopGainers(int limit) {
        return stockMap.values().stream()
                .sorted((s1, s2) -> Double.compare(s2.getChangePercentage(), s1.getChangePercentage()))
                .limit(limit)
                .collect(Collectors.toList());
    }

    @Override
    public List<Stock> getTopLosers(int limit) {
        return stockMap.values().stream()
                .sorted(Comparator.comparingDouble(Stock::getChangePercentage))
                .limit(limit)
                .collect(Collectors.toList());
    }

    @Override
    public synchronized Transaction buyStock(User user, String symbol, int quantity)
            throws StockNotFoundException, InsufficientStockQuantityException,
            InsufficientBalanceException, InvalidInputException {
        if (quantity <= 0) {
            throw new InvalidInputException("Quantity must be greater than zero.");
        }

        Stock stock = getStockBySymbol(symbol);
        if (stock.getAvailableQuantity() < quantity) {
            throw new InsufficientStockQuantityException(stock.getSymbol(), quantity, stock.getAvailableQuantity());
        }

        double totalCost = stock.getCurrentPrice() * quantity;
        if (user.getWalletBalance() < totalCost) {
            throw new InsufficientBalanceException(totalCost, user.getWalletBalance());
        }

        // Deduct wallet balance
        user.withdraw(totalCost);

        // Deduct available market stock quantity
        stock.reduceQuantity(quantity);

        // Add position to user's portfolio
        Portfolio portfolio = portfolioService.getUserPortfolio(user);
        portfolio.buyStock(stock.getSymbol(), stock.getCompanyName(), quantity, stock.getCurrentPrice());

        // Log transaction
        Transaction tx = new Transaction(
                UUID.randomUUID().toString(),
                user.getId(),
                stock.getSymbol(),
                quantity,
                stock.getCurrentPrice(),
                TransactionType.BUY
        );
        transactions.add(tx);

        // Save state
        fileManager.saveStocks(stockMap);
        fileManager.saveTransactions(transactions);
        portfolioService.savePortfolios();

        return tx;
    }

    @Override
    public synchronized Transaction sellStock(User user, String symbol, int quantity)
            throws StockNotFoundException, InsufficientStockQuantityException, InvalidInputException {
        if (quantity <= 0) {
            throw new InvalidInputException("Quantity must be greater than zero.");
        }

        Stock stock = getStockBySymbol(symbol);
        Portfolio portfolio = portfolioService.getUserPortfolio(user);
        PortfolioItem item = portfolio.getItem(symbol);

        if (item == null || item.getQuantity() < quantity) {
            int owned = (item == null) ? 0 : item.getQuantity();
            throw new InsufficientStockQuantityException("Owned " + symbol, quantity, owned);
        }

        double totalProceeds = stock.getCurrentPrice() * quantity;

        // Credit user wallet
        user.deposit(totalProceeds);

        // Add quantity back to market
        stock.addQuantity(quantity);

        // Remove shares from portfolio
        portfolio.sellStock(symbol, quantity);

        // Create transaction record
        Transaction tx = new Transaction(
                UUID.randomUUID().toString(),
                user.getId(),
                stock.getSymbol(),
                quantity,
                stock.getCurrentPrice(),
                TransactionType.SELL
        );
        transactions.add(tx);

        // Save state
        fileManager.saveStocks(stockMap);
        fileManager.saveTransactions(transactions);
        portfolioService.savePortfolios();

        return tx;
    }

    @Override
    public synchronized void addStock(Stock stock) throws InvalidInputException {
        if (stock == null || stock.getSymbol() == null || stock.getSymbol().trim().isEmpty()) {
            throw new InvalidInputException("Invalid stock symbol.");
        }
        stockMap.put(stock.getSymbol().toUpperCase(), stock);
        fileManager.saveStocks(stockMap);
    }

    @Override
    public synchronized void updateStockPricesRandomly() {
        for (Stock stock : stockMap.values()) {
            // Price change range: -5.0% to +5.0%
            double changePercent = ThreadLocalRandom.current().nextDouble(-0.05, 0.05);
            double newPrice = stock.getCurrentPrice() * (1 + changePercent);
            stock.setCurrentPrice(newPrice);
        }
        fileManager.saveStocks(stockMap);
    }

    @Override
    public List<Transaction> getUserTransactions(User user) {
        return transactions.stream()
                .filter(t -> t.getUserId().equals(user.getId()))
                .sorted()
                .collect(Collectors.toList());
    }

    @Override
    public List<Transaction> getAllTransactions() {
        return new ArrayList<>(transactions);
    }
}
