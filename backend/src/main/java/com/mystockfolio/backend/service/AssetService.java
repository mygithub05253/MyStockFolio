package com.mystockfolio.backend.service;

import com.mystockfolio.backend.domain.entity.Asset;
import com.mystockfolio.backend.dto.AssetDto;
import com.mystockfolio.backend.repository.AssetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // 중요: 데이터 변경 시 트랜잭션 처리

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor // final 필드에 대한 생성자 자동 주입 (Lombok)
public class AssetService {

    private final AssetRepository assetRepository;
    // TODO: PortfolioRepository 주입 필요

    // 특정 포트폴리오의 모든 자산 조회
    @Transactional(readOnly = true) // 읽기 전용 트랜잭션
    public List<AssetDto.AssetResponse> getAssetsByPortfolioId(Long portfolioId) {
        // TODO: 해당 portfolioId가 현재 로그인한 사용자의 것인지 확인하는 로직 필요
        List<Asset> assets = assetRepository.findByPortfolioId(portfolioId);
        // Entity 리스트를 DTO 리스트로 변환하여 반환
        return assets.stream()
                .map(AssetDto.AssetResponse::fromEntity)
                .collect(Collectors.toList());
    }

    // 새 자산 추가
    @Transactional // 데이터 변경이 있으므로 트랜잭션 적용
    public AssetDto.AssetResponse createAsset(Long portfolioId, AssetDto.AssetCreateRequest requestDto) {
        // TODO: 해당 portfolioId의 Portfolio 객체 조회
        // Portfolio portfolio = portfolioRepository.findById(portfolioId)
        //         .orElseThrow(() -> new IllegalArgumentException("Invalid portfolio ID"));
        // TODO: 해당 portfolio가 현재 로그인한 사용자의 것인지 확인

        // 요청 DTO를 Entity로 변환 (Portfolio 객체 전달 필요)
        Asset asset = requestDto.toEntity(/* portfolio */);

        // TODO: Asset 이름 정보 설정 (예: 외부 API 호출 또는 ticker 기반 DB 조회)
        // asset.setName(findAssetNameByTicker(asset.getTicker()));

        Asset savedAsset = assetRepository.save(asset);
        return AssetDto.AssetResponse.fromEntity(savedAsset);
    }

    // 자산 정보 수정
    @Transactional
    public AssetDto.AssetResponse updateAsset(Long assetId, AssetDto.AssetUpdateRequest requestDto) {
        // TODO: 해당 assetId가 현재 로그인한 사용자의 자산인지 확인
        Asset asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid asset ID: " + assetId));

        // Entity 내부의 업데이트 메서드 사용 (혹은 Service에서 직접 필드 변경)
        asset.updateAssetDetails(null, requestDto.getQuantity(), requestDto.getAvgBuyPrice()); // 이름은 null 전달
        // ticker 변경 로직은 별도 고려 필요

        // save 호출 안해도 Transactional 덕분에 변경 감지(Dirty Checking)로 업데이트됨
        return AssetDto.AssetResponse.fromEntity(asset);
    }

    // 자산 삭제
    @Transactional
    public void deleteAsset(Long assetId) {
        // TODO: 해당 assetId가 현재 로그인한 사용자의 자산인지 확인
        Asset asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid asset ID: " + assetId));
        assetRepository.delete(asset);
        // 또는 assetRepository.deleteById(assetId);
    }

    // TODO: 자산 이름 조회 로직 (임시)
    private String findAssetNameByTicker(String ticker) {
        if ("AAPL".equalsIgnoreCase(ticker)) return "Apple Inc.";
        if ("BTC-USD".equalsIgnoreCase(ticker)) return "Bitcoin";
        // ... 실제 구현 필요
        return ticker; // 임시 반환
    }
}