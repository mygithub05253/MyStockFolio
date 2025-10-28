package com.mystockfolio.backend.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.util.List;

public class MarketDataDto {

    // FastAPI PriceResponse와 매핑
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PriceResponse {
        private String ticker;
        private Double price;
        private String currency;
        private String lastUpdated;
    }

    // FastAPI ChartPoint와 매핑
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ChartPoint {
        private String date;
        private Double price;
    }

    // FastAPI ChartResponse와 매핑
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ChartResponse {
        private String ticker;
        private List<ChartPoint> history;
    }
}