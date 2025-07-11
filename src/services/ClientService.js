//src/services/ClientService.ts
import { useState } from "react";
const ClientService = (p0) => {
    const [clients, setClients] = useState([]);
    const [trainers, setTrainers] = useState([]);
    const [nutritionists, setNutritionists] = useState([]);
    const [gyms, setGyms] = useState([]);
    const fetchClients = async (token) => {
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
        }
        catch (error) {
            console.error("Error al obtener los clientes:", error);
        }
    };
    const fetchTrainers = async (token) => {
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
        }
        catch (error) {
            console.error("Error al obtener los entrenadores:", error);
        }
    };
    const fetchNutritionists = async (token) => {
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
        }
        catch (error) {
            console.error("Error al obtener los nutricionistas:", error);
        }
    };
    const fetchGyms = async (token) => {
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
        }
        catch (error) {
            console.error("Error al obtener los gimnasios:", error);
        }
    };
    const createClient = async (newClient, token) => {
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
        }
        catch (error) {
            console.log("Error al crear el cliente:", error);
        }
    };
    const fetchClientByDni = async (dni) => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`http://localhost:8080/api/v1/clients/${dni}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (response.status === 404) {
                return null;
            }
            if (!response.ok) {
                throw new Error("Error al obtener el cliente");
            }
            return await response.json();
        }
        catch (error) {
            console.error("Error fetching client:", error);
            throw error;
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
        fetchClientByDni,
        createClient
    };
};
export default ClientService;
