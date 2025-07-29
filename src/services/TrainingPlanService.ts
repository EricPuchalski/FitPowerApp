import { ClientReportDTO } from "../model/ClientReportDTO";
import { ExerciseRoutine } from "../model/ExerciseRoutine";

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

export const saveExerciseRoutine = async (
  clientDni: string,
  planId: string,
  exercise: ExerciseRoutine,
  token: string,
  isUpdate: boolean = false
) => {
  const url = isUpdate && exercise.id
    ? `http://localhost:8080/api/v1/clients/${clientDni}/training-plans/exercises/${exercise.id}`
    : `http://localhost:8080/api/v1/clients/${clientDni}/training-plans/${planId}/exercises`;

  const method = isUpdate && exercise.id ? "PUT" : "POST";

  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      exerciseId: exercise.exerciseId,
      series: exercise.series,
      repetitions: exercise.repetitions,
      weight: exercise.weight,
      day: exercise.dayOfWeek,
      restTime: exercise.restTime,
    }),
  });

  return await response.json();
};

export const deleteExerciseRoutine = async (
  clientDni: string,
  planId: string,
  exerciseId: number,
  token: string
) => {
  const response = await fetch(
    `http://localhost:8080/api/v1/clients/${clientDni}/training-plans/${planId}/exercises/${exerciseId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.ok;
};

export const generateTrainingReport = async (
  clientDni: string,
  startDate: string,
  endDate: string,
  trainerComment: string,
  nextSteps: string
): Promise<ClientReportDTO> => {
  const token = localStorage.getItem("token");
  
  if (!token) {
    throw new Error("No se encontró el token de autenticación. Inicia sesión nuevamente.");
  }

  const response = await fetch(
    `${API_BASE_URL}/clients/${clientDni}/training-plans/reports?startDate=${startDate}&endDate=${endDate}`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        trainerComment: trainerComment.trim(),
        nextSteps: nextSteps.trim(),
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al generar el reporte");
  }

  return await response.json();
};