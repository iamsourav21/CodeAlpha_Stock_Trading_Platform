package com.stocktrading.ui;

import com.stocktrading.exception.StockException;
import com.stocktrading.model.Portfolio;
import com.stocktrading.model.PortfolioItem;
import com.stocktrading.model.Stock;
import com.stocktrading.model.User;
import com.stocktrading.service.IPortfolioService;
import com.stocktrading.service.IStockMarketService;
import com.stocktrading.util.FormatUtil;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;

/**
 * Portfolio UI View displaying current holdings, gain/loss, total return %, and sell actions.
 */
public class PortfolioPanel extends JPanel {
    private final IPortfolioService portfolioService;
    private final IStockMarketService marketService;
    private User currentUser;

    private JLabel totalValueLabel;
    private JLabel totalInvestmentLabel;
    private JLabel profitLossLabel;
    private JLabel returnPctLabel;

    private JTable holdingsTable;
    private DefaultTableModel tableModel;

    public PortfolioPanel(IPortfolioService portfolioService, IStockMarketService marketService, User currentUser) {
        this.portfolioService = portfolioService;
        this.marketService = marketService;
        this.currentUser = currentUser;

        setLayout(new BorderLayout(10, 10));
        setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));

        initMetricsHeader();
        initTable();
        initActionPanel();
        refreshPortfolio();
    }

    public void setCurrentUser(User user) {
        this.currentUser = user;
    }

    private void initMetricsHeader() {
        JPanel header = new JPanel(new GridLayout(1, 4, 10, 0));
        header.setBorder(BorderFactory.createTitledBorder("Portfolio Summary"));

        totalValueLabel = createMetricCard(header, "Total Portfolio Value", "$0.00");
        totalInvestmentLabel = createMetricCard(header, "Total Investment", "$0.00");
        profitLossLabel = createMetricCard(header, "Total Profit / Loss", "$0.00");
        returnPctLabel = createMetricCard(header, "Return %", "0.00%");

        add(header, BorderLayout.NORTH);
    }

    private JLabel createMetricCard(JPanel container, String title, String defaultValue) {
        JPanel card = new JPanel(new BorderLayout(5, 5));
        card.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(Color.LIGHT_GRAY),
                BorderFactory.createEmptyBorder(8, 8, 8, 8)
        ));

        JLabel titleLbl = new JLabel(title, SwingConstants.CENTER);
        titleLbl.setFont(new Font("SansSerif", Font.PLAIN, 12));
        titleLbl.setForeground(Color.GRAY);

        JLabel valLbl = new JLabel(defaultValue, SwingConstants.CENTER);
        valLbl.setFont(new Font("SansSerif", Font.BOLD, 16));

        card.add(titleLbl, BorderLayout.NORTH);
        card.add(valLbl, BorderLayout.CENTER);

        container.add(card);
        return valLbl;
    }

    private void initTable() {
        String[] columns = {"Symbol", "Company", "Qty", "Avg Buy Price", "Current Price", "Market Value", "Unrealized P/L", "Return %"};
        tableModel = new DefaultTableModel(columns, 0) {
            @Override
            public boolean isCellEditable(int row, int column) {
                return false;
            }
        };

        holdingsTable = new JTable(tableModel);
        holdingsTable.setRowHeight(26);
        add(new JScrollPane(holdingsTable), BorderLayout.CENTER);
    }

    private void initActionPanel() {
        JPanel panel = new JPanel(new FlowLayout(FlowLayout.RIGHT));
        JButton sellBtn = new JButton("Sell Selected Holding");
        sellBtn.setFont(new Font("SansSerif", Font.BOLD, 13));
        sellBtn.setBackground(new Color(220, 20, 60));
        sellBtn.setForeground(Color.WHITE);
        sellBtn.addActionListener(e -> handleSellStock());

        panel.add(sellBtn);
        add(panel, BorderLayout.SOUTH);
    }

    public void refreshPortfolio() {
        if (currentUser == null) return;

        Portfolio portfolio = portfolioService.getUserPortfolio(currentUser);
        double marketValue = portfolioService.getPortfolioMarketValue(currentUser, marketService.getStockMap());
        double investment = portfolio.getTotalInvestment();
        double pl = portfolioService.getPortfolioProfitLoss(currentUser, marketService.getStockMap());
        double retPct = portfolioService.getPortfolioReturnPercentage(currentUser, marketService.getStockMap());

        totalValueLabel.setText(FormatUtil.formatCurrency(marketValue));
        totalInvestmentLabel.setText(FormatUtil.formatCurrency(investment));
        profitLossLabel.setText(FormatUtil.formatCurrency(pl));
        profitLossLabel.setForeground(pl >= 0 ? new Color(0, 128, 0) : Color.RED);

        returnPctLabel.setText(FormatUtil.formatPercentage(retPct));
        returnPctLabel.setForeground(retPct >= 0 ? new Color(0, 128, 0) : Color.RED);

        tableModel.setRowCount(0);
        for (PortfolioItem item : portfolio.getHoldings()) {
            Stock stock = marketService.getStockMap().get(item.getStockSymbol());
            double currentPrice = (stock != null) ? stock.getCurrentPrice() : item.getAverageBuyPrice();
            double holdingValue = item.getQuantity() * currentPrice;
            double holdingPL = holdingValue - item.getTotalInvestment();
            double holdingRetPct = item.getTotalInvestment() == 0 ? 0 : (holdingPL / item.getTotalInvestment()) * 100.0;

            tableModel.addRow(new Object[]{
                    item.getStockSymbol(),
                    item.getCompanyName(),
                    item.getQuantity(),
                    FormatUtil.formatCurrency(item.getAverageBuyPrice()),
                    FormatUtil.formatCurrency(currentPrice),
                    FormatUtil.formatCurrency(holdingValue),
                    FormatUtil.formatCurrency(holdingPL),
                    FormatUtil.formatPercentage(holdingRetPct)
            });
        }
    }

    private void handleSellStock() {
        int row = holdingsTable.getSelectedRow();
        if (row == -1) {
            JOptionPane.showMessageDialog(this, "Please select a holding to sell.", "Selection Required", JOptionPane.WARNING_MESSAGE);
            return;
        }

        String symbol = (String) tableModel.getValueAt(row, 0);
        int ownedQty = (int) tableModel.getValueAt(row, 2);

        String qtyStr = JOptionPane.showInputDialog(this,
                String.format("Enter quantity of %s to SELL (Owned: %d):", symbol, ownedQty),
                "Sell Stock", JOptionPane.QUESTION_MESSAGE);

        if (qtyStr == null || qtyStr.trim().isEmpty()) return;

        try {
            int qty = Integer.parseInt(qtyStr.trim());
            marketService.sellStock(currentUser, symbol, qty);

            JOptionPane.showMessageDialog(this,
                    String.format("Successfully sold %d shares of %s!\nUpdated Wallet: %s",
                            qty, symbol, FormatUtil.formatCurrency(currentUser.getWalletBalance())),
                    "Sale Completed", JOptionPane.INFORMATION_MESSAGE);

            refreshPortfolio();
        } catch (NumberFormatException ex) {
            JOptionPane.showMessageDialog(this, "Invalid quantity entered.", "Error", JOptionPane.ERROR_MESSAGE);
        } catch (StockException ex) {
            JOptionPane.showMessageDialog(this, ex.getMessage(), "Sell Error", JOptionPane.ERROR_MESSAGE);
        }
    }
}
