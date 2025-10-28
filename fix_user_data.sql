-- ========================================
-- MyStockFolio - 사용자 데이터 수정
-- 현재 로그인한 사용자와 포트폴리오 연결
-- ========================================

USE mystockfolio_db;

-- 1. 현재 데이터 확인
SELECT '=== 현재 Users 테이블 ===' AS info;
SELECT * FROM users;

SELECT '=== 현재 Portfolio 테이블 ===' AS info;
SELECT * FROM portfolio;

SELECT '=== 현재 Asset 테이블 ===' AS info;
SELECT * FROM asset;

-- 2. 옵션 A: portfolio의 user_id를 현재 로그인한 사용자(ID: 5)로 변경
-- (기존 포트폴리오를 현재 사용자에게 할당)
UPDATE portfolio SET user_id = 5 WHERE id = 1;

-- 3. 확인
SELECT '=== 수정 후 Portfolio 테이블 ===' AS info;
SELECT * FROM portfolio;

-- 4. 대시보드 통계가 제대로 나오는지 확인용 쿼리
SELECT 
    u.id AS user_id,
    u.email,
    p.id AS portfolio_id,
    p.name AS portfolio_name,
    COUNT(a.id) AS asset_count
FROM users u
LEFT JOIN portfolio p ON u.id = p.user_id
LEFT JOIN asset a ON p.id = a.portfolio_id
WHERE u.id = 5
GROUP BY u.id, u.email, p.id, p.name;

