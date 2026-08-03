package com.stocktrading.model;

import java.io.Serializable;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

/**
 * Represents the aggregate stock portfolio for a user.
 * Demonstrates Collections Framework (HashMap).
 */
public class Portfolio implements Serializable {
    private static final long serialVersionUID = 1L;

    private String userId;
    private Map<String, PortfolioItem> holdings; // Key: stock symbol

    public Portfolio() {
        this.holdings = new HashMap<>();
    }

    public Portfolio(String userId) {
        this.userId = userId;
        this.holdings = new HashMap<>();
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Map<String, PortfolioItem> getHoldingsMap() {
        return holdings;
    }

    public Collection<PortfolioItem> getHoldings() {
        return holdings.values();
    }

    public PortfolioItem getItem(String symbol) {
        return holdings.get(symbol.toUpperCase());
    }

    /**
     * Buy stock and update position.
     */
    public void buyStock(String symbol, String companyName, int quantity, double price) {
        symbol = symbol.toUpperCase();
        if (holdings.containsKey(symbol)) {
            PortfolioItem item = holdings.get(symbol);
            item.addShares(quantity, price);
        } else {
            PortfolioItem item = new PortfolioItem(symbol, companyName, quantity, price);
            holdings.put(symbol, item);
        }
    }

    /**
     * Sell stock and update position.
     * @return true if holding exists and sell succeeded, false otherwise.
     */
    public boolean sellStock(String symbol, int quantity) {
        symbol = symbol.toUpperCase();
        if (holdings.containsKey(symbol)) {
            PortfolioItem item = holdings.get(symbol);
            if (item.getQuantity() > quantity) {
                item.removeShares(quantity);
                return true;
            } else if (item.getQuantity() == quantity) {
                holdings.remove(symbol);
                return true;
            }
        }
        return false;
    }

    /**
     * Calculates total initial investment cost across all holdings.
     */
    public double getTotalInvestment() {
        double total = 0;
        for (PortfolioItem item : holdings.values()) {
            total += item.getTotalInvestment();
        }
        return total;
    }

    /**
     * Calculates current total market value given live stock prices map.
     */
    public double getCurrentMarketValue(Map<String, Stock> liveStocks) {
        double total = 0;
        for (PortfolioItem item : holdings.values()) {
            Stock stock = liveStocks.get(item.getStockSymbol());
            double price = (stock != null) ? stock.getCurrentPrice() : item.getAverageBuyPrice();
            total += item.getQuantity() * price;
        }
        return total;
    }

    /**
     * Calculates net profit/loss.
     */
    public double getTotalProfitLoss(Map<String, Stock> liveStocks) {
        return getCurrentMarketValue(liveStocks) - getTotalInvestment();
    }

    /**
     * Calculates return percentage.
     */
    public double getReturnPercentage(Map<String, Stock> liveStocks) {
        double investment = getTotalInvestment();
        if (investment == 0) return 0.0;
        return (getTotalProfitLoss(liveStocks) / investment) * 100.0;
    }
}
