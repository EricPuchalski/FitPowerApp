// src/model/TrainingPlan.ts
import { ExerciseRoutine } from "./ExerciseRoutine";

export interface TrainingPlan {
  id: number;
  name: string;
  createdAt: string;         // o date
  trainerDni: string;
  clientDni: string;
  active: boolean;
  exercises: ExerciseRoutine[];
}