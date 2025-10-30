package com.mystockfolio.backend.service;

import com.mystockfolio.backend.domain.entity.Portfolio;
import com.mystockfolio.backend.domain.entity.User; // User 임포트
import com.mystockfolio.backend.dto.PortfolioDto;
import com.mystockfolio.backend.exception.ResourceNotFoundException;
import com.mystockfolio.backend.repository.PortfolioRepository;
import com.mystockfolio.backend.repository.UserRepository; // UserRepository 임포트 (아래 생성 필요)
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PortfolioService {

    private final PortfolioRepository portfolioRepository;
    private final UserRepository userRepository; // 사용자 정보 조회 위해 추가

    // 사용자의 모든 포트폴리오 목록 조회 (자산 포함)
    @Transactional(readOnly = true)
    public List<PortfolioDto.PortfolioResponse> getPortfoliosByUserId(Long userId) {
        // TODO: 보안 - userId가 실제 로그인한 사용자인지 확인 필요
        List<Portfolio> portfolios = portfolioRepository.findByUserIdWithAssets(userId); // JOIN FETCH로 assets 함께 로드
        return portfolios.stream()
                .map(PortfolioDto.PortfolioResponse::fromEntity)
                .collect(Collectors.toList());
    }

    // 특정 포트폴리오 상세 조회 (자산 포함)
    @Transactional(readOnly = true)
    public PortfolioDto.PortfolioResponse getPortfolioById(Long userId, Long portfolioId) {
        // TODO: 보안 - userId 확인
        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio not found with id: " + portfolioId));
        // TODO: 조회된 포트폴리오가 해당 사용자의 것이 맞는지 추가 확인
        // if (!portfolio.getUser().getUserId().equals(userId)) { ... }
        return PortfolioDto.PortfolioResponse.fromEntity(portfolio);
    }

    // 새 포트폴리오 생성
    @Transactional
    public PortfolioDto.PortfolioSimpleResponse createPortfolio(Long userId, PortfolioDto.PortfolioCreateRequest requestDto) {
        // TODO: 보안 - userId 확인
        User user = userRepository.findById(userId) // 사용자 정보 조회
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Portfolio portfolio = requestDto.toEntity(user);
        Portfolio savedPortfolio = portfolioRepository.save(portfolio);
        return PortfolioDto.PortfolioSimpleResponse.fromEntity(savedPortfolio);
    }

    // 포트폴리오 이름 수정
    @Transactional
    public PortfolioDto.PortfolioSimpleResponse updatePortfolioName(Long userId, Long portfolioId, PortfolioDto.PortfolioUpdateRequest requestDto) {
        // TODO: 보안 - userId 확인
        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio not found with id: " + portfolioId));
        // TODO: 해당 포트폴리오가 사용자의 것이 맞는지 추가 확인

        portfolio.updateName(requestDto.getName()); // Entity 내부 메서드 사용
        // 변경 감지로 자동 업데이트됨
        return PortfolioDto.PortfolioSimpleResponse.fromEntity(portfolio);
    }

    // 포트폴리오 삭제
    @Transactional
    public void deletePortfolio(Long userId, Long portfolioId) {
        // TODO: 보안 - userId 확인
        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio not found with id: " + portfolioId));
        // TODO: 해당 포트폴리오가 사용자의 것이 맞는지 추가 확인

        portfolioRepository.delete(portfolio);
    }
}