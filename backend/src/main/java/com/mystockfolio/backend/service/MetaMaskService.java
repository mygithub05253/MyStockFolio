package com.mystockfolio.backend.service;

import com.mystockfolio.backend.domain.entity.User;
import com.mystockfolio.backend.dto.MetaMaskDto;
import com.mystockfolio.backend.exception.InvalidCredentialsException;
import com.mystockfolio.backend.repository.UserRepository;
import com.mystockfolio.backend.util.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.web3j.crypto.Keys;
import org.web3j.crypto.Sign;
import org.web3j.utils.Numeric;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * MetaMask 지갑 인증 서비스
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class MetaMaskService {

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;

    // Nonce를 메모리에 임시 저장 (실제 프로덕션 환경에서는 Redis 등 사용 권장)
    private final Map<String, NonceData> nonceStore = new ConcurrentHashMap<>();

    /**
     * Nonce 데이터 저장용 클래스
     */
    private static class NonceData {
        String nonce;
        LocalDateTime expiresAt;

        NonceData(String nonce, LocalDateTime expiresAt) {
            this.nonce = nonce;
            this.expiresAt = expiresAt;
        }

        boolean isExpired() {
            return LocalDateTime.now().isAfter(expiresAt);
        }
    }

    /**
     * Nonce 생성
     */
    public MetaMaskDto.NonceResponse generateNonce(String walletAddress) {
        log.info("Nonce 생성 요청 - walletAddress: {}", walletAddress);

        // 소문자로 정규화
        String normalizedAddress = walletAddress.toLowerCase();

        // 랜덤 nonce 생성
        String nonce = UUID.randomUUID().toString();

        // Nonce 저장 (5분 유효)
        nonceStore.put(normalizedAddress, new NonceData(nonce, LocalDateTime.now().plusMinutes(5)));

        // 서명할 메시지 생성
        String message = String.format("MyStockFolio 로그인\n\nNonce: %s", nonce);

        log.info("Nonce 생성 완료 - nonce: {}", nonce);

        return MetaMaskDto.NonceResponse.builder()
                .nonce(nonce)
                .message(message)
                .build();
    }

    /**
     * 서명 검증 및 인증
     */
    @Transactional
    public MetaMaskDto.AuthResponse verifyAndAuthenticate(String walletAddress, String signature, String nickname) {
        log.info("서명 검증 시작 - walletAddress: {}", walletAddress);

        // 소문자로 정규화
        String normalizedAddress = walletAddress.toLowerCase();

        // Nonce 확인
        NonceData nonceData = nonceStore.get(normalizedAddress);
        if (nonceData == null) {
            throw new InvalidCredentialsException("Nonce를 찾을 수 없습니다. 다시 시도해주세요.");
        }

        if (nonceData.isExpired()) {
            nonceStore.remove(normalizedAddress);
            throw new InvalidCredentialsException("Nonce가 만료되었습니다. 다시 시도해주세요.");
        }

        // 서명 검증
        String message = String.format("MyStockFolio 로그인\n\nNonce: %s", nonceData.nonce);
        boolean isValid = verifySignature(message, signature, normalizedAddress);

        if (!isValid) {
            throw new InvalidCredentialsException("서명 검증에 실패했습니다.");
        }

        // Nonce 사용 완료 (재사용 방지)
        nonceStore.remove(normalizedAddress);

        log.info("서명 검증 성공 - walletAddress: {}", normalizedAddress);

        // 사용자 조회 또는 생성
        Optional<User> existingUser = userRepository.findByWalletAddress(normalizedAddress);

        boolean isNewUser = false;
        User user;

        if (existingUser.isPresent()) {
            user = existingUser.get();
            log.info("기존 사용자 로그인 - userId: {}", user.getUserId());
        } else {
            // 신규 사용자
            if (nickname == null || nickname.trim().isEmpty()) {
                throw new InvalidCredentialsException("신규 사용자는 닉네임이 필요합니다.");
            }

            isNewUser = true;

            // 지갑 주소를 이메일로 사용 (고유성 보장)
            String email = normalizedAddress + "@metamask.wallet";

            user = User.builder()
                    .email(email)
                    .nickname(nickname)
                    .walletAddress(normalizedAddress)
                    .provider("metamask")
                    .providerId(normalizedAddress)
                    .createdAt(LocalDateTime.now())
                    .build();

            user = userRepository.save(user);
            log.info("새 MetaMask 사용자 생성 - userId: {}, walletAddress: {}", user.getUserId(), normalizedAddress);
        }

        // JWT 토큰 생성
        String accessToken = jwtTokenProvider.generateToken(user.getEmail());

        return MetaMaskDto.AuthResponse.builder()
                .userId(user.getUserId())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .walletAddress(user.getWalletAddress())
                .accessToken(accessToken)
                .isNewUser(isNewUser)
                .build();
    }

    /**
     * 서명 검증 (Web3j 사용)
     */
    private boolean verifySignature(String message, String signature, String expectedAddress) {
        try {
            // 메시지를 Ethereum Signed Message 형식으로 변환
            String prefix = "\u0019Ethereum Signed Message:\n";
            String prefixedMessage = prefix + message.length() + message;

            // 메시지 해시 계산
            byte[] messageHash = org.web3j.crypto.Hash.sha3(prefixedMessage.getBytes());

            // 서명에서 v, r, s 추출
            byte[] signatureBytes = Numeric.hexStringToByteArray(signature);
            byte v = signatureBytes[64];
            if (v < 27) {
                v += 27;
            }

            Sign.SignatureData signatureData = new Sign.SignatureData(
                    v,
                    java.util.Arrays.copyOfRange(signatureBytes, 0, 32),
                    java.util.Arrays.copyOfRange(signatureBytes, 32, 64)
            );

            // 공개키 복원
            int header = 0;
            for (byte b : signatureData.getR()) {
                header = (header << 8) + (b & 0xFF);
            }

            // EcRecover를 사용하여 주소 복원
            for (int i = 0; i < 4; i++) {
                try {
                    byte recId = (byte) i;
                    Sign.SignatureData sd = new Sign.SignatureData(
                            (byte) (recId + 27),
                            signatureData.getR(),
                            signatureData.getS()
                    );

                    java.math.BigInteger publicKey = Sign.signedMessageHashToKey(messageHash, sd);
                    String recoveredAddress = "0x" + Keys.getAddress(publicKey);

                    if (recoveredAddress.equalsIgnoreCase(expectedAddress)) {
                        log.info("서명 검증 성공 - 복원된 주소: {}", recoveredAddress);
                        return true;
                    }
                } catch (Exception e) {
                    // 다음 recId 시도
                    continue;
                }
            }

            log.warn("서명 검증 실패 - 예상 주소와 불일치");
            return false;

        } catch (Exception e) {
            log.error("서명 검증 중 오류 발생", e);
            return false;
        }
    }
}

