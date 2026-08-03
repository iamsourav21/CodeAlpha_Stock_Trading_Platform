package com.stocktrading.exception;

public class InsufficientBalanceException extends StockException {
    private final double requiredAmount;
    private final double availableBalance;

    public InsufficientBalanceException(double requiredAmount, double availableBalance) {
        super(String.format("Insufficient wallet balance! Required: $%.2f, Available: $%.2f", requiredAmount, availableBalance));
        this.requiredAmount = requiredAmount;
        this.availableBalance = availableBalance;
    }

    public double getRequiredAmount() {
        return requiredAmount;
    }

    public double getAvailableBalance() {
        return availableBalance;
    }
}
