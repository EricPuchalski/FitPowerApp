import { MealTime } from "./MealTime";

export interface NutritionRecordCreateRequestDto {
  calories: number;
  food: string;
  mealTime: MealTime;
  observations: string;
}