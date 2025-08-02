import { Client } from "../model/Client";

const API_URL = "http://localhost:8080/api/v1";

export interface TrainerInfo {
  id: number;
  dni: string;
  name: string;
  gymName: string;
}

export const TrainerService = {
  async getTrainerInfo(dni: string, token: string): Promise<TrainerInfo> {
    const response = await fetch(`${API_URL}/trainers/${dni}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al cargar información del entrenador");
    }

    return response.json();
  },

  async getMyClients(trainerId: string, token: string): Promise<Client[]> {
    const response = await fetch(
      `${API_URL}/trainers/${trainerId}/clients/active`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 404) {
      return [];
    }

    if (!response.ok) {
      throw new Error("Error al cargar los clientes");
    }

    return response.json();
  },

  async getTrainingPlansCount(trainerId: string, token: string): Promise<number> {
    const response = await fetch(
      `${API_URL}/trainers/${trainerId}/training-plans`,
      { 
        headers: { 
          Authorization: `Bearer ${token}` 
        } 
      }
    );

    if (!response.ok) {
      return 0;
    }

    const data = await response.json();
    return data.filter((plan: any) => plan.active).length;
  }
};