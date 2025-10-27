package com.mystockfolio.backend.domain.entity; // 패키지 경로 변경

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Portfolio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "portfolio_id") // DB 컬럼 이름은 그대로 유지
    private Long portfolioId; // <-- 필드 이름 변경 (id -> portfolioId)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 50)
    private String name;

    // mappedBy는 Asset 엔티티의 portfolio 필드를 가리킴
    // cascade = CascadeType.ALL: 포트폴리오 저장/삭제 시 Asset도 함께 처리
    // orphanRemoval = true: 컬렉션에서 Asset 제거 시 DB에서도 삭제
    @OneToMany(mappedBy = "portfolio", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Asset> assets = new ArrayList<>();

    @Builder
    public Portfolio(User user, String name) {
        this.user = user;
        this.name = name;
    }

    // 연관관계 편의 메서드
    public void addAsset(Asset asset) {
        this.assets.add(asset);
        if (asset.getPortfolio() != this) { // 무한 루프 방지
            asset.setPortfolio(this);
        }
    }
    // 이름 변경 메서드
    public void updateName(String name) {
        if (name != null && !name.isBlank()){
            this.name = name;
        }
    }

    // portfolioId getter 추가 (Lombok @Getter가 자동으로 생성하지만 명시적으로 보여주기 위해)
    // Lombok의 @Getter가 있으므로 실제 코드에 추가할 필요는 없습니다.
    // public Long getPortfolioId() {
    //     return portfolioId;
    // }
}