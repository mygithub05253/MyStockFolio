CREATE DATABASE IF NOT EXISTS mystockfolio_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE mystockfolio_db;
select * from asset;
select * from portfolio;
select* from users;

-- users 테이블 생성 (User Entity 기반)
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- 비밀번호는 보통 더 길게 저장됩니다 (해시값)
    nickname VARCHAR(50) NOT NULL,
    wallet_address VARCHAR(42) NULL -- NULL 허용
);

-- portfolio 테이블 생성 (Portfolio Entity 기반)
CREATE TABLE IF NOT EXISTS portfolio (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,              -- User 테이블 외래키
    name VARCHAR(50) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE -- 사용자가 삭제되면 포트폴리오도 삭제
);

-- asset 테이블 생성 (Asset Entity 기반)
CREATE TABLE IF NOT EXISTS asset (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    portfolio_id BIGINT NOT NULL,         -- Portfolio 테이블 외래키
    asset_type VARCHAR(10) NOT NULL,      -- 'STOCK' 또는 'COIN'
    ticker VARCHAR(20) NOT NULL,
    name VARCHAR(100) NULL,               -- 이름은 NULL 허용 가능
    quantity DOUBLE NOT NULL,
    avg_buy_price DOUBLE NOT NULL,
    FOREIGN KEY (portfolio_id) REFERENCES portfolio(id) ON DELETE CASCADE -- 포트폴리오가 삭제되면 자산도 삭제
);

-- ========================================
-- MyStockFolio Database Schema Update
-- 블록체인 자산 유형 추가를 위한 스키마 업데이트
-- ========================================

-- Asset 테이블의 asset_type 컬럼 크기 확장
-- 기존: VARCHAR(10) → 변경: VARCHAR(15)
-- 이유: STABLECOIN (10자) 등 새로운 자산 유형 추가
ALTER TABLE asset 
MODIFY COLUMN asset_type VARCHAR(15) NOT NULL 
COMMENT 'Asset types: STOCK, COIN, STABLECOIN, DEFI, NFT, OTHER';

-- 변경사항 확인
SELECT 
    COLUMN_NAME, 
    COLUMN_TYPE, 
    IS_NULLABLE, 
    COLUMN_COMMENT
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE() 
  AND TABLE_NAME = 'asset' 
  AND COLUMN_NAME = 'asset_type';

-- ========================================
-- 참고: 새로운 AssetType Enum 값
-- ========================================
-- STOCK       : 주식 (예: AAPL, TSLA)
-- COIN        : 일반 코인/토큰 (예: BTC, ETH, ADA)
-- STABLECOIN  : 스테이블코인 (예: USDT, USDC, DAI)
-- DEFI        : 디파이 토큰 (예: UNI, AAVE, COMP)
-- NFT         : NFT
-- OTHER       : 기타 블록체인 자산
-- ========================================
DESCRIBE asset;

-- 3. asset 테이블을 완전히 삭제하고 재생성 (가장 깨끗한 방법)
DROP TABLE IF EXISTS asset;

-- 4. 올바른 구조로 asset 테이블 재생성
CREATE TABLE asset (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    portfolio_id BIGINT NOT NULL,
    asset_type VARCHAR(15) NOT NULL,
    ticker VARCHAR(20) NOT NULL,
    name VARCHAR(100) NULL,
    quantity DOUBLE NOT NULL,
    avg_buy_price DOUBLE NOT NULL,
    FOREIGN KEY (portfolio_id) REFERENCES portfolio(id) ON DELETE CASCADE
);

select * from asset;