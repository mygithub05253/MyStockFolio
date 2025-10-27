package com.mystockfolio.backend.domain.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // @Column(name = "user_id") // 실제 DB 컬럼 이름 'id'와 불일치하므로 이 줄 제거
    private Long id; // 필드 이름 'id'는 NamingStrategy에 의해 'id' 컬럼에 매핑됨

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, length = 50)
    private String nickname;

    @Column(length = 42)
    private String walletAddress; // NamingStrategy에 의해 'wallet_address' 컬럼에 매핑됨

    @Builder
    public User(String email, String password, String nickname, String walletAddress) {
        this.email = email;
        this.password = password;
        this.nickname = nickname;
        this.walletAddress = walletAddress;
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