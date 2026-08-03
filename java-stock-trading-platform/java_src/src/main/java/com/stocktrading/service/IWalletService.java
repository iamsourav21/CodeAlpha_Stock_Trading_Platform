package com.stocktrading.service;

import com.stocktrading.exception.InsufficientBalanceException;
import com.stocktrading.exception.InvalidInputException;
import com.stocktrading.model.Transaction;
import com.stocktrading.model.User;

import java.util.List;

public interface IWalletService {
    double deposit(User user, double amount) throws InvalidInputException;

    double withdraw(User user, double amount) throws InvalidInputException, InsufficientBalanceException;

    List<Transaction> getWalletTransactions(User user);
}
