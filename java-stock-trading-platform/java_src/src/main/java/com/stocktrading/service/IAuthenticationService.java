package com.stocktrading.service;

import com.stocktrading.exception.AuthenticationException;
import com.stocktrading.exception.DuplicateUserException;
import com.stocktrading.exception.InvalidInputException;
import com.stocktrading.model.User;

import java.util.List;

/**
 * Interface contract for User Authentication and Profile Management.
 * Demonstrates Abstraction and Interface definition.
 */
public interface IAuthenticationService {
    User register(String name, String email, String password, double initialDeposit)
            throws DuplicateUserException, InvalidInputException;

    User login(String email, String password) throws AuthenticationException;

    boolean changePassword(User user, String oldPassword, String newPassword)
            throws InvalidInputException, AuthenticationException;

    boolean updateProfile(User user, String newName, String newEmail)
            throws InvalidInputException, DuplicateUserException;

    List<User> getAllUsers();
}
