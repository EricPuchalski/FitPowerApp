import { Client } from "../model/Client";

const API_BASE_URL = "http://localhost:8080/api/v1";

export const fetchClientData = async (clientDni: string): Promise<Client> => {
  const token = localStorage.getItem("token");
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
