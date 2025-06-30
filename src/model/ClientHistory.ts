import { NutritionPlanResponseDto } from "./NutritionPlanResponseDto";
import { NutritionRecordResponseDto } from "./NutritionRecordResponseDto";
import { TrainingPlan } from "./TrainingPlan";
import { TrainingRecord } from "./TrainingRecord";

export type ClientHistoryResponse = {
  clientId: number;
  clientName: string;
  clientDni: string;
  clientGoal: string;
  trainingPlans: TrainingPlan[];
  trainingRecords: TrainingRecord[];
  nutritionPlans: NutritionPlanResponseDto[];
  nutritionRecords: NutritionRecordResponseDto[];
}