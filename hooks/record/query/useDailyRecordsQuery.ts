import { API_CONFIG, createApiUrl } from '@/constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// 일일 섭취 기록 응답 타입
export interface DailyRecord {
  id: number;
  userId: number;
  foodId?: number;
  customFoodId?: number;
  menuName: string;
  calorie: number;
  carbohydrate: number;
  protein: number;
  fat: number;
  intakeTimeType: 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';
  createdAt: string;
  updatedAt: string;
}

export interface DailyRecordsResponse {
  success: boolean;
  code: string;
  message: string;
  data: DailyRecord[];
}

// API 호출 함수
const fetchDailyRecords = async (userId: number, date: string): Promise<DailyRecordsResponse> => {
  const accessToken = await AsyncStorage.getItem('accessToken');
  
  if (!accessToken) {
    throw new Error('액세스 토큰이 없습니다.');
  }

  const url = createApiUrl(API_CONFIG.ENDPOINTS.DAILY_RECORDS(userId));
  console.log('url', url);
  console.log('date', date);
  console.log('accessToken', accessToken);
  const response = await axios.get(url, {
    params: { date },
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    timeout: 10000,
  });

  return response.data;
};

// React Query 훅
export const useDailyRecordsQuery = (userId: number, date: string) => {
  return useQuery({
    queryKey: ['dailyRecords', userId, date],
    queryFn: () => fetchDailyRecords(userId, date),
    enabled: !!userId && !!date, // userId와 date가 있을 때만 실행
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
    gcTime: 10 * 60 * 1000, // 10분간 가비지 컬렉션 대기
    retry: 3, // 실패 시 3번 재시도
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // 지수 백오프
  });
};
