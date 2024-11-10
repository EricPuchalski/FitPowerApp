"use client";

import { useState, useEffect } from "react";
import { NavBarClient } from "./NavBarClient";
import { FooterPag } from "./Footer";
import ClientInfo from "./ClientInfo";
import PhysicalStatus from "./PhysicalStatus";
import PhysicalStatusHistory from "./PhysicalStatusHistory";
import AddPhysicalStatus from "./AddPhysicalStatus";

// Tipos de datos
type ClientStats = {
  id: number;
  weight: number;
  height: number;
  bodymass: number;
  bodyfat: number;
  creationDate: string;
};

type Client = {
  id: number;
  name: string;
  lastname: string;
  dni: string;
  phone: string;
  address: string;
  email: string;
  goal: string;
  gymName: string;
  trainerDni: string;
  nutritionistDni: string;
};

const clientUrl = "http://localhost:8080/api/clients/email/";
const clientStatusUrl = "http://localhost:8080/api/clients/";

// Función para obtener los datos del cliente
async function getClientData(email: string, token: string) {
  try {
    const response = await fetch(`${clientUrl}${email}`, {
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
    console.error("Error al obtener los datos del cliente:", error);
    throw error;
  }
}

// Función para obtener los estados físicos del cliente
async function getClientStatuses(dni: string, token: string) {
  try {
    const response = await fetch(`${clientStatusUrl}${dni}/statuses`, {
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
    console.error("Error al obtener los estados físicos del cliente:", error);
    throw error;
  }
}

export default function DashboardClient() {
  const [selectedFood, setSelectedFood] = useState("");
  const [foodAmount, setFoodAmount] = useState<string>("");
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("userEmail");

  const [clientStats, setClientStats] = useState<ClientStats[]>([]);
  const [client, setClient] = useState<Client | null>(null);

  const fetchClientData = async () => {
    try {
      const clientData = await getClientData(email, token);
      setClient(clientData);

      if (clientData && clientData.dni) {
        const statuses = await getClientStatuses(clientData.dni, token);
        setClientStats(statuses);
      }
    } catch (error) {
      console.error("Error al obtener los datos del cliente:", error);
    }
  };

  useEffect(() => {
    fetchClientData();
  }, [email, token]);

  const updateClientStats = async () => {
    if (client && client.dni) {
      const statuses = await getClientStatuses(client.dni, token);
      setClientStats(statuses);
    }
  };

  if (!client) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <NavBarClient />

      <main className="flex-grow container mx-auto px-4 py-8">
        <ClientInfo client={client} />

        <div className="grid md:grid-cols-2 gap-8">
          <PhysicalStatus clientStats={clientStats} />
          <PhysicalStatusHistory clientStats={clientStats} />
        </div>

        <AddPhysicalStatus clientDni={client.dni} onUpdate={updateClientStats} />
      </main>

      <FooterPag />
    </div>
  );
}
