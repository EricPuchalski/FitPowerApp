//src/services/RoutineService.ts
// Función para activar una rutina
export async function activateRoutine(routineId: number, token: string, clientDni: string) {
    try {
      const response = await fetch(`http://localhost:8080/api/routines/activate/${clientDni}/${routineId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.statusText}`);
      }
  
      return response;
    } catch (error) {
      console.error("Error al activar la rutina:", error);
      throw error;
    }
  }

  


  // Función para obtener las rutinas activas del plan de entrenamiento
export async function getActiveRoutines(trainingPlanId: number, token: string) {
    try {
      const response = await fetch(`http://localhost:8080/api/training-plans/${trainingPlanId}/active-routines`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.statusText}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al obtener las rutinas activas del plan de entrenamiento:", error);
      throw error;
    }
  }

  

  export async function deactivateRoutine(id: number, token: string) {
    try {
      const response = await fetch(`http://localhost:8080/api/routines/deactivate/${id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Error deactivating routine');
      }
      return response;
    } catch (error) {
      console.error('Error deactivating routine:', error);
      throw error;
    }
  }
  