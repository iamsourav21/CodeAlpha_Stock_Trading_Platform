package com.stocktrading.thread;

import com.stocktrading.model.Stock;
import com.stocktrading.service.IStockMarketService;

import java.util.ArrayList;
import java.util.List;

/**
 * Background Thread that simulates live stock market price fluctuations every 10 seconds.
 * Demonstrates Multithreading, Runnable interface, Thread control, and Event Listeners.
 */
public class MarketSimulatorThread implements Runnable {
    private final IStockMarketService marketService;
    private final List<MarketUpdateListener> listeners;
    private volatile boolean running;
    private final long intervalMs;

    public MarketSimulatorThread(IStockMarketService marketService) {
        this.marketService = marketService;
        this.listeners = new ArrayList<>();
        this.running = true;
        this.intervalMs = 10000; // 10 Seconds
    }

    public void addListener(MarketUpdateListener listener) {
        synchronized (listeners) {
            listeners.add(listener);
        }
    }

    public void removeListener(MarketUpdateListener listener) {
        synchronized (listeners) {
            listeners.remove(listener);
        }
    }

    public void stopSimulator() {
        this.running = false;
    }

    @Override
    public void run() {
        System.out.println("Market Simulator Thread Started (Updating every " + (intervalMs / 1000) + "s)...");
        while (running) {
            try {
                Thread.sleep(intervalMs);
                if (!running) break;

                // Randomly update market prices (-5% to +5%)
                marketService.updateStockPricesRandomly();
                List<Stock> updatedStocks = marketService.getAllStocks();

                // Notify all UI listeners
                synchronized (listeners) {
                    for (MarketUpdateListener listener : listeners) {
                        listener.onMarketUpdated(updatedStocks);
                    }
                }
            } catch (InterruptedException e) {
                System.out.println("Market Simulator Thread interrupted.");
                Thread.currentThread().interrupt();
                break;
            } catch (Exception e) {
                System.err.println("Error in Market Simulator Thread: " + e.getMessage());
            }
        }
        System.out.println("Market Simulator Thread Stopped.");
    }
}
