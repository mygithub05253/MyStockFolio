# MyStockFolio

**클라우드 네이티브 MSA + ERC-20 블록체인 기반 자산 관리 플랫폼**

MyStockFolio는 전통적인 금융 자산(주식, 채권 등)과 암호화폐 자산을 통합 관리할 수 있는 차세대 포트폴리오 관리 시스템입니다. 마이크로서비스 아키텍처(MSA)와 블록체인 기술을 결합하여 확장 가능하고 안전한 자산 관리 경험을 제공합니다.

---

## 📋 목차

- [프로젝트 개요](#-프로젝트-개요)
- [핵심 기능](#-핵심-기능)
- [기술 스택](#-기술-스택)
- [시스템 아키텍처](#-시스템-아키텍처)
- [프로젝트 구조](#-프로젝트-구조)
- [설치 및 실행](#-설치-및-실행)
- [API 문서](#-api-문서)
- [개발 로드맵](#-개발-로드맵)
- [기여 방법](#-기여-방법)
- [라이선스](#-라이선스)

---

## 🎯 프로젝트 개요

### 비전
전통 금융과 블록체인 기술을 융합하여 차세대 자산 관리 플랫폼을 구축합니다.

### 핵심 가치
- **통합 관리**: 주식, 채권, 암호화폐를 하나의 플랫폼에서 관리
- **투명성**: 블록체인 기반 거래 내역으로 투명한 자산 추적
- **확장성**: MSA 기반 아키텍처로 무한 확장 가능
- **보안**: JWT 인증 + 블록체인 암호화로 이중 보안

---

## 🚀 핵심 기능

### ✅ Phase 1: 기본 기능 (완료)
- [x] 사용자 인증/인가 (JWT)
- [x] OAuth2 소셜 로그인 (Google, Naver, Kakao)
- [x] MetaMask 지갑 연동 로그인
- [x] 포트폴리오 생성 및 관리
- [x] 자산 추가/수정/삭제
- [x] 대시보드 (총 자산, 수익률, 자산 분포)
- [x] HTS 스타일 시장 탐색 페이지
- [x] 실시간 시세 조회 (주식, 암호화폐)

### 🔄 Phase 2: MSA 인프라 (진행 중)
- [x] FastAPI 기반 Market Data Service
- [ ] Spring Cloud Gateway (API Gateway)
- [ ] Service Discovery (Eureka/Consul)
- [ ] Config Server (중앙 설정 관리)
- [ ] Circuit Breaker (Resilience4j)
- [ ] Distributed Tracing (Zipkin/Jaeger)

### 🔮 Phase 3: 블록체인/Web3 확장 (예정)
- [ ] ERC-20 토큰 발행 (MSF Token)
- [ ] 스마트 컨트랙트 배포 (Solidity)
- [ ] Web3.js 통합
- [ ] NFT 기반 자산 증명서
- [ ] DeFi 프로토콜 연동

---

## 🛠 기술 스택

### Frontend
- **Framework**: React 18.3.1
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Charts**: Chart.js
- **Routing**: React Router v6

### Backend - Main Service (Spring Boot)
- **Framework**: Spring Boot 3.4.1
- **Security**: Spring Security + JWT
- **OAuth2**: Spring Security OAuth2 Client
- **Database**: MySQL 8.0
- **ORM**: Spring Data JPA (Hibernate)
- **Build Tool**: Gradle

### Backend - Market Data Service (FastAPI)
- **Framework**: FastAPI 0.115.6
- **Data Source**: Yahoo Finance API (yfinance)
- **CORS**: FastAPI CORS Middleware
- **Server**: Uvicorn

### Blockchain (예정)
- **Platform**: Ethereum (Sepolia Testnet)
- **Smart Contract**: Solidity
- **Web3 Library**: Web3.js, Ethers.js
- **Wallet**: MetaMask

### DevOps & Infrastructure
- **Containerization**: Docker
- **Orchestration**: Kubernetes (예정)
- **CI/CD**: GitHub Actions (예정)
- **Monitoring**: Prometheus + Grafana (예정)

---

## 🏗 시스템 아키텍처

### 현재 아키텍처 (Phase 1-2)

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│                    React + Redux + Tailwind                  │
│                      (Port: 3000)                            │
└────────────┬────────────────────────────┬───────────────────┘
             │                            │
             │ REST API                   │ REST API
             │ (JWT Auth)                 │ (Market Data)
             │                            │
┌────────────▼────────────┐    ┌─────────▼──────────────────┐
│   Backend Main Service  │    │  Market Data Service       │
│   Spring Boot + MySQL   │    │  FastAPI + Yahoo Finance   │
│   (Port: 8080)          │    │  (Port: 8001)              │
│                         │    │                            │
│  - User Management      │    │  - Real-time Quotes        │
│  - Portfolio CRUD       │    │  - Chart Data              │
│  - JWT Auth             │    │  - Market Search           │
│  - OAuth2 (G/N/K)       │    │                            │
│  - MetaMask Auth        │    │                            │
└─────────────────────────┘    └────────────────────────────┘
```

### 목표 아키텍처 (Phase 3)

```
                    ┌──────────────────┐
                    │   API Gateway    │
                    │  (Spring Cloud)  │
                    └────────┬─────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼────────┐  ┌───────▼────────┐  ┌───────▼────────┐
│  Auth Service  │  │ Market Service │  │ Blockchain API │
│  (Spring Boot) │  │   (FastAPI)    │  │   (Node.js)    │
└────────────────┘  └────────────────┘  └───────┬────────┘
                                                 │
                                        ┌────────▼────────┐
                                        │  Ethereum Net   │
                                        │  (Smart Contract)│
                                        └─────────────────┘
```

---

## 📁 프로젝트 구조

```
MyStockFolio/
├── frontend/                    # React 프론트엔드
│   ├── public/
│   ├── src/
│   │   ├── api/                # API 클라이언트 (axios)
│   │   ├── components/         # 재사용 가능한 컴포넌트
│   │   ├── pages/              # 페이지 컴포넌트
│   │   │   ├── auth/           # 인증 관련 (로그인, 회원가입, OAuth2)
│   │   │   ├── dashboard/      # 대시보드
│   │   │   ├── portfolio/      # 포트폴리오 관리
│   │   │   ├── market/         # HTS 스타일 시장 탐색
│   │   │   └── ...
│   │   ├── modules/            # Redux 모듈
│   │   ├── routes/             # 라우팅 설정
│   │   └── ...
│   ├── package.json
│   └── tailwind.config.js
│
├── backend/                     # Spring Boot 백엔드
│   ├── src/main/
│   │   ├── java/com/mystockfolio/backend/
│   │   │   ├── config/         # Spring Security, CORS, JWT 설정
│   │   │   ├── controller/     # REST API 컨트롤러
│   │   │   ├── service/        # 비즈니스 로직
│   │   │   ├── repository/     # JPA Repository
│   │   │   ├── entity/         # JPA Entity (User, Portfolio, Asset)
│   │   │   ├── dto/            # Data Transfer Object
│   │   │   └── ...
│   │   └── resources/
│   │       ├── application.properties
│   │       └── application.properties.example
│   ├── build.gradle
│   ├── .env.example
│   └── ...
│
├── market-data-svc/             # FastAPI 시장 데이터 서비스
│   ├── app/
│   │   ├── main.py             # FastAPI 메인 애플리케이션
│   │   └── ...
│   ├── requirements.txt
│   └── ...
│
├── blockchain-api/              # (예정) Node.js + Web3 블록체인 API
│   └── ...
│
├── mystockfolio_db_complete.sql # MySQL 데이터베이스 스키마
├── OAUTH2_SETUP_GUIDE.md        # OAuth2 설정 가이드
├── .gitignore
└── README.md
```

---

## 🚀 설치 및 실행

### 사전 요구사항

- **Node.js**: v18 이상
- **Java**: JDK 17 이상
- **Python**: 3.9 이상
- **MySQL**: 8.0 이상
- **Gradle**: 8.0 이상 (또는 Gradle Wrapper 사용)

### 1. 데이터베이스 설정

```bash
# MySQL 접속
mysql -u root -p

# 데이터베이스 생성 및 스키마 적용
source mystockfolio_db_complete.sql
```

### 2. Backend (Spring Boot) 실행

```bash
cd backend

# 환경변수 설정 (중요!)
cp .env.example .env
# .env 파일을 열어 실제 값으로 수정:
# - DB_USERNAME, DB_PASSWORD
# - JWT_SECRET
# - GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
# - NAVER_CLIENT_ID, NAVER_CLIENT_SECRET
# - KAKAO_CLIENT_ID, KAKAO_CLIENT_SECRET

# Gradle 빌드 및 실행
./gradlew bootRun

# 또는 JAR 파일 생성 후 실행
./gradlew build
java -jar build/libs/backend-0.0.1-SNAPSHOT.jar
```

**Backend 실행 확인**: http://localhost:8080

### 3. Market Data Service (FastAPI) 실행

```bash
cd market-data-svc

# 가상환경 생성 및 활성화
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 의존성 설치
pip install -r requirements.txt

# FastAPI 서버 실행
uvicorn app.main:app --reload --port 8001
```

**FastAPI 문서 확인**: http://localhost:8001/docs

### 4. Frontend (React) 실행

```bash
cd frontend

# 의존성 설치
npm install

# 개발 서버 실행
npm start
```

**Frontend 접속**: http://localhost:3000

---

## 📚 API 문서

### Backend Main Service (Spring Boot)

#### 인증 API
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
- `GET /api/auth/me` - 현재 사용자 정보 조회
- `POST /api/auth/metamask` - MetaMask 로그인
- `GET /api/auth/metamask/nonce` - MetaMask 논스 발급

#### OAuth2 소셜 로그인
- `GET /oauth2/authorization/google` - Google 로그인
- `GET /oauth2/authorization/naver` - Naver 로그인
- `GET /oauth2/authorization/kakao` - Kakao 로그인
- `GET /oauth2/callback` - OAuth2 콜백 (프론트엔드)
- `POST /api/auth/oauth2/register` - OAuth2 회원가입

#### 포트폴리오 API
- `GET /api/portfolios` - 포트폴리오 목록 조회
- `POST /api/portfolios` - 포트폴리오 생성
- `GET /api/portfolios/{id}` - 포트폴리오 상세 조회
- `PUT /api/portfolios/{id}` - 포트폴리오 수정
- `DELETE /api/portfolios/{id}` - 포트폴리오 삭제

#### 자산 API
- `POST /api/portfolios/{portfolioId}/assets` - 자산 추가
- `PUT /api/portfolios/{portfolioId}/assets/{assetId}` - 자산 수정
- `DELETE /api/portfolios/{portfolioId}/assets/{assetId}` - 자산 삭제

#### 대시보드 API
- `GET /api/dashboard/stats` - 대시보드 통계 조회

### Market Data Service (FastAPI)

#### 시세 조회 API
- `GET /api/market/price?ticker={TICKER}` - 현재가 조회
- `GET /api/market/chart?ticker={TICKER}&period={PERIOD}` - 차트 데이터 조회
- `GET /api/market/quote?ticker={TICKER}` - 상세 시세 정보 조회 (HTS 스타일)

**예시**:
```bash
# 애플 주식 현재가
curl http://localhost:8001/api/market/price?ticker=AAPL

# 비트코인 30일 차트
curl http://localhost:8001/api/market/chart?ticker=BTC-USD&period=1mo

# 삼성전자 상세 시세
curl http://localhost:8001/api/market/quote?ticker=005930.KS
```

**Swagger UI**: http://localhost:8001/docs

---

## 🗺 개발 로드맵

### ✅ Phase 1: 기본 기능 구현 (완료)
- [x] 프로젝트 초기 설정
- [x] 데이터베이스 스키마 설계
- [x] JWT 인증 시스템
- [x] OAuth2 소셜 로그인 (Google, Naver, Kakao)
- [x] MetaMask 지갑 연동
- [x] 포트폴리오 CRUD
- [x] 대시보드 UI
- [x] HTS 스타일 시장 탐색 페이지
- [x] FastAPI Market Data Service

### 🔄 Phase 2: MSA 인프라 구축 (진행 중)
- [x] FastAPI 마이크로서비스 분리
- [ ] Spring Cloud Gateway 도입
- [ ] Service Discovery (Eureka)
- [ ] Config Server
- [ ] Circuit Breaker (Resilience4j)
- [ ] Docker Compose 구성
- [ ] Kubernetes 배포 준비

### 🔮 Phase 3: 블록체인/Web3 확장 (예정)
- [ ] Solidity 스마트 컨트랙트 개발
- [ ] ERC-20 토큰 발행 (MSF Token)
- [ ] Web3.js 통합
- [ ] MetaMask 트랜잭션 서명
- [ ] NFT 기반 자산 증명서
- [ ] DeFi 프로토콜 연동 (Uniswap, Aave 등)

### 🚀 Phase 4: 프로덕션 배포 (예정)
- [ ] CI/CD 파이프라인 구축
- [ ] AWS/GCP 클라우드 배포
- [ ] 모니터링 시스템 (Prometheus + Grafana)
- [ ] 로그 수집 (ELK Stack)
- [ ] 성능 최적화
- [ ] 보안 강화 (HTTPS, Rate Limiting)

---

## 🔐 보안 설정

### 환경변수 관리

**⚠️ 중요**: 민감한 정보는 절대 Git에 커밋하지 마세요!

#### Backend 환경변수 설정

1. `backend/.env.example`을 복사하여 `backend/.env` 생성
2. 실제 값으로 수정:

```env
# 데이터베이스
DB_USERNAME=root
DB_PASSWORD=your-actual-password

# JWT
JWT_SECRET=your-very-long-and-secure-secret-key-at-least-32-characters

# OAuth2
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NAVER_CLIENT_ID=your-naver-client-id
NAVER_CLIENT_SECRET=your-naver-client-secret
KAKAO_CLIENT_ID=your-kakao-client-id
KAKAO_CLIENT_SECRET=your-kakao-client-secret
```

3. OAuth2 클라이언트 ID/Secret 발급 방법은 `OAUTH2_SETUP_GUIDE.md` 참고

### .gitignore 설정

다음 파일들은 Git에서 제외됩니다:
- `*.env` - 모든 환경변수 파일
- `backend/src/main/resources/application.properties` - 실제 설정 파일
- `.cursor/` - AI 설정 파일

---

## 🧪 테스트

### Backend 테스트

```bash
cd backend
./gradlew test
```

### Frontend 테스트

```bash
cd frontend
npm test
```

---

## 📊 주요 화면

### 1. 로그인 페이지
- 이메일/비밀번호 로그인
- OAuth2 소셜 로그인 (Google, Naver, Kakao)
- MetaMask 지갑 연동 로그인

### 2. 대시보드
- 총 자산 현황
- 수익률 차트 (Pie Chart, Line Chart)
- 자산 분포 (주식, 암호화폐 등)
- 최근 거래 내역

### 3. 포트폴리오 관리
- 포트폴리오 생성/수정/삭제
- 자산 추가/수정/삭제
- 자산 상세 정보 모달

### 4. 시장 탐색 (HTS 스타일)
- 실시간 시세 조회
- 종목 검색
- 시가/고가/저가/거래량 정보
- 차트 데이터 (최근 30일)
- 호가 정보 (향후 구현)

---

## 🤝 기여 방법

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 커밋 메시지 규칙

```
[Type] Subject

Body (optional)

Footer (optional)
```

**Type**:
- `feat`: 새로운 기능 추가
- `fix`: 버그 수정
- `docs`: 문서 수정
- `style`: 코드 포맷팅, 세미콜론 누락 등
- `refactor`: 코드 리팩토링
- `test`: 테스트 코드 추가
- `chore`: 빌드 업무, 패키지 매니저 설정 등

**예시**:
```
[feat] Add MetaMask wallet login

- Implement Web3 signature verification
- Add nonce generation for security
- Update frontend login page

Closes #42
```

---

## 📝 라이선스

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 팀

- **Backend Developer**: Spring Boot, MySQL, JWT, OAuth2
- **Frontend Developer**: React, Redux, Tailwind CSS
- **Blockchain Developer**: Solidity, Web3.js (예정)
- **DevOps Engineer**: Docker, Kubernetes (예정)

---

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 등록해주세요.

- **GitHub Issues**: [MyStockFolio Issues](https://github.com/yourusername/MyStockFolio/issues)
- **Email**: your.email@example.com

---

## 🙏 감사의 말

이 프로젝트는 다음 오픈소스 프로젝트들의 도움을 받았습니다:

- [Spring Boot](https://spring.io/projects/spring-boot)
- [React](https://reactjs.org/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [Yahoo Finance API](https://github.com/ranaroussi/yfinance)
- [Chart.js](https://www.chartjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**⭐ 이 프로젝트가 도움이 되셨다면 Star를 눌러주세요!**

