package com.stocktrading.exception;

public class StockNotFoundException extends StockException {
    public StockNotFoundException(String symbol) {
        super("Stock ticker symbol not found: " + symbol);
    }
}
