package com.stocktrading.ui;

import com.stocktrading.model.Stock;
import com.stocktrading.model.User;
import com.stocktrading.service.IAuthenticationService;
import com.stocktrading.service.IPortfolioService;
import com.stocktrading.service.IStockMarketService;
import com.stocktrading.service.IWalletService;
import com.stocktrading.thread.MarketSimulatorThread;
import com.stocktrading.thread.MarketUpdateListener;
import com.stocktrading.util.FormatUtil;

import javax.swing.*;
import java.awt.*;
import java.util.List;

/**
 * Main Application Window Frame container with JTabbedPane, JMenuBar, and Status Bar.
 */
public class MainFrame extends JFrame implements MarketUpdateListener {
    private final IAuthenticationService authService;
    private final IStockMarketService marketService;
    private final IPortfolioService portfolioService;
    private final IWalletService walletService;
    private final MarketSimulatorThread simulatorThread;

    private User currentUser;

    private JTabbedPane mainTabPane;
    private MarketPanel marketPanel;
    private PortfolioPanel portfolioPanel;
    private WalletPanel walletPanel;
    private TransactionPanel transactionPanel;
    private WatchlistPanel watchlistPanel;
    private AdminPanel adminPanel;

    private JLabel userStatusLabel;
    private JLabel walletStatusLabel;
    private JLabel marketTickerStatusLabel;

    public MainFrame(IAuthenticationService authService,
                     IStockMarketService marketService,
                     IPortfolioService portfolioService,
                     IWalletService walletService,
                     MarketSimulatorThread simulatorThread) {
        super("Stock Trading Platform Desktop Application");
        this.authService = authService;
        this.marketService = marketService;
        this.portfolioService = portfolioService;
        this.walletService = walletService;
        this.simulatorThread = simulatorThread;

        // Register for thread callbacks
        if (this.simulatorThread != null) {
            this.simulatorThread.addListener(this);
        }

        initUI();
    }

    public void setCurrentUser(User user) {
        this.currentUser = user;
        updateUserUI();
    }

    private void initUI() {
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(1100, 720);
        setMinimumSize(new Dimension(900, 600));
        setLocationRelativeTo(null);

        initMenuBar();

        // Main Tabbed Layout
        mainTabPane = new JTabbedPane();

        marketPanel = new MarketPanel(marketService, currentUser);
        portfolioPanel = new PortfolioPanel(portfolioService, marketService, currentUser);
        walletPanel = new WalletPanel(walletService, currentUser);
        transactionPanel = new TransactionPanel(marketService, currentUser);
        watchlistPanel = new WatchlistPanel(marketService, currentUser);
        adminPanel = new AdminPanel(marketService);

        mainTabPane.addTab("Stock Market", marketPanel);
        mainTabPane.addTab("My Portfolio", portfolioPanel);
        mainTabPane.addTab("Wallet", walletPanel);
        mainTabPane.addTab("Transaction History", transactionPanel);
        mainTabPane.addTab("Watchlist", watchlistPanel);

        // Tab selection change listener to refresh views
        mainTabPane.addChangeListener(e -> refreshCurrentTab());

        add(mainTabPane, BorderLayout.CENTER);

        // Status Bar
        initStatusBar();
    }

    private void initMenuBar() {
        JMenuBar menuBar = new JMenuBar();

        // Account Menu
        JMenu accountMenu = new JMenu("Account");
        JMenuItem loginItem = new JMenuItem("Switch User / Login");
        loginItem.addActionListener(e -> showLoginDialog());

        JMenuItem exitItem = new JMenuItem("Exit Application");
        exitItem.addActionListener(e -> System.exit(0));

        accountMenu.add(loginItem);
        accountMenu.addSeparator();
        accountMenu.add(exitItem);

        // View Menu
        JMenu viewMenu = new JMenu("View");
        JMenuItem refreshItem = new JMenuItem("Refresh All Views");
        refreshItem.addActionListener(e -> refreshAllPanels());
        viewMenu.add(refreshItem);

        // Help Menu
        JMenu helpMenu = new JMenu("Help");
        JMenuItem aboutItem = new JMenuItem("About Application");
        aboutItem.addActionListener(e -> JOptionPane.showMessageDialog(this,
                "Stock Trading Platform Desktop Application\nVersion 1.0.0\nBuilt with Core Java & Swing\n\nFeatures 10-second Market Simulation Thread.",
                "About", JOptionPane.INFORMATION_MESSAGE));
        helpMenu.add(aboutItem);

        menuBar.add(accountMenu);
        menuBar.add(viewMenu);
        menuBar.add(helpMenu);

        setJMenuBar(menuBar);
    }

    private void initStatusBar() {
        JPanel statusBar = new JPanel(new FlowLayout(FlowLayout.LEFT, 20, 5));
        statusBar.setBorder(BorderFactory.createEtchedBorder());

        userStatusLabel = new JLabel("User: Guest");
        walletStatusLabel = new JLabel("Wallet: $0.00");
        marketTickerStatusLabel = new JLabel("Market Ticker: Active (Updates every 10s)");
        marketTickerStatusLabel.setForeground(new Color(34, 139, 34));

        statusBar.add(userStatusLabel);
        statusBar.add(new JSeparator(SwingConstants.VERTICAL));
        statusBar.add(walletStatusLabel);
        statusBar.add(new JSeparator(SwingConstants.VERTICAL));
        statusBar.add(marketTickerStatusLabel);

        add(statusBar, BorderLayout.SOUTH);
    }

    private void showLoginDialog() {
        LoginDialog dialog = new LoginDialog(this, authService);
        dialog.setVisible(true);
        User user = dialog.getAuthenticatedUser();
        if (user != null) {
            setCurrentUser(user);
        }
    }

    private void updateUserUI() {
        if (currentUser == null) return;

        userStatusLabel.setText("User: " + currentUser.getName() + (currentUser.isAdmin() ? " (Admin)" : ""));
        walletStatusLabel.setText("Wallet: " + FormatUtil.formatCurrency(currentUser.getWalletBalance()));

        marketPanel.setCurrentUser(currentUser);
        portfolioPanel.setCurrentUser(currentUser);
        walletPanel.setCurrentUser(currentUser);
        transactionPanel.setCurrentUser(currentUser);
        watchlistPanel.setCurrentUser(currentUser);

        // Toggle Admin Tab
        int adminIndex = mainTabPane.indexOfComponent(adminPanel);
        if (currentUser.isAdmin()) {
            if (adminIndex == -1) {
                mainTabPane.addTab("Admin Panel", adminPanel);
            }
        } else {
            if (adminIndex != -1) {
                mainTabPane.remove(adminPanel);
            }
        }

        refreshAllPanels();
    }

    private void refreshCurrentTab() {
        int index = mainTabPane.getSelectedIndex();
        if (index == 0) marketPanel.refreshStockTable();
        else if (index == 1) portfolioPanel.refreshPortfolio();
        else if (index == 2) walletPanel.refreshBalance();
        else if (index == 3) transactionPanel.refreshTransactions();
        else if (index == 4) watchlistPanel.refreshWatchlist();
    }

    public void refreshAllPanels() {
        if (currentUser != null) {
            walletStatusLabel.setText("Wallet: " + FormatUtil.formatCurrency(currentUser.getWalletBalance()));
        }
        marketPanel.refreshStockTable();
        portfolioPanel.refreshPortfolio();
        walletPanel.refreshBalance();
        transactionPanel.refreshTransactions();
        watchlistPanel.refreshWatchlist();
    }

    @Override
    public void onMarketUpdated(List<Stock> stocks) {
        SwingUtilities.invokeLater(() -> {
            refreshAllPanels();
        });
    }
}
