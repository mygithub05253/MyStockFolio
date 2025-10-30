package com.mystockfolio.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

public class MetaMaskDto {

    // Nonce 요청 DTO
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NonceRequest {
        @NotBlank(message = "지갑 주소는 필수입니다.")
        private String walletAddress;
    }

    // Nonce 응답 DTO
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class NonceResponse {
        private String nonce;
        private String message; // 서명할 메시지
    }

    // 서명 검증 요청 DTO
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VerifyRequest {
        @NotBlank(message = "지갑 주소는 필수입니다.")
        private String walletAddress;

        @NotBlank(message = "서명은 필수입니다.")
        private String signature;

        private String nickname; // 신규 사용자인 경우 닉네임 필수
    }

    // MetaMask 인증 요청 DTO (AuthRequest 별칭)
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AuthRequest {
        @NotBlank(message = "지갑 주소는 필수입니다.")
        private String walletAddress;

        @NotBlank(message = "서명은 필수입니다.")
        private String signature;

        private String nickname; // 신규 사용자인 경우 닉네임
    }

    // 인증 응답 DTO
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AuthResponse {
        private Long userId;
        private String email;
        private String nickname;
        private String walletAddress;
        private String accessToken;
        private boolean isNewUser;
    }
}

