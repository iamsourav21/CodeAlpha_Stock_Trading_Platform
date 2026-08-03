package com.stocktrading.service;

import com.stocktrading.model.Portfolio;
import com.stocktrading.model.Stock;
import com.stocktrading.model.User;

import java.util.Map;

public interface IPortfolioService {
    Portfolio getUserPortfolio(User user);

    double getPortfolioMarketValue(User user, Map<String, Stock> liveStocks);

    double getPortfolioProfitLoss(User user, Map<String, Stock> liveStocks);

    double getPortfolioReturnPercentage(User user, Map<String, Stock> liveStocks);

    void savePortfolios();
}
