import { create } from 'zustand';

interface MealData {
  name: string;
  calories: string;
  carbs: string;
  protein: string;
  fat: string;
}

interface SearchedFoodData {
  menuName: string;
  calorie: number;
  carbohydrate: number;
  protein: number;
  fat: number;
  brand?: string;
  foodId?: number; // 검색 API의 foodId 보관
}

// 날짜별 음식 데이터를 저장하는 구조
interface DailyMealData {
  [dateKey: string]: {
    [mealType: string]: MealData[]; // breakfast, lunch, dinner, water
  };
}

interface MealStore {
  mealData: MealData[];
  searchedFood: SearchedFoodData | null;
  dailyMealData: DailyMealData; // 날짜별 음식 데이터
  addMealData: (data: MealData) => void;
  addMealDataByDate: (dateKey: string, mealType: string, data: MealData) => void;
  getMealDataByDate: (dateKey: string, mealType: string) => MealData[];
  setSearchedFood: (food: SearchedFoodData | null) => void;
  clearSearchedFood: () => void;
}

export const useMealStore = create<MealStore>((set, get) => ({
  mealData: [],
  searchedFood: null,
  dailyMealData: {},
  addMealData: (data) =>
    set((state) => ({
      mealData: [...state.mealData, data],
    })),
  addMealDataByDate: (dateKey, mealType, data) =>
    set((state) => ({
      dailyMealData: {
        ...state.dailyMealData,
        [dateKey]: {
          ...state.dailyMealData[dateKey],
          [mealType]: [
            ...(state.dailyMealData[dateKey]?.[mealType] || []),
            data
          ]
        }
      }
    })),
  getMealDataByDate: (dateKey, mealType) => {
    const state = get();
    return state.dailyMealData[dateKey]?.[mealType] || [];
  },
  setSearchedFood: (food) =>
    set(() => ({
      searchedFood: food,
    })),
  clearSearchedFood: () =>
    set(() => ({
      searchedFood: null,
    })),
})); 