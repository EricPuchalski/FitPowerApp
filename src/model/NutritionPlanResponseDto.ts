export interface NutritionPlanResponseDto {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  caloricTarget: number;
  dailyCarbs: number;
  dailyProteins: number;
  dailyFats: number;
  recommendations: string;
  active: boolean;
  nutritionistId: number;
  nutritionistName: string;
  clientDni: string;
  clientName: string;
}
