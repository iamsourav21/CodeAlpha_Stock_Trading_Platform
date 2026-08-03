package com.stocktrading.util;

import com.stocktrading.model.Portfolio;
import com.stocktrading.model.Stock;
import com.stocktrading.model.Transaction;
import com.stocktrading.model.User;

import java.io.*;
import java.util.*;

/**
 * Handles binary serialization and file persistence for application data.
 * Manages users.dat, stocks.dat, portfolio.dat, transactions.dat.
 */
public class FileManager {
    private static final String DATA_DIR = "data/";
    private static final String USERS_FILE = DATA_DIR + "users.dat";
    private static final String STOCKS_FILE = DATA_DIR + "stocks.dat";
    private static final String PORTFOLIO_FILE = DATA_DIR + "portfolio.dat";
    private static final String TRANSACTIONS_FILE = DATA_DIR + "transactions.dat";

    public FileManager() {
        File dir = new File(DATA_DIR);
        if (!dir.exists()) {
            dir.mkdirs();
        }
    }

    /**
     * Save List of Users to binary file.
     */
    public synchronized void saveUsers(List<User> users) {
        saveObject(USERS_FILE, users);
    }

    /**
     * Load List of Users from binary file.
     */
    @SuppressWarnings("unchecked")
    public synchronized List<User> loadUsers() {
        Object obj = loadObject(USERS_FILE);
        if (obj instanceof List) {
            return (List<User>) obj;
        }
        return new ArrayList<>();
    }

    /**
     * Save Stocks Map to binary file.
     */
    public synchronized void saveStocks(Map<String, Stock> stocks) {
        saveObject(STOCKS_FILE, stocks);
    }

    /**
     * Load Stocks Map from binary file.
     */
    @SuppressWarnings("unchecked")
    public synchronized Map<String, Stock> loadStocks() {
        Object obj = loadObject(STOCKS_FILE);
        if (obj instanceof Map) {
            return (Map<String, Stock>) obj;
        }
        return new HashMap<>();
    }

    /**
     * Save User Portfolios Map to binary file.
     */
    public synchronized void savePortfolios(Map<String, Portfolio> portfolios) {
        saveObject(PORTFOLIO_FILE, portfolios);
    }

    /**
     * Load User Portfolios Map from binary file.
     */
    @SuppressWarnings("unchecked")
    public synchronized Map<String, Portfolio> loadPortfolios() {
        Object obj = loadObject(PORTFOLIO_FILE);
        if (obj instanceof Map) {
            return (Map<String, Portfolio>) obj;
        }
        return new HashMap<>();
    }

    /**
     * Save List of Transactions to binary file.
     */
    public synchronized void saveTransactions(List<Transaction> transactions) {
        saveObject(TRANSACTIONS_FILE, transactions);
    }

    /**
     * Load List of Transactions from binary file.
     */
    @SuppressWarnings("unchecked")
    public synchronized List<Transaction> loadTransactions() {
        Object obj = loadObject(TRANSACTIONS_FILE);
        if (obj instanceof List) {
            return (List<Transaction>) obj;
        }
        return new ArrayList<>();
    }

    // Helper method for generic binary serialization
    private void saveObject(String filePath, Object data) {
        try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(filePath))) {
            oos.writeObject(data);
        } catch (IOException e) {
            System.err.println("Error saving data to file " + filePath + ": " + e.getMessage());
        }
    }

    // Helper method for generic binary deserialization
    private Object loadObject(String filePath) {
        File file = new File(filePath);
        if (!file.exists()) return null;

        try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream(file))) {
            return ois.readObject();
        } catch (IOException | ClassNotFoundException e) {
            System.err.println("Error loading data from file " + filePath + ": " + e.getMessage());
            return null;
        }
    }
}
