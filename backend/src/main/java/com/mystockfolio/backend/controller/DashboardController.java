package com.mystockfolio.backend.controller;

import com.mystockfolio.backend.config.JwtAuthenticationFilter;
import com.mystockfolio.backend.dto.DashboardDto;
import com.mystockfolio.backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    /**
     * Security Context에서 현재 로그인한 사용자 ID 추출
     */
    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication != null && authentication.getPrincipal() instanceof JwtAuthenticationFilter.CustomUserDetails) {
            JwtAuthenticationFilter.CustomUserDetails userDetails = 
                (JwtAuthenticationFilter.CustomUserDetails) authentication.getPrincipal();
            Long userId = userDetails.getUserId();
            log.debug("🔑 현재 사용자 ID 추출: {}", userId);
            return userId;
        }
        
        log.warn("⚠️ 인증된 사용자를 찾을 수 없습니다.");
        return null;
    }

    /**
     * 사용자의 총 포트폴리오 통계 (총 자산 가치, 수익률, 자산 배분 등)를 조회합니다.
     */
    @GetMapping("/stats")
    public ResponseEntity<DashboardDto.PortfolioStatsResponse> getPortfolioStats() {
        log.info("🎯 대시보드 통계 API 호출됨");

        Long userId = getCurrentUserId();
        if (userId == null) {
            log.error("❌ 인증된 사용자 ID를 찾을 수 없습니다");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        log.info("📊 사용자 ID: {}의 대시보드 통계 조회 시작", userId);
        DashboardDto.PortfolioStatsResponse response = dashboardService.getPortfolioStats(userId);
        log.info("✅ 대시보드 통계 응답 전송 완료 - 총 자산: ₩{}, 수익률: {}%", 
            response.getTotalMarketValue(), response.getTotalReturnRate());
        return ResponseEntity.ok(response);
    }
}