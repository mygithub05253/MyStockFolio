package com.mystockfolio.backend.domain.entity; // 패키지 경로 변경

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter; // 연관관계 편의 메서드 위해 임시 추가 (혹은 별도 메서드)

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Asset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "asset_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "portfolio_id", nullable = false)
    @Setter // 연관관계 편의 메서드를 위해 임시 추가 (양방향 설정 시)
    private Portfolio portfolio;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private AssetType assetType;

    @Column(nullable = false, length = 20)
    private String ticker;

    @Column(length = 100)
    private String name;

    @Column(nullable = false)
    private Double quantity;

    @Column(nullable = false)
    private Double avgBuyPrice; // avg_buy_price 컬럼에 매핑됨

    @Builder
    public Asset(Portfolio portfolio, AssetType assetType, String ticker, String name, Double quantity, Double avgBuyPrice) {
        this.portfolio = portfolio; // portfolio 객체 직접 설정
        this.assetType = assetType;
        this.ticker = ticker;
        this.name = name;
        this.quantity = quantity;
        this.avgBuyPrice = avgBuyPrice;
    }

    // 자산 정보 업데이트 메서드 (예시)
    public void updateAssetDetails(String name, Double quantity, Double avgBuyPrice) {
        // name 업데이트 로직은 아래 setName 으로 분리하거나, 여기서 조건부 업데이트 유지 가능
        // if (name != null) this.name = name;
        if (quantity != null && quantity >= 0) this.quantity = quantity;
        if (avgBuyPrice != null && avgBuyPrice >= 0) this.avgBuyPrice = avgBuyPrice;
    }

    // AssetService에서 이름을 설정하기 위한 setter 메서드 추가
    public void setName(String name) {
        this.name = name;
    }

    // 필요하다면 ticker setter도 추가할 수 있습니다.
    // public void setTicker(String ticker) {
    //     if (ticker != null && !ticker.isBlank()) {
    //         this.ticker = ticker;
    //     }
    // }
}