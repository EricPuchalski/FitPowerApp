
const API_BASE_URL = "http://localhost:8080/api/v1";

export const fetchActiveTrainingPlan = async (clientDni: string) => {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `${API_BASE_URL}/clients/${clientDni}/training-plans/active`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  return await response.json();
};

export const fetchExerciseRoutines = async (clientDni: string, planId: string, token: string) => {
  const response = await fetch(
    `http://localhost:8080/api/v1/clients/${clientDni}/training-plans/${planId}/exercises`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return await response.json();
};
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