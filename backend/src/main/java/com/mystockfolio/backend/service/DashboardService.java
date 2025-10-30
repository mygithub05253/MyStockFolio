package com.mystockfolio.backend.service;

import com.mystockfolio.backend.domain.entity.Asset;
import com.mystockfolio.backend.domain.entity.AssetType;
import com.mystockfolio.backend.domain.entity.Portfolio;
import com.mystockfolio.backend.dto.DashboardDto;
import com.mystockfolio.backend.repository.PortfolioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class DashboardService {

    private final PortfolioRepository portfolioRepository;

    // 사용자의 포트폴리오 통계 계산 (동기 방식으로 간소화)
    @Transactional(readOnly = true)
    public DashboardDto.PortfolioStatsResponse getPortfolioStats(Long userId) {
        log.info("📊 대시보드 통계 조회 시작 - userId: {}", userId);
        
        // 1. 사용자 ID로 모든 포트폴리오 조회 (자산 포함 - JOIN FETCH)
        List<Portfolio> portfolios = portfolioRepository.findByUserIdWithAssets(userId);
        log.info("📁 포트폴리오 개수: {}", portfolios.size());
        
        // 각 포트폴리오의 자산 개수 로깅
        for (Portfolio portfolio : portfolios) {
            log.info("  - 포트폴리오 '{}' (ID: {}): 자산 {}개", 
                portfolio.getName(), portfolio.getId(), portfolio.getAssets().size());
            for (Asset asset : portfolio.getAssets()) {
                log.info("    • {} ({}) - {}개 @ ₩{}", 
                    asset.getName(), asset.getTicker(), asset.getQuantity(), asset.getAvgBuyPrice());
            }
        }
        
        // 2. 통계 계산
        DashboardDto.PortfolioStatsResponse response = calculateStats(portfolios);
        log.info("💰 계산된 통계 - 총 자산: ₩{}, 수익률: {}%, 자산 배분 항목: {}개", 
            response.getTotalMarketValue(), response.getTotalReturnRate(), 
            response.getAssetAllocations() != null ? response.getAssetAllocations().size() : 0);
        
        return response;
    }

    // 통계 계산 로직 (실제 자산 데이터 기반)
    private DashboardDto.PortfolioStatsResponse calculateStats(List<Portfolio> portfolios) {
        log.info("🧮 통계 계산 시작");
        double totalInitialInvestment = 0.0;
        double totalMarketValue = 0.0;
        
        // 자산 유형별 시장 가치 집계 (Pie Chart용)
        Map<AssetType, Double> assetTypeMarketValues = new HashMap<>();
        
        // 모든 포트폴리오의 모든 자산 순회
        int totalAssetCount = 0;
        for (Portfolio portfolio : portfolios) {
            for (Asset asset : portfolio.getAssets()) {
                totalAssetCount++;
                // 초기 투자금 계산
                double investmentValue = asset.getQuantity() * asset.getAvgBuyPrice();
                totalInitialInvestment += investmentValue;
                
                // 현재 시장 가치 계산
                // TODO: 실제 시장 가격은 MarketDataService에서 가져와야 함
                // 임시로 avgBuyPrice를 현재 가격으로 사용 (또는 더미 배율 적용)
                double currentPrice = getCurrentPrice(asset); // 임시 구현
                double marketValue = asset.getQuantity() * currentPrice;
                totalMarketValue += marketValue;
                
                log.debug("  자산: {} ({}) - 투자금: ₩{}, 현재가치: ₩{}", 
                    asset.getName(), asset.getAssetType(), investmentValue, marketValue);
                
                // 자산 유형별 집계
                assetTypeMarketValues.merge(asset.getAssetType(), marketValue, Double::sum);
            }
        }
        
        log.info("💼 총 자산 개수: {}", totalAssetCount);
        log.info("💰 총 투자금: ₩{}, 총 시장가치: ₩{}", totalInitialInvestment, totalMarketValue);
        
        // 손익 및 수익률 계산
        double totalGainLoss = totalMarketValue - totalInitialInvestment;
        double totalReturnRate = (totalInitialInvestment > 0) 
            ? (totalGainLoss / totalInitialInvestment) * 100.0 
            : 0.0;
        
        log.info("📈 손익: ₩{}, 수익률: {}%", totalGainLoss, totalReturnRate);
        
        // 자산 배분 리스트 생성 (Pie Chart용)
        List<DashboardDto.AssetAllocation> assetAllocations = new ArrayList<>();
        for (Map.Entry<AssetType, Double> entry : assetTypeMarketValues.entrySet()) {
            double percentage = (totalMarketValue > 0) 
                ? (entry.getValue() / totalMarketValue) * 100.0 
                : 0.0;
            
            DashboardDto.AssetAllocation allocation = DashboardDto.AssetAllocation.builder()
                    .assetType(entry.getKey().name())
                    .value(entry.getValue())
                    .percentage(percentage)
                    .build();
            assetAllocations.add(allocation);
            
            log.info("📊 자산 배분 - {}: ₩{} ({}%)", 
                entry.getKey().name(), entry.getValue(), percentage);
        }
        
        log.info("✅ 통계 계산 완료 - 자산 배분 항목: {}개", assetAllocations.size());
        
        return DashboardDto.PortfolioStatsResponse.builder()
                .totalMarketValue(totalMarketValue)
                .totalInitialInvestment(totalInitialInvestment)
                .totalGainLoss(totalGainLoss)
                .totalReturnRate(totalReturnRate)
                .assetAllocations(assetAllocations)
                .build();
    }
    
    // 자산의 현재 시장 가격 조회 (임시 구현)
    private double getCurrentPrice(Asset asset) {
        // TODO: MarketDataService를 통해 실제 시장 가격 조회
        // 임시로 더미 가격 반환:
        // - 주식(STOCK): avgBuyPrice * 1.2 (20% 상승 시뮬레이션)
        // - 코인(COIN): avgBuyPrice * 2.5 (150% 상승 시뮬레이션)
        // - 스테이블코인(STABLECOIN): avgBuyPrice (가격 고정)
        // - 기타: avgBuyPrice * 1.5 (50% 상승 시뮬레이션)
        
        return switch (asset.getAssetType()) {
            case STOCK -> asset.getAvgBuyPrice() * 1.2;
            case COIN -> asset.getAvgBuyPrice() * 2.5;
            case STABLECOIN -> asset.getAvgBuyPrice();
            case DEFI -> asset.getAvgBuyPrice() * 1.8;
            case NFT -> asset.getAvgBuyPrice() * 0.7;
            case OTHER -> asset.getAvgBuyPrice() * 1.5;
        };
    }
}