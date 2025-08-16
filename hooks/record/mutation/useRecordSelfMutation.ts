import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

// API 요청 타입 정의
export interface CustomFoodRequest {
  menuName: string;
  calorie: number;
  carbohydrate: number;
  protein: number;
  fat: number;
  intakeTimeType: 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';
}

// API 응답 타입 정의
export interface CustomFoodResponse {
  success: boolean;
  message: string;
  data?: {
    id: number;
    userId: number;
    menuName: string;
    calorie: number;
    carbohydrate: number;
    protein: number;
    fat: number;
    intakeTimeType: string;
    createdAt: string;
    updatedAt: string;
  };
}

// API 호출 함수
const saveCustomFood = async (
  userId: number, 
  foodData: CustomFoodRequest
): Promise<CustomFoodResponse> => {
  const accessToken = await AsyncStorage.getItem('accessToken');
  
  if (!accessToken) {
    throw new Error('액세스 토큰이 없습니다.');
  }

  const response = await axios.post(
    `https://healthpick.store/api/records/${userId}/custom-food`,
    foodData,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    }
  );

  return response.data;
};

// React Query Mutation 훅
export const useRecordSelfMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, foodData }: { userId: number; foodData: CustomFoodRequest }) =>
      saveCustomFood(userId, foodData),
    
    onSuccess: (data, variables) => {
      console.log('커스텀 음식 저장 성공:', data);
      
      // 관련 쿼리 무효화 (선택사항)
      // 예: 사용자의 음식 기록 목록을 다시 불러오기 위해
      queryClient.invalidateQueries({
        queryKey: ['userFoods', variables.userId]
      });
      
      // 또는 특정 날짜의 음식 기록을 무효화
      queryClient.invalidateQueries({
        queryKey: ['dailyFoods']
      });
    },
    
    onError: (error: any) => {
      console.error('커스텀 음식 저장 실패:', error);
      
      if (error.response) {
        const { status, data } = error.response;
        console.error(`HTTP ${status}:`, data);
        
        switch (status) {
          case 400:
            console.error('잘못된 요청 데이터입니다.');
            break;
          case 401:
            console.error('인증이 필요합니다.');
            break;
          case 404:
            console.error('사용자를 찾을 수 없습니다.');
            break;
          case 500:
            console.error('서버 내부 오류가 발생했습니다.');
            break;
          default:
            console.error('알 수 없는 오류가 발생했습니다.');
        }
      } else if (error.request) {
        console.error('네트워크 오류가 발생했습니다.');
      } else {
        console.error('요청 설정 중 오류가 발생했습니다:', error.message);
      }
    },
  });
};

export type UseRecordSelfMutationReturn = ReturnType<typeof useRecordSelfMutation>;
