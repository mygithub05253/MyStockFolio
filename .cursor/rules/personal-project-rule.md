# MyStockFolio 프로젝트 코딩 규칙

## 🎯 프로젝트 개요
- **프로젝트명**: MyStockFolio (주식 포트폴리오 관리 시스템)
- **기술 스택**: Spring Boot (백엔드) + React (프론트엔드)
- **아키텍처**: RESTful API + SPA (Single Page Application)

## 🎯 핵심 원칙

### 1. 안전성 우선
- 기존 작동하는 기능을 절대 손상시키지 않음
- 핵심 기능(인증, 포트폴리오 관리, 자산 관리)은 검증된 상태 유지
- 새로운 코드 추가/수정 시 기존 테스트 코드 보존

### 2. 아키텍처 준수
- Controller-Service-Repository 레이어 분리
- DB 접근은 Repository, 비즈니스 로직은 Service
- 외부 API 연동은 전용 서비스에 국한

### 3. 코드 품질
- 명확하고 간결한 코드 작성
- 의미있는 변수/함수명 사용 (자산 관련: asset, portfolio, transaction 등)
- 마법의 숫자 사용 금지

## 🖥️ 프론트엔드 규칙 (React)

### 파일 확장자
- **JSX 문법 포함 파일**: `.jsx` 사용
- **로직 파일** (Hooks, Redux, Config, Utility): `.js` 사용

### 상태 관리
- 컴포넌트 간 공유 상태: Redux 사용
- 로그인, 사용자 정보, 포트폴리오 데이터: Redux Store 관리

### 스타일링
- **Tailwind CSS** 클래스 기반 스타일링
- 인라인 스타일 또는 별도 CSS 파일 사용 금지
- 기존 CSS 절대 망가지면 안됨 (중요 사항!)

### API 호출
- 모든 백엔드 API 요청: `axiosInstance` 사용
- JWT 토큰 자동 첨부 로직 준수

### 컴포넌트 구조
- 페이지별 컴포넌트: `pages/` 폴더
- 재사용 가능한 컴포넌트: `components/` 폴더
- 포트폴리오 관련: `pages/portfolio/` 폴더

## ⚙️ 백엔드 규칙 (Spring Boot)

### DTO 사용
- Entity 객체를 Controller에서 직접 사용 금지
- Request/Response 시 반드시 DTO 사용
- 포트폴리오 관련: `PortfolioDto`, `AssetDto` 사용

### 예외 처리
- 커스텀 예외 클래스 정의
- `@ControllerAdvice`로 전역 예외 처리
- HTTP 상태 코드 명확한 매핑

### 트랜잭션
- DB 쓰기/수정/삭제 Service 메소드: `@Transactional` 사용
- 조회 전용 로직: `@Transactional(readOnly = true)` 권장

### 보안
- 권한 필요 API: Spring Security로 보호
- JWT 토큰 검증 필수

### 도메인 설계
- **User**: 사용자 정보
- **Portfolio**: 포트폴리오 정보
- **Asset**: 자산 정보 (주식, 현금 등)
- **Transaction**: 거래 내역

## 📊 비즈니스 로직 규칙

### 포트폴리오 관리
- 사용자별 포트폴리오는 독립적으로 관리
- 자산 추가/수정/삭제 시 포트폴리오 총액 자동 계산
- 거래 내역은 변경 불가 (읽기 전용)

### 자산 관리
- 자산 종류: 주식, 현금, 기타 투자상품
- 실시간 가격 정보는 외부 API 연동
- 자산별 수익률 계산 로직 구현

### 인증/인가
- JWT 토큰 기반 인증
- 토큰 만료 시 자동 갱신
- 사용자별 데이터 접근 권한 검증

## 🤖 Cursor AI 사용 지침

### 코드 제시 방식
- 새로운/수정된 코드는 전체 파일 내용을 코드 블록으로 제시
- 파일명과 수정 목적을 간결하게 설명

### 오류 해결
- 컴파일 오류 시 근본 원인 분석
- 기존 기능 유지하면서 관련 파일들을 한 번에 수정

### 경로 관리
- Import 경로는 상대 경로 사용
- 파일 확장자 규칙 준수

## 📁 프로젝트 구조

```
MyStockFolio/
├── backend/                    # Spring Boot 백엔드
│   ├── src/main/java/com/mystockfolio/backend/
│   │   ├── controller/         # API 컨트롤러
│   │   ├── service/           # 비즈니스 로직
│   │   ├── repository/        # 데이터 접근
│   │   ├── domain/entity/     # 엔티티
│   │   └── dto/              # 데이터 전송 객체
├── frontend/                   # React 프론트엔드
│   ├── src/
│   │   ├── pages/            # 페이지 컴포넌트
│   │   ├── components/       # 재사용 컴포넌트
│   │   ├── api/             # API 호출 로직
│   │   └── modules/         # Redux 모듈
└── .cursor/rules/            # Cursor AI 규칙 파일
```

## ⚠️ 주의사항

- 보안 정보(비밀번호, 토큰)는 코드에 하드코딩 금지
- 민감 정보는 환경 변수 또는 설정 파일로 관리
- 모든 변경사항은 기존 기능에 영향을 주지 않도록 주의
- 포트폴리오 데이터는 정확성과 일관성이 중요하므로 신중하게 처리