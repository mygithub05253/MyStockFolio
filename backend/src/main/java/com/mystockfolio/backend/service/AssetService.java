package com.mystockfolio.backend.service;

import com.mystockfolio.backend.domain.entity.Asset;
import com.mystockfolio.backend.domain.entity.Portfolio;
import com.mystockfolio.backend.domain.entity.User;
import com.mystockfolio.backend.exception.ResourceNotFoundException;
import com.mystockfolio.backend.dto.AssetDto;
import com.mystockfolio.backend.repository.AssetRepository;
import com.mystockfolio.backend.repository.PortfolioRepository;
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

    // 특정 포트폴리오의 모든 자산 조회
    @Transactional(readOnly = true)
    public List<AssetDto.AssetResponse> getAssetsByPortfolioId(Long portfolioId) {
        // TODO: 사용자 권한 확인 로직 추가

        List<Asset> assets = assetRepository.findByPortfolioId(portfolioId); // <-- 수정: findByPortfolioPortfolioId -> findByPortfolioId

        return assets.stream()
                .map(AssetDto.AssetResponse::fromEntity)
                .collect(Collectors.toList());
    }

    // 새 자산 추가
    @Transactional
    public AssetDto.AssetResponse createAsset(Long portfolioId, AssetDto.AssetCreateRequest requestDto) {
        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio not found with id: " + portfolioId));
        // TODO: 사용자 권한 확인 로직 추가

        Asset asset = requestDto.toEntity(portfolio);

        asset.setName(findAssetNameByTicker(asset.getTicker()));

        Asset savedAsset = assetRepository.save(asset);
        portfolio.addAsset(savedAsset); // 연관관계 편의 메서드 호출

        return AssetDto.AssetResponse.fromEntity(savedAsset);
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

    // 자산 이름 조회 로직 (임시)
    private String findAssetNameByTicker(String ticker) {
        if (ticker == null) return "Unknown";
        // 실제 구현에서는 외부 API 호출 또는 DB 조회 필요
        if ("AAPL".equalsIgnoreCase(ticker)) return "Apple Inc.";
        if ("BTC-USD".equalsIgnoreCase(ticker)) return "Bitcoin";
        if ("TSLA".equalsIgnoreCase(ticker)) return "Tesla, Inc.";
        if ("ETH-USD".equalsIgnoreCase(ticker)) return "Ethereum";
        if ("005930.KS".equalsIgnoreCase(ticker)) return "Samsung Electronics";
        return ticker.toUpperCase();
    }
}