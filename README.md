# HealthyPick

건강한 식습관을 위한 모바일 앱입니다.

## 주요 기능

### 🍽️ 음식 검색 및 기록
- **API 기반 음식 검색**: tanstack-query를 사용한 효율적인 음식 검색
- **영양 정보 표시**: 칼로리, 단백질, 지방, 탄수화물 정보 제공
- **식사 타입별 기록**: 아침, 점심, 저녁, 물 섭취 기록

### 📊 영양제 관리
- **영양제 복용 기록**: 복용 여부 및 시간 관리
- **복용 상태 토글**: 간편한 복용 완료 체크

### ⚖️ 체중 관리
- **체중 변화 추적**: 일별 체중 기록 및 변화량 표시
- **목표 체중 설정**: 개인 목표 체중 관리

### 📅 캘린더 뷰
- **데이터 마커**: 기록이 있는 날짜 표시
- **날짜별 데이터**: 특정 날짜의 모든 기록 조회

## 기술 스택

- **Frontend**: React Native, Expo
- **상태 관리**: Zustand, TanStack Query
- **스타일링**: NativeWind (Tailwind CSS)
- **네비게이션**: Expo Router
- **HTTP 클라이언트**: Axios

## API 연동

### 음식 검색 API
```
GET /api/foods/search?query={음식명}
```

**응답 예시:**
```json
{
  "success": true,
  "code": "200",
  "message": "음식 검색 성공",
  "data": [
    {
      "foodId": 1,
      "menuName": "감자탕",
      "calories": 500,
      "protein": 30,
      "fat": 20,
      "carbohydrate": 50
    }
  ]
}
```

## 개발 환경 설정

1. **의존성 설치**
   ```bash
   yarn install
   ```

2. **개발 서버 실행**
   ```bash
   yarn start
   ```

3. **API 설정**
   - `constants/api.ts`에서 실제 API 서버 주소 설정
   - 개발 환경에서는 더미 데이터로 테스트 가능

## 프로젝트 구조

```
healthypick/
├── app/                    # Expo Router 앱 구조
│   ├── (tabs)/           # 탭 네비게이션
│   ├── meal/             # 식사 관련 화면
│   └── signup/           # 회원가입 화면
├── components/            # 재사용 가능한 컴포넌트
│   └── ui/               # UI 컴포넌트
├── constants/             # 상수 및 설정
│   ├── api.ts            # API 설정
│   └── schemas/          # 타입 정의
├── hooks/                 # 커스텀 훅
│   └── record/           # 기록 관련 훅
└── stores/                # 상태 관리 (Zustand)
```

## 주요 컴포넌트

- **FoodSearchComponent**: 음식 검색 및 선택
- **MealCard**: 식사 정보 카드
- **SupplementCard**: 영양제 정보 카드
- **WeightCard**: 체중 정보 카드

## 상태 관리

- **Zustand**: 영양제, 식사 데이터 등 로컬 상태
- **TanStack Query**: API 데이터 캐싱 및 동기화
- **AsyncStorage**: 사용자 인증 정보 저장

## 개발 가이드

### 새로운 API 엔드포인트 추가
1. `constants/api.ts`에 엔드포인트 추가
2. `constants/schemas/`에 타입 정의
3. `hooks/`에 쿼리 훅 생성

### 컴포넌트 추가
1. `components/ui/`에 새 컴포넌트 생성
2. TypeScript 타입 정의
3. Tailwind CSS로 스타일링

## 라이센스

MIT License
