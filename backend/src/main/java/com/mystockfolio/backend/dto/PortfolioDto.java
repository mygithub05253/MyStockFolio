package com.mystockfolio.backend.dto;

import com.mystockfolio.backend.domain.entity.Portfolio;
import com.mystockfolio.backend.domain.entity.User; // User 임포트
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.util.List; // Asset 목록 포함 위해 임포트
import java.util.stream.Collectors; // Asset 목록 포함 위해 임포트


public class PortfolioDto {

    // --- 요청(Request) DTO ---

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PortfolioCreateRequest {
        private String name; // 생성할 포트폴리오 이름

        // DTO를 Entity로 변환 (User 정보 필요)
        public Portfolio toEntity(User user) {
            return Portfolio.builder()
                    .user(user)
                    .name(name)
                    .build();
        }
    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PortfolioUpdateRequest {
        private String name; // 변경할 포트폴리오 이름
    }

    // --- 응답(Response) DTO ---

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PortfolioResponse {
        private Long id;
        private String name;
        // 필요시 포트폴리오에 속한 자산 목록도 포함 가능
        private List<AssetDto.AssetResponse> assets;

        public static PortfolioResponse fromEntity(Portfolio portfolio) {
            // Asset 목록도 함께 변환하여 포함
            List<AssetDto.AssetResponse> assetDtos = portfolio.getAssets().stream()
                    .map(AssetDto.AssetResponse::fromEntity)
                    .collect(Collectors.toList());

            return PortfolioResponse.builder()
                    .id(portfolio.getId())
                    .name(portfolio.getName())
                    .assets(assetDtos) // 자산 목록 포함
                    .build();
        }
    }

    // 포트폴리오 목록 조회 시 사용할 간단한 응답 DTO (자산 제외)
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PortfolioSimpleResponse {
        private Long id;
        private String name;

        public static PortfolioSimpleResponse fromEntity(Portfolio portfolio) {
            return PortfolioSimpleResponse.builder()
                    .id(portfolio.getId())
                    .name(portfolio.getName())
                    .build();
        }
    }
}