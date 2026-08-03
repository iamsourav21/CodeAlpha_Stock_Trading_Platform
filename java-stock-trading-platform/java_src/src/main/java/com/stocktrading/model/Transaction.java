package com.stocktrading.model;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Represents a single executed financial trade or wallet transaction.
 */
public class Transaction implements Serializable, Comparable<Transaction> {
    private static final long serialVersionUID = 1L;

    private String transactionId;
    private String userId;
    private String stockSymbol;
    private int quantity;
    private double price;
    private TransactionType type;
    private LocalDateTime timestamp;
    private double totalAmount;

    public Transaction() {}

    public Transaction(String transactionId, String userId, String stockSymbol, int quantity, double price, TransactionType type) {
        this.transactionId = transactionId;
        this.userId = userId;
        this.stockSymbol = stockSymbol;
        this.quantity = quantity;
        this.price = price;
        this.type = type;
        this.timestamp = LocalDateTime.now();
        this.totalAmount = quantity * price;
    }

    public Transaction(String transactionId, String userId, String stockSymbol, int quantity, double price, TransactionType type, LocalDateTime timestamp) {
        this.transactionId = transactionId;
        this.userId = userId;
        this.stockSymbol = stockSymbol;
        this.quantity = quantity;
        this.price = price;
        this.type = type;
        this.timestamp = timestamp;
        this.totalAmount = quantity * price;
    }

    // Getters and Setters
    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getStockSymbol() {
        return stockSymbol;
    }

    public void setStockSymbol(String stockSymbol) {
        this.stockSymbol = stockSymbol;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public TransactionType getType() {
        return type;
    }

    public void setType(TransactionType type) {
        this.type = type;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public double getTotalAmount() {
        return totalAmount;
    }

    public String getFormattedTimestamp() {
        if (timestamp == null) return "N/A";
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        return timestamp.format(formatter);
    }

    @Override
    public int compareTo(Transaction o) {
        if (this.timestamp == null || o.timestamp == null) return 0;
        return o.timestamp.compareTo(this.timestamp); // Newest first
    }

    @Override
    public String toString() {
        return String.format("[%s] %s %d x %s @ $%.2f = $%.2f",
                getFormattedTimestamp(), type.getDisplayName(), quantity, stockSymbol, price, totalAmount);
    }
}
