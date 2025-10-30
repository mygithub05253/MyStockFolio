// backend/src/main/java/com/mystockfolio/backend/service/AssetService.java (전체 코드)

package com.mystockfolio.backend.service;

import com.mystockfolio.backend.domain.entity.Asset;
import com.mystockfolio.backend.domain.entity.Portfolio;
import com.mystockfolio.backend.dto.AssetDto;
import com.mystockfolio.backend.repository.AssetRepository;
import com.mystockfolio.backend.repository.PortfolioRepository;
import com.mystockfolio.backend.exception.ResourceNotFoundException;
import com.mystockfolio.backend.client.MarketDataClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AssetService {

    private final AssetRepository assetRepository;
    private final PortfolioRepository portfolioRepository;
    private final MarketDataClient marketDataClient;

    // 특정 포트폴리오의 모든 자산 조회
    @Transactional(readOnly = true)
    public List<AssetDto.AssetResponse> getAssetsByPortfolioId(Long portfolioId) {
        List<Asset> assets = assetRepository.findByPortfolioId(portfolioId);
        return assets.stream()
                .map(AssetDto.AssetResponse::fromEntity)
                .collect(Collectors.toList());
    }

    // 새 자산 추가
    @Transactional
    public AssetDto.AssetResponse createAsset(Long portfolioId, AssetDto.AssetCreateRequest requestDto) {
        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio not found with id: " + portfolioId));

        // [★★★ DB 오류 해결: DTO 필드 유효성 최종 확인 ★★★]
        if (requestDto.getQuantity() == null || requestDto.getAvgBuyPrice() == null ||
                requestDto.getQuantity() <= 0 || requestDto.getAvgBuyPrice() <= 0) {
            throw new IllegalArgumentException("수량과 매입 가격은 0보다 커야 합니다.");
        }

        Asset asset = requestDto.toEntity(portfolio);

        // 2. 자산 이름 설정 (유효한 티커만 허용)
        String assetName = findAssetNameByTicker(asset.getTicker());
        if (assetName.equals("Unknown")) {
            throw new IllegalArgumentException("지원하지 않거나 유효하지 않은 자산 티커입니다. (유효 티커: AAPL, BTC-USD, TSLA, 005930.KS)");
        }
        asset.setName(assetName);

        // 3. 자산 저장
        Asset savedAsset = assetRepository.save(asset);
        portfolio.addAsset(savedAsset);

        return AssetDto.AssetResponse.fromEntity(savedAsset);
    }

    // 자산 정보 수정
    @Transactional
    public AssetDto.AssetResponse updateAsset(Long assetId, AssetDto.AssetUpdateRequest requestDto) {
        Asset asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found with id: " + assetId));

        asset.updateAssetDetails(requestDto.getName(), requestDto.getQuantity(), requestDto.getAvgBuyPrice());

        if (requestDto.getTicker() != null && !requestDto.getTicker().equals(asset.getTicker())) {
            asset.setName(findAssetNameByTicker(requestDto.getTicker()));
        }

        return AssetDto.AssetResponse.fromEntity(asset);
    }

    // 자산 삭제
    @Transactional
    public void deleteAsset(Long assetId) {
        Asset asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found with id: " + assetId));

        assetRepository.delete(asset);
    }

    // TODO: 자산 이름 조회 로직 (임시) - FastAPI 연동 후 실시간 조회로 대체
    private String findAssetNameByTicker(String ticker) {
        if (ticker == null) return "Unknown";

        // FE에서 BTC-USD, AAPL, 005930.KS 등 유효한 티커를 입력했는지 확인
        if ("AAPL".equalsIgnoreCase(ticker)) return "Apple Inc.";
        if ("BTC-USD".equalsIgnoreCase(ticker)) return "Bitcoin";
        if ("TSLA".equalsIgnoreCase(ticker)) return "Tesla, Inc.";
        if ("005930.KS".equalsIgnoreCase(ticker)) return "Samsung Electronics";

        return "Unknown";
    }
}