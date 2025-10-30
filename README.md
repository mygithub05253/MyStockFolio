# 🚀 MyStockFolio

**클라우드 네이티브 MSA와 ERC-20 블록체인을 결합한 자산 관리 플랫폼**

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.7-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.x-teal.svg)](https://fastapi.tiangolo.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.x-orange.svg)](https://www.mysql.com/)

## 📋 목차

- [프로젝트 개요](#-프로젝트-개요)
- [시스템 아키텍처](#-시스템-아키텍처)
- [기술 스택](#-기술-스택)
- [빠른 시작](#-빠른-시작)
- [데이터베이스 설정](#-데이터베이스-설정)
- [Backend (C2) 설정](#-backend-c2---spring-boot)
- [Frontend (C1) 설정](#-frontend-c1---react)
- [Market Data Service (C3) 설정](#-market-data-service-c3---fastapi)
- [개발 로드맵](#-개발-로드맵)
- [주요 기능](#-주요-기능)
- [프로젝트 구조](#-프로젝트-구조)
- [API 문서](#-api-문서)
- [보안](#-보안)
- [개발 원칙](#-개발-원칙)
- [트러블슈팅](#-트러블슈팅)

---

## 🎯 프로젝트 개요

MyStockFolio는 **마이크로서비스 아키텍처(MSA)** 와 **블록체인 기술(ERC-20)**을 융합한 차세대 자산 관리 플랫폼입니다.

### 핵심 가치

- 📊 **통합 자산 관리**: 주식, 코인, DeFi, NFT 등 모든 디지털 자산을 한 곳에서
- 🔐 **다양한 인증**: 일반 로그인, OAuth2 소셜 로그인, MetaMask 지갑 연동
- 🎁 **블록체인 리워드**: 활동 기반 ERC-20 토큰(FOLIO) 보상 시스템
- ☁️ **클라우드 네이티브**: 컨테이너 기반 MSA로 확장성과 유연성 극대화

---

## 🏗️ 시스템 아키텍처

### 마이크로서비스 구조 (5개 컨테이너)

```
┌─────────────────────────────────────────────────────────────┐
│                    MyStockFolio Platform                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   C1: FE    │  │   C2: BE    │  │   C3: MKT   │         │
│  │   React     │◄─┤ Spring Boot │◄─┤   FastAPI   │         │
│  │   Redux     │  │  Gateway    │  │ Market Data │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                          │                                    │
│                          │                                    │
│  ┌─────────────┐  ┌─────────────┐                           │
│  │ C4: BC-API  │  │ C5: NOTIFY  │                           │
│  │  Node.js    │  │   Future    │                           │
│  │   Web3.js   │  │  Service    │                           │
│  └─────────────┘  └─────────────┘                           │
│                                                               │
└───────────────────────────┬───────────────────────────────┘
                            │
                    ┌───────┴────────┐
                    │  MySQL 8.x     │
                    │  (Shared DB)   │
                    └────────────────┘
```

### 컨테이너별 역할

| 컨테이너 | 기술 스택 | 역할 | 상태 |
|---------|----------|------|------|
| **C1** | React, Redux, TailwindCSS | 프론트엔드 UI | ✅ 완료 |
| **C2** | Spring Boot, Spring Security, JWT | API 게이트웨이 & 인증 | ✅ 완료 |
| **C3** | FastAPI, Python | 실시간 시장 데이터 | 🚧 진행중 |
| **C4** | Node.js, Web3.js | 블록체인 API | 📋 예정 |
| **C5** | TBD | 알림 서비스 | 📋 예정 |

---

## 🛠️ 기술 스택

### Frontend (C1)
- **React 18.x**: 컴포넌트 기반 UI
- **Redux Toolkit**: 상태 관리
- **React Router v6**: 라우팅
- **TailwindCSS**: 모바일 우선 반응형 디자인
- **Chart.js**: 데이터 시각화
- **Axios**: HTTP 통신

### Backend (C2)
- **Spring Boot 3.5.7**: RESTful API
- **Spring Security**: JWT + OAuth2 인증
- **Spring Data JPA**: ORM
- **MySQL 8.x**: 관계형 데이터베이스
- **Web3j**: 블록체인 서명 검증
- **Gradle**: 빌드 도구

### Market Data Service (C3)
- **FastAPI**: 고성능 비동기 API
- **Python 3.x**: 데이터 처리
- **Yahoo Finance API**: 실시간 시세

### Blockchain API (C4) - 예정
- **Node.js**: 서버 런타임
- **Web3.js / Ethers.js**: 이더리움 상호작용
- **Hardhat / Truffle**: 스마트 컨트랙트 개발
- **Solidity**: ERC-20 토큰 구현

---

## 🚀 빠른 시작

### 사전 요구사항

- **Node.js** 18.x 이상
- **Java** 17 이상
- **Python** 3.9 이상
- **MySQL** 8.x
- **Git**

### 1. 프로젝트 클론

```bash
git clone https://github.com/yourusername/MyStockFolio.git
cd MyStockFolio
```

---

## 💾 데이터베이스 설정

### 1. MySQL 접속

```bash
mysql -u root -p
```

### 2. 스키마 실행

```bash
# 프로젝트 루트에서
source mystockfolio_db_complete.sql

# 또는
mysql -u root -p < mystockfolio_db_complete.sql
```

### 3. 데이터 확인

```sql
USE mystockfolio_db;
SHOW TABLES;
SELECT * FROM users;
```

### 📊 DB 스키마 구조

#### users 테이블

| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | PK |
| email | VARCHAR(100) | 이메일 (Unique) |
| password | VARCHAR(255) | 비밀번호 해시 (OAuth2는 NULL) |
| nickname | VARCHAR(50) | 닉네임 |
| wallet_address | VARCHAR(42) | 지갑 주소 |
| provider | VARCHAR(20) | mystockfolio, google, naver, kakao, metamask |
| provider_id | VARCHAR(100) | OAuth2 제공자 ID |
| is_oauth2_signup | BOOLEAN | OAuth2 회원가입 여부 (추가 정보 입력 필요) |

#### portfolio 테이블

| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | PK |
| user_id | BIGINT | FK → users.id |
| name | VARCHAR(50) | 포트폴리오 이름 |

#### asset 테이블

| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | PK |
| portfolio_id | BIGINT | FK → portfolio.id |
| asset_type | VARCHAR(15) | STOCK, COIN, STABLECOIN, DEFI, NFT, OTHER |
| ticker | VARCHAR(20) | 티커 심볼 |
| name | VARCHAR(100) | 자산 이름 |
| quantity | DOUBLE | 보유 수량 |
| avgBuyPrice | DOUBLE | 평균 매입가 |

### 👤 샘플 계정

| 이메일 | 비밀번호 | 닉네임 | Provider |
|--------|---------|--------|----------|
| dev@mystockfolio.com | password123 | Developer | local |
| test@mystockfolio.com | password123 | Tester | local |

---

## 🔧 Backend (C2) - Spring Boot

### 1. application.properties 설정

`backend/src/main/resources/application.properties`:

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/mystockfolio_db
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD

# JWT
jwt.secret=yourVerySecretKeyWhichShouldBeLongAndSecure
jwt.expiration-ms=3600000

# FastAPI (Market Data Service)
market.data.url=http://127.0.0.1:8001
```

### 2. 환경변수 설정 (보안) 🔐

> **중요**: 민감한 정보는 환경변수로 관리하여 보안을 강화합니다.

#### 환경변수 설정 방법

**Windows (PowerShell)**:
```powershell
# 시스템 환경변수 설정
$env:DB_PASSWORD="your_secure_password"
$env:JWT_SECRET="your_very_long_and_secure_jwt_secret_key"
$env:GOOGLE_CLIENT_ID="your_google_client_id"
$env:GOOGLE_CLIENT_SECRET="your_google_client_secret"
$env:NAVER_CLIENT_ID="your_naver_client_id"
$env:NAVER_CLIENT_SECRET="your_naver_client_secret"
$env:KAKAO_CLIENT_ID="your_kakao_client_id"
$env:KAKAO_CLIENT_SECRET="your_kakao_client_secret"
```

**Linux/macOS**:
```bash
# .env 파일 생성 (backend 폴더에)
cat > backend/.env << EOF
DB_PASSWORD=your_secure_password
JWT_SECRET=your_very_long_and_secure_jwt_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NAVER_CLIENT_ID=your_naver_client_id
NAVER_CLIENT_SECRET=your_naver_client_secret
KAKAO_CLIENT_ID=your_kakao_client_id
KAKAO_CLIENT_SECRET=your_kakao_client_secret
EOF
```

### 3. OAuth2 설정 (선택사항) ⚠️

> **현재 상태**: OAuth2는 기본적으로 **비활성화**되어 있습니다.  
> 소셜 로그인을 사용하려면 아래 단계를 따라 설정하세요.

#### Google OAuth2
1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. **사용자 인증 정보 만들기 > OAuth 2.0 클라이언트 ID**
3. 승인된 리디렉션 URI: `http://localhost:8080/login/oauth2/code/google`
4. **Client ID**와 **Client Secret** 복사

#### Naver OAuth2
1. [네이버 개발자 센터](https://developers.naver.com/apps/) 접속
2. **애플리케이션 등록**
3. Callback URL: `http://localhost:8080/login/oauth2/code/naver`
4. **Client ID**와 **Client Secret** 복사

#### Kakao OAuth2
1. [Kakao Developers](https://developers.kakao.com/) 접속
2. **내 애플리케이션 > 카카오 로그인**
3. Redirect URI: `http://localhost:8080/login/oauth2/code/kakao`
4. **REST API 키**(Client ID)와 **Client Secret** 복사

**OAuth2 활성화 후**:
- 환경변수에 OAuth2 정보 설정
- 백엔드 재시작
- 프론트엔드 `SignIn.jsx`의 `handleSocialLogin` 함수에서 주석 부분 수정

### 4. 빌드 & 실행

```bash
cd backend

# 빌드
./gradlew clean build

# 실행
./gradlew bootRun

# 서버: http://localhost:8080
```

### 📁 Backend 패키지 구조

```
backend/src/main/java/com/mystockfolio/backend/
├── config/                         # 설정 클래스
│   ├── SecurityConfig.java         # Spring Security
│   ├── WebClientConfig.java        # WebClient
│   ├── JwtAuthenticationFilter.java
│   └── oauth2/                     # OAuth2 관련 클래스
│       ├── CustomOAuth2UserService.java
│       ├── OAuth2SuccessHandler.java
│       ├── OAuth2UserInfo.java
│       ├── GoogleOAuth2UserInfo.java
│       ├── NaverOAuth2UserInfo.java
│       └── KakaoOAuth2UserInfo.java
├── controller/                     # REST API
│   ├── AuthController.java
│   ├── DashboardController.java
│   ├── PortfolioController.java
│   └── AssetController.java
├── service/                        # 비즈니스 로직
│   ├── AuthService.java
│   ├── MetaMaskService.java
│   ├── DashboardService.java
│   ├── PortfolioService.java
│   └── AssetService.java
├── repository/                     # JPA
│   ├── UserRepository.java
│   ├── PortfolioRepository.java
│   └── AssetRepository.java
├── domain/entity/                  # 엔티티
│   ├── User.java
│   ├── Portfolio.java
│   └── Asset.java
├── dto/                            # DTO
│   ├── AuthDto.java
│   ├── MetaMaskDto.java
│   ├── DashboardDto.java
│   ├── PortfolioDto.java
│   └── AssetDto.java
├── client/                         # 외부 API
│   └── MarketDataClient.java
├── exception/                      # 예외 처리
│   └── GlobalExceptionHandler.java
└── util/
    └── JwtTokenProvider.java
```

---

## 🎨 Frontend (C1) - React

### 1. 의존성 설치 & 실행

```bash
cd frontend

# 설치
npm install

# 개발 서버 실행
npm start

# 서버: http://localhost:3000
```

### 2. 빌드 (운영)

```bash
npm run build
# build/ 폴더에 최적화된 빌드 생성
```

### 📁 Frontend 폴더 구조

```
frontend/src/
├── api/
│   └── axiosInstance.js          # Axios 설정
├── assets/
│   └── images/                   # 이미지 리소스
├── components/                   # 재사용 컴포넌트
│   ├── button/
│   │   └── BasicButton.jsx
│   └── modal/
│       └── AssetDetailModal.jsx
├── pages/                        # 페이지 컴포넌트
│   ├── auth/
│   │   └── OAuth2Callback.jsx    # OAuth2 콜백
│   ├── dashboard/
│   │   └── Dashboard.jsx         # 대시보드
│   ├── layout/
│   │   └── Layout.jsx            # 레이아웃 (네비게이션)
│   ├── main/
│   │   └── Main.jsx              # 메인 페이지
│   ├── market/
│   │   └── Market.jsx            # 시장 정보
│   ├── myPage/
│   │   └── MyPage.jsx            # 마이페이지
│   ├── portfolio/
│   │   ├── PortfolioContainer.jsx
│   │   ├── AssetInsert.jsx
│   │   └── AssetItem.jsx
│   ├── rewards/
│   │   └── Rewards.jsx           # 리워드
│   ├── signIn/
│   │   └── SignIn.jsx            # 로그인
│   └── signUp/
│       └── SignUp.jsx            # 회원가입
├── modules/                      # Redux 모듈
│   ├── index.js                  # rootReducer
│   ├── user.js
│   ├── dashboard.js
│   └── portfolio.js
├── routes/
│   └── router.js                 # 라우팅 설정
├── hooks/
│   └── useInput.js
├── store.js                      # Redux 스토어
└── App.jsx                       # 루트 컴포넌트
```

### 🗺️ 페이지 구조

| 경로 | 컴포넌트 | 설명 | 인증 필요 |
|------|---------|------|-----------|
| `/` | Main.jsx | 메인 페이지 | ❌ |
| `/signin` | SignIn.jsx | 로그인 | ❌ |
| `/signup` | SignUp.jsx | 회원가입 | ❌ |
| `/oauth2/callback` | OAuth2Callback.jsx | OAuth2 콜백 | ❌ |
| `/dashboard` | Dashboard.jsx | 대시보드 | ✅ |
| `/portfolio` | PortfolioContainer.jsx | 포트폴리오 | ✅ |
| `/market` | Market.jsx | 시장 정보 | ✅ |
| `/rewards` | Rewards.jsx | 리워드 | ✅ |
| `/mypage` | MyPage.jsx | 마이페이지 | ✅ |

### 🔑 로그인 방식

#### 1. 일반 로그인
```javascript
const response = await axiosInstance.post('/api/auth/login', {
    email, password
});
sessionStorage.setItem('accessToken', response.data.accessToken);
```

#### 2. OAuth2 소셜 로그인
```javascript
// Google, Naver, Kakao
window.location.href = `http://localhost:8080/oauth2/authorization/${provider}`;
```

#### 3. MetaMask 지갑 로그인
```javascript
// 1. 계정 연결
const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

// 2. 논스 발급
const { nonce } = await axiosInstance.get('/api/auth/metamask/nonce');

// 3. 서명
const signature = await window.ethereum.request({
    method: 'personal_sign',
    params: [message, walletAddress]
});

// 4. 인증
await axiosInstance.post('/api/auth/metamask', {
    walletAddress, signature, message
});
```

---

## 📊 Market Data Service (C3) - FastAPI

### 1. 가상 환경 & 실행

```bash
cd market-data-svc

# 가상 환경 생성 (선택)
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 의존성 설치
pip install -r requirements.txt

# 서버 실행
uvicorn app.main:app --reload --port 8001

# 서버: http://localhost:8001
# API 문서: http://localhost:8001/docs
```

### 2. API 테스트

```bash
# Health Check
curl http://localhost:8001/

# 시세 조회 (예정)
curl http://localhost:8001/api/market/ticker/AAPL
```

---

## 📅 개발 로드맵

### ✅ P3: 소셜/지갑 로그인 연동 (완료)

- [x] Google, Naver, Kakao OAuth2 통합
- [x] MetaMask 지갑 서명 인증
- [x] JWT 토큰 기반 세션 관리
- [x] sessionStorage 자동 로그아웃
- [x] 사용자 프로필 관리

**기술 포인트**: Spring Security OAuth2, Web3j 서명 검증

### 🚧 P1: 실시간 시장 데이터 (다음 단계)

- [ ] FastAPI 외부 API 연동 (Yahoo Finance)
- [ ] 실시간 시세 조회 API
- [ ] 시장 페이지 UI 구현
- [ ] MarketDataClient WebClient 통신

**기술 포인트**: FastAPI 비동기 처리, Spring WebClient

### 📋 P4: 블록체인 기능 (계획)

- [ ] FolioToken.sol ERC-20 컨트랙트
- [ ] Hardhat 테스트 환경
- [ ] 활동 기반 리워드 Mint
- [ ] 토큰 잔액 조회 API
- [ ] Rewards 페이지 연동

**기술 포인트**: Solidity, Web3.js, Smart Contract

### 📋 P2/P5: 마이페이지 & 최종 완성 (계획)

- [ ] 회원 정보 CRUD API
- [ ] 닉네임/지갑 주소 수정
- [ ] 회원 탈퇴 기능
- [ ] Docker/Kubernetes 배포

---

## ✨ 주요 기능

### 1. 다양한 로그인 방식

| 로그인 방식 | 설명 | 상태 |
|-----------|------|------|
| 일반 로그인 | 이메일 + 비밀번호 | ✅ 사용 가능 |
| Google OAuth2 | 구글 계정 연동 | ⚙️ 설정 필요 |
| Naver OAuth2 | 네이버 계정 연동 | ⚙️ 설정 필요 |
| Kakao OAuth2 | 카카오 계정 연동 | ⚙️ 설정 필요 |
| MetaMask | 지갑 서명 인증 | ✅ 사용 가능 |

### 2. OAuth2 회원가입 플로우

#### 신규 사용자 (OAuth2)
1. **소셜 로그인 클릭** → OAuth2 제공자 페이지로 이동
2. **소셜 계정 로그인** → 백엔드에서 임시 사용자 생성 (`is_oauth2_signup=true`)
3. **추가 정보 입력 페이지** → 닉네임, 지갑 주소 등 입력
4. **회원가입 완료** → JWT 토큰 발급 후 대시보드 이동

#### 기존 사용자 (OAuth2)
1. **소셜 로그인 클릭** → OAuth2 제공자 페이지로 이동
2. **소셜 계정 로그인** → 기존 사용자 정보와 연동
3. **즉시 로그인** → JWT 토큰 발급 후 대시보드 이동

#### 일반 회원가입 사용자
1. **일반 회원가입** → `provider="mystockfolio"`로 설정
2. **소셜 로그인 시도** → 기존 계정에 OAuth2 정보 추가
3. **통합 계정** → 일반 로그인과 소셜 로그인 모두 가능

### 3. 자산 관리

- **포트폴리오 생성**: 여러 개의 포트폴리오 관리
- **자산 추가**: STOCK, COIN, STABLECOIN, DEFI, NFT, OTHER
- **실시간 손익 계산**: 평균 매입가 기반 자동 계산
- **차트 시각화**: Pie Chart, Line Chart

### 4. 대시보드

- 총 자산 가치
- 총 수익률
- 자산 배분 (Pie Chart)
- 자산 추이 (Line Chart)

---

## 📁 프로젝트 구조

```
MyStockFolio/
├── backend/                      # C2: Spring Boot
│   ├── src/main/java/
│   │   └── com/mystockfolio/backend/
│   │       ├── config/          # 설정 (Security, OAuth2)
│   │       ├── controller/      # REST API
│   │       ├── service/         # 비즈니스 로직
│   │       ├── repository/      # JPA
│   │       ├── domain/entity/   # 엔티티
│   │       ├── dto/             # DTO
│   │       └── util/            # 유틸리티
│   └── build.gradle
│
├── frontend/                     # C1: React
│   ├── src/
│   │   ├── api/                 # Axios
│   │   ├── components/          # 재사용 컴포넌트
│   │   ├── pages/               # 페이지
│   │   ├── modules/             # Redux
│   │   └── routes/              # 라우팅
│   └── package.json
│
├── market-data-svc/              # C3: FastAPI
│   ├── app/
│   │   └── main.py
│   └── requirements.txt
│
├── mystockfolio_db_complete.sql  # 통합 DB 스키마
└── README.md                     # 이 파일
```

---

## 📡 API 문서

### 인증 (Auth)

| Method | Endpoint | 설명 | 인증 |
|--------|----------|------|------|
| POST | `/api/auth/register` | 회원가입 | ❌ |
| POST | `/api/auth/login` | 로그인 | ❌ |
| GET | `/api/auth/metamask/nonce` | MetaMask 논스 | ❌ |
| POST | `/api/auth/metamask` | MetaMask 인증 | ❌ |
| POST | `/api/auth/oauth2/complete` | OAuth2 회원가입 완료 | ❌ |

**OAuth2 로그인**:
- Google: `GET /oauth2/authorization/google`
- Naver: `GET /oauth2/authorization/naver`
- Kakao: `GET /oauth2/authorization/kakao`

### 대시보드

| Method | Endpoint | 설명 | 인증 |
|--------|----------|------|------|
| GET | `/api/dashboard/stats` | 통계 조회 | ✅ |

### 포트폴리오

| Method | Endpoint | 설명 | 인증 |
|--------|----------|------|------|
| GET | `/api/portfolio` | 목록 조회 | ✅ |
| POST | `/api/portfolio` | 생성 | ✅ |
| PUT | `/api/portfolio/{id}` | 수정 | ✅ |
| DELETE | `/api/portfolio/{id}` | 삭제 | ✅ |

### 자산

| Method | Endpoint | 설명 | 인증 |
|--------|----------|------|------|
| GET | `/api/asset/portfolio/{portfolioId}` | 목록 조회 | ✅ |
| POST | `/api/asset` | 추가 | ✅ |
| PUT | `/api/asset/{id}` | 수정 | ✅ |
| DELETE | `/api/asset/{id}` | 삭제 | ✅ |

---

## 🔐 보안

### 인증 & 인가

- **JWT 토큰**: 무상태(Stateless) 인증
- **sessionStorage**: 브라우저 닫으면 자동 로그아웃
- **BCrypt**: 비밀번호 암호화
- **CORS**: 허용된 Origin만 접근

### API 보안

- **Bearer Token**: 모든 인증된 요청에 필요
- **401 Unauthorized**: 자동 로그아웃 및 리다이렉트

---

## 🎨 개발 원칙

### 클라우드 네이티브 영역

- **AI 활용 최소화**: 아키텍처 설계와 인프라 구성은 수동
- **컨테이너 분리**: 각 서비스는 독립적으로 배포 가능
- **폴더 구조**: MSA를 고려한 명확한 책임 분리

### 블록체인 영역

- **AI 활용 적극**: 스마트 컨트랙트 개발 및 Web3 통합
- **테스트 환경**: Hardhat 로컬 테스트
- **보안 감사**: OpenZeppelin 기준 검토

### 코드 품질

- **Git 커밋**: AI 언급 금지
- **`.cursor` 폴더**: `.gitignore` 처리
- **기존 기능 보존**: UI/CSS 변경 시 모바일 뷰 유지

---

## 🔧 트러블슈팅

### Backend

#### 1. Database Connection 오류
**증상**: `Communications link failure`

**해결**:
```bash
# MySQL 서비스 확인
sudo systemctl status mysql    # Linux
net start MySQL80              # Windows

# application.properties 확인
spring.datasource.url=jdbc:mysql://localhost:3306/mystockfolio_db
```

#### 2. OAuth2 리다이렉트 오류
**증상**: `redirect_uri_mismatch`

**해결**:
- OAuth2 콘솔에서 Redirect URI 정확히 일치하는지 확인
- `http://localhost:8080/login/oauth2/code/{provider}` 형식

#### 3. Web3j 서명 검증 실패
**해결**:
- 메시지 문자열이 프론트엔드와 정확히 일치하는지 확인
- 지갑 주소가 소문자로 통일되었는지 확인

### Frontend

#### 1. CORS 오류
**증상**: `Access-Control-Allow-Origin` 오류

**해결**:
- 백엔드 `SecurityConfig.java`에서 `http://localhost:3000` 허용 확인

#### 2. MetaMask 연결 오류
**증상**: `window.ethereum is undefined`

**해결**:
- [MetaMask 확장 프로그램](https://metamask.io/) 설치 확인
- HTTPS 또는 localhost에서만 작동

#### 3. sessionStorage 손실
**해결**:
- 정상 동작입니다 (새로고침 시 유지됨)
- 브라우저 탭을 닫으면 자동 삭제됨

---

## 🧪 테스트

```bash
# 백엔드 테스트
cd backend
./gradlew test

# 프론트엔드 테스트
cd frontend
npm test
```

---

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 커밋 메시지 규칙

```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 코드 리팩토링
test: 테스트 코드
chore: 빌드 업무 수정
```

---

## 📚 참고 자료

- [Spring Boot](https://spring.io/projects/spring-boot)
- [React](https://reactjs.org/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [Web3.js](https://web3js.readthedocs.io/)
- [TailwindCSS](https://tailwindcss.com/)

---

## 📝 라이선스

This project is licensed under the MIT License.

---

## 📧 문의

- 프로젝트 링크: [https://github.com/yourusername/MyStockFolio](https://github.com/yourusername/MyStockFolio)
- 이슈 트래커: [GitHub Issues](https://github.com/yourusername/MyStockFolio/issues)

---

**Made with ❤️ by MyStockFolio Team**
