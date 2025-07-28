const API_BASE_URL = "http://localhost:8080/api/v1";

export const fetchTrainingProgress = async (clientDni: string) => {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `${API_BASE_URL}/clients/${clientDni}/progress/training`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (!response.ok) throw new Error("Error al cargar datos de progreso");
  return await response.json();
};

export const fetchRmEvolution = async (clientDni: string) => {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `${API_BASE_URL}/clients/${clientDni}/progress/rm-evolution`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (!response.ok) throw new Error("Error al cargar datos de RM");
  return await response.json();
};