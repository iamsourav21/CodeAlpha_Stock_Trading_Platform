package com.stocktrading.exception;

/**
 * Base custom checked exception for the stock trading application.
 * Demonstrates Inheritance and Exception Handling.
 */
public class StockException extends Exception {
    public StockException(String message) {
        super(message);
    }

    public StockException(String message, Throwable cause) {
        super(message, cause);
    }
}
