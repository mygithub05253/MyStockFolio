package com.mystockfolio.backend.config.oauth2;

import com.mystockfolio.backend.domain.entity.User;
import com.mystockfolio.backend.repository.UserRepository;
import com.mystockfolio.backend.util.JwtTokenProvider;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.Optional;

/**
 * OAuth2 로그인 성공 시 처리 핸들러
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        
        CustomOAuth2User customOAuth2User = (CustomOAuth2User) authentication.getPrincipal();
        OAuth2UserInfo oauth2UserInfo = customOAuth2User.getOAuth2UserInfo();
        
        String email = oauth2UserInfo.getEmail();
        log.info("OAuth2 로그인 성공 - email: {}, provider: {}", email, oauth2UserInfo.getProvider());

        // 사용자 조회
        Optional<User> userOptional = userRepository.findByEmail(email);
        
        if (userOptional.isEmpty()) {
            log.error("OAuth2 로그인 성공했지만 사용자를 찾을 수 없음 - email: {}", email);
            response.sendRedirect("http://localhost:3000/signin?error=user_not_found");
            return;
        }

        User user = userOptional.get();
        
        // 닉네임이 없으면 추가 정보 입력 페이지로 리다이렉트
        if (user.getNickname() == null || user.getNickname().trim().isEmpty()) {
            log.info("닉네임 미설정 사용자 - 추가 정보 입력 페이지로 이동");
            String redirectUrl = UriComponentsBuilder.fromUriString("http://localhost:3000/oauth2/signup")
                    .queryParam("email", email)
                    .queryParam("provider", oauth2UserInfo.getProvider())
                    .build().toUriString();
            
            response.sendRedirect(redirectUrl);
            return;
        }

        // JWT 토큰 생성
        String token = jwtTokenProvider.generateToken(user.getEmail());
        log.info("JWT 토큰 생성 완료 - userId: {}", user.getUserId());

        // 프론트엔드로 리다이렉트 (토큰 전달)
        String redirectUrl = UriComponentsBuilder.fromUriString("http://localhost:3000/oauth2/callback")
                .queryParam("token", token)
                .queryParam("userId", user.getUserId())
                .queryParam("email", user.getEmail())
                .queryParam("nickname", user.getNickname())
                .build().toUriString();

        log.info("OAuth2 로그인 완료 - 프론트엔드로 리다이렉트: {}", redirectUrl);
        response.sendRedirect(redirectUrl);
    }
}

