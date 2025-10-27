package com.mystockfolio.backend.service;

import com.mystockfolio.backend.domain.entity.User;
import com.mystockfolio.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList; // UserDetails 생성을 위해 import

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    // 사용자 ID(Long 타입)를 기반으로 UserDetails 객체를 로드하는 메서드 (추가)
    @Transactional(readOnly = true)
    public UserDetails loadUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id : " + id));

        // Spring Security의 UserDetails 객체로 변환하여 반환
        // 여기서는 간단히 사용자 이메일(username), 비밀번호, 빈 권한 목록을 사용합니다.
        // 실제 애플리케이션에서는 권한(Role) 관리 로직이 추가될 수 있습니다.
        return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(), new ArrayList<>());
    }

    // UserDetailsService 인터페이스의 기본 메서드 (이메일 기반 로드)
    // 여기서는 ID 기반 로드를 주로 사용할 것이므로, 이 메서드는 필요시 구현하거나 예외를 던지도록 둘 수 있습니다.
    // 여기서는 UsernameNotFoundException을 던지도록 유지합니다.
    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email : " + email));

        return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(), new ArrayList<>());
        // throw new UsernameNotFoundException("Username (email) based login is not supported by JWT filter directly.");
    }
}