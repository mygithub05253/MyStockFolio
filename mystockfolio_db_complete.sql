-- ========================================
-- MyStockFolio Database Complete Schema
-- ========================================

-- 데이터베이스 생성 (필요시)
CREATE DATABASE IF NOT EXISTS mystockfolio_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE mystockfolio_db;

-- ========================================
-- 1. Users Table (사용자 정보)
-- ========================================
CREATE TABLE IF NOT EXISTS users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE COMMENT '사용자 이메일 (고유)',
    password VARCHAR(255) COMMENT '비밀번호 (OAuth2 사용자는 NULL 가능)',
    nickname VARCHAR(50) COMMENT '사용자 닉네임',
    wallet_address VARCHAR(42) UNIQUE COMMENT '지갑 주소 (MetaMask 등)',
    provider VARCHAR(50) COMMENT 'OAuth2 제공자 (google, naver, kakao, metamask)',
    provider_id VARCHAR(255) COMMENT 'OAuth2 제공자의 고유 ID',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '계정 생성일',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '최종 수정일',
    INDEX idx_email (email),
    INDEX idx_wallet (wallet_address),
    INDEX idx_provider (provider, provider_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='사용자 정보 테이블';

-- ========================================
-- 2. Portfolios Table (포트폴리오)
-- ========================================
CREATE TABLE IF NOT EXISTS portfolios (
    portfolio_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL COMMENT '사용자 ID (FK)',
    portfolio_name VARCHAR(100) NOT NULL COMMENT '포트폴리오 이름',
    description TEXT COMMENT '포트폴리오 설명',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '생성일',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '최종 수정일',
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='포트폴리오 테이블';

-- ========================================
-- 3. Assets Table (자산)
-- ========================================
CREATE TABLE IF NOT EXISTS assets (
    asset_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    portfolio_id BIGINT NOT NULL COMMENT '포트폴리오 ID (FK)',
    asset_type VARCHAR(20) NOT NULL COMMENT '자산 종류 (STOCK, CRYPTO, CASH, etc.)',
    ticker VARCHAR(20) COMMENT '종목 코드 (주식/코인)',
    asset_name VARCHAR(100) NOT NULL COMMENT '자산 이름',
    quantity DECIMAL(20, 8) NOT NULL DEFAULT 0 COMMENT '보유 수량',
    average_price DECIMAL(20, 2) COMMENT '평균 매입 단가',
    current_price DECIMAL(20, 2) COMMENT '현재 가격',
    currency VARCHAR(10) DEFAULT 'USD' COMMENT '통화 (USD, KRW, etc.)',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '생성일',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '최종 수정일',
    FOREIGN KEY (portfolio_id) REFERENCES portfolios(portfolio_id) ON DELETE CASCADE,
    INDEX idx_portfolio (portfolio_id),
    INDEX idx_ticker (ticker)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='자산 테이블';

-- ========================================
-- 4. Transactions Table (거래 내역)
-- ========================================
CREATE TABLE IF NOT EXISTS transactions (
    transaction_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    asset_id BIGINT NOT NULL COMMENT '자산 ID (FK)',
    transaction_type VARCHAR(20) NOT NULL COMMENT '거래 유형 (BUY, SELL, DEPOSIT, WITHDRAW)',
    quantity DECIMAL(20, 8) NOT NULL COMMENT '거래 수량',
    price_per_unit DECIMAL(20, 2) NOT NULL COMMENT '단가',
    total_amount DECIMAL(20, 2) NOT NULL COMMENT '총 거래 금액',
    transaction_date DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '거래 일시',
    notes TEXT COMMENT '메모',
    FOREIGN KEY (asset_id) REFERENCES assets(asset_id) ON DELETE CASCADE,
    INDEX idx_asset (asset_id),
    INDEX idx_date (transaction_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='거래 내역 테이블';

-- ========================================
-- 5. Market Data Cache (시장 데이터 캐시) - Optional
-- ========================================
CREATE TABLE IF NOT EXISTS market_data_cache (
    cache_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ticker VARCHAR(20) NOT NULL UNIQUE COMMENT '종목 코드',
    current_price DECIMAL(20, 2) COMMENT '현재 가격',
    open_price DECIMAL(20, 2) COMMENT '시가',
    high_price DECIMAL(20, 2) COMMENT '고가',
    low_price DECIMAL(20, 2) COMMENT '저가',
    previous_close DECIMAL(20, 2) COMMENT '전일 종가',
    volume BIGINT COMMENT '거래량',
    market_cap DECIMAL(30, 2) COMMENT '시가총액',
    currency VARCHAR(10) DEFAULT 'USD' COMMENT '통화',
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '마지막 업데이트',
    INDEX idx_ticker (ticker),
    INDEX idx_updated (last_updated)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='시장 데이터 캐시 테이블';

-- ========================================
-- 6. Blockchain Rewards (블록체인 리워드) - Optional
-- ========================================
CREATE TABLE IF NOT EXISTS blockchain_rewards (
    reward_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL COMMENT '사용자 ID (FK)',
    reward_type VARCHAR(50) NOT NULL COMMENT '리워드 종류 (LOGIN, TRADE, REFERRAL, etc.)',
    token_amount DECIMAL(20, 8) NOT NULL COMMENT '토큰 수량',
    transaction_hash VARCHAR(66) COMMENT '블록체인 트랜잭션 해시',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '발급일',
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_tx_hash (transaction_hash)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='블록체인 리워드 테이블';

-- ========================================
-- Sample Data (테스트용 초기 데이터)
-- ========================================

-- 샘플 사용자 (비밀번호는 BCrypt로 암호화된 'password123')
INSERT INTO users (email, password, nickname, provider, created_at) VALUES
('test@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye5HJ6qxXdRXjz9xYb8LPj9m3lMUyW6Fa', '테스트유저', 'email', NOW()),
('demo@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye5HJ6qxXdRXjz9xYb8LPj9m3lMUyW6Fa', '데모유저', 'email', NOW())
ON DUPLICATE KEY UPDATE email=email;

-- 샘플 포트폴리오
INSERT INTO portfolios (user_id, portfolio_name, description, created_at) VALUES
(1, '내 첫 포트폴리오', '테스트 포트폴리오입니다.', NOW()),
(1, '장기 투자', '장기 보유 종목', NOW()),
(2, 'Demo Portfolio', '데모 계정의 포트폴리오', NOW())
ON DUPLICATE KEY UPDATE portfolio_name=portfolio_name;

-- 샘플 자산
INSERT INTO assets (portfolio_id, asset_type, ticker, asset_name, quantity, average_price, current_price, currency, created_at) VALUES
(1, 'STOCK', 'AAPL', 'Apple Inc.', 10.00000000, 150.00, 175.50, 'USD', NOW()),
(1, 'STOCK', 'TSLA', 'Tesla Inc.', 5.00000000, 200.00, 245.30, 'USD', NOW()),
(1, 'CRYPTO', 'BTC-USD', 'Bitcoin', 0.50000000, 45000.00, 67000.00, 'USD', NOW()),
(1, 'CASH', NULL, '현금 (USD)', 1000.00000000, 1.00, 1.00, 'USD', NOW()),
(2, 'STOCK', 'GOOGL', 'Alphabet Inc.', 3.00000000, 2800.00, 2950.00, 'USD', NOW()),
(3, 'STOCK', 'AMZN', 'Amazon.com Inc.', 8.00000000, 3200.00, 3500.00, 'USD', NOW())
ON DUPLICATE KEY UPDATE asset_name=asset_name;

-- 샘플 거래 내역
INSERT INTO transactions (asset_id, transaction_type, quantity, price_per_unit, total_amount, transaction_date, notes) VALUES
(1, 'BUY', 10.00000000, 150.00, 1500.00, '2024-01-15 10:30:00', '초기 매수'),
(2, 'BUY', 5.00000000, 200.00, 1000.00, '2024-02-20 14:00:00', '추가 매수'),
(3, 'BUY', 0.50000000, 45000.00, 22500.00, '2024-03-10 09:15:00', 'BTC 매수')
ON DUPLICATE KEY UPDATE transaction_type=transaction_type;

-- 샘플 시장 데이터 캐시
INSERT INTO market_data_cache (ticker, current_price, open_price, high_price, low_price, previous_close, volume, market_cap, currency, last_updated) VALUES
('AAPL', 175.50, 173.20, 176.80, 172.50, 174.00, 52000000, 2750000000000, 'USD', NOW()),
('TSLA', 245.30, 240.00, 248.90, 239.00, 242.50, 35000000, 775000000000, 'USD', NOW()),
('BTC-USD', 67000.00, 65500.00, 68000.00, 65000.00, 66000.00, 28000000000, 1300000000000, 'USD', NOW()),
('GOOGL', 2950.00, 2900.00, 2980.00, 2890.00, 2920.00, 15000000, 1950000000000, 'USD', NOW())
ON DUPLICATE KEY UPDATE current_price=VALUES(current_price), last_updated=NOW();

-- ========================================
-- Verification Queries (검증용 쿼리)
-- ========================================

-- 테이블 목록 확인
SHOW TABLES;

-- 사용자 수 확인
SELECT COUNT(*) AS total_users FROM users;

-- 포트폴리오 수 확인
SELECT COUNT(*) AS total_portfolios FROM portfolios;

-- 자산 수 확인
SELECT COUNT(*) AS total_assets FROM assets;

-- 각 사용자별 포트폴리오 요약
SELECT 
    u.nickname,
    p.portfolio_name,
    COUNT(a.asset_id) AS asset_count,
    SUM(a.quantity * a.current_price) AS total_value
FROM users u
LEFT JOIN portfolios p ON u.user_id = p.user_id
LEFT JOIN assets a ON p.portfolio_id = a.portfolio_id
GROUP BY u.user_id, p.portfolio_id;

-- 완료 메시지
SELECT 'Database schema and sample data created successfully!' AS status;

