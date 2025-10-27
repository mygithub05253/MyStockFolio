package com.mystockfolio.backend.service;

import com.mystockfolio.backend.domain.entity.Asset;
// Portfolio, User, ResourceNotFoundException import 추가
import com.mystockfolio.backend.domain.entity.Portfolio;
import com.mystockfolio.backend.domain.entity.User;
import com.mystockfolio.backend.exception.ResourceNotFoundException;
import com.mystockfolio.backend.dto.AssetDto;
import com.mystockfolio.backend.repository.AssetRepository;
import com.mystockfolio.backend.repository.PortfolioRepository; // PortfolioRepository import 추가
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // 중요: 데이터 변경 시 트랜잭션 처리

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor // final 필드에 대한 생성자 자동 주입 (Lombok)
public class AssetService {

    private final AssetRepository assetRepository;
    private final PortfolioRepository portfolioRepository; // PortfolioRepository 주입 추가

    // 특정 포트폴리오의 모든 자산 조회
    @Transactional(readOnly = true) // 읽기 전용 트랜잭션
    public List<AssetDto.AssetResponse> getAssetsByPortfolioId(Long portfolioId) {
        // TODO: 해당 portfolioId가 현재 로그인한 사용자의 것인지 확인하는 로직 필요
        // PortfolioService에서 해당 Portfolio 존재 및 소유권 확인 필요

        List<Asset> assets = assetRepository.findByPortfolioPortfolioId(portfolioId); // <-- 여기를 수정! findByPortfolioId -> findByPortfolioPortfolioId
        // Entity 리스트를 DTO 리스트로 변환하여 반환
        return assets.stream()
                .map(AssetDto.AssetResponse::fromEntity)
                .collect(Collectors.toList());
    }

    // 새 자산 추가
    @Transactional // 데이터 변경이 있으므로 트랜잭션 적용
    public AssetDto.AssetResponse createAsset(Long portfolioId, AssetDto.AssetCreateRequest requestDto) {
        // 해당 portfolioId의 Portfolio 객체 조회
        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio not found with id: " + portfolioId));
        // TODO: 해당 portfolio가 현재 로그인한 사용자의 것인지 확인 (PortfolioService 에 위임하거나 여기서 User 정보 받아 확인)

        // 요청 DTO를 Entity로 변환 (조회한 Portfolio 객체 전달)
        Asset asset = requestDto.toEntity(portfolio); // <-- portfolio 객체 전달

        // TODO: Asset 이름 정보 설정 (예: 외부 API 호출 또는 ticker 기반 DB 조회)
        asset.setName(findAssetNameByTicker(asset.getTicker())); // 이름 설정 로직 추가

        Asset savedAsset = assetRepository.save(asset);
        // Portfolio의 assets 리스트에도 추가 (연관관계 편의 메서드 사용)
        portfolio.addAsset(savedAsset); // <-- 연관관계 설정

        return AssetDto.AssetResponse.fromEntity(savedAsset);
    }

    // 자산 정보 수정
    @Transactional
    public AssetDto.AssetResponse updateAsset(Long assetId, AssetDto.AssetUpdateRequest requestDto) {
        // TODO: 해당 assetId가 현재 로그인한 사용자의 자산인지 확인
        Asset asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found with id: " + assetId));

        // TODO: Asset의 Portfolio 소유권 확인

        // Entity 내부의 업데이트 메서드 사용 (혹은 Service에서 직접 필드 변경)
        asset.updateAssetDetails(requestDto.getName(), requestDto.getQuantity(), requestDto.getAvgBuyPrice()); // 이름도 업데이트 가능하도록 수정
        // ticker 변경 로직은 별도 고려 필요 (변경 시 이름도 다시 조회해야 할 수 있음)
        if (requestDto.getName() == null && requestDto.getTicker() != null && !requestDto.getTicker().equals(asset.getTicker())) {
            // ticker가 변경되었고, 이름이 명시적으로 주어지지 않았다면 이름 다시 조회/설정
            asset.setName(findAssetNameByTicker(requestDto.getTicker()));
            // asset.setTicker(requestDto.getTicker()); // Ticker 변경 로직은 updateAssetDetails 에 포함하거나 별도 관리
        }


        // save 호출 안해도 Transactional 덕분에 변경 감지(Dirty Checking)로 업데이트됨
        return AssetDto.AssetResponse.fromEntity(asset);
    }

    // 자산 삭제
    @Transactional
    public void deleteAsset(Long assetId) {
        // TODO: 해당 assetId가 현재 로그인한 사용자의 자산인지 확인
        Asset asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found with id: " + assetId));

        // TODO: Asset의 Portfolio 소유권 확인

        assetRepository.delete(asset);
        // 또는 assetRepository.deleteById(assetId);
    }

    // TODO: 자산 이름 조회 로직 (임시)
    private String findAssetNameByTicker(String ticker) {
        if (ticker == null) return "Unknown";
        if ("AAPL".equalsIgnoreCase(ticker)) return "Apple Inc.";
        if ("BTC-USD".equalsIgnoreCase(ticker)) return "Bitcoin";
        if ("TSLA".equalsIgnoreCase(ticker)) return "Tesla, Inc.";
        if ("ETH-USD".equalsIgnoreCase(ticker)) return "Ethereum";
        if ("005930.KS".equalsIgnoreCase(ticker)) return "Samsung Electronics";
        // ... 실제 구현 필요
        return ticker.toUpperCase(); // 임시 반환
    }
}