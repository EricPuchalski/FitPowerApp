import { Client } from "../model/Client";

const API_BASE_URL = "http://localhost:8080/api/v1";

export const fetchClientData = async (clientDni: string, token: string): Promise<Client> => {
  const response = await fetch(`${API_BASE_URL}/clients/${clientDni}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  return await response.json();
};

export const ClientService = {
  async getGymClientsWithoutPlan(gymName: string, token: string): Promise<Client[]> {
    const response = await fetch(
      `${API_BASE_URL}/gyms/${encodeURIComponent(gymName)}/clients/without-training-plan`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error al cargar los clientes del gimnasio");
    }

    return response.json();
  }
};