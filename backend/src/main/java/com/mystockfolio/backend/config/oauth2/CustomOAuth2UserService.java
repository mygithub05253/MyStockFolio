package com.mystockfolio.backend.config.oauth2;

import com.mystockfolio.backend.domain.entity.User;
import com.mystockfolio.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

/**
 * OAuth2 사용자 정보를 처리하는 커스텀 서비스
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);
        
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        log.info("OAuth2 로그인 시도 - Provider: {}", registrationId);

        OAuth2UserInfo oauth2UserInfo = getOAuth2UserInfo(registrationId, oauth2User.getAttributes());
        
        if (oauth2UserInfo.getEmail() == null) {
            throw new OAuth2AuthenticationException("Email not found from OAuth2 provider");
        }

        // 사용자 조회 또는 생성
        UserCheckResult result = processOAuth2User(oauth2UserInfo);
        
        // CustomOAuth2User 반환 (나중에 SuccessHandler에서 사용)
        return new CustomOAuth2User(oauth2User, oauth2UserInfo);
    }

    private OAuth2UserInfo getOAuth2UserInfo(String registrationId, Map<String, Object> attributes) {
        log.info("OAuth2UserInfo 생성 - registrationId: {}", registrationId);
        
        if ("google".equals(registrationId)) {
            return new GoogleOAuth2UserInfo(attributes);
        } else if ("naver".equals(registrationId)) {
            Map<String, Object> response = (Map<String, Object>) attributes.get("response");
            return new NaverOAuth2UserInfo(response);
        } else if ("kakao".equals(registrationId)) {
            return new KakaoOAuth2UserInfo(attributes);
        } else {
            throw new OAuth2AuthenticationException("Unsupported OAuth2 provider: " + registrationId);
        }
    }

    /**
     * OAuth2 사용자 처리 결과
     */
    public static class UserCheckResult {
        public final boolean exists;
        public final boolean needsNickname;
        public final User user;

        public UserCheckResult(boolean exists, boolean needsNickname, User user) {
            this.exists = exists;
            this.needsNickname = needsNickname;
            this.user = user;
        }
    }

    /**
     * OAuth2 사용자 처리 (존재 여부 확인 및 생성)
     */
    private UserCheckResult processOAuth2User(OAuth2UserInfo oauth2UserInfo) {
        String email = oauth2UserInfo.getEmail();
        String provider = oauth2UserInfo.getProvider();
        String providerId = oauth2UserInfo.getProviderId();

        log.info("OAuth2 사용자 처리 - email: {}, provider: {}", email, provider);

        // 기존 사용자 조회
        Optional<User> existingUser = userRepository.findByEmail(email);

        if (existingUser.isPresent()) {
            User user = existingUser.get();
            log.info("기존 사용자 발견 - userId: {}, nickname: {}", user.getUserId(), user.getNickname());
            
            // 닉네임이 없으면 추가 정보 필요
            boolean needsNickname = (user.getNickname() == null || user.getNickname().trim().isEmpty());
            
            return new UserCheckResult(true, needsNickname, user);
        } else {
            // 새 사용자 생성 (닉네임은 나중에 입력받음)
            User newUser = User.builder()
                    .email(email)
                    .nickname(null)  // 추후 입력 받음
                    .provider(provider)
                    .providerId(providerId)
                    .createdAt(LocalDateTime.now())
                    .build();
            
            User savedUser = userRepository.save(newUser);
            log.info("새 OAuth2 사용자 생성 완료 - userId: {}, email: {}", savedUser.getUserId(), savedUser.getEmail());
            
            return new UserCheckResult(false, true, savedUser);
        }
    }

    /**
     * 외부에서 사용자 상태를 확인하기 위한 메서드
     */
    public UserCheckResult checkUser(OAuth2UserInfo oauth2UserInfo) {
        return processOAuth2User(oauth2UserInfo);
    }
}

