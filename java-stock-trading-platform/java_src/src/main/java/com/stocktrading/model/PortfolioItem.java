package com.stocktrading.model;

import java.io.Serializable;

/**
 * Represents an individual stock holding inside a user portfolio.
 */
public class PortfolioItem implements Serializable {
    private static final long serialVersionUID = 1L;

    private String stockSymbol;
    private String companyName;
    private int quantity;
    private double averageBuyPrice;

    public PortfolioItem() {}

    public PortfolioItem(String stockSymbol, String companyName, int quantity, double averageBuyPrice) {
        this.stockSymbol = stockSymbol;
        this.companyName = companyName;
        this.quantity = quantity;
        this.averageBuyPrice = averageBuyPrice;
    }

    public String getStockSymbol() {
        return stockSymbol;
    }

    public void setStockSymbol(String stockSymbol) {
        this.stockSymbol = stockSymbol;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public double getAverageBuyPrice() {
        return averageBuyPrice;
    }

    public void setAverageBuyPrice(double averageBuyPrice) {
        this.averageBuyPrice = averageBuyPrice;
    }

    public double getTotalInvestment() {
        return quantity * averageBuyPrice;
    }

    /**
     * Add newly purchased shares and adjust average cost basis.
     */
    public void addShares(int newQty, double buyPrice) {
        double currentCost = this.quantity * this.averageBuyPrice;
        double newCost = newQty * buyPrice;
        this.quantity += newQty;
        this.averageBuyPrice = (currentCost + newCost) / this.quantity;
    }

    /**
     * Reduce shares upon selling.
     */
    public void removeShares(int qty) {
        this.quantity -= qty;
    }
}
