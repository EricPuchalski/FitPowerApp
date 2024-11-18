// src/services/trainingDiaryService.ts

export async function getTrainingDiaries(clientId: string, token: string) {
    try {
      const response = await fetch(`http://localhost:8080/api/training-diaries/client/${clientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }

  // Función para crear un TrainingDiary
export async function createTrainingDiary(clientDni: string, token: string) {
    try {
      const response = await fetch("http://localhost:8080/api/training-diaries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          clientDni: clientDni,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.statusText}`);
      }
  
      const data = await response.json();
      return data.id;
    } catch (error) {
      console.error("Error al crear el TrainingDiary:", error);
      throw error;
    }
  }
  
  