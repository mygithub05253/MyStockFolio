package com.mystockfolio.backend.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.util.List;

public class DashboardDto {

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AssetAllocation {
        private String assetType;
        private Double percentage;
        private Double value;
    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PortfolioStatsResponse {
        private Double totalMarketValue; // 총 평가 금액
        private Double totalInitialInvestment; // 총 투자 원금
        private Double totalGainLoss; // 총 손익
        private Double totalReturnRate; // 총 수익률 (%)
        private List<AssetAllocation> assetAllocations; // 자산 배분 목록 (Pie Chart 데이터)
        // TODO: List<ChartPoint> timeSeriesData; // 기간별 추이 데이터 (Line Chart 데이터)
    }
}