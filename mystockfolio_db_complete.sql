-- ========================================
-- MyStockFolio Complete Database Schema
-- 블록체인 기반 자산 관리 시스템 (클라우드 네이티브 MSA + ERC-20)
-- 버전: P3 (OAuth2 소셜/지갑 로그인 통합)
-- ========================================

-- 1. 데이터베이스 생성
CREATE DATABASE IF NOT EXISTS mystockfolio_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE mystockfolio_db;

-- ========================================
-- 2. 테이블 생성
-- ========================================

-- 2.1. users 테이블 (User Entity)
-- 기존 테이블이 있으면 구조만 변경하고, 없으면 새로 생성
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE COMMENT '사용자 이메일 (고유)',
    password VARCHAR(255) NULL COMMENT '비밀번호 해시 (OAuth2 사용자는 NULL)',
    nickname VARCHAR(50) NOT NULL COMMENT '사용자 닉네임',
    wallet_address VARCHAR(42) NULL COMMENT '블록체인 지갑 주소 (0x...)',
    provider VARCHAR(20) NOT NULL DEFAULT 'mystockfolio' COMMENT '인증 제공자 (mystockfolio, google, naver, kakao, metamask)',
    provider_id VARCHAR(100) NULL COMMENT 'OAuth2 제공자의 고유 사용자 ID',
    is_oauth2_signup BOOLEAN DEFAULT FALSE COMMENT 'OAuth2 회원가입 여부 (추가 정보 입력 필요)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성 시간',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정 시간'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 기존 테이블이 있는 경우 컬럼 수정
ALTER TABLE users MODIFY COLUMN password VARCHAR(255) NULL COMMENT '비밀번호 해시 (OAuth2 사용자는 NULL)';
ALTER TABLE users MODIFY COLUMN provider VARCHAR(20) NOT NULL DEFAULT 'mystockfolio' COMMENT '인증 제공자 (mystockfolio, google, naver, kakao, metamask)';

-- is_oauth2_signup 컬럼 추가 (존재하지 않는 경우에만)
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = 'mystockfolio_db' 
     AND TABLE_NAME = 'users' 
     AND COLUMN_NAME = 'is_oauth2_signup') = 0,
    'ALTER TABLE users ADD COLUMN is_oauth2_signup BOOLEAN DEFAULT FALSE COMMENT ''OAuth2 회원가입 여부 (추가 정보 입력 필요)''',
    'SELECT ''Column already exists'' as message'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 2.2. portfolio 테이블 (Portfolio Entity)
CREATE TABLE IF NOT EXISTS portfolio (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL COMMENT 'User 테이블 외래키',
    name VARCHAR(50) NOT NULL COMMENT '포트폴리오 이름',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성 시간',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정 시간',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2.3. asset 테이블 (Asset Entity)
CREATE TABLE IF NOT EXISTS asset (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    portfolio_id BIGINT NOT NULL COMMENT 'Portfolio 테이블 외래키',
    asset_type VARCHAR(15) NOT NULL COMMENT 'STOCK, COIN, STABLECOIN, DEFI, NFT, OTHER',
    ticker VARCHAR(20) NOT NULL COMMENT '자산 티커 심볼',
    name VARCHAR(100) NULL COMMENT '자산 이름 (선택)',
    quantity DOUBLE NOT NULL COMMENT '보유 수량',
    avgBuyPrice DOUBLE NOT NULL COMMENT '평균 매입 가격 (camelCase)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성 시간',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정 시간',
    FOREIGN KEY (portfolio_id) REFERENCES portfolio(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- 3. 인덱스 생성 (성능 최적화)
-- ========================================

-- users 테이블 인덱스
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_provider_provider_id ON users(provider, provider_id);

-- portfolio 테이블 인덱스
CREATE INDEX idx_portfolio_user_id ON portfolio(user_id);

-- asset 테이블 인덱스
CREATE INDEX idx_asset_portfolio_id ON asset(portfolio_id);
CREATE INDEX idx_asset_ticker ON asset(ticker);
CREATE INDEX idx_asset_type ON asset(asset_type);

-- ========================================
-- 4. 샘플 데이터 (개발 및 테스트용 - 선택사항)
-- ========================================

-- 4.1. 개발용 사용자 추가
-- 비밀번호: 'password123' (BCrypt 해시)
INSERT INTO users (email, password, nickname, wallet_address, provider, provider_id, is_oauth2_signup) 
VALUES 
    ('dev@mystockfolio.com', '$2a$10$CwTycUXWue0Thq9StjUM0u.qDEMBEp4W/PVKz.iCQFmIiGGNKMqxq', 'Developer', '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', 'mystockfolio', NULL, FALSE),
    ('test@mystockfolio.com', '$2a$10$CwTycUXWue0Thq9StjUM0u.qDEMBEp4W/PVKz.iCQFmIiGGNKMqxq', 'Tester', NULL, 'mystockfolio', NULL, FALSE),
    ('google@mystockfolio.com', NULL, 'Google User', NULL, 'google', '1234567890', FALSE),
    ('metamask@mystockfolio.local', NULL, 'MetaMask User', '0x1234567890abcdef1234567890abcdef12345678', 'metamask', '0x1234567890abcdef1234567890abcdef12345678', FALSE)
ON DUPLICATE KEY UPDATE id=id;

-- 4.2. 샘플 포트폴리오 추가
INSERT INTO portfolio (user_id, name) 
VALUES 
    (1, '암호화폐 포트폴리오'),
    (1, '주식 포트폴리오'),
    (2, 'Test 포트폴리오')
ON DUPLICATE KEY UPDATE id=id;

-- 4.3. 샘플 자산 추가
INSERT INTO asset (portfolio_id, asset_type, ticker, name, quantity, avgBuyPrice) 
VALUES 
    -- 암호화폐 포트폴리오 (portfolio_id = 1)
    (1, 'COIN', 'BTC', 'Bitcoin', 0.5, 60000000),
    (1, 'COIN', 'ETH', 'Ethereum', 2.0, 3000000),
    (1, 'STABLECOIN', 'USDT', 'Tether', 10000, 1400),
    (1, 'DEFI', 'UNI', 'Uniswap', 100, 5000),
    (1, 'COIN', 'ADA', 'Cardano', 5000, 500),
    
    -- 주식 포트폴리오 (portfolio_id = 2)
    (2, 'STOCK', 'AAPL', 'Apple Inc.', 10, 180000),
    (2, 'STOCK', 'TSLA', 'Tesla, Inc.', 5, 250000),
    (2, 'STOCK', 'MSFT', 'Microsoft Corporation', 8, 380000),
    (2, 'STOCK', 'GOOGL', 'Alphabet Inc.', 3, 140000),
    
    -- Test 포트폴리오 (portfolio_id = 3)
    (3, 'COIN', 'BTC', 'Bitcoin', 0.1, 55000000)
ON DUPLICATE KEY UPDATE id=id;

-- ========================================
-- 5. 데이터 확인 쿼리
-- ========================================

-- 테이블 구조 확인
SELECT '=== Users 테이블 구조 ===' AS info;
DESCRIBE users;

SELECT '=== Portfolio 테이블 구조 ===' AS info;
DESCRIBE portfolio;

SELECT '=== Asset 테이블 구조 ===' AS info;
DESCRIBE asset;

-- 데이터 확인
SELECT '=== Users 데이터 ===' AS info;
SELECT 
    id, 
    email, 
    nickname, 
    wallet_address, 
    provider, 
    provider_id,
    is_oauth2_signup,
    CASE WHEN password IS NULL THEN 'NULL (OAuth2)' ELSE 'SET' END as password_status,
    created_at
FROM users
ORDER BY id;

SELECT '=== Portfolio 데이터 ===' AS info;
SELECT 
    p.id,
    p.name,
    u.email AS user_email,
    u.nickname AS user_nickname,
    COUNT(a.id) AS asset_count,
    p.created_at
FROM portfolio p
LEFT JOIN users u ON p.user_id = u.id
LEFT JOIN asset a ON p.id = a.portfolio_id
GROUP BY p.id, p.name, u.email, u.nickname, p.created_at
ORDER BY p.id;

SELECT '=== Asset 데이터 ===' AS info;
SELECT 
    a.id,
    a.asset_type,
    a.ticker,
    a.name,
    a.quantity,
    FORMAT(a.avgBuyPrice, 0) AS avg_buy_price,
    FORMAT(a.quantity * a.avgBuyPrice, 0) AS total_value,
    p.name AS portfolio_name,
    u.nickname AS owner_nickname
FROM asset a
LEFT JOIN portfolio p ON a.portfolio_id = p.id
LEFT JOIN users u ON p.user_id = u.id
ORDER BY a.portfolio_id, a.id;

-- 인덱스 확인
SELECT '=== 생성된 인덱스 ===' AS info;
SELECT 
    TABLE_NAME,
    INDEX_NAME,
    GROUP_CONCAT(COLUMN_NAME ORDER BY SEQ_IN_INDEX) AS columns
FROM INFORMATION_SCHEMA.STATISTICS
WHERE TABLE_SCHEMA = 'mystockfolio_db'
GROUP BY TABLE_NAME, INDEX_NAME
ORDER BY TABLE_NAME, INDEX_NAME;

-- ========================================
-- 6. 완료 메시지
-- ========================================

SELECT '✅ MyStockFolio Database 초기화 완료!' AS message;
SELECT 'P3 단계: OAuth2 소셜/지갑 로그인 지원 완료' AS status;
SELECT 'Next: P1 단계 - FastAPI 시장 데이터 연동' AS next_step;

-- ========================================
-- OAuth2 로그인을 위한 password 컬럼 NULL 허용
-- ========================================

USE mystockfolio_db;

-- password 컬럼을 NULL 허용으로 변경
ALTER TABLE users MODIFY password VARCHAR(255) NULL COMMENT '비밀번호 해시 (OAuth2 사용자는 NULL)';

-- 변경 확인
DESCRIBE users;

SELECT '✅ password 컬럼이 NULL 허용으로 변경되었습니다!' AS STATUS;

select * from users;
select * from asset;