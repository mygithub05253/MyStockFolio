-- ========================================
-- MyStockFolio Database Schema
-- 블록체인 기반 자산 관리 시스템
-- ========================================

-- users 테이블 생성 (User Entity 기반)
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,           -- 비밀번호 해시값 저장
    nickname VARCHAR(50) NOT NULL,
    wallet_address VARCHAR(42) NULL           -- 블록체인 지갑 주소 (NULL 허용)
);

-- portfolio 테이블 생성 (Portfolio Entity 기반)
CREATE TABLE IF NOT EXISTS portfolio (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,                  -- User 테이블 외래키
    name VARCHAR(50) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- asset 테이블 생성 (Asset Entity 기반)
CREATE TABLE IF NOT EXISTS asset (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    portfolio_id BIGINT NOT NULL,             -- Portfolio 테이블 외래키
    asset_type VARCHAR(15) NOT NULL           -- 'STOCK', 'COIN', 'STABLECOIN', 'DEFI', 'NFT', 'OTHER'
        COMMENT 'Asset types: STOCK, COIN, STABLECOIN, DEFI, NFT, OTHER',
    ticker VARCHAR(20) NOT NULL,
    name VARCHAR(100) NULL,                   -- 자산 이름 (NULL 허용)
    quantity DOUBLE NOT NULL,                 -- 보유 수량
    avg_buy_price DOUBLE NOT NULL,            -- 평균 매입 가격
    FOREIGN KEY (portfolio_id) REFERENCES portfolio(id) ON DELETE CASCADE
);

-- ========================================
-- 인덱스 생성 (성능 최적화)
-- ========================================

-- users 테이블 인덱스
CREATE INDEX idx_users_email ON users(email);

-- portfolio 테이블 인덱스
CREATE INDEX idx_portfolio_user_id ON portfolio(user_id);

-- asset 테이블 인덱스
CREATE INDEX idx_asset_portfolio_id ON asset(portfolio_id);
CREATE INDEX idx_asset_ticker ON asset(ticker);
CREATE INDEX idx_asset_type ON asset(asset_type);

-- ========================================
-- 샘플 데이터 (개발용 - 선택사항)
-- ========================================

-- 개발용 사용자 (비밀번호: password123)
INSERT INTO users (email, password, nickname, wallet_address) 
VALUES 
    ('dev@folio.com', '$2a$10$CwTycUXWue0Thq9StjUM0u.qDEMBEp4W/PVKz.iCQFmIiGGNKMqxq', 'Developer', '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'),
    ('test@folio.com', '$2a$10$CwTycUXWue0Thq9StjUM0u.qDEMBEp4W/PVKz.iCQFmIiGGNKMqxq', 'Tester', NULL)
ON DUPLICATE KEY UPDATE id=id;

-- 샘플 포트폴리오
INSERT INTO portfolio (user_id, name) 
VALUES 
    (1, '암호화폐 포트폴리오'),
    (1, '주식 포트폴리오')
ON DUPLICATE KEY UPDATE id=id;

-- 샘플 자산
INSERT INTO asset (portfolio_id, asset_type, ticker, name, quantity, avg_buy_price) 
VALUES 
    -- 암호화폐 포트폴리오
    (1, 'COIN', 'BTC', 'Bitcoin', 0.5, 60000000),
    (1, 'COIN', 'ETH', 'Ethereum', 2.0, 3000000),
    (1, 'STABLECOIN', 'USDT', 'Tether', 10000, 1400),
    (1, 'DEFI', 'UNI', 'Uniswap', 100, 5000),
    
    -- 주식 포트폴리오
    (2, 'STOCK', 'AAPL', 'Apple Inc.', 10, 150000),
    (2, 'STOCK', 'TSLA', 'Tesla, Inc.', 5, 250000)
ON DUPLICATE KEY UPDATE id=id;

-- ========================================
-- 완료
-- ========================================

