export interface Food {
  foodId: number;
  menuName: string;
  calories: number;
  protein: number;
  fat: number;
  carbohydrate: number;
}

export interface FoodSearchResponse {
  success: boolean;
  code: string;
  message: string;
  data: Food[];
}

export interface FoodSearchParams {
  query: string;
}
