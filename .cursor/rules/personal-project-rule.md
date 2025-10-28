# MyStockFolio 프로젝트 코딩 규칙

## 🎯 프로젝트 개요
- **프로젝트명**: MyStockFolio (종합 자산 관리 및 블록체인 리워드 플랫폼)
- **학기 목표**: 클라우드 네이티브 MSA + ERC-20 기반 블록체인 통합
- **기술 스택**: Spring Boot (백엔드) + React (프론트엔드) + FastAPI (시장 데이터) + Node.js (블록체인)
- **아키텍처**: Cloud Native MSA (5-Container) + Web3/Blockchain
- **현재 상태**: JWT 인증/인가 풀스택 연동 완료, 시스템 안정화 단계

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

## 🏗️ 시스템 아키텍처 (Cloud Native MSA)

프로젝트는 5개의 독립된 컨테이너로 분리되어 Docker 및 Kubernetes 환경에 배포됩니다.

### 컨테이너 구성
- **C1: frontend** (React/Redux)
  - 역할: 사용자 경험(UX) 및 인터페이스 전담
  - 기능: JWT 토큰 활용 클라이언트 세션 관리

- **C2: backend** (Spring Boot)
  - 역할: 시스템 중앙 제어 및 핵심 로직
  - 기능: 사용자/포트폴리오/자산 관리 (CRUD), 인증/인가
  - 게이트웨이: C3, C4, C5 서비스 호출 중계

- **C3: market-data-svc** (FastAPI/Python)
  - 역할: 외부 금융 API 연동 전담
  - 기능: 주식/코인 시세, 차트 데이터 수집 및 가공

- **C4: blockchain-api** (Node.js/Web3)
  - 역할: Solidity 컨트랙트 통신 전담
  - 기능: 토큰 잔액 조회, 리워드 트랜잭션 전송

- **C5: notification-svc** (Node.js/Spring WebFlux)
  - 역할: 실시간 알림 기능 제공
  - 기능: WebSocket/SSE 통신 전담 (차후 구현)

### 인프라
- **데이터베이스**: MySQL (mystockfolio_db)
- **로컬 개발**: `infra/docker-compose.yaml`
- **배포 환경**: `infra/kubernetes/` (설정 파일 예정)

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

## 🤖 Cursor AI 사용 지침 및 전략

### ⚠️ 중요: AI 활용 이중 전략

이 프로젝트는 두 학기 과제를 동시에 만족시켜야 하므로, AI 활용 범위를 전략적으로 구분합니다.

#### ✅ 적극 활용 영역 (블록체인 과제)
- Solidity 컨트랙트 코드 작성
- Node.js 기반 blockchain-api 서비스 구현
- Web3 및 블록체인 연동 로직
- ERC-20 토큰 관련 모든 기능

#### ⚠️ 최소 활용 영역 (클라우드 네이티브 과제)
- Spring Boot 핵심 비즈니스 로직
- Kubernetes YAML 설정 (컨테이너 오케스트레이션)
- DevOps 파이프라인 설정
- FastAPI 마이크로서비스 구현

### 🔒 증적 관리 원칙 (매우 중요!)

AI 사용 흔적이 드러나지 않도록 철저히 관리합니다.

#### 커밋 메시지 작성 규칙
- ❌ **절대 금지**: "AI generated", "Cursor", "ChatGPT", "AI assisted" 등의 단어
- ✅ **권장**: 달성한 기능 중심으로 작성
  - 예: `"FE: Redux를 통한 JWT 401 자동 로그아웃 로직 구현"`
  - 예: `"BE: 포트폴리오 CRUD API 엔드포인트 추가"`
  - 예: `"Blockchain: ERC-20 FolioToken 컨트랙트 배포"`

#### 파일 관리
- `.cursor/` 폴더는 **반드시** `.gitignore`에 추가
- AI 설정 관련 파일은 Git 커밋 대상에서 완전히 제외
- 프로젝트 제출 시 AI 관련 메타데이터 전부 제거

#### 코드 스타일
- AI 생성 코드를 그대로 사용하지 말고 반드시 검토 및 정제
- 주석 스타일과 변수명을 일관되게 유지
- 개발자가 직접 작성한 듯한 자연스러운 코드로 가공

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
├── backend/                    # C2: Spring Boot 백엔드 (게이트웨이)
│   ├── src/main/java/com/mystockfolio/backend/
│   │   ├── controller/         # API 컨트롤러
│   │   ├── service/           # 비즈니스 로직
│   │   ├── repository/        # 데이터 접근
│   │   ├── domain/entity/     # 엔티티
│   │   └── dto/              # 데이터 전송 객체
├── frontend/                   # C1: React 프론트엔드
│   ├── src/
│   │   ├── pages/            # 페이지 컴포넌트
│   │   ├── components/       # 재사용 컴포넌트
│   │   ├── api/             # API 호출 로직
│   │   └── modules/         # Redux 모듈
├── market-data-svc/           # C3: FastAPI 시장 데이터 서비스 (예정)
├── blockchain-api/            # C4: Node.js 블록체인 API (예정)
│   └── contracts/            # Solidity 컨트랙트
├── notification-svc/          # C5: 실시간 알림 서비스 (예정)
├── infra/                     # 인프라 설정
│   ├── docker-compose.yaml   # 로컬 개발 환경
│   └── kubernetes/           # K8s 배포 설정 (예정)
└── .cursor/rules/            # Cursor AI 규칙 파일
```

## ✅ 현재 진행 현황 (Completed Milestones)

| 영역 | 기능 | 구현 상세 |
|------|------|----------|
| 인증 시스템 | JWT 풀스택 연동 | 백엔드 JWT 발급/검증, FE `axiosInstance.js` 통한 요청 헤더 자동 첨부, 401 Unauthorized 시 자동 로그아웃 처리 완료 |
| FE 상태 관리 | Redux 통합 | `user.js` 모듈 통한 로그인 상태(`isLoggedIn`) 및 사용자 정보(`userInfo`) 전역 관리 완료 |
| UI 제어 | 조건부 렌더링 | `Layout.jsx`에서 `isLoggedIn` 상태에 따라 하단 네비게이션 바 표시/숨김 처리 완료 |
| 개발 표준 | 확장자 표준화 | `.js` (로직)와 `.jsx` (뷰) 확장자 구분 및 파일명 변경 완료 |

## 🗺️ 향후 개발 로드맵 (Roadmap)

### P1. 프론트엔드 안정화 및 메인 UI (최우선 순위)

| 목표 | 대상 파일 | 구현 상세 목표 |
|------|----------|---------------|
| FE 라우팅 분기 | `router.js`, `Layout.jsx` | 루트 경로(`/`) 접속 시 로그인 상태에 따라 `Dashboard.jsx` 또는 `Main.jsx`로 즉시 리다이렉션 |
| 회원가입 API 연동 | `SignUp.jsx` | `POST /api/auth/register` API 호출 및 성공 시 `/signin`으로 이동 |
| 메인 UI 개선 | `Main.jsx` | 로그인/회원가입 버튼 간격 조정 (Tailwind CSS) |

### P2. 마이크로서비스 인프라 구축 및 코어 연동

| 목표 | 대상 서비스 | 구현 상세 목표 |
|------|------------|---------------|
| Market-Data 환경 | `market-data-svc` (FastAPI) | FastAPI 환경 구성(Dockerfile, requirements.txt) 및 기본 테스트 엔드포인트 |
| 포트폴리오 연동 | FE: `PortfolioContainer.jsx` | 자산 목록 조회(`GET /api/portfolios`), 신규 포트폴리오/자산 추가 FE-BE 연동 |
| 시장 데이터 연동 | BE: `backend` | `GET /api/market/{ticker}` 구현, 내부적으로 C3 호출하여 시세 데이터 전달 |

### P3. 블록체인 및 Web3 확장 (과제 목적)

| 목표 | 대상 파일 | 구현 상세 목표 |
|------|----------|---------------|
| ERC-20 컨트랙트 | `blockchain/contracts/FolioToken.sol` | 자체 리워드 로직 포함한 Solidity 컨트랙트 개발 |
| Web3 API 구축 | `blockchain-api` (Node.js) | 컨트랙트 잔액 조회 API 구현 및 C2(backend)와 통신 프로토콜 정의 |
| 분석 및 차트 | `Dashboard.jsx`, `backend` | 대시보드 통계 계산 API 구현 및 실제 시장 데이터 활용 차트 렌더링 |
| 소셜 로그인 | `backend`, FE | Naver OAuth2 연동 및 MetaMask 지갑 인증 연동 |

## ⚠️ 주의사항

- 보안 정보(비밀번호, 토큰)는 코드에 하드코딩 금지
- 민감 정보는 환경 변수 또는 설정 파일로 관리
- 모든 변경사항은 기존 기능에 영향을 주지 않도록 주의
- 포트폴리오 데이터는 정확성과 일관성이 중요하므로 신중하게 처리
- AI 관련 흔적(`.cursor/` 등)은 반드시 `.gitignore`에 추가