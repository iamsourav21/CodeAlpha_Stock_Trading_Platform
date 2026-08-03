package com.stocktrading.service;

import com.stocktrading.exception.InsufficientBalanceException;
import com.stocktrading.exception.InsufficientStockQuantityException;
import com.stocktrading.exception.InvalidInputException;
import com.stocktrading.exception.StockNotFoundException;
import com.stocktrading.model.Stock;
import com.stocktrading.model.Transaction;
import com.stocktrading.model.User;

import java.util.Comparator;
import java.util.List;
import java.util.Map;

public interface IStockMarketService {
    List<Stock> getAllStocks();

    Map<String, Stock> getStockMap();

    Stock getStockBySymbol(String symbol) throws StockNotFoundException;

    List<Stock> searchStocks(String query);

    List<Stock> searchStocks(String query, String sector);

    List<Stock> getSortedStocks(Comparator<Stock> comparator);

    List<Stock> getTopGainers(int limit);

    List<Stock> getTopLosers(int limit);

    Transaction buyStock(User user, String symbol, int quantity)
            throws StockNotFoundException, InsufficientStockQuantityException,
            InsufficientBalanceException, InvalidInputException;

    Transaction sellStock(User user, String symbol, int quantity)
            throws StockNotFoundException, InsufficientStockQuantityException, InvalidInputException;

    void addStock(Stock stock) throws InvalidInputException;

    void updateStockPricesRandomly();

    List<Transaction> getUserTransactions(User user);

    List<Transaction> getAllTransactions();
}
