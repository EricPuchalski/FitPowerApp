// src/model/TrainingPlan.ts
import { ExerciseRoutine } from "./ExerciseRoutine";

export interface TrainingPlan {
  id: number;
  name: string;
  createdAt: string;         // o date
  trainerDni: string;
  trainerName: string;
  clientDni: string;
  clientName: string;
  trainerSpecification: string;
  clientGoal: string;
  active: boolean;
  exercises: ExerciseRoutine[];
}