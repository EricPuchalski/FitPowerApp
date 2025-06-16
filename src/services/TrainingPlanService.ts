// src/services/trainingPlanService.ts

export async function getActiveTrainingPlan(clientDni: string, token: string) {
    try {
      const response = await fetch(`http://localhost:8080/api/training-plans/active/${clientDni}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Error fetching training plan');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching training plan:', error);
      throw error;
    }
  }
  
