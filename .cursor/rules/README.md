# Cursor AI 프로젝트별 지침 관리 가이드

## 📋 파일 구조

```
.cursor/rules/
├── README.md                    # 이 파일 (관리 가이드)
├── template-universal-rules.md  # 범용 지침 템플릿
└── personal-project-rule.md     # 현재 프로젝트 지침 (MyStockFolio)
```

## 🚀 새로운 프로젝트 시작하기

### 1단계: 템플릿 복사
```bash
# 새 프로젝트 폴더에서
cp .cursor/rules/template-universal-rules.md .cursor/rules/project-specific-rules.md
```

### 2단계: 프로젝트 정보 수정
- 프로젝트명 변경
- 기술 스택 명시
- 비즈니스 도메인 규칙 추가
- 프로젝트 구조 업데이트

### 3단계: Cursor AI에 알리기
- 파일명을 `personal-project-rule.md`로 변경하거나
- Cursor AI에게 "이 프로젝트의 규칙을 확인해줘"라고 요청

## 🔄 프로젝트별 지침 관리 방법

### 방법 1: 파일명 기반 관리
```
.cursor/rules/
├── mystockfolio-rules.md        # MyStockFolio 프로젝트
├── ecommerce-rules.md          # 이커머스 프로젝트
├── blog-rules.md               # 블로그 프로젝트
└── template-universal-rules.md # 템플릿
```

### 방법 2: 프로젝트별 폴더 관리
```
.cursor/rules/
├── mystockfolio/
│   └── rules.md
├── ecommerce/
│   └── rules.md
└── template/
    └── universal-rules.md
```

## 💡 Cursor AI가 규칙을 기억하는 방법

### 1. 파일명 규칙
- `personal-project-rule.md`: 현재 활성 프로젝트 규칙
- `@personal-project-rule.md`: 언급하여 규칙 참조

### 2. 규칙 파일 위치
- `.cursor/rules/` 폴더에 위치
- Cursor AI가 자동으로 인식

### 3. 규칙 업데이트 시
- 규칙 변경 후 Cursor AI에게 "규칙이 업데이트되었어"라고 알리기
- 또는 "현재 프로젝트 규칙을 확인해줘"라고 요청

## 🎯 프로젝트별 커스터마이징 팁

### 기술 스택별 추가 규칙
- **React**: 컴포넌트 구조, 상태 관리 패턴
- **Spring Boot**: 패키지 구조, 어노테이션 사용법
- **Node.js**: 미들웨어 패턴, 에러 핸들링
- **Python**: PEP 8 스타일, 타입 힌트

### 도메인별 추가 규칙
- **금융**: 보안, 정확성, 감사 로그
- **이커머스**: 결제, 주문, 재고 관리
- **소셜**: 사용자 관계, 콘텐츠 관리
- **IoT**: 실시간 데이터, 장치 관리

### 팀별 추가 규칙
- **코드 리뷰**: PR 템플릿, 체크리스트
- **테스트**: 단위 테스트, 통합 테스트
- **배포**: CI/CD 파이프라인, 환경 관리

## 🔧 규칙 파일 작성 팁

### 1. 명확한 구조
- 제목과 섹션을 명확히 구분
- 이모지 사용으로 가독성 향상
- 코드 블록으로 예시 제공

### 2. 구체적인 지침
- "좋은 코드를 작성하라" ❌
- "변수명은 camelCase를 사용하고, 함수명은 동사로 시작하라" ✅

### 3. 프로젝트 특화
- 비즈니스 도메인에 맞는 규칙 추가
- 사용하는 라이브러리/프레임워크별 규칙
- 팀의 코딩 컨벤션 반영

## 📝 규칙 업데이트 체크리스트

- [ ] 프로젝트명과 기술 스택이 정확한가?
- [ ] 비즈니스 도메인 규칙이 포함되었는가?
- [ ] 사용하는 라이브러리별 규칙이 있는가?
- [ ] 팀의 코딩 컨벤션이 반영되었는가?
- [ ] Cursor AI가 이해하기 쉬운 구조인가?

## 🚨 주의사항

- 규칙 파일은 프로젝트별로 독립적으로 관리
- 공통 규칙은 템플릿에서 관리
- 규칙 변경 시 팀원들과 공유
- Cursor AI에게 규칙 업데이트를 알려주기
