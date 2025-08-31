import Constants from 'expo-constants';

// API 설정
export const API_CONFIG = {
  // app.config.js에서 백엔드 URL 가져오기
  BASE_URL: Constants.expoConfig?.extra?.backendUrl || 'https://healthpick.store',
  
  // API 엔드포인트
  ENDPOINTS: {
    FOOD_SEARCH: '/api/foods/search',
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
  const fullUrl = `${API_CONFIG.BASE_URL}${endpoint}`;
  console.log('🔗 API URL 생성:', {
    baseUrl: API_CONFIG.BASE_URL,
    endpoint: endpoint,
    fullUrl: fullUrl
  });
  return fullUrl;
};
