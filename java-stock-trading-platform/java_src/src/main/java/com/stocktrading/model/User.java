package com.stocktrading.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * Represents a user in the stock trading system.
 * Demonstrates Encapsulation, Constructors, and Serializable interface.
 */
public class User implements Serializable {
    private static final long serialVersionUID = 1L;

    private String id;
    private String name;
    private String email;
    private String password;
    private double walletBalance;
    private boolean isAdmin;
    private List<String> watchlist;

    /**
     * Default Constructor
     */
    public User() {
        this.watchlist = new ArrayList<>();
    }

    /**
     * Parameterized Constructor
     */
    public User(String id, String name, String email, String password, double walletBalance, boolean isAdmin) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.walletBalance = walletBalance;
        this.isAdmin = isAdmin;
        this.watchlist = new ArrayList<>();
    }

    // Getters and Setters (Encapsulation)
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public double getWalletBalance() {
        return walletBalance;
    }

    public void setWalletBalance(double walletBalance) {
        this.walletBalance = walletBalance;
    }

    public boolean isAdmin() {
        return isAdmin;
    }

    public void setAdmin(boolean admin) {
        isAdmin = admin;
    }

    public List<String> getWatchlist() {
        if (watchlist == null) {
            watchlist = new ArrayList<>();
        }
        return watchlist;
    }

    public void setWatchlist(List<String> watchlist) {
        this.watchlist = watchlist;
    }

    /**
     * Deposit funds into wallet
     */
    public void deposit(double amount) {
        if (amount > 0) {
            this.walletBalance += amount;
        }
    }

    /**
     * Withdraw funds from wallet
     */
    public boolean withdraw(double amount) {
        if (amount > 0 && this.walletBalance >= amount) {
            this.walletBalance -= amount;
            return true;
        }
        return false;
    }

    /**
     * Toggle stock in user's watchlist
     */
    public boolean toggleWatchlist(String symbol) {
        if (getWatchlist().contains(symbol)) {
            watchlist.remove(symbol);
            return false;
        } else {
            watchlist.add(symbol);
            return true;
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return Objects.equals(id, user.id) || Objects.equals(email, user.email);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, email);
    }

    @Override
    public String toString() {
        return "User{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", walletBalance=" + walletBalance +
                ", isAdmin=" + isAdmin +
                '}';
    }
}
