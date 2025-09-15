import Constants from 'expo-constants';

// API 설정
export const API_CONFIG = {
  // 우선순위: .env(EXPO_PUBLIC_BACKEND_URL) > app.config.js(extra.backendUrl) > 기본값
  BASE_URL: process.env.EXPO_PUBLIC_BACKEND_URL
    || (Constants.expoConfig as any)?.extra?.backendUrl
    || 'https://healthpick.store',
  
  // API 엔드포인트
  ENDPOINTS: {
    FOOD_SEARCH: '/api/foods/search',
    RECORD_FOOD: (userId: number) => `/records/${userId}/food`,
    DAILY_RECORDS: (userId: number) => `/records/${userId}/daily`,
  },
  
  // API 헤더
  HEADERS: {
    'Content-Type': 'application/json',
  },
};

// API 설정 디버그 로그
console.log('⚙️ API 설정 로드:', {
  BASE_URL: API_CONFIG.BASE_URL,
  ENDPOINTS: API_CONFIG.ENDPOINTS,
  CONFIG_BACKEND_URL: Constants.expoConfig?.extra?.backendUrl,
  NODE_ENV: process.env.NODE_ENV
});

// API URL 생성 함수
export const createApiUrl = (endpoint: string): string => {
  // 1) BASE 정규화: 끝 슬래시 제거
  let base = (API_CONFIG.BASE_URL || '').replace(/\/+$/, '');
  // 2) 엔드포인트 정규화: 앞에 슬래시 보장
  let ep = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  // 3) BASE가 /api로 끝나고, 엔드포인트가 /api로 시작하면 접두 /api 제거
  if (/\/api\/?$/.test(base) && /^\/api(\/|$)/.test(ep)) {
    ep = ep.replace(/^\/api/, '');
  }
  const fullUrl = `${base}${ep}`;
  console.log('🔗 API URL 생성:', {
    baseUrl: base,
    endpoint: ep,
    fullUrl: fullUrl
  });
  return fullUrl;
};
