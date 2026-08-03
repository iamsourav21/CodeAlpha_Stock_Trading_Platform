package com.stocktrading.ui;

import com.stocktrading.exception.StockException;
import com.stocktrading.model.User;
import com.stocktrading.service.IWalletService;
import com.stocktrading.util.FormatUtil;

import javax.swing.*;
import java.awt.*;

/**
 * Wallet Management Panel for Deposits and Withdrawals.
 */
public class WalletPanel extends JPanel {
    private final IWalletService walletService;
    private User currentUser;

    private JLabel balanceLabel;
    private JTextField amountField;

    public WalletPanel(IWalletService walletService, User currentUser) {
        this.walletService = walletService;
        this.currentUser = currentUser;

        setLayout(new GridBagLayout());
        setBorder(BorderFactory.createEmptyBorder(20, 20, 20, 20));

        initUI();
    }

    public void setCurrentUser(User user) {
        this.currentUser = user;
        refreshBalance();
    }

    private void initUI() {
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(10, 10, 10, 10);
        gbc.fill = GridBagConstraints.HORIZONTAL;

        // Balance Card
        JPanel card = new JPanel(new BorderLayout(10, 10));
        card.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(new Color(70, 130, 180), 2),
                BorderFactory.createEmptyBorder(20, 30, 20, 30)
        ));

        JLabel title = new JLabel("Current Available Wallet Balance", SwingConstants.CENTER);
        title.setFont(new Font("SansSerif", Font.PLAIN, 14));

        balanceLabel = new JLabel("$0.00", SwingConstants.CENTER);
        balanceLabel.setFont(new Font("SansSerif", Font.BOLD, 32));
        balanceLabel.setForeground(new Color(34, 139, 34));

        card.add(title, BorderLayout.NORTH);
        card.add(balanceLabel, BorderLayout.CENTER);

        gbc.gridx = 0; gbc.gridy = 0; gbc.gridwidth = 2;
        add(card, gbc);

        // Amount Input
        gbc.gridy = 1; gbc.gridwidth = 1;
        add(new JLabel("Amount ($):"), gbc);

        gbc.gridx = 1;
        amountField = new JTextField(12);
        amountField.setFont(new Font("SansSerif", Font.PLAIN, 16));
        add(amountField, gbc);

        // Buttons
        gbc.gridx = 0; gbc.gridy = 2;
        JButton depositBtn = new JButton("Deposit Funds");
        depositBtn.setFont(new Font("SansSerif", Font.BOLD, 14));
        depositBtn.setBackground(new Color(34, 139, 34));
        depositBtn.setForeground(Color.WHITE);
        depositBtn.addActionListener(e -> handleDeposit());
        add(depositBtn, gbc);

        gbc.gridx = 1;
        JButton withdrawBtn = new JButton("Withdraw Funds");
        withdrawBtn.setFont(new Font("SansSerif", Font.BOLD, 14));
        withdrawBtn.setBackground(new Color(205, 92, 92));
        withdrawBtn.setForeground(Color.WHITE);
        withdrawBtn.addActionListener(e -> handleWithdraw());
        add(withdrawBtn, gbc);

        refreshBalance();
    }

    public void refreshBalance() {
        if (currentUser != null) {
            balanceLabel.setText(FormatUtil.formatCurrency(currentUser.getWalletBalance()));
        }
    }

    private void handleDeposit() {
        try {
            double amount = Double.parseDouble(amountField.getText().trim());
            walletService.deposit(currentUser, amount);
            JOptionPane.showMessageDialog(this, "Deposited " + FormatUtil.formatCurrency(amount) + " successfully!",
                    "Deposit Successful", JOptionPane.INFORMATION_MESSAGE);
            amountField.setText("");
            refreshBalance();
        } catch (NumberFormatException ex) {
            JOptionPane.showMessageDialog(this, "Please enter a valid amount.", "Input Error", JOptionPane.ERROR_MESSAGE);
        } catch (StockException ex) {
            JOptionPane.showMessageDialog(this, ex.getMessage(), "Deposit Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    private void handleWithdraw() {
        try {
            double amount = Double.parseDouble(amountField.getText().trim());
            walletService.withdraw(currentUser, amount);
            JOptionPane.showMessageDialog(this, "Withdrew " + FormatUtil.formatCurrency(amount) + " successfully!",
                    "Withdrawal Successful", JOptionPane.INFORMATION_MESSAGE);
            amountField.setText("");
            refreshBalance();
        } catch (NumberFormatException ex) {
            JOptionPane.showMessageDialog(this, "Please enter a valid amount.", "Input Error", JOptionPane.ERROR_MESSAGE);
        } catch (StockException ex) {
            JOptionPane.showMessageDialog(this, ex.getMessage(), "Withdrawal Error", JOptionPane.ERROR_MESSAGE);
        }
    }
}
