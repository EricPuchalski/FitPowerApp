export interface ExerciseRoutine {
  id?: number;               
  exerciseId: number;       
  exerciseName: string;     
  series: number;            
  repetitions: number;       
  weight: number | null;
  restTime: string;
  dayOfWeek: string;               
  trainingPlanId?: number;
}
