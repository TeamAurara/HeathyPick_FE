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
}

interface MealStore {
  mealData: MealData[];
  searchedFood: SearchedFoodData | null;
  addMealData: (data: MealData) => void;
  setSearchedFood: (food: SearchedFoodData | null) => void;
  clearSearchedFood: () => void;
}

export const useMealStore = create<MealStore>((set) => ({
  mealData: [],
  searchedFood: null,
  addMealData: (data) =>
    set((state) => ({
      mealData: [...state.mealData, data],
    })),
  setSearchedFood: (food) =>
    set(() => ({
      searchedFood: food,
    })),
  clearSearchedFood: () =>
    set(() => ({
      searchedFood: null,
    })),
})); 