-- ========================================
-- MyStockFolio Database Schema Fix
-- asset 테이블 컬럼명 문제 해결
-- ========================================

USE mystockfolio_db;

-- 1. 기존 asset 테이블 삭제
DROP TABLE IF EXISTS asset;

-- 2. 올바른 컬럼명으로 asset 테이블 재생성
CREATE TABLE asset (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    portfolio_id BIGINT NOT NULL,
    asset_type VARCHAR(15) NOT NULL COMMENT 'STOCK, COIN, STABLECOIN, DEFI, NFT, OTHER',
    ticker VARCHAR(20) NOT NULL,
    name VARCHAR(100) NULL,
    quantity DOUBLE NOT NULL,
    avgBuyPrice DOUBLE NOT NULL COMMENT 'Average buy price - camelCase to match Entity',
    FOREIGN KEY (portfolio_id) REFERENCES portfolio(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. 인덱스 생성
CREATE INDEX idx_asset_portfolio_id ON asset(portfolio_id);
CREATE INDEX idx_asset_ticker ON asset(ticker);
CREATE INDEX idx_asset_type ON asset(asset_type);

-- 4. 테이블 구조 확인
DESCRIBE asset;

-- 5. 기존 데이터 확인
SELECT * FROM portfolio;
SELECT * FROM users;

