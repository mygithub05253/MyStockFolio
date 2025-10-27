package com.mystockfolio.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
// httpBasic, formLogin 비활성화를 위해 import 추가
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // 1. CSRF 보호 비활성화 (Stateless API)
                .csrf(AbstractHttpConfigurer::disable) // 새로운 방식의 비활성화 권장

                // 2. HTTP Basic 인증 비활성화 (Stateless API)
                .httpBasic(AbstractHttpConfigurer::disable)

                // 3. Form 로그인 비활성화 (Stateless API)
                .formLogin(AbstractHttpConfigurer::disable)

                // 4. 세션 관리 정책: Stateless (JWT 사용 예정)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // 5. HTTP 요청 접근 제한 설정
                .authorizeHttpRequests(authz -> authz
                        .requestMatchers("/api/auth/**").permitAll() // 회원가입, 로그인 경로는 허용
                        .requestMatchers("/api/hello").permitAll()   // 테스트 경로 임시 허용
                        // TODO: OAuth2 관련 경로 허용 추가 필요
                        // .requestMatchers("/oauth2/**", "/login/oauth2/code/**").permitAll()
                        .anyRequest().permitAll() // 임시: 나머지 모든 요청 일단 허용 (나중에 .authenticated()로 변경)
                );
        // TODO: JWT 인증 필터 추가 예정

        return http.build();
    }
}