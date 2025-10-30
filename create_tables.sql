-- Clean table creation
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NULL,
    nickname VARCHAR(50) NOT NULL,
    wallet_address VARCHAR(42) NULL,
    provider VARCHAR(20) NOT NULL DEFAULT 'mystockfolio',
    provider_id VARCHAR(100) NULL,
    is_oauth2_signup BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE portfolio (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE asset (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    portfolio_id BIGINT NOT NULL,
    asset_type VARCHAR(15) NOT NULL,
    ticker VARCHAR(20) NOT NULL,
    name VARCHAR(100) NULL,
    quantity DOUBLE NOT NULL,
    avgBuyPrice DOUBLE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (portfolio_id) REFERENCES portfolio(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample data
INSERT INTO users (email, password, nickname, wallet_address, provider, provider_id, is_oauth2_signup) 
VALUES 
    ('dev@mystockfolio.com', '$2a$10$CwTycUXWue0Thq9StjUM0u.qDEMBEp4W/PVKz.iCQFmIiGGNKMqxq', 'Developer', '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', 'mystockfolio', NULL, FALSE),
    ('test@mystockfolio.com', '$2a$10$CwTycUXWue0Thq9StjUM0u.qDEMBEp4W/PVKz.iCQFmIiGGNKMqxq', 'Tester', NULL, 'mystockfolio', NULL, FALSE);

INSERT INTO portfolio (user_id, name) 
VALUES 
    (1, 'Crypto Portfolio'),
    (1, 'Stock Portfolio'),
    (2, 'Test Portfolio');

INSERT INTO asset (portfolio_id, asset_type, ticker, name, quantity, avgBuyPrice) 
VALUES 
    (1, 'COIN', 'BTC', 'Bitcoin', 0.5, 60000000),
    (1, 'COIN', 'ETH', 'Ethereum', 2.0, 3000000),
    (1, 'STABLECOIN', 'USDT', 'Tether', 10000, 1400),
    (2, 'STOCK', 'AAPL', 'Apple Inc.', 10, 180000),
    (2, 'STOCK', 'TSLA', 'Tesla, Inc.', 5, 250000),
    (3, 'COIN', 'BTC', 'Bitcoin', 0.1, 55000000);
