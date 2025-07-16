import { create } from 'zustand';

type MealData = {
  name: string;
  calories: string;
  carbs: string;
  protein: string;
  fat: string;
};

type MealStore = {
  mealType: string;
  mealDate: string;
  mealData: MealData[];
  setMealType: (type: string) => void;
  setMealDate: (date: string) => void;
  addMealData: (newData: MealData) => void;
};

export const useMealStore = create<MealStore>((set) => ({
  mealType: '',
  mealDate: '',
  mealData: [],
  setMealType: (type) => set({ mealType: type }),
  setMealDate: (date) => set({ mealDate: date }),
  addMealData: (newData) => set((state) => ({ mealData: [...state.mealData, newData] })),
})); 