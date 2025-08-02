import { MealTime } from "./MealTime";

export interface NutritionRecordResponseDto {
  id: number;
  createdAt: string;
  calories: number;
    proteins: number;
  carbohydrates: number;
  fats: number;
  food: string;
  mealTime: MealTime;
  observations: string;
  clientDni: string;
  nutritionPlanId: number;
}
