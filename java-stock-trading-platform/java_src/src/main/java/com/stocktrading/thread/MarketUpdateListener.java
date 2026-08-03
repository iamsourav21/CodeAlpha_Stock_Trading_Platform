package com.stocktrading.thread;

import com.stocktrading.model.Stock;
import java.util.List;

/**
 * Observer interface for reacting to market price updates from the simulator thread.
 * Demonstrates Observer Design Pattern.
 */
public interface MarketUpdateListener {
    void onMarketUpdated(List<Stock> stocks);
}
