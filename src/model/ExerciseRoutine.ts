export interface ExerciseRoutine {
  id?: number;               
  routineId: number;         
  exerciseId: number;       
  exerciseName: string;     
  series: number;            
  repetitions: number;       
  weight: number | null;
  restTime: string;
  day: string;               
  trainingPlanId?: number;
}
