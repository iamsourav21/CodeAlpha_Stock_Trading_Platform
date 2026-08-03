package com.stocktrading.ui;

import com.stocktrading.exception.AuthenticationException;
import com.stocktrading.exception.DuplicateUserException;
import com.stocktrading.exception.InvalidInputException;
import com.stocktrading.model.User;
import com.stocktrading.service.IAuthenticationService;

import javax.swing.*;
import java.awt.*;

/**
 * Modal Dialog for User Login and Registration.
 * Demonstrates Swing Forms, Layout Managers, and Event Handling.
 */
public class LoginDialog extends JDialog {
    private final IAuthenticationService authService;
    private User authenticatedUser;

    private JTextField loginEmailField;
    private JPasswordField loginPasswordField;

    private JTextField regNameField;
    private JTextField regEmailField;
    private JPasswordField regPasswordField;
    private JTextField regDepositField;

    public LoginDialog(Frame parent, IAuthenticationService authService) {
        super(parent, "Stock Trading Platform - Welcome", true);
        this.authService = authService;
        initUI();
    }

    private void initUI() {
        setSize(420, 380);
        setLocationRelativeTo(getOwner());
        setResizable(false);
        setDefaultCloseOperation(DISPOSE_ON_CLOSE);

        JTabbedPane tabbedPane = new JTabbedPane();
        tabbedPane.addTab("Login", createLoginPanel());
        tabbedPane.addTab("Register", createRegisterPanel());

        add(tabbedPane);
    }

    private JPanel createLoginPanel() {
        JPanel panel = new JPanel(new GridBagLayout());
        panel.setBorder(BorderFactory.createEmptyBorder(20, 20, 20, 20));
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(8, 8, 8, 8);
        gbc.fill = GridBagConstraints.HORIZONTAL;

        gbc.gridx = 0; gbc.gridy = 0;
        panel.add(new JLabel("Email Address:"), gbc);

        gbc.gridx = 1;
        loginEmailField = new JTextField("trader@stocktrading.com", 18);
        panel.add(loginEmailField, gbc);

        gbc.gridx = 0; gbc.gridy = 1;
        panel.add(new JLabel("Password:"), gbc);

        gbc.gridx = 1;
        loginPasswordField = new JPasswordField("password123", 18);
        panel.add(loginPasswordField, gbc);

        gbc.gridx = 0; gbc.gridy = 2; gbc.gridwidth = 2;
        JButton loginButton = new JButton("Login");
        loginButton.setFont(new Font("SansSerif", Font.BOLD, 14));
        loginButton.addActionListener(e -> performLogin());
        panel.add(loginButton, gbc);

        gbc.gridy = 3;
        JLabel hint = new JLabel("<html><center><small>Demo: trader@stocktrading.com / password123<br>Admin: admin@stocktrading.com / admin</small></center></html>");
        hint.setForeground(Color.GRAY);
        panel.add(hint, gbc);

        return panel;
    }

    private JPanel createRegisterPanel() {
        JPanel panel = new JPanel(new GridBagLayout());
        panel.setBorder(BorderFactory.createEmptyBorder(15, 20, 15, 20));
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(6, 6, 6, 6);
        gbc.fill = GridBagConstraints.HORIZONTAL;

        gbc.gridx = 0; gbc.gridy = 0;
        panel.add(new JLabel("Full Name:"), gbc);
        gbc.gridx = 1;
        regNameField = new JTextField(16);
        panel.add(regNameField, gbc);

        gbc.gridx = 0; gbc.gridy = 1;
        panel.add(new JLabel("Email Address:"), gbc);
        gbc.gridx = 1;
        regEmailField = new JTextField(16);
        panel.add(regEmailField, gbc);

        gbc.gridx = 0; gbc.gridy = 2;
        panel.add(new JLabel("Password:"), gbc);
        gbc.gridx = 1;
        regPasswordField = new JPasswordField(16);
        panel.add(regPasswordField, gbc);

        gbc.gridx = 0; gbc.gridy = 3;
        panel.add(new JLabel("Initial Deposit ($):"), gbc);
        gbc.gridx = 1;
        regDepositField = new JTextField("10000.00", 16);
        panel.add(regDepositField, gbc);

        gbc.gridx = 0; gbc.gridy = 4; gbc.gridwidth = 2;
        JButton regButton = new JButton("Create Account");
        regButton.setFont(new Font("SansSerif", Font.BOLD, 14));
        regButton.addActionListener(e -> performRegistration());
        panel.add(regButton, gbc);

        return panel;
    }

    private void performLogin() {
        String email = loginEmailField.getText();
        String password = new String(loginPasswordField.getPassword());

        try {
            authenticatedUser = authService.login(email, password);
            JOptionPane.showMessageDialog(this, "Welcome back, " + authenticatedUser.getName() + "!",
                    "Login Successful", JOptionPane.INFORMATION_MESSAGE);
            dispose();
        } catch (AuthenticationException ex) {
            JOptionPane.showMessageDialog(this, ex.getMessage(), "Authentication Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    private void performRegistration() {
        String name = regNameField.getText();
        String email = regEmailField.getText();
        String password = new String(regPasswordField.getPassword());
        String depositStr = regDepositField.getText();

        try {
            double deposit = Double.parseDouble(depositStr);
            authenticatedUser = authService.register(name, email, password, deposit);
            JOptionPane.showMessageDialog(this, "Account created successfully! Welcome " + authenticatedUser.getName() + ".",
                    "Registration Successful", JOptionPane.INFORMATION_MESSAGE);
            dispose();
        } catch (NumberFormatException ex) {
            JOptionPane.showMessageDialog(this, "Please enter a valid deposit amount.", "Input Error", JOptionPane.ERROR_MESSAGE);
        } catch (DuplicateUserException | InvalidInputException ex) {
            JOptionPane.showMessageDialog(this, ex.getMessage(), "Registration Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    public User getAuthenticatedUser() {
        return authenticatedUser;
    }
}
