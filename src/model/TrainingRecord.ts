

export type TrainingRecord = {
  id: number;
  observation: string | null;
  createdAt: string;
  series: number;
  repetitions: number;
  weight: number;
  restTime: string;
  exerciseId: number;
  trainingPlanId: number;
  exerciseName: string; // Agregado para mostrar el nombre del ejercicio
}