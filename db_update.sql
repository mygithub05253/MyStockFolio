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

