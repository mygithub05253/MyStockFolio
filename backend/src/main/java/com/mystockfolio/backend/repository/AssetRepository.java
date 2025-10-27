package com.mystockfolio.backend.repository;

import com.mystockfolio.backend.domain.entity.Asset;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

// JpaRepository<Entity클래스, ID타입> 상속
public interface AssetRepository extends JpaRepository<Asset, Long> {

    // 특정 포트폴리오에 속한 모든 자산 조회 (Portfolio ID 기준)
    // Spring Data JPA가 메서드 이름을 분석하여 자동으로 쿼리 생성
    List<Asset> findByPortfolioId(Long portfolioId);

    // TODO: 필요시 추가적인 조회 메서드 정의 (예: 티커로 검색)
}