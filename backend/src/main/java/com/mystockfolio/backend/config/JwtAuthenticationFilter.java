package com.mystockfolio.backend.config;

import com.mystockfolio.backend.service.CustomUserDetailsService;
import com.mystockfolio.backend.util.JwtTokenProvider;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider tokenProvider;
    private final CustomUserDetailsService customUserDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String jwt = getJwtFromRequest(request);

            // 토큰이 유효하고, 현재 Security Context에 인증 정보가 없는 경우
            if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {
                Long userId = tokenProvider.getUserIdFromToken(jwt);

                // UserDetailsService를 통해 UserDetails 로드
                UserDetails userDetails = customUserDetailsService.loadUserById(userId);
                // UserDetails를 기반으로 Authentication 객체 생성
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities()); // 비밀번호는 null 처리
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // SecurityContext에 Authentication 객체 설정
                SecurityContextHolder.getContext().setAuthentication(authentication);
                log.debug("Authenticated user: {}, setting security context", userDetails.getUsername());
            } else {
                if (!StringUtils.hasText(jwt)) {
                    log.debug("No JWT token found in request headers");
                }
                // validateToken 내부에서 이미 로그를 남기므로 여기서는 추가 로그 생략 가능
            }
        } catch (Exception ex) {
            log.error("Could not set user authentication in security context", ex);
        }

        // 다음 필터 체인 실행
        filterChain.doFilter(request, response);
    }

    // Request Header에서 토큰 정보 추출
    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7); // "Bearer " 이후의 문자열 반환
        }
        return null;
    }
}