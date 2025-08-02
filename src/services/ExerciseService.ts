const API_BASE_URL = "http://localhost:8080/api/v1";

export const fetchExercises = async (token: string): Promise<any[]> => {
  const response = await fetch(`${API_BASE_URL}/exercises`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error("Error al cargar ejercicios");
  return await response.json();
};