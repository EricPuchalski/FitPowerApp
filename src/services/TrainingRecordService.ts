const API_BASE_URL = "http://localhost:8080/api/v1";

interface TrainingRecord {
  id: number;
  observation: string | null;
  createdAt: string;
  series: number;
  repetitions: number;
  weight: number;
  restTime: string;
  exerciseId: number;
  trainingPlanId: number;
}

export const fetchTrainingRecords = async (clientDni: string, trainingPlanId: string): Promise<TrainingRecord[]> => {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `${API_BASE_URL}/clients/${clientDni}/training-plans/${trainingPlanId}/records`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (!response.ok) throw new Error("Error al cargar registros");
  return await response.json();
};

export const saveTrainingRecord = async (
  clientDni: string,
  trainingPlanId: string,
  recordData: any,
  recordId?: number
): Promise<TrainingRecord> => {
  const token = localStorage.getItem("token");
  const url = recordId
    ? `${API_BASE_URL}/clients/${clientDni}/training-plans/${trainingPlanId}/records/${recordId}`
    : `${API_BASE_URL}/clients/${clientDni}/training-plans/${trainingPlanId}/records`;

  const method = recordId ? "PUT" : "POST";

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(recordData),
  });

  if (!response.ok) throw new Error("Error al guardar el registro");
  return await response.json();
};

export const deleteTrainingRecord = async (
  clientDni: string,
  trainingPlanId: string,
  recordId: number
): Promise<void> => {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `${API_BASE_URL}/clients/${clientDni}/training-plans/${trainingPlanId}/records/${recordId}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!response.ok) throw new Error("Error al eliminar el registro");
};