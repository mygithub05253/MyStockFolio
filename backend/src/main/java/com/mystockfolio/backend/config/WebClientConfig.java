package com.mystockfolio.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    // WebClient.Builder를 Bean으로 등록하여 다른 곳에서 주입받아 사용 가능하게 함
    @Bean
    public WebClient.Builder webClientBuilder() {
        return WebClient.builder();
    }
}