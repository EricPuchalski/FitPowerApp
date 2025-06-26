import { MealTime } from "./MealTime";

export interface NutritionRecordCreateResponseDto {
  id: number;
  createdAt: string;
  calories: number;
  food: string;
  mealTime: MealTime;
  observations: string;
  clientDni: string;
  nutritionPlanId: number;
}