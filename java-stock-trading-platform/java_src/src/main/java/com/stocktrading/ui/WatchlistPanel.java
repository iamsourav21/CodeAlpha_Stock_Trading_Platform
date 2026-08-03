package com.stocktrading.ui;

import com.stocktrading.exception.StockNotFoundException;
import com.stocktrading.model.Stock;
import com.stocktrading.model.User;
import com.stocktrading.service.IStockMarketService;
import com.stocktrading.util.FormatUtil;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;

/**
 * Watchlist UI View showing saved stocks.
 */
public class WatchlistPanel extends JPanel {
    private final IStockMarketService marketService;
    private User currentUser;

    private JTable watchlistTable;
    private DefaultTableModel tableModel;

    public WatchlistPanel(IStockMarketService marketService, User currentUser) {
        this.marketService = marketService;
        this.currentUser = currentUser;

        setLayout(new BorderLayout(10, 10));
        setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));

        initTable();
        initActionButtons();
        refreshWatchlist();
    }

    public void setCurrentUser(User user) {
        this.currentUser = user;
        refreshWatchlist();
    }

    private void initTable() {
        String[] columns = {"Symbol", "Company", "Current Price", "Change %", "Day High", "Day Low"};
        tableModel = new DefaultTableModel(columns, 0) {
            @Override
            public boolean isCellEditable(int row, int col) { return false; }
        };

        watchlistTable = new JTable(tableModel);
        watchlistTable.setRowHeight(26);
        add(new JScrollPane(watchlistTable), BorderLayout.CENTER);
    }

    private void initActionButtons() {
        JPanel panel = new JPanel(new FlowLayout(FlowLayout.RIGHT));
        JButton removeBtn = new JButton("Remove From Watchlist");
        removeBtn.addActionListener(e -> handleRemove());
        panel.add(removeBtn);

        add(panel, BorderLayout.SOUTH);
    }

    public void refreshWatchlist() {
        if (currentUser == null) return;

        tableModel.setRowCount(0);
        for (String symbol : currentUser.getWatchlist()) {
            try {
                Stock s = marketService.getStockBySymbol(symbol);
                tableModel.addRow(new Object[]{
                        s.getSymbol(),
                        s.getCompanyName(),
                        FormatUtil.formatCurrency(s.getCurrentPrice()),
                        FormatUtil.formatPercentage(s.getChangePercentage()),
                        FormatUtil.formatCurrency(s.getDayHigh()),
                        FormatUtil.formatCurrency(s.getDayLow())
                });
            } catch (StockNotFoundException ignored) {}
        }
    }

    private void handleRemove() {
        int row = watchlistTable.getSelectedRow();
        if (row == -1) return;

        String symbol = (String) tableModel.getValueAt(row, 0);
        currentUser.getWatchlist().remove(symbol);
        refreshWatchlist();
    }
}
