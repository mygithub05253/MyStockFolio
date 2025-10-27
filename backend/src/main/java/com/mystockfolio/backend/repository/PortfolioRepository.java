package com.mystockfolio.backend.repository;

import com.mystockfolio.backend.domain.entity.Portfolio;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List; // List 임포트

public interface PortfolioRepository extends JpaRepository<Portfolio, Long> {
    // 사용자 ID로 해당 사용자의 모든 포트폴리오 목록 조회
    List<Portfolio> findByUserId(Long userId); // 메서드 추가
}