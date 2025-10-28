package com.mystockfolio.backend.service;

import com.mystockfolio.backend.domain.entity.Asset;
import com.mystockfolio.backend.domain.entity.AssetType;
import com.mystockfolio.backend.domain.entity.Portfolio;
import com.mystockfolio.backend.dto.DashboardDto;
import com.mystockfolio.backend.repository.PortfolioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final PortfolioRepository portfolioRepository;

    // 사용자의 포트폴리오 통계 계산 (동기 방식으로 간소화)
    @Transactional(readOnly = true)
    public DashboardDto.PortfolioStatsResponse getPortfolioStats(Long userId) {
        // 1. 사용자 ID로 모든 포트폴리오 조회 (자산 포함 - JOIN FETCH)
        List<Portfolio> portfolios = portfolioRepository.findByUserIdWithAssets(userId);
        
        // 2. 통계 계산
        return calculateStats(portfolios);
    }

    // 통계 계산 로직 (실제 자산 데이터 기반)
    private DashboardDto.PortfolioStatsResponse calculateStats(List<Portfolio> portfolios) {
        double totalInitialInvestment = 0.0;
        double totalMarketValue = 0.0;
        
        // 자산 유형별 시장 가치 집계 (Pie Chart용)
        Map<AssetType, Double> assetTypeMarketValues = new HashMap<>();
        
        // 모든 포트폴리오의 모든 자산 순회
        for (Portfolio portfolio : portfolios) {
            for (Asset asset : portfolio.getAssets()) {
                // 초기 투자금 계산
                double investmentValue = asset.getQuantity() * asset.getAvgBuyPrice();
                totalInitialInvestment += investmentValue;
                
                // 현재 시장 가치 계산
                // TODO: 실제 시장 가격은 MarketDataService에서 가져와야 함
                // 임시로 avgBuyPrice를 현재 가격으로 사용 (또는 더미 배율 적용)
                double currentPrice = getCurrentPrice(asset); // 임시 구현
                double marketValue = asset.getQuantity() * currentPrice;
                totalMarketValue += marketValue;
                
                // 자산 유형별 집계
                assetTypeMarketValues.merge(asset.getAssetType(), marketValue, Double::sum);
            }
        }
        
        // 손익 및 수익률 계산
        double totalGainLoss = totalMarketValue - totalInitialInvestment;
        double totalReturnRate = (totalInitialInvestment > 0) 
            ? (totalGainLoss / totalInitialInvestment) * 100.0 
            : 0.0;
        
        // 자산 배분 리스트 생성 (Pie Chart용)
        List<DashboardDto.AssetAllocation> assetAllocations = new ArrayList<>();
        for (Map.Entry<AssetType, Double> entry : assetTypeMarketValues.entrySet()) {
            double percentage = (totalMarketValue > 0) 
                ? (entry.getValue() / totalMarketValue) * 100.0 
                : 0.0;
            
            assetAllocations.add(DashboardDto.AssetAllocation.builder()
                    .assetType(entry.getKey().name())
                    .value(entry.getValue())
                    .percentage(percentage)
                    .build());
        }
        
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