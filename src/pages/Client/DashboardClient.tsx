import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Client } from "../../model/Client";
import { FooterPag } from "../../components/Footer";
import { useAuth } from "../../auth/hook/useAuth";
import { ClientHeader } from "../../components/ClientHeader";
import { fetchClientData } from "../../services/ClientService";
import { fetchActiveNutritionPlan } from "../../services/NutritionPlanService";
import { fetchActiveTrainingPlan } from "../../services/TrainingPlanService";

const ClientDashboard: React.FC = () => {
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Estados para los planes activos
  const [activeNutritionPlanId, setActiveNutritionPlanId] = useState<number | null>(null);
  const [activeTrainingPlanId, setActiveTrainingPlanId] = useState<number | null>(null);
  const [fetchingPlans, setFetchingPlans] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Cargar datos del cliente
  useEffect(() => {
    const loadClientData = async () => {
      try {
        const clientDni = localStorage.getItem("userDni");
        if (!clientDni) {
          throw new Error("No se encontró el DNI del cliente en el almacenamiento local");
        }
          const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No se encontró token de autenticación");
        }
        const clientData = await fetchClientData(clientDni, token);
        setClient(clientData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ocurrió un error desconocido");
      } finally {
        setLoading(false);
      }
    };

    loadClientData();
  }, []);

  // Cargar planes activos cuando el cliente está disponible
  useEffect(() => {
    const loadActivePlans = async () => {
      if (!client) return;

        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No se encontró token de autenticación");
        }

      try {
        setFetchingPlans(true);
        const clientDni = client.dni;

        // Cargar planes en paralelo
        const [nutritionPlan, trainingPlan] = await Promise.all([
          fetchActiveNutritionPlan(clientDni).catch(() => null),
          fetchActiveTrainingPlan(clientDni, token).catch(() => null)
        ]);

        setActiveNutritionPlanId(nutritionPlan?.id || null);
        setActiveTrainingPlanId(trainingPlan?.id || null);
      } catch (err) {
        console.error("Error al obtener planes activos:", err);
      } finally {
        setFetchingPlans(false);
      }
    };

    loadActivePlans();
  }, [client]);

  // Handlers de navegación
  const handleNavigateToNutritionRecords = () => {
    if (activeNutritionPlanId) {
      navigate(`/client/nutrition-plans/${activeNutritionPlanId}/records`);
    } else {
      alert("No tienes un plan de nutrición activo. Contacta a tu nutricionista.");
    }
  };

  const handleNavigateToTrainingRecords = () => {
    if (activeTrainingPlanId) {
      navigate(`/client/training-plan/${activeTrainingPlanId}/records`);
    } else {
      alert("No tienes un plan de entrenamiento activo. Contacta a tu entrenador.");
    }
  };

  // Estados de carga y error
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg text-gray-600">Cargando tu información...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
        <p className="text-gray-700 mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Intentar nuevamente
        </button>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          No se encontraron datos del cliente
        </h2>
        <p className="text-gray-600">Por favor, contacta al soporte técnico.</p>
      </div>
    );
  }

  // Renderizado principal
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ClientHeader
        fullName={`${client.name} ${client.lastName}`}
        onLogout={handleLogout}
      />

      <nav className="bg-white shadow-sm">
        <ul className="container mx-auto px-4 flex">
          <li className="flex-1 text-center border-b-4 border-red-500">
            <button
              className="w-full py-4 font-medium text-red-500"
              onClick={() => navigate("/client")}
            >
              Inicio
            </button>
          </li>
          <li className="flex-1 text-center hover:bg-gray-50 transition-colors">
            <button
              onClick={() => navigate("/client/training-plan")}
              className="w-full py-4 font-medium text-gray-600 hover:text-gray-900"
            >
              Plan de Entrenamiento
            </button>
          </li>
          <li className="flex-1 text-center hover:bg-gray-50 transition-colors">
            <button
              onClick={() => navigate("/client/nutrition-plan")}
              className="w-full py-4 font-medium text-gray-600 hover:text-gray-900"
            >
              Plan de Nutrición
            </button>
          </li>
        </ul>
      </nav>

      <main className="flex-grow container mx-auto px-4 py-8">
        <section className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Bienvenido, {client.name}
          </h2>
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <p className="text-xl text-gray-600 mr-2">
                Tu objetivo: <strong className="text-indigo-600">{client.goal}</strong>
              </p>
            </div>
          </div>
          <p className="text-gray-500">
            Estamos aquí para ayudarte a alcanzar tus metas de fitness.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <section className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
              Información Personal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Nombre completo</label>
                <p className="font-medium">{client.name} {client.lastName}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">DNI</label>
                <p className="font-medium">{client.dni}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Teléfono</label>
                <p className="font-medium">{client.phoneNumber}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Email</label>
                <p className="font-medium">{client.email}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Dirección</label>
                <p className="font-medium">{client.address}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Gimnasio</label>
                <p className="font-medium">{client.gymName}</p>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
              Acciones Rápidas
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                className="flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-md transition-all"
                onClick={handleNavigateToTrainingRecords}
                disabled={fetchingPlans || !activeTrainingPlanId}
              >
                <div className="text-3xl mb-2">📝</div>
                <span className="text-sm font-medium text-center">
                  {fetchingPlans ? "Cargando..." : "Registrar entrenamiento"}
                </span>
                {!activeTrainingPlanId && !fetchingPlans && (
                  <span className="text-xs text-red-500 mt-1">Sin plan activo</span>
                )}
              </button>
              <button
                className="flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-md transition-all"
                onClick={handleNavigateToNutritionRecords}
                disabled={fetchingPlans || !activeNutritionPlanId}
              >
                <div className="text-3xl mb-2">🍽️</div>
                <span className="text-sm font-medium text-center">
                  {fetchingPlans ? "Cargando..." : "Registrar comida"}
                </span>
                {!activeNutritionPlanId && !fetchingPlans && (
                  <span className="text-xs text-red-500 mt-1">Sin plan activo</span>
                )}
              </button>
              <button
                className="flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-md transition-all"
                onClick={() => navigate(`/client/history/${client.dni}`)}
              >
                <div className="text-3xl mb-2">📜</div>
                <span className="text-sm font-medium text-center">
                  Ver mi historial
                </span>
              </button>
              <button
                className="flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-md transition-all"
                onClick={() => navigate(`/client/${client.dni}/progress`)}
              >
                <div className="text-3xl mb-2">📊</div>
                <span className="text-sm font-medium text-center">
                  Ver progreso de entrenamiento
                </span>
              </button>
              <button
                className="flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-lg hover:border-green-300 hover:shadow-md transition-all"
                onClick={() => navigate(`/client/${client.dni}/progress/nutrition`)}
              >
                <div className="text-3xl mb-2">🥗</div>
                <span className="text-sm font-medium text-center">
                  Ver progreso nutricional
                </span>
              </button>
            </div>
          </section>
        </div>
      </main>

      <FooterPag />
    </div>
  );
};

export default ClientDashboard;