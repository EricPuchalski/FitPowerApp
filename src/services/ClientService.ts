import { useState, useEffect } from "react";
import { Client} from '../model/Client'; // Asegúrate de importar tus modelos
import { Trainer } from "../model/Trainer";
import { Gym } from "../model/Gym";
import { Nutritionist } from "../model/Nutritionist";

const ClientService = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [nutritionists, setNutritionists] = useState<Nutritionist[]>([]);
  const [gyms, setGyms] = useState<Gym[]>([]);

  const fetchClients = async (token: string) => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/clients", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error("Error al obtener los clientes:", error);
    }
  };

  const fetchTrainers = async (token: string) => {
    try {
      const response = await fetch("http://localhost:8080/api/trainers", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setTrainers(data);
    } catch (error) {
      console.error("Error al obtener los entrenadores:", error);
    }
  };

  const fetchNutritionists = async (token: string) => {
    try {
      const response = await fetch("http://localhost:8080/api/nutritionists", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setNutritionists(data);
    } catch (error) {
      console.error("Error al obtener los nutricionistas:", error);
    }
  };

  const fetchGyms = async (token: string) => {
    try {
      const response = await fetch("http://localhost:8080/api/gyms", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setGyms(data);
    } catch (error) {
      console.error("Error al obtener los gimnasios:", error);
    }
  };

  const createClient = async (newClient: Client, token: string) => {
    try {
      const response = await fetch("http://localhost:8080/api/clients", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newClient),
      });
      const data = await response.json();
      setClients((prevClients) => [...prevClients, data]);
      return data; // Return the created client
    } catch (error) {
      console.log("Error al crear el cliente:", error);
    }
  };

 

  return {
    clients,
    trainers,
    nutritionists,
    gyms,
    fetchClients,
    fetchTrainers,
    fetchNutritionists,
    fetchGyms,
    createClient
  };
};

export default ClientService;
