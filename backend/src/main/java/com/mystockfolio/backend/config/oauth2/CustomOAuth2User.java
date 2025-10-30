package com.mystockfolio.backend.config.oauth2;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.Map;

/**
 * OAuth2 인증 사용자 정보를 담는 커스텀 클래스
 */
public class CustomOAuth2User implements OAuth2User {
    private OAuth2User oauth2User;
    private OAuth2UserInfo oauth2UserInfo;

    public CustomOAuth2User(OAuth2User oauth2User, OAuth2UserInfo oauth2UserInfo) {
        this.oauth2User = oauth2User;
        this.oauth2UserInfo = oauth2UserInfo;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return oauth2User.getAttributes();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return oauth2User.getAuthorities();
    }

    @Override
    public String getName() {
        return oauth2UserInfo.getProvider() + "_" + oauth2UserInfo.getProviderId();
    }

    public OAuth2UserInfo getOAuth2UserInfo() {
        return oauth2UserInfo;
    }
}

