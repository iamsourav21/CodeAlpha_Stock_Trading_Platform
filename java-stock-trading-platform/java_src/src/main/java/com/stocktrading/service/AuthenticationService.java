package com.stocktrading.service;

import com.stocktrading.exception.AuthenticationException;
import com.stocktrading.exception.DuplicateUserException;
import com.stocktrading.exception.InvalidInputException;
import com.stocktrading.model.User;
import com.stocktrading.util.FileManager;
import com.stocktrading.util.ValidationUtil;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Service implementation for User Authentication & Registration.
 */
public class AuthenticationService implements IAuthenticationService {
    private List<User> users;
    private FileManager fileManager;

    public AuthenticationService(FileManager fileManager) {
        this.fileManager = fileManager;
        this.users = fileManager.loadUsers();
        seedDefaultUsersIfEmpty();
    }

    private void seedDefaultUsersIfEmpty() {
        if (users.isEmpty()) {
            // Default Admin
            User admin = new User(UUID.randomUUID().toString(), "Admin User", "admin@stocktrading.com", "admin", 50000.0, true);
            // Default Trader
            User trader = new User(UUID.randomUUID().toString(), "John Doe", "trader@stocktrading.com", "password123", 10000.0, false);
            users.add(admin);
            users.add(trader);
            fileManager.saveUsers(users);
        }
    }

    @Override
    public User register(String name, String email, String password, double initialDeposit)
            throws DuplicateUserException, InvalidInputException {
        if (name == null || name.trim().isEmpty()) {
            throw new InvalidInputException("Name cannot be empty.");
        }
        if (!ValidationUtil.isValidEmail(email)) {
            throw new InvalidInputException("Invalid email format.");
        }
        if (!ValidationUtil.isValidPassword(password)) {
            throw new InvalidInputException("Password must be at least 4 characters long.");
        }
        if (initialDeposit < 0) {
            throw new InvalidInputException("Initial deposit cannot be negative.");
        }

        for (User u : users) {
            if (u.getEmail().equalsIgnoreCase(email.trim())) {
                throw new DuplicateUserException(email);
            }
        }

        User newUser = new User(UUID.randomUUID().toString(), name.trim(), email.trim(), password, initialDeposit, false);
        users.add(newUser);
        fileManager.saveUsers(users);
        return newUser;
    }

    @Override
    public User login(String email, String password) throws AuthenticationException {
        if (email == null || password == null) {
            throw new AuthenticationException("Email and password are required.");
        }

        for (User user : users) {
            if (user.getEmail().equalsIgnoreCase(email.trim()) && user.getPassword().equals(password)) {
                return user;
            }
        }
        throw new AuthenticationException("Invalid email or password.");
    }

    @Override
    public boolean changePassword(User user, String oldPassword, String newPassword)
            throws InvalidInputException, AuthenticationException {
        if (!user.getPassword().equals(oldPassword)) {
            throw new AuthenticationException("Incorrect current password.");
        }
        if (!ValidationUtil.isValidPassword(newPassword)) {
            throw new InvalidInputException("New password must be at least 4 characters long.");
        }
        user.setPassword(newPassword);
        fileManager.saveUsers(users);
        return true;
    }

    @Override
    public boolean updateProfile(User user, String newName, String newEmail)
            throws InvalidInputException, DuplicateUserException {
        if (newName == null || newName.trim().isEmpty()) {
            throw new InvalidInputException("Name cannot be empty.");
        }
        if (!ValidationUtil.isValidEmail(newEmail)) {
            throw new InvalidInputException("Invalid email format.");
        }

        for (User u : users) {
            if (!u.getId().equals(user.getId()) && u.getEmail().equalsIgnoreCase(newEmail.trim())) {
                throw new DuplicateUserException(newEmail);
            }
        }

        user.setName(newName.trim());
        user.setEmail(newEmail.trim());
        fileManager.saveUsers(users);
        return true;
    }

    @Override
    public List<User> getAllUsers() {
        return new ArrayList<>(users);
    }
}
