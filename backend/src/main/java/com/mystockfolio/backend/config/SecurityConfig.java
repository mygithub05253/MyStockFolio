package com.mystockfolio.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy; // Session 설정 추가
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity // Spring Security 활성화
public class SecurityConfig {

    // 비밀번호 암호화를 위한 PasswordEncoder 빈 등록
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // CSRF 보호 비활성화 (Stateless API 서버이므로)
                .csrf(csrf -> csrf.disable())
                // 세션 관리 정책 설정: Stateless (JWT 사용 예정)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // HTTP 요청에 대한 접근 제한 설정
                .authorizeHttpRequests(authz -> authz
                                // '/api/auth/**' 경로 (회원가입, 로그인)는 인증 없이 접근 허용
                                .requestMatchers("/api/auth/**").permitAll()
                                // '/api/hello' 경로도 임시로 허용 (테스트용)
                                .requestMatchers("/api/hello").permitAll()
                                // TODO: '/oauth2/**' 경로도 소셜 로그인 위해 허용 필요
                                // .requestMatchers("/oauth2/**", "/login/oauth2/code/**").permitAll()
                                // 나머지 모든 요청은 인증 필요 (추후 설정)
                                .anyRequest().authenticated() // 지금은 주석 처리 (JWT 필터 추가 후 활성화)
                        // .anyRequest().permitAll() // 임시: 모든 요청 허용 (테스트 편의)
                );
        // TODO: JWT 인증 필터 추가 예정
        // TODO: OAuth2 로그인 설정 추가 예정

        return http.build();
    }
}