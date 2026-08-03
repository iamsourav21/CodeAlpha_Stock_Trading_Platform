package com.stocktrading.service;

import com.stocktrading.model.Portfolio;
import com.stocktrading.model.Stock;
import com.stocktrading.model.User;
import com.stocktrading.util.FileManager;

import java.util.HashMap;
import java.util.Map;

public class PortfolioService implements IPortfolioService {
    private Map<String, Portfolio> portfolios;
    private FileManager fileManager;

    public PortfolioService(FileManager fileManager) {
        this.fileManager = fileManager;
        this.portfolios = fileManager.loadPortfolios();
        if (this.portfolios == null) {
            this.portfolios = new HashMap<>();
        }
    }

    @Override
    public Portfolio getUserPortfolio(User user) {
        if (!portfolios.containsKey(user.getId())) {
            Portfolio portfolio = new Portfolio(user.getId());
            portfolios.put(user.getId(), portfolio);
            savePortfolios();
        }
        return portfolios.get(user.getId());
    }

    @Override
    public double getPortfolioMarketValue(User user, Map<String, Stock> liveStocks) {
        Portfolio p = getUserPortfolio(user);
        return p.getCurrentMarketValue(liveStocks);
    }

    @Override
    public double getPortfolioProfitLoss(User user, Map<String, Stock> liveStocks) {
        Portfolio p = getUserPortfolio(user);
        return p.getTotalProfitLoss(liveStocks);
    }

    @Override
    public double getPortfolioReturnPercentage(User user, Map<String, Stock> liveStocks) {
        Portfolio p = getUserPortfolio(user);
        return p.getReturnPercentage(liveStocks);
    }

    @Override
    public void savePortfolios() {
        fileManager.savePortfolios(portfolios);
    }
}
