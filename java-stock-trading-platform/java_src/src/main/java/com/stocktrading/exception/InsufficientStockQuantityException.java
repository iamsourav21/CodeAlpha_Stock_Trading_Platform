package com.stocktrading.exception;

public class InsufficientStockQuantityException extends StockException {
    public InsufficientStockQuantityException(String symbol, int requested, int available) {
        super(String.format("Insufficient stock quantity for %s! Requested: %d, Available: %d", symbol, requested, available));
    }
}
