package com.stocktrading.ui;

import com.stocktrading.exception.StockException;
import com.stocktrading.model.Stock;
import com.stocktrading.model.User;
import com.stocktrading.service.IStockMarketService;
import com.stocktrading.util.FormatUtil;

import javax.swing.*;
import javax.swing.table.DefaultTableCellRenderer;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.util.List;

/**
 * Stock Market UI View displaying available stocks, live price ticks, and trade actions.
 */
public class MarketPanel extends JPanel {
    private final IStockMarketService marketService;
    private User currentUser;

    private JTable stockTable;
    private DefaultTableModel tableModel;
    private JTextField searchField;
    private JComboBox<String> sectorFilter;

    public MarketPanel(IStockMarketService marketService, User currentUser) {
        this.marketService = marketService;
        this.currentUser = currentUser;
        setLayout(new BorderLayout(10, 10));
        setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));

        initHeader();
        initTable();
        initActionButtons();
        refreshStockTable();
    }

    public void setCurrentUser(User user) {
        this.currentUser = user;
    }

    private void initHeader() {
        JPanel headerPanel = new JPanel(new FlowLayout(FlowLayout.LEFT, 10, 5));

        headerPanel.add(new JLabel("Search:"));
        searchField = new JTextField(15);
        searchField.addActionListener(e -> refreshStockTable());
        headerPanel.add(searchField);

        headerPanel.add(new JLabel("Sector:"));
        sectorFilter = new JComboBox<>(new String[]{
                "All Sectors", "Technology", "Consumer Cyclical", "Semiconductors",
                "Automotive", "Financial Services", "Consumer Staples", "Entertainment"
        });
        sectorFilter.addActionListener(e -> refreshStockTable());
        headerPanel.add(sectorFilter);

        JButton searchButton = new JButton("Filter");
        searchButton.addActionListener(e -> refreshStockTable());
        headerPanel.add(searchButton);

        add(headerPanel, BorderLayout.NORTH);
    }

    private void initTable() {
        String[] columns = {"Symbol", "Company Name", "Sector", "Current Price", "Price Change", "Change %", "Available Qty", "Watchlist"};
        tableModel = new DefaultTableModel(columns, 0) {
            @Override
            public boolean isCellEditable(int row, int column) {
                return false;
            }
        };

        stockTable = new JTable(tableModel);
        stockTable.setRowHeight(26);
        stockTable.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);

        // Custom Cell Renderer for Price Changes (+Green / -Red)
        stockTable.getColumnModel().getColumn(4).setCellRenderer(new PriceChangeRenderer());
        stockTable.getColumnModel().getColumn(5).setCellRenderer(new PriceChangeRenderer());

        add(new JScrollPane(stockTable), BorderLayout.CENTER);
    }

    private void initActionButtons() {
        JPanel actionPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 5));

        JButton buyButton = new JButton("Buy Selected Stock");
        buyButton.setFont(new Font("SansSerif", Font.BOLD, 13));
        buyButton.setBackground(new Color(34, 139, 34));
        buyButton.setForeground(Color.WHITE);
        buyButton.addActionListener(e -> handleBuyStock());

        JButton toggleWatchlistButton = new JButton("Toggle Watchlist");
        toggleWatchlistButton.addActionListener(e -> handleToggleWatchlist());

        actionPanel.add(toggleWatchlistButton);
        actionPanel.add(buyButton);

        add(actionPanel, BorderLayout.SOUTH);
    }

    public void refreshStockTable() {
        String query = searchField != null ? searchField.getText() : "";
        String sector = sectorFilter != null ? (String) sectorFilter.getSelectedItem() : "All Sectors";

        List<Stock> stocks = marketService.searchStocks(query, sector);
        tableModel.setRowCount(0);

        for (Stock s : stocks) {
            boolean inWatchlist = currentUser != null && currentUser.getWatchlist().contains(s.getSymbol());
            tableModel.addRow(new Object[]{
                    s.getSymbol(),
                    s.getCompanyName(),
                    s.getSector(),
                    FormatUtil.formatCurrency(s.getCurrentPrice()),
                    FormatUtil.formatCurrency(s.getPriceChange()),
                    FormatUtil.formatPercentage(s.getChangePercentage()),
                    s.getAvailableQuantity(),
                    inWatchlist ? "★ Saved" : "☆"
            });
        }
    }

    private void handleBuyStock() {
        int selectedRow = stockTable.getSelectedRow();
        if (selectedRow == -1) {
            JOptionPane.showMessageDialog(this, "Please select a stock from the table to buy.", "Selection Required", JOptionPane.WARNING_MESSAGE);
            return;
        }

        String symbol = (String) tableModel.getValueAt(selectedRow, 0);
        String company = (String) tableModel.getValueAt(selectedRow, 1);

        String qtyStr = JOptionPane.showInputDialog(this,
                String.format("Enter quantity of %s (%s) to BUY:\nWallet Balance: %s",
                        company, symbol, FormatUtil.formatCurrency(currentUser.getWalletBalance())),
                "Buy Stock", JOptionPane.QUESTION_MESSAGE);

        if (qtyStr == null || qtyStr.trim().isEmpty()) return;

        try {
            int quantity = Integer.parseInt(qtyStr.trim());
            marketService.buyStock(currentUser, symbol, quantity);

            JOptionPane.showMessageDialog(this,
                    String.format("Successfully purchased %d shares of %s!\nUpdated Wallet: %s",
                            quantity, symbol, FormatUtil.formatCurrency(currentUser.getWalletBalance())),
                    "Trade Executed", JOptionPane.INFORMATION_MESSAGE);

            refreshStockTable();
        } catch (NumberFormatException ex) {
            JOptionPane.showMessageDialog(this, "Please enter a valid integer quantity.", "Input Error", JOptionPane.ERROR_MESSAGE);
        } catch (StockException ex) {
            JOptionPane.showMessageDialog(this, ex.getMessage(), "Trade Failed", JOptionPane.ERROR_MESSAGE);
        }
    }

    private void handleToggleWatchlist() {
        int selectedRow = stockTable.getSelectedRow();
        if (selectedRow == -1) return;

        String symbol = (String) tableModel.getValueAt(selectedRow, 0);
        boolean added = currentUser.toggleWatchlist(symbol);

        JOptionPane.showMessageDialog(this,
                added ? symbol + " added to your watchlist!" : symbol + " removed from your watchlist.",
                "Watchlist Updated", JOptionPane.INFORMATION_MESSAGE);

        refreshStockTable();
    }

    private static class PriceChangeRenderer extends DefaultTableCellRenderer {
        @Override
        public Component getTableCellRendererComponent(JTable table, Object value, boolean isSelected, boolean hasFocus, int row, int column) {
            Component c = super.getTableCellRendererComponent(table, value, isSelected, hasFocus, row, column);
            if (value != null) {
                String str = value.toString();
                if (str.startsWith("+")) {
                    c.setForeground(new Color(0, 128, 0)); // Green
                } else if (str.startsWith("-")) {
                    c.setForeground(Color.RED);
                } else {
                    c.setForeground(table.getForeground());
                }
            }
            return c;
        }
    }
}
