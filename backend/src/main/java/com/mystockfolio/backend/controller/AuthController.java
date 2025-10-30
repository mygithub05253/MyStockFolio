package com.mystockfolio.backend.controller;

import com.mystockfolio.backend.dto.AuthDto;
import com.mystockfolio.backend.dto.MetaMaskDto;
import com.mystockfolio.backend.service.AuthService;
import com.mystockfolio.backend.service.MetaMaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final MetaMaskService metaMaskService;

    // 일반 회원가입 API
    @PostMapping("/register")
    public ResponseEntity<AuthDto.MessageResponse> registerUser(@Valid @RequestBody AuthDto.SignUpRequest signUpRequest) {
        authService.signUp(signUpRequest);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(AuthDto.MessageResponse.builder().message("회원가입 성공").build());
    }

    // 일반 로그인 API
    @PostMapping("/login")
    public ResponseEntity<AuthDto.AuthResponse> authenticateUser(@Valid @RequestBody AuthDto.SignInRequest signInRequest) {
        AuthDto.AuthResponse authResponse = authService.signIn(signInRequest);
        return ResponseEntity.ok(authResponse);
    }

    // OAuth2 추가 정보 입력 완료 API
    @PostMapping("/oauth2/complete")
    public ResponseEntity<AuthDto.AuthResponse> completeOAuth2SignUp(@Valid @RequestBody AuthDto.OAuth2CompleteRequest request) {
        AuthDto.AuthResponse authResponse = authService.completeOAuth2SignUp(request);
        return ResponseEntity.ok(authResponse);
    }

    // MetaMask 지갑 인증 - Nonce 요청
    @PostMapping("/metamask/nonce")
    public ResponseEntity<MetaMaskDto.NonceResponse> requestNonce(@Valid @RequestBody MetaMaskDto.NonceRequest request) {
        MetaMaskDto.NonceResponse response = metaMaskService.generateNonce(request.getWalletAddress());
        return ResponseEntity.ok(response);
    }

    // MetaMask 지갑 인증 - 서명 검증 및 로그인
    @PostMapping("/metamask/verify")
    public ResponseEntity<MetaMaskDto.AuthResponse> verifySignature(@Valid @RequestBody MetaMaskDto.VerifyRequest request) {
        MetaMaskDto.AuthResponse response = metaMaskService.verifyAndAuthenticate(
                request.getWalletAddress(),
                request.getSignature(),
                request.getNickname()
        );
        return ResponseEntity.ok(response);
    }

    // 현재 로그인한 사용자 정보 조회 (JWT 토큰 기반)
    @GetMapping("/me")
    public ResponseEntity<AuthDto.UserInfoResponse> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        // JWT 토큰에서 사용자 정보 추출
        AuthDto.UserInfoResponse userInfo = authService.getCurrentUser(authHeader);
        return ResponseEntity.ok(userInfo);
    }
}
