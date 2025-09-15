import { API_CONFIG, createApiUrl } from '@/constants/api';
import { FoodSearchParams, FoodSearchResponse } from '@/constants/schemas/food';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';

const searchFoods = async (params: FoodSearchParams): Promise<FoodSearchResponse> => {
  const apiUrl = createApiUrl(API_CONFIG.ENDPOINTS.FOOD_SEARCH);
  
  console.log('🔍 음식 검색 API 호출 시작');
  console.log('📍 API URL:', apiUrl);
  console.log('🔎 검색 파라미터:', params);
  console.log('🌐 백엔드 URL:', API_CONFIG.BASE_URL);
  
  try {
    const response = await axios.get(apiUrl, {
      params
    });
    
    console.log('✅ API 응답 성공:', response.status);
    console.log('📊 응답 데이터:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('❌ API 호출 실패:', error);
    
    if (axios.isAxiosError(error)) {
      console.error('📡 HTTP 상태 코드:', error.response?.status);
      console.error('📝 에러 메시지:', error.response?.data);
      console.error('🔗 요청 URL:', error.config?.url);
    }
    
    throw error;
  }
};

export const useFoodSearchQuery = (query: string) => {
  console.log('🎯 useFoodSearchQuery 훅 호출');
  console.log('🔍 검색어:', query);
  console.log('📝 검색어 길이:', query.length);
  console.log('🚀 API 호출 활성화:', query.length > 0);
  
  const queryResult = useQuery({
    queryKey: ['foods', 'search', query],
    queryFn: () => searchFoods({ query }),
    enabled: query.length > 0, // 검색어가 있을 때만 API 호출
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
    gcTime: 10 * 60 * 1000, // 10분간 가비지 컬렉션 대기
  });
  
  // 디버그 로그
  React.useEffect(() => {
    if (queryResult.isSuccess) {
      console.log('🎉 쿼리 성공:', queryResult.data);
    }
    if (queryResult.isError) {
      console.error('💥 쿼리 에러:', queryResult.error);
    }
    if (queryResult.isPending) {
      console.log('⏳ 쿼리 로딩 중...');
    }
  }, [queryResult.isSuccess, queryResult.isError, queryResult.isPending, queryResult.data, queryResult.error]);
  
  return queryResult;
};
