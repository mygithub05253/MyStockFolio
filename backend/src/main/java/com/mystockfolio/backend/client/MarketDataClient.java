package com.mystockfolio.backend.client;

import com.mystockfolio.backend.dto.MarketDataDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

@Slf4j
@Component
public class MarketDataClient {

    private final WebClient webClient;

    public MarketDataClient(@Value("${market.data.url}") String marketDataUrl, WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl(marketDataUrl).build();
        log.info("MarketDataClient initialized with URL: {}", marketDataUrl);
    }

    // 1. 실시간 시세 조회 (FastAPI의 /api/market/price 엔드포인트 호출)
    public Mono<MarketDataDto.PriceResponse> getCurrentPrice(String ticker) {
        return webClient.get()
                .uri("/api/market/price?ticker={ticker}", ticker)
                .retrieve()
                // [★★★ 오류 수정: status -> status.isError()로 람다 사용 ★★★]
                .onStatus(status -> status.isError(), response -> {
                    log.error("Error calling MarketDataService for price: {}", response.statusCode());
                    if (response.statusCode() == HttpStatus.NOT_FOUND) {
                        return Mono.error(new WebClientResponseException(
                                response.statusCode().value(),
                                "Market data not found for ticker: " + ticker,
                                response.headers().asHttpHeaders(), null, null
                        ));
                    }
                    return response.createException();
                })
                .bodyToMono(MarketDataDto.PriceResponse.class)
                .onErrorResume(e -> {
                    log.error("Failed to connect to MarketDataService: {}", e.getMessage());
                    return Mono.empty();
                });
    }

    // 2. 차트 데이터 조회 (FastAPI의 /api/market/chart 엔드포인트 호출)
    public Mono<MarketDataDto.ChartResponse> getHistoricalChart(String ticker, String period) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/api/market/chart")
                        .queryParam("ticker", ticker)
                        .queryParam("period", period)
                        .build())
                .retrieve()
                // [★★★ 오류 수정: status -> status.isError()로 람다 사용 ★★★]
                .onStatus(status -> status.isError(), response -> {
                    log.error("Error calling MarketDataService for chart: {}", response.statusCode());
                    return response.createException();
                })
                .bodyToMono(MarketDataDto.ChartResponse.class)
                .onErrorResume(e -> {
                    log.error("Failed to connect to MarketDataService for chart: {}", e.getMessage());
                    return Mono.empty();
                });
    }
}