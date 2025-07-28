// src/components/DashboardTrainer.tsx
"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Users,
  Plus,
  TrendingUp,
  Menu,
  X,
  Dumbbell,
  Home,
  Calendar,
  Mail,
  Phone,
  Target,
  User,
} from "lucide-react";
import { FooterPag } from "../../components/Footer";
import { TrainerHeader } from "../../components/TrainerHeader";
import { useAuth } from "../../auth/hook/useAuth";
import { Client } from "../../model/Client";
import { ClientCard } from "../../components/ClientCard";

interface User {
  dni: string;
  name: string;
  gymName: string;
  role: string;
}

interface DashboardTrainerProps {
  user?: User;
}

export default function DashboardTrainer({ user }: DashboardTrainerProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(user || null);
  const [activePlansCount, setActivePlansCount] = useState<number>(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Carga inicial del entrenador y luego de los clientes/plans
  useEffect(() => {
    console.log("el user es:");
    
    console.log(currentUser);
    
    if (!currentUser) {
      const token = localStorage.getItem("token");
      const userDni = localStorage.getItem("userDni");
      if (token && userDni) {
        fetchTrainerInfo(userDni);
      }
    } else {
      loadData();
    }
  }, [currentUser, showAll]);

  // Helper que lanza la función correcta de fetch
  const loadData = () => {
    setLoading(true);
    setError(null);

    const loader = showAll ? fetchAllClients : fetchMyClients;
    loader()
      .then(() => fetchTrainingPlans())
      .catch(() => {
        setError("Error al cargar los clientes");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Obtiene datos del entrenador y guarda trainerId en localStorage
  const fetchTrainerInfo = async (dni: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8080/api/v1/trainers/${dni}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      localStorage.setItem("trainerId", data.id.toString());
      localStorage.setItem("userRole", "ROLE_TRAINER");
      setCurrentUser({
        dni: data.dni,
        name: data.name,
        gymName: data.gymName,
        role: "ROLE_TRAINER",
      });
      
      console.log(data);
      
    } catch {
      setError("Error al cargar información del entrenador");
      setLoading(false);
    }
  };

  // Fetch solo “Mis Clientes”
  const fetchMyClients = async () => {
    const trainerId = localStorage.getItem("trainerId");
    const token = localStorage.getItem("token");
    if (!trainerId || !token) throw new Error();

    const res = await fetch(
      `http://localhost:8080/api/v1/trainers/${trainerId}/clients/active`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!res.ok) {
      // Si 404 o vacío, devolvemos array vacío
      if (res.status === 404) {
        setClients([]);
        return;
      }
      throw new Error();
    }
    const data: Client[] = await res.json();
    setClients(data);
  };

  // Fetch “Todos los Clientes del Gimnasio”
  const fetchAllClients = async () => {
    const token = localStorage.getItem("token");
    const gymName = currentUser?.gymName;
    if (!gymName || !token) throw new Error();

    const res = await fetch(
      `http://localhost:8080/api/v1/gyms/${encodeURIComponent(
        gymName
      )}/clients/without-training-plan`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!res.ok) throw new Error();
    const data: Client[] = await res.json();
    setClients(data);
  };

  // Fetch contador de planes activos
  const fetchTrainingPlans = async () => {
    const trainerId = localStorage.getItem("trainerId");
    const token = localStorage.getItem("token");
    if (!trainerId || !token) return;

    try {
      const res = await fetch(
        `http://localhost:8080/api/v1/trainers/${trainerId}/training-plans`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error();
      const data: any[] = await res.json();
      const activos = data.filter((plan) => plan.active);
      setActivePlansCount(activos.length);
    } catch {
      setActivePlansCount(0);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/"); // o "/login" si tenés una ruta específica
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100">
        {/* … tu código de loading idéntico … */}
        <p className="p-8 text-center">Cargando datos…</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header y menú */}
      <TrainerHeader onLogout={handleLogout}></TrainerHeader>
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Bienvenida */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{`Bienvenido, ${currentUser?.name}`}</h1>
          <div className="mt-4"></div>
          <p className="text-gray-600 mt-4">{`Gimnasio: ${currentUser?.gymName}`}</p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="p-6 bg-cyan-50 rounded-lg border flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">Total Clientes</p>
              <p className="text-2xl font-bold">{clients.length}</p>
            </div>
            <Users className="h-8 w-8 text-cyan-600" />
          </div>
        </div>

        {/* Toggle de vista */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setShowAll(false)}
            className={`px-4 py-2 rounded ${
              !showAll ? "bg-blue-900 text-white" : "bg-gray-200"
            }`}
          >
            Mis Clientes
          </button>
          <button
            onClick={() => setShowAll(true)}
            className={`px-4 py-2 rounded ${
              showAll ? "bg-blue-900 text-white" : "bg-gray-200"
            }`}
          >
            Clientes libres
          </button>
        </div>

        {/* Título y descripción */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold">
            {showAll
              ? `Clientes de ${currentUser?.gymName} sin un plan activo`
              : "Mis Clientes Activos"}
          </h2>
          {!showAll && (
            <p className="text-sm text-gray-600">
              Clientes con planes de entrenamiento activos contigo
            </p>
          )}
        </div>

        {/* Error de carga */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-800 border rounded">
            {error}
          </div>
        )}

        {/* Grilla de clientes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))}
        </div>

        {/* Estado “sin clientes” */}
        {clients.length === 0 && !loading && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {showAll
                ? "No hay clientes en el gimnasio"
                : "No tienes clientes activos"}
            </h3>
            <p className="text-gray-600">
              {showAll
                ? "Los clientes aparecerán aquí cuando se registren en el gimnasio."
                : "Los clientes aparecerán aquí cuando tengan planes activos contigo."}
            </p>
          </div>
        )}
      </main>

      <FooterPag />
    </div>
  );
}
