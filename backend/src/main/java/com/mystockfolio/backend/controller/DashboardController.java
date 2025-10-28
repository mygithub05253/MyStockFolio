package com.mystockfolio.backend.controller;

import com.mystockfolio.backend.config.JwtAuthenticationFilter; // CustomUserDetails 사용을 위해 import
import com.mystockfolio.backend.dto.DashboardDto;
import com.mystockfolio.backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication; // Authentication import
import org.springframework.security.core.context.SecurityContextHolder; // SecurityContextHolder import
import org.springframework.security.core.userdetails.UserDetails; // UserDetails import
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    /**
     * 사용자의 총 포트폴리오 통계 (총 자산 가치, 수익률, 자산 배분 등)를 조회합니다.
     */
    @GetMapping("/stats")
    public ResponseEntity<DashboardDto.PortfolioStatsResponse> getPortfolioStats() {

        // [★★★ 수정: Spring Security Context에서 사용자 ID 추출 ★★★]
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = null;

        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            Object principal = authentication.getPrincipal();

            // 1. 커스텀 UserDetails를 사용하는 경우 (개발자 모드 포함)
            if (principal instanceof JwtAuthenticationFilter.CustomUserDetails customUserDetails) {
                userId = customUserDetails.getUserId();
            }
            // 2. 기본 UserDetails를 사용하는 경우 (실제 JWT 로그인, 이메일로 DB 조회 필요)
            else if (principal instanceof UserDetails userDetails) {
                // TODO: 실제 유저 이메일을 통해 DB에서 User Entity를 조회하여 ID를 가져오는 로직이 필요
                // 현재는 임시로 ID 1L 또는 조회 로직을 생략합니다.
                // 여기서는 DEV_USER_ID를 사용하도록 임시 처리
                userId = 1L; // 실제 구현 시 userId = userService.findIdByEmail(userDetails.getUsername()); 로직 필요
            }
        }

        // ID 추출 실패 시 (인증되었으나 ID를 찾을 수 없음 - DEV 모드 문제로 발생 가능)
        if (userId == null) {
            // 이 경로는 SecurityConfig의 authenticated()에 걸리므로, 사실상 도달해서는 안 됨
            // 임시로 DEV ID 강제 지정 (Backend 테스트 편의성 보장)
            userId = 999L;
        }

        DashboardDto.PortfolioStatsResponse response = dashboardService.getPortfolioStats(userId);
        return ResponseEntity.ok(response);
    }
}