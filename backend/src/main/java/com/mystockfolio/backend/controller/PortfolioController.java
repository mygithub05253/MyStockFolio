package com.mystockfolio.backend.controller;

import com.mystockfolio.backend.dto.PortfolioDto;
import com.mystockfolio.backend.service.PortfolioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/portfolios") // 기본 경로 변경 (/api/portfolio -> /api/portfolios 복수형 권장)
@RequiredArgsConstructor
public class PortfolioController {

    private final PortfolioService portfolioService;

    // 사용자의 모든 포트폴리오 목록 조회 (GET /api/portfolios)
    @GetMapping
    public ResponseEntity<List<PortfolioDto.PortfolioResponse>> getUserPortfolios() {
        // TODO: 실제 로그인된 사용자 ID 가져오기 (Spring Security 등 사용)
        Long tempUserId = 1L; // 임시 사용자 ID
        List<PortfolioDto.PortfolioResponse> portfolios = portfolioService.getPortfoliosByUserId(tempUserId);
        return ResponseEntity.ok(portfolios);
    }

    // 특정 포트폴리오 상세 조회 (GET /api/portfolios/{portfolioId})
    @GetMapping("/{portfolioId}")
    public ResponseEntity<PortfolioDto.PortfolioResponse> getPortfolioDetails(@PathVariable Long portfolioId) {
        // TODO: 실제 로그인된 사용자 ID 가져오기
        Long tempUserId = 1L; // 임시 사용자 ID
        PortfolioDto.PortfolioResponse portfolio = portfolioService.getPortfolioById(tempUserId, portfolioId);
        return ResponseEntity.ok(portfolio);
    }

    // 새 포트폴리오 생성 (POST /api/portfolios)
    @PostMapping
    public ResponseEntity<PortfolioDto.PortfolioSimpleResponse> createPortfolio(@RequestBody PortfolioDto.PortfolioCreateRequest requestDto) {
        // TODO: 실제 로그인된 사용자 ID 가져오기
        Long tempUserId = 1L; // 임시 사용자 ID
        PortfolioDto.PortfolioSimpleResponse createdPortfolio = portfolioService.createPortfolio(tempUserId, requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPortfolio);
    }

    // 포트폴리오 이름 수정 (PUT /api/portfolios/{portfolioId})
    @PutMapping("/{portfolioId}")
    public ResponseEntity<PortfolioDto.PortfolioSimpleResponse> updatePortfolioName(@PathVariable Long portfolioId,
                                                                                    @RequestBody PortfolioDto.PortfolioUpdateRequest requestDto) {
        // TODO: 실제 로그인된 사용자 ID 가져오기
        Long tempUserId = 1L; // 임시 사용자 ID
        PortfolioDto.PortfolioSimpleResponse updatedPortfolio = portfolioService.updatePortfolioName(tempUserId, portfolioId, requestDto);
        return ResponseEntity.ok(updatedPortfolio);
    }

    // 포트폴리오 삭제 (DELETE /api/portfolios/{portfolioId})
    @DeleteMapping("/{portfolioId}")
    public ResponseEntity<Void> deletePortfolio(@PathVariable Long portfolioId) {
        // TODO: 실제 로그인된 사용자 ID 가져오기
        Long tempUserId = 1L; // 임시 사용자 ID
        portfolioService.deletePortfolio(tempUserId, portfolioId);
        return ResponseEntity.noContent().build();
    }
}