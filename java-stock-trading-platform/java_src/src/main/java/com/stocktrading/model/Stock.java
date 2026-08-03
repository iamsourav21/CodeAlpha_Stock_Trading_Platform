package com.stocktrading.model;

import java.io.Serializable;
import java.util.Objects;

/**
 * Represents a stock asset in the market.
 * Encapsulates price history, current valuation, and available quantity.
 */
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

    public Stock() {}

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

    // Getters and Setters
    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public double getCurrentPrice() {
        return currentPrice;
    }

    public void setCurrentPrice(double currentPrice) {
        this.previousPrice = this.currentPrice;
        this.currentPrice = Math.max(0.01, currentPrice); // Minimum price floor
        if (this.currentPrice > dayHigh) dayHigh = this.currentPrice;
        if (this.currentPrice < dayLow || dayLow == 0) dayLow = this.currentPrice;
    }

    public double getPreviousPrice() {
        return previousPrice;
    }

    public double getDayHigh() {
        return dayHigh;
    }

    public double getDayLow() {
        return dayLow;
    }

    public int getAvailableQuantity() {
        return availableQuantity;
    }

    public void setAvailableQuantity(int availableQuantity) {
        this.availableQuantity = availableQuantity;
    }

    public String getSector() {
        return sector;
    }

    public void setSector(String sector) {
        this.sector = sector;
    }

    /**
     * Calculates the price change amount from previous ticker price.
     */
    public double getPriceChange() {
        return currentPrice - previousPrice;
    }

    /**
     * Calculates the price change percentage.
     */
    public double getChangePercentage() {
        if (previousPrice == 0) return 0.0;
        return ((currentPrice - previousPrice) / previousPrice) * 100.0;
    }

    /**
     * Reduces available market quantity when a user buys.
     */
    public void reduceQuantity(int qty) {
        if (qty <= availableQuantity) {
            this.availableQuantity -= qty;
        }
    }

    /**
     * Increases available market quantity when a user sells.
     */
    public void addQuantity(int qty) {
        this.availableQuantity += qty;
    }

    @Override
    public int compareTo(Stock o) {
        return this.symbol.compareTo(o.symbol);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Stock stock = (Stock) o;
        return Objects.equals(symbol, stock.symbol);
    }

    @Override
    public int hashCode() {
        return Objects.hash(symbol);
    }

    @Override
    public String toString() {
        return String.format("%s (%s) - $%.2f", companyName, symbol, currentPrice);
    }
}
