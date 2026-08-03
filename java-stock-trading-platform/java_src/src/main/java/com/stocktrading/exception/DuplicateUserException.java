package com.stocktrading.exception;

public class DuplicateUserException extends StockException {
    public DuplicateUserException(String email) {
        super("A user account already exists with email: " + email);
    }
}
