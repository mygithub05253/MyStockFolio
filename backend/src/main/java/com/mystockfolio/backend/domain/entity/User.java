package com.mystockfolio.backend.domain.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column
    private String password; // OAuth2 사용자는 null 가능

    @Column(length = 50)
    private String nickname;

    @Column(length = 42)
    private String walletAddress;

    @Column(length = 50)
    private String provider; // google, naver, kakao, metamask 등

    @Column(length = 255)
    private String providerId; // OAuth2 제공자의 고유 ID

    @Column
    private LocalDateTime createdAt;

    @Builder
    public User(String email, String password, String nickname, String walletAddress, 
                String provider, String providerId, LocalDateTime createdAt) {
        this.email = email;
        this.password = password;
        this.nickname = nickname;
        this.walletAddress = walletAddress;
        this.provider = provider;
        this.providerId = providerId;
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
    }

    // Getter 메서드 (Lombok으로 자동 생성되지만 명시적으로 추가 가능)
    public Long getUserId() {
        return userId;
    }

    // Setter 메서드 (필요한 경우에만)
    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public void updateNickname(String nickname) {
        if (nickname != null && !nickname.isBlank()) {
            this.nickname = nickname;
        }
    }

    public void updateWalletAddress(String walletAddress) {
        if (walletAddress == null || (walletAddress.startsWith("0x") && walletAddress.length() == 42)) {
            this.walletAddress = walletAddress;
        }
    }
}