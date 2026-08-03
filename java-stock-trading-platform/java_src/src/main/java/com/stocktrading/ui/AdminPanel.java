package com.stocktrading.ui;

import com.stocktrading.exception.InvalidInputException;
import com.stocktrading.model.Stock;
import com.stocktrading.service.IStockMarketService;

import javax.swing.*;
import java.awt.*;

/**
 * Admin Panel for creating new stock tickers and manually overriding market controls.
 */
public class AdminPanel extends JPanel {
    private final IStockMarketService marketService;

    private JTextField symbolField;
    private JTextField companyField;
    private JTextField priceField;
    private JTextField quantityField;
    private JComboBox<String> sectorCombo;

    public AdminPanel(IStockMarketService marketService) {
        this.marketService = marketService;

        setLayout(new GridBagLayout());
        setBorder(BorderFactory.createTitledBorder("Admin Stock Management"));

        initUI();
    }

    private void initUI() {
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(8, 8, 8, 8);
        gbc.fill = GridBagConstraints.HORIZONTAL;

        gbc.gridx = 0; gbc.gridy = 0;
        add(new JLabel("Ticker Symbol:"), gbc);
        gbc.gridx = 1;
        symbolField = new JTextField(15);
        add(symbolField, gbc);

        gbc.gridx = 0; gbc.gridy = 1;
        add(new JLabel("Company Name:"), gbc);
        gbc.gridx = 1;
        companyField = new JTextField(15);
        add(companyField, gbc);

        gbc.gridx = 0; gbc.gridy = 2;
        add(new JLabel("Initial Price ($):"), gbc);
        gbc.gridx = 1;
        priceField = new JTextField(15);
        add(priceField, gbc);

        gbc.gridx = 0; gbc.gridy = 3;
        add(new JLabel("Available Quantity:"), gbc);
        gbc.gridx = 1;
        quantityField = new JTextField(15);
        add(quantityField, gbc);

        gbc.gridx = 0; gbc.gridy = 4;
        add(new JLabel("Sector:"), gbc);
        gbc.gridx = 1;
        sectorCombo = new JComboBox<>(new String[]{
                "Technology", "Consumer Cyclical", "Semiconductors",
                "Automotive", "Financial Services", "Consumer Staples", "Entertainment"
        });
        add(sectorCombo, gbc);

        gbc.gridx = 0; gbc.gridy = 5; gbc.gridwidth = 2;
        JButton createBtn = new JButton("Add Stock to Market");
        createBtn.setFont(new Font("SansSerif", Font.BOLD, 14));
        createBtn.addActionListener(e -> handleAddStock());
        add(createBtn, gbc);

        gbc.gridy = 6;
        JButton triggerTickBtn = new JButton("Trigger Manual Price Tick (-5% to +5%)");
        triggerTickBtn.addActionListener(e -> {
            marketService.updateStockPricesRandomly();
            JOptionPane.showMessageDialog(this, "Market price tick triggered manually!", "Market Updated", JOptionPane.INFORMATION_MESSAGE);
        });
        add(triggerTickBtn, gbc);
    }

    private void handleAddStock() {
        try {
            String symbol = symbolField.getText().trim().toUpperCase();
            String company = companyField.getText().trim();
            double price = Double.parseDouble(priceField.getText().trim());
            int quantity = Integer.parseInt(quantityField.getText().trim());
            String sector = (String) sectorCombo.getSelectedItem();

            if (symbol.isEmpty() || company.isEmpty()) {
                throw new InvalidInputException("Symbol and company name cannot be blank.");
            }

            Stock newStock = new Stock(symbol, company, price, quantity, sector);
            marketService.addStock(newStock);

            JOptionPane.showMessageDialog(this, "Stock " + symbol + " added to market successfully!",
                    "Admin Success", JOptionPane.INFORMATION_MESSAGE);

            symbolField.setText("");
            companyField.setText("");
            priceField.setText("");
            quantityField.setText("");
        } catch (NumberFormatException ex) {
            JOptionPane.showMessageDialog(this, "Please enter valid numeric price and quantity.", "Input Error", JOptionPane.ERROR_MESSAGE);
        } catch (InvalidInputException ex) {
            JOptionPane.showMessageDialog(this, ex.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
        }
    }
}
