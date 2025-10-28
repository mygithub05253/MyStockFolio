package com.mystockfolio.backend.service;

import com.mystockfolio.backend.domain.entity.Asset;
import com.mystockfolio.backend.domain.entity.Portfolio;
import com.mystockfolio.backend.domain.entity.User;
import com.mystockfolio.backend.exception.ResourceNotFoundException;
import com.mystockfolio.backend.dto.AssetDto;
import com.mystockfolio.backend.repository.AssetRepository;
import com.mystockfolio.backend.repository.PortfolioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AssetService {

    private final AssetRepository assetRepository;
    private final PortfolioRepository portfolioRepository;

    // 특정 포트폴리오의 모든 자산 조회
    @Transactional(readOnly = true)
    public List<AssetDto.AssetResponse> getAssetsByPortfolioId(Long portfolioId) {
        log.debug("자산 목록 조회 시작 - portfolioId: {}", portfolioId);
        List<Asset> assets = assetRepository.findByPortfolioId(portfolioId);
        log.debug("자산 목록 조회 완료 - {}개", assets.size());
        return assets.stream()
                .map(AssetDto.AssetResponse::fromEntity)
                .collect(Collectors.toList());
    }

    // 새 자산 추가
    @Transactional
    public AssetDto.AssetResponse createAsset(Long portfolioId, AssetDto.AssetCreateRequest requestDto) {
        log.info("💼 자산 추가 서비스 시작 - portfolioId: {}, ticker: {}", portfolioId, requestDto.getTicker());
        
        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .orElseThrow(() -> {
                    log.error("❌ 포트폴리오를 찾을 수 없음 - portfolioId: {}", portfolioId);
                    return new ResourceNotFoundException("Portfolio not found with id: " + portfolioId);
                });
        
        log.info("✅ 포트폴리오 조회 성공 - name: {}, userId: {}", portfolio.getName(), portfolio.getUser().getId());

        try {
            Asset asset = requestDto.toEntity(portfolio);
            log.info("✅ Entity 변환 완료 - ticker: {}, assetType: {}", asset.getTicker(), asset.getAssetType());
            
            // 이름 설정 로직: 요청에 이름이 있으면 그대로 사용, 없으면 티커로 조회
            if (asset.getName() == null || asset.getName().trim().isEmpty()) {
                String discoveredName = findAssetNameByTicker(asset.getTicker());
                asset.setName(discoveredName);
                log.info("📝 자산 이름 자동 설정: {}", discoveredName);
            } else {
                log.info("📝 자산 이름 사용자 지정: {}", asset.getName());
            }

            Asset savedAsset = assetRepository.save(asset);
            log.info("💾 자산 저장 완료 - assetId: {}", savedAsset.getId());
            
            portfolio.addAsset(savedAsset); // 연관관계 편의 메서드 호출
            log.info("✅ 포트폴리오에 자산 추가 완료");

            return AssetDto.AssetResponse.fromEntity(savedAsset);
        } catch (Exception e) {
            log.error("❌ 자산 추가 중 오류 발생", e);
            throw e;
        }
    }

    // 자산 정보 수정
    @Transactional
    public AssetDto.AssetResponse updateAsset(Long assetId, AssetDto.AssetUpdateRequest requestDto) {
        Asset asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found with id: " + assetId));
        // TODO: 사용자 권한 확인 로직 추가

        asset.updateAssetDetails(requestDto.getName(), requestDto.getQuantity(), requestDto.getAvgBuyPrice());

        // 티커 변경 시 이름 재조회 (선택적)
        if (requestDto.getTicker() != null && !requestDto.getTicker().equals(asset.getTicker())) {
            // asset.setTicker(requestDto.getTicker()); // Ticker 변경 setter 필요
            asset.setName(findAssetNameByTicker(requestDto.getTicker()));
        } else if (requestDto.getName() != null){
            // 명시적으로 이름이 주어지면 그대로 사용 (updateAssetDetails 에서 처리)
        }


        return AssetDto.AssetResponse.fromEntity(asset);
    }

    // 자산 삭제
    @Transactional
    public void deleteAsset(Long assetId) {
        Asset asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found with id: " + assetId));
        // TODO: 사용자 권한 확인 로직 추가

        assetRepository.delete(asset);
    }

    // 자산 이름 조회 로직 (임시 - 실제 구현에서는 외부 API 호출 필요)
    private String findAssetNameByTicker(String ticker) {
        if (ticker == null) return "Unknown";
        
        String upperTicker = ticker.toUpperCase();
        
        // 주식
        if ("AAPL".equals(upperTicker)) return "Apple Inc.";
        if ("TSLA".equals(upperTicker)) return "Tesla, Inc.";
        if ("GOOGL".equals(upperTicker)) return "Alphabet Inc.";
        if ("005930.KS".equals(upperTicker)) return "Samsung Electronics";
        
        // 코인/토큰
        if ("BTC".equals(upperTicker) || "BTC-USD".equals(upperTicker)) return "Bitcoin";
        if ("ETH".equals(upperTicker) || "ETH-USD".equals(upperTicker)) return "Ethereum";
        if ("BNB".equals(upperTicker) || "BNB-USD".equals(upperTicker)) return "Binance Coin";
        if ("ADA".equals(upperTicker) || "ADA-USD".equals(upperTicker)) return "Cardano";
        if ("SOL".equals(upperTicker) || "SOL-USD".equals(upperTicker)) return "Solana";
        if ("XRP".equals(upperTicker) || "XRP-USD".equals(upperTicker)) return "Ripple";
        if ("DOT".equals(upperTicker) || "DOT-USD".equals(upperTicker)) return "Polkadot";
        if ("MATIC".equals(upperTicker) || "MATIC-USD".equals(upperTicker)) return "Polygon";
        
        // 스테이블코인
        if ("USDT".equals(upperTicker)) return "Tether";
        if ("USDC".equals(upperTicker)) return "USD Coin";
        if ("DAI".equals(upperTicker)) return "Dai";
        if ("BUSD".equals(upperTicker)) return "Binance USD";
        
        // 디파이 토큰
        if ("UNI".equals(upperTicker)) return "Uniswap";
        if ("AAVE".equals(upperTicker)) return "Aave";
        if ("COMP".equals(upperTicker)) return "Compound";
        if ("SUSHI".equals(upperTicker)) return "SushiSwap";
        if ("CRV".equals(upperTicker)) return "Curve DAO Token";
        if ("MKR".equals(upperTicker)) return "Maker";
        
        // 기본값: 티커를 그대로 대문자로 반환
        return upperTicker;
    }
}