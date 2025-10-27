package com.mystockfolio.backend.domain.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users") // 테이블 이름을 'user' 대신 'users'로 지정 (예약어 회피)
@Getter
@Setter
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false)
    private String password; // 실제로는 해시된 비밀번호 저장

    @Column(nullable = false, length = 50)
    private String nickname;

    @Column(length = 42) // Ethereum 주소 길이는 42 (0x 포함)
    private String walletAddress;

    // 생성자, 빌더 패턴 등 필요에 따라 추가
}