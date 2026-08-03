package com.stocktrading.service;

import com.stocktrading.exception.InsufficientBalanceException;
import com.stocktrading.exception.InvalidInputException;
import com.stocktrading.model.Transaction;
import com.stocktrading.model.TransactionType;
import com.stocktrading.model.User;
import com.stocktrading.util.FileManager;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public class WalletService implements IWalletService {
    private FileManager fileManager;
    private List<Transaction> transactions;

    public WalletService(FileManager fileManager, List<Transaction> transactions) {
        this.fileManager = fileManager;
        this.transactions = transactions;
    }

    @Override
    public double deposit(User user, double amount) throws InvalidInputException {
        if (amount <= 0) {
            throw new InvalidInputException("Deposit amount must be greater than zero.");
        }
        user.deposit(amount);

        Transaction tx = new Transaction(
                UUID.randomUUID().toString(),
                user.getId(),
                "CASH",
                1,
                amount,
                TransactionType.DEPOSIT
        );
        transactions.add(tx);
        fileManager.saveTransactions(transactions);
        return user.getWalletBalance();
    }

    @Override
    public double withdraw(User user, double amount) throws InvalidInputException, InsufficientBalanceException {
        if (amount <= 0) {
            throw new InvalidInputException("Withdrawal amount must be greater than zero.");
        }
        if (user.getWalletBalance() < amount) {
            throw new InsufficientBalanceException(amount, user.getWalletBalance());
        }

        user.withdraw(amount);

        Transaction tx = new Transaction(
                UUID.randomUUID().toString(),
                user.getId(),
                "CASH",
                1,
                amount,
                TransactionType.WITHDRAW
        );
        transactions.add(tx);
        fileManager.saveTransactions(transactions);
        return user.getWalletBalance();
    }

    @Override
    public List<Transaction> getWalletTransactions(User user) {
        return transactions.stream()
                .filter(tx -> tx.getUserId().equals(user.getId()) &&
                        (tx.getType() == TransactionType.DEPOSIT || tx.getType() == TransactionType.WITHDRAW))
                .sorted()
                .collect(Collectors.toList());
    }
}
