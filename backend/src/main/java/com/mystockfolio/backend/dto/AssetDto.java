package com.mystockfolio.backend.dto;

import com.mystockfolio.backend.domain.entity.Asset;
import com.mystockfolio.backend.domain.entity.AssetType;
import com.mystockfolio.backend.domain.entity.Portfolio; // Portfolio import 추가
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

public class AssetDto {

    // --- 요청(Request) DTO ---

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AssetCreateRequest {
        // 프론트엔드 AssetInsert.js 에서 보내는 데이터 필드
        private String ticker;
        private Double quantity;
        private Double avgBuyPrice;
        private String name; // 자산 이름 (API 통해 가져오거나 사용자 입력)
        private String assetType; // "STOCK" 또는 "COIN" 문자열
        private Long portfolioId; // 어느 포트폴리오에 추가할지 ID 추가

        // DTO를 Entity로 변환하는 메서드 (Service에서 사용)
        public Asset toEntity(Portfolio portfolio) { // <-- 여기에 Portfolio 파라미터 추가!
            // assetType 문자열을 Enum으로 변환 (오류 처리 강화 필요)
            AssetType type;
            try {
                type = AssetType.valueOf(assetType.toUpperCase());
            } catch (IllegalArgumentException | NullPointerException e) {
                // 기본값 또는 예외 처리 로직 추가 (예: 기본값 STOCK 설정 또는 예외 던지기)
                // 여기서는 예외를 던지도록 수정 (ControllerAdvise 등에서 처리)
                throw new IllegalArgumentException("Invalid asset type: " + assetType);
            }

            return Asset.builder()
                    .portfolio(portfolio) // 포트폴리오 설정
                    .assetType(type)
                    .ticker(ticker)
                    .name(name) // Service에서 API 통해 가져온 이름으로 덮어쓸 수 있음
                    .quantity(quantity)
                    .avgBuyPrice(avgBuyPrice)
                    .build();
        }
    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AssetUpdateRequest {
        // 프론트엔드 AssetItem.jsx 에서 수정 시 보낼 데이터 필드 (예시)
        private String ticker; // 티커도 변경 가능하게 할지? (변경 시 이름 재조회 필요)
        private String name;   // 이름도 변경 가능하게 할지?
        private Double quantity;
        private Double avgBuyPrice;
        // TODO: 필요한 필드 추가
    }


    // --- 응답(Response) DTO ---

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AssetResponse {
        // 프론트엔드에 전달할 자산 정보 필드
        private Long id;
        private String name;
        private String ticker;
        private Double quantity;
        private Double avgBuyPrice;
        private String assetType;
        private Long portfolioId; // 어느 포트폴리오 소속인지 ID 추가

        // Entity를 Response DTO로 변환하는 정적 메서드 (Service에서 사용)
        public static AssetResponse fromEntity(Asset asset) {
            return AssetResponse.builder()
                    .id(asset.getId())
                    .name(asset.getName())
                    .ticker(asset.getTicker())
                    .quantity(asset.getQuantity())
                    .avgBuyPrice(asset.getAvgBuyPrice())
                    .assetType(asset.getAssetType().name()) // Enum을 문자열로 변환
                    .portfolioId(asset.getPortfolio().getPortfolioId()) // Portfolio ID 추가
                    .build();
        }
    }
}