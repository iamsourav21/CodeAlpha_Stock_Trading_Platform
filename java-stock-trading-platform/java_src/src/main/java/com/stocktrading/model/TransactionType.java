package com.stocktrading.model;

/**
 * Enumeration representing the type of stock transaction.
 * Demonstrates the use of Java Enum type.
 */
public enum TransactionType {
    BUY("Purchase"),
    SELL("Sale"),
    DEPOSIT("Wallet Deposit"),
    WITHDRAW("Wallet Withdrawal");

    private final String displayName;

    TransactionType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    @Override
    public String toString() {
        return displayName;
    }
}
