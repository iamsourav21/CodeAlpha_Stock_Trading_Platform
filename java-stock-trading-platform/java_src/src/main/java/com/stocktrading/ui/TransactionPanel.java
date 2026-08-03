package com.stocktrading.ui;

import com.stocktrading.model.Transaction;
import com.stocktrading.model.User;
import com.stocktrading.service.IStockMarketService;
import com.stocktrading.util.ExporterUtil;
import com.stocktrading.util.FormatUtil;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.io.File;
import java.util.List;

/**
 * Transaction History Audit Log View with Export capabilities.
 */
public class TransactionPanel extends JPanel {
    private final IStockMarketService marketService;
    private User currentUser;

    private JTable transactionTable;
    private DefaultTableModel tableModel;

    public TransactionPanel(IStockMarketService marketService, User currentUser) {
        this.marketService = marketService;
        this.currentUser = currentUser;

        setLayout(new BorderLayout(10, 10));
        setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));

        initTable();
        initHeader();
        refreshTransactions();
    }

    public void setCurrentUser(User user) {
        this.currentUser = user;
        refreshTransactions();
    }

    private void initHeader() {
        JPanel header = new JPanel(new FlowLayout(FlowLayout.RIGHT));
        JButton exportBtn = new JButton("Export History (CSV)");
        exportBtn.addActionListener(e -> handleExportCSV());
        header.add(exportBtn);

        add(header, BorderLayout.NORTH);
    }

    private void initTable() {
        String[] columns = {"Transaction ID", "Type", "Symbol", "Qty", "Price", "Total Amount", "Timestamp"};
        tableModel = new DefaultTableModel(columns, 0) {
            @Override
            public boolean isCellEditable(int row, int column) {
                return false;
            }
        };

        transactionTable = new JTable(tableModel);
        transactionTable.setRowHeight(24);
        add(new JScrollPane(transactionTable), BorderLayout.CENTER);
    }

    public void refreshTransactions() {
        if (currentUser == null) return;

        List<Transaction> txList = marketService.getUserTransactions(currentUser);
        tableModel.setRowCount(0);

        for (Transaction tx : txList) {
            tableModel.addRow(new Object[]{
                    tx.getTransactionId().substring(0, 8) + "...",
                    tx.getType().getDisplayName(),
                    tx.getStockSymbol(),
                    tx.getQuantity(),
                    FormatUtil.formatCurrency(tx.getPrice()),
                    FormatUtil.formatCurrency(tx.getTotalAmount()),
                    tx.getFormattedTimestamp()
            });
        }
    }

    private void handleExportCSV() {
        List<Transaction> txList = marketService.getUserTransactions(currentUser);
        if (txList.isEmpty()) {
            JOptionPane.showMessageDialog(this, "No transaction history available to export.", "Info", JOptionPane.INFORMATION_MESSAGE);
            return;
        }

        JFileChooser fileChooser = new JFileChooser();
        fileChooser.setSelectedFile(new File("transactions_" + currentUser.getId().substring(0, 6) + ".csv"));
        if (fileChooser.showSaveDialog(this) == JFileChooser.APPROVE_OPTION) {
            File targetFile = fileChooser.getSelectedFile();
            boolean success = ExporterUtil.exportTransactionsToCSV(txList, targetFile);
            if (success) {
                JOptionPane.showMessageDialog(this, "Exported successfully to: " + targetFile.getAbsolutePath(),
                        "Export Complete", JOptionPane.INFORMATION_MESSAGE);
            } else {
                JOptionPane.showMessageDialog(this, "Failed to export file.", "Error", JOptionPane.ERROR_MESSAGE);
            }
        }
    }
}
