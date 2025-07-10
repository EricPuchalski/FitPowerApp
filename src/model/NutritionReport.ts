export interface NutritionReport {
  clientId: number;
  clientName: string;
  nutritionPlanId: number;
  planStartDate: string; // formato: "YYYY-MM-DD"
  reportStartDate: string;
  reportEndDate: string;
  generatedAt: string; // formato ISO
  targetCalories: number;
  targetProteins: number;
  targetCarbohydrates: number;
  targetFats: number;
  analysis: {
    mostConsistentMacro: MacroConsistency;
    leastConsistentMacro: MacroConsistency;
    compliance: ComplianceData;
    mealTimeAverages: Record<MealTime, NutrientData>;
    periodAverages: NutrientData;
  };
  dailyData: DailyReport[];
  comments: {
    trainerComment: string | null;
    nextSteps: string | null;
  };
}

export type MealTime = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface MacroConsistency {
  macroName: 'calories' | 'proteins' | 'carbohydrates' | 'fats';
  averageDeviation: number;
  daysInRange: number;
}

export interface ComplianceData {
  perfectDays: number;
  onlyCaloriesInRange: number;
  onlyMacrosInRange: number;
}

export interface NutrientData {
  calories: number;
  proteins: number;
  carbohydrates: number;
  fats: number;
}

export interface DailyReport {
  date: string; // formato: "YYYY-MM-DD"
  consumed: NutrientData;
  percentages: {
    calories: number;
    proteins: number;
    carbohydrates: number;
    fats: number;
  };
}
