package com.mystockfolio.backend.controller;

import com.mystockfolio.backend.dto.AssetDto;
import com.mystockfolio.backend.service.AssetService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/portfolios/{portfolioId}/assets")// 프론트엔드 요청 경로에 맞춤
@RequiredArgsConstructor
public class AssetController {

    private final AssetService assetService;

    // 특정 포트폴리오의 모든 자산 조회 (GET /api/portfolio/assets?portfolioId=1)
    @GetMapping
    public ResponseEntity<List<AssetDto.AssetResponse>> getAssets(@PathVariable Long portfolioId) {
        log.info("🔍 자산 목록 조회 - portfolioId: {}", portfolioId);
        List<AssetDto.AssetResponse> assets = assetService.getAssetsByPortfolioId(portfolioId);
        log.info("✅ 자산 목록 조회 완료 - {}개", assets.size());
        return ResponseEntity.ok(assets);
    }

    // 새 자산 추가 (POST /api/portfolio/assets?portfolioId=1)
    @PostMapping
    public ResponseEntity<AssetDto.AssetResponse> createAsset(@PathVariable Long portfolioId,
                                                              @RequestBody AssetDto.AssetCreateRequest requestDto) {
        log.info("➕ 자산 추가 요청 - portfolioId: {}", portfolioId);
        log.info("   - ticker: {}, assetType: {}, quantity: {}, avgBuyPrice: {}, name: {}", 
            requestDto.getTicker(), requestDto.getAssetType(), requestDto.getQuantity(), 
            requestDto.getAvgBuyPrice(), requestDto.getName());
        
        AssetDto.AssetResponse createdAsset = assetService.createAsset(portfolioId, requestDto);
        log.info("✅ 자산 추가 완료 - assetId: {}, name: {}", createdAsset.getId(), createdAsset.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(createdAsset);
    }

    // 자산 정보 수정 (PUT /api/portfolio/assets/{assetId})
    @PutMapping("/{assetId}")
    public ResponseEntity<AssetDto.AssetResponse> updateAsset(@PathVariable Long assetId,
                                                              @RequestBody AssetDto.AssetUpdateRequest requestDto) {
        // TODO: assetId가 현재 로그인한 사용자의 것인지 Service에서 확인하도록 수정
        AssetDto.AssetResponse updatedAsset = assetService.updateAsset(assetId, requestDto);
        return ResponseEntity.ok(updatedAsset);
    }

    // 자산 삭제 (DELETE /api/portfolio/assets/{assetId})
    @DeleteMapping("/{assetId}")
    public ResponseEntity<Void> deleteAsset(@PathVariable Long assetId) {
        // TODO: assetId가 현재 로그인한 사용자의 것인지 Service에서 확인하도록 수정
        assetService.deleteAsset(assetId);
        // 성공 시 204 No Content 상태 코드 반환
        return ResponseEntity.noContent().build();
    }
}