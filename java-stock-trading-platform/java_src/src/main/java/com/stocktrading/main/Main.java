package com.stocktrading.main;

import com.stocktrading.model.User;
import com.stocktrading.service.AuthenticationService;
import com.stocktrading.service.PortfolioService;
import com.stocktrading.service.StockMarketService;
import com.stocktrading.service.WalletService;
import com.stocktrading.thread.MarketSimulatorThread;
import com.stocktrading.ui.LoginDialog;
import com.stocktrading.ui.MainFrame;
import com.stocktrading.util.FileManager;

import javax.swing.*;

/**
 * Main Entry Point for the Stock Trading Platform Desktop Application.
 * Boots Services, File Manager, Market Simulator Thread, and Swing UI.
 */
public class Main {

    public static void main(String[] args) {
        // Set System Look and Feel or Nimbus
        try {
            for (UIManager.LookAndFeelInfo info : UIManager.getInstalledLookAndFeels()) {
                if ("Nimbus".equals(info.getName())) {
                    UIManager.setLookAndFeel(info.getClassName());
                    break;
                }
            }
        } catch (Exception e) {
            System.err.println("Defaulting to System Look and Feel: " + e.getMessage());
        }

        SwingUtilities.invokeLater(() -> {
            // Boot Core Services & Data Persistence
            FileManager fileManager = new FileManager();
            AuthenticationService authService = new AuthenticationService(fileManager);
            PortfolioService portfolioService = new PortfolioService(fileManager);
            StockMarketService marketService = new StockMarketService(fileManager, portfolioService);
            WalletService walletService = new WalletService(fileManager, marketService.getAllTransactions());

            // Start Market Price Simulator Thread (10s interval)
            MarketSimulatorThread simulatorThread = new MarketSimulatorThread(marketService);
            Thread simulatorWorker = new Thread(simulatorThread, "MarketSimulatorWorker");
            simulatorWorker.setDaemon(true);
            simulatorWorker.start();

            // Launch Main Frame Window
            MainFrame mainFrame = new MainFrame(authService, marketService, portfolioService, walletService, simulatorThread);

            // Prompt User Login / Registration
            LoginDialog loginDialog = new LoginDialog(mainFrame, authService);
            loginDialog.setVisible(true);

            User user = loginDialog.getAuthenticatedUser();
            if (user != null) {
                mainFrame.setCurrentUser(user);
                mainFrame.setVisible(true);
            } else {
                System.out.println("No user authenticated. Exiting application.");
                System.exit(0);
            }
        });
    }
}
