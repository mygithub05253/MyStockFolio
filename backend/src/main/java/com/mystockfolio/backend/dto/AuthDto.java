package com.mystockfolio.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

public class AuthDto {

    // --- 요청(Request) DTO ---

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SignUpRequest {
        // SignUp.js 에서 받는 필드
        private String email;
        private String password;
        private String passwordConfirm; // 비밀번호 확인 (백엔드에서도 검증)
        private String nickname; // 닉네임 추가 필요 (프론트 SignUp.js 수정 필요)
        private String walletAddress;
    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SignInRequest {
        // SignIn.js 에서 받는 필드
        private String email;
        private String password;
    }

    // --- 응답(Response) DTO ---

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AuthResponse {
        // 로그인 성공 시 프론트엔드에 전달할 정보 (JWT 토큰 포함 예정)
        private Long userId;
        private String email;
        private String nickname;
        private String accessToken; // JWT 액세스 토큰 (다음 단계에서 구현)
        // private String refreshToken; // 리프레시 토큰 (선택 사항)
    }

    // 간단 응답 메시지 (예: 회원가입 성공)
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MessageResponse {
        private String message;
    }
}