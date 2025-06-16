import { Exercise } from "./Exercise";

export type  TrainingPlan = {
  id: number;
  name: string;
  createdAt: string;
  trainerDni: string;
  trainerName: string;
  clientDni: string;
  clientName: string;
  trainerSpecification: string;
  clientGoal: string;
  active: boolean;
  exercises: Exercise[];
}