import { API_CONFIG, createApiUrl } from '@/constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export type IntakeTimeType = 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';

export interface SaveSearchedFoodRequest {
  foodId?: number;          // 검색한 음식 ID(옵션)
  customFoodId?: number;    // 직접 입력 저장 ID(옵션)
  intakeTimeType: IntakeTimeType;
}

export interface BasicResponse<T = unknown> {
  success: boolean;
  code: string;
  message: string;
  data: T;
}

const saveSearchedFood = async (
  userId: number,
  body: SaveSearchedFoodRequest
): Promise<BasicResponse> => {
  const accessToken = await AsyncStorage.getItem('accessToken');
  if (!accessToken) throw new Error('액세스 토큰이 없습니다.');

  const url = createApiUrl(API_CONFIG.ENDPOINTS.RECORD_FOOD(userId));
  const res = await axios.post(url, body, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    timeout: 10000,
  });
  return res.data;
};

export const useRecordFoodMutation = () => {
  return useMutation({
    mutationFn: ({ userId, body }: { userId: number; body: SaveSearchedFoodRequest }) =>
      saveSearchedFood(userId, body),
  });
};

export type UseRecordFoodMutationReturn = ReturnType<typeof useRecordFoodMutation>;


