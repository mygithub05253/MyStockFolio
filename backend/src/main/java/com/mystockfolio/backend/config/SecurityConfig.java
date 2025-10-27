package com.mystockfolio.backend.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration; // CORS import 추가
import org.springframework.web.cors.CorsConfigurationSource; // CORS import 추가
import org.springframework.web.cors.UrlBasedCorsConfigurationSource; // CORS import 추가

import java.util.Arrays; // CORS 설정 위해 추가
import java.util.List;  // CORS 설정 위해 추가

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // 1. CORS 설정 추가 (개발 편의를 위해 모든 출처 허용 - 운영 시 주의)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // 2. CSRF 보호 비활성화 (Stateless API 이므로) - 확실하게 적용
                .csrf(AbstractHttpConfigurer::disable)

                // 3. HTTP Basic 및 Form Login 비활성화 (기존과 동일)
                .httpBasic(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)

                // 4. 세션 관리 정책: Stateless (기존과 동일)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // 5. HTTP 요청 접근 제한 설정 (순서 및 내용 확인)
                .authorizeHttpRequests(authz -> authz
                        .requestMatchers("/api/auth/**").permitAll() // 회원가입, 로그인은 인증 없이 접근 허용
                        .requestMatchers("/api/hello").permitAll()   // 테스트 경로 임시 허용
                        // TODO: OAuth2 관련 경로 허용 추가 필요
                        // .requestMatchers("/oauth2/**", "/login/oauth2/code/**").permitAll()
                        .anyRequest().authenticated() // 그 외 모든 요청은 인증 필요
                )

                // 6. JWT 인증 필터를 UsernamePasswordAuthenticationFilter 앞에 추가 (기존과 동일)
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // CORS 설정 Bean 추가
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // TODO: 운영 환경에서는 실제 프론트엔드 주소만 허용하도록 변경해야 합니다.
        configuration.setAllowedOrigins(List.of("http://localhost:3000")); // 프론트엔드 개발 서버 주소
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Cache-Control", "Content-Type"));
        configuration.setAllowCredentials(true); // 자격 증명 허용 (JWT 토큰 등)
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // 모든 경로에 대해 적용
        return source;
    }
}