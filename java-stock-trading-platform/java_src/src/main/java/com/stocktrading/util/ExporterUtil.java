package com.stocktrading.util;

import com.stocktrading.model.Transaction;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.List;

/**
 * Utility for exporting transaction reports to CSV and TXT formats.
 */
public class ExporterUtil {

    public static boolean exportTransactionsToCSV(List<Transaction> transactions, File file) {
        try (FileWriter writer = new FileWriter(file)) {
            writer.write("TransactionID,UserID,Type,StockSymbol,Quantity,Price,TotalAmount,Timestamp\n");
            for (Transaction tx : transactions) {
                writer.write(String.format("%s,%s,%s,%s,%d,%.2f,%.2f,%s\n",
                        tx.getTransactionId(),
                        tx.getUserId(),
                        tx.getType().name(),
                        tx.getStockSymbol(),
                        tx.getQuantity(),
                        tx.getPrice(),
                        tx.getTotalAmount(),
                        tx.getFormattedTimestamp()
                ));
            }
            return true;
        } catch (IOException e) {
            System.err.println("Failed to export transactions: " + e.getMessage());
            return false;
        }
    }
}
