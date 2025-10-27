package com.mystockfolio.backend.service;

import com.mystockfolio.backend.domain.entity.User;
import com.mystockfolio.backend.dto.AuthDto;
import com.mystockfolio.backend.exception.DuplicateResourceException;
import com.mystockfolio.backend.exception.InvalidCredentialsException;
import com.mystockfolio.backend.repository.UserRepository;
import com.mystockfolio.backend.util.JwtTokenProvider; // JwtTokenProvider import 추가
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider; // JwtTokenProvider 주입

    // 회원가입 (변경 없음)
    @Transactional
    public User signUp(AuthDto.SignUpRequest requestDto) {
        // 이메일 중복 확인
        if (userRepository.existsByEmail(requestDto.getEmail())) {
            throw new DuplicateResourceException("이미 사용 중인 이메일입니다: " + requestDto.getEmail());
        }

        // 비밀번호 확인 일치 여부
        if (!requestDto.getPassword().equals(requestDto.getPasswordConfirm())) {
            throw new IllegalArgumentException("비밀번호 확인이 일치하지 않습니다.");
        }

        // TODO: 닉네임 중복 확인 (선택 사항)

        // 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(requestDto.getPassword());

        // User 객체 생성 (빌더 패턴 사용)
        User newUser = User.builder()
                .email(requestDto.getEmail())
                .password(encodedPassword)
                .nickname(requestDto.getNickname())
                .walletAddress(requestDto.getWalletAddress())
                .build();

        return userRepository.save(newUser);
    }

    // 로그인 (JWT 발급 로직 수정)
    @Transactional(readOnly = true)
    public AuthDto.AuthResponse signIn(AuthDto.SignInRequest requestDto) {
        // 이메일로 사용자 조회
        User user = userRepository.findByEmail(requestDto.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("이메일 또는 비밀번호가 잘못되었습니다."));

        // 비밀번호 일치 확인
        if (!passwordEncoder.matches(requestDto.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("이메일 또는 비밀번호가 잘못되었습니다.");
        }

        // JWT 토큰 생성
        String accessToken = jwtTokenProvider.generateToken(user.getId());

        // 로그인 성공 응답 생성
        return AuthDto.AuthResponse.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .accessToken(accessToken) // 생성된 JWT 토큰 전달
                .build();
    }
}