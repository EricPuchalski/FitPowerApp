import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  User,
} from "lucide-react";
import { FooterPag } from "../../components/Footer";
import { TrainerHeader } from "../../components/TrainerHeader";
import { useAuth } from "../../auth/hook/useAuth";
import { Client } from "../../model/Client";
import { ClientCard } from "../../components/ClientCard";
import { TrainerService } from "../../services/TrainerService";
import { ClientService } from "../../services/ClientService";


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
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      const token = localStorage.getItem("token");
      const userDni = localStorage.getItem("userDni");
      if (token && userDni) {
        fetchTrainerInfo(userDni, token);
      }
    } else {
      loadData();
    }
  }, [currentUser, showAll]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token");

    try {
      if (!token) throw new Error("No authentication token found");

      if (showAll) {
        await fetchAllClients(token);
      } else {
        await fetchMyClients(token);
      }
      
      await fetchTrainingPlans(token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  const fetchTrainerInfo = async (dni: string, token: string) => {
    try {
      const data = await TrainerService.getTrainerInfo(dni, token);
      localStorage.setItem("trainerId", data.id.toString());
      localStorage.setItem("userRole", "ROLE_TRAINER");
      setCurrentUser({
        dni: data.dni,
        name: data.name,
        gymName: data.gymName,
        role: "ROLE_TRAINER",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar información del entrenador");
      setLoading(false);
    }
  };

  const fetchMyClients = async (token: string) => {
    const trainerId = localStorage.getItem("trainerId");
    if (!trainerId) throw new Error("Trainer ID not found");

    const clients = await TrainerService.getMyClients(trainerId, token);
    setClients(clients);
  };

  const fetchAllClients = async (token: string) => {
    if (!currentUser?.gymName) throw new Error("Gym name not found");

    const clients = await ClientService.getGymClientsWithoutPlan(currentUser.gymName, token);
    setClients(clients);
  };

  const fetchTrainingPlans = async (token: string) => {
    const trainerId = localStorage.getItem("trainerId");
    if (!trainerId) return;

    const count = await TrainerService.getTrainingPlansCount(trainerId, token);
    setActivePlansCount(count);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100">
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
