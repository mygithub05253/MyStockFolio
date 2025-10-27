package com.mystockfolio.backend.dto;

import com.mystockfolio.backend.domain.entity.Asset;
import com.mystockfolio.backend.domain.entity.AssetType;
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

        // TODO: 어느 포트폴리오에 추가할지 portfolioId 추가 필요

        // DTO를 Entity로 변환하는 메서드 (Service에서 사용)
        public Asset toEntity(/* Portfolio portfolio */) {
            // 임시: assetType 문자열을 Enum으로 변환 (오류 처리 필요)
            AssetType type = AssetType.valueOf(assetType.toUpperCase());

            return Asset.builder()
                    // .portfolio(portfolio) // 포트폴리오 설정
                    .assetType(type)
                    .ticker(ticker)
                    .name(name) // TODO: 이름 정보 가져오는 로직 필요
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
        private String ticker;
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

        // Entity를 Response DTO로 변환하는 정적 메서드 (Service에서 사용)
        public static AssetResponse fromEntity(Asset asset) {
            return AssetResponse.builder()
                    .id(asset.getId())
                    .name(asset.getName())
                    .ticker(asset.getTicker())
                    .quantity(asset.getQuantity())
                    .avgBuyPrice(asset.getAvgBuyPrice())
                    .assetType(asset.getAssetType().name()) // Enum을 문자열로 변환
                    .build();
        }
    }
}