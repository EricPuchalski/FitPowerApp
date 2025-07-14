//src/pages/Client/DashboardClient.tsx
import React, { useEffect, useState } from "react";
import { Client } from "../../model/Client";
import { useNavigate } from "react-router-dom";
import { FooterPag } from "../../components/Footer";
import { useAuth } from "../../auth/hook/useAuth";
import { ClientHeader } from "../../components/ClientHeader";

const ClientDashboard: React.FC = () => {
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { logout } = useAuth();



const handleLogout = () => {
  logout();
  navigate("/"); // o "/login" si tenés una ruta específica
};
  //planes
  const [activeNutritionPlanId, setActiveNutritionPlanId] = useState<
    number | null
  >(null);
  const [activeTrainingPlanId, setActiveTrainingPlanId] = useState<
    number | null
  >(null);
  const [fetchingPlans, setFetchingPlans] = useState(false);

  // editar
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [editedGoal, setEditedGoal] = useState(client?.goal);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const clientDni = localStorage.getItem("userDni");

        if (!clientDni) {
          throw new Error(
            "No se encontró el DNI del cliente en el almacenamiento local"
          );
        }

        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:8080/api/v1/clients/${clientDni}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data: Client = await response.json();
        setClient(data);
        console.log(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Ocurrió un error desconocido"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, []);

  useEffect(() => {
    const fetchActivePlans = async () => {
      try {
        if (!client) return;

        setFetchingPlans(true);
        const token = localStorage.getItem("token");
        const clientDni = client.dni;

        // Obtener plan de nutrición activo
        const nutritionResponse = await fetch(
          `http://localhost:8080/api/v1/clients/${clientDni}/nutrition-plans/active`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (nutritionResponse.ok) {
          const nutritionData = await nutritionResponse.json();
          setActiveNutritionPlanId(nutritionData.id);
        }

        // Obtener plan de entrenamiento activo
        const trainingResponse = await fetch(
          `http://localhost:8080/api/v1/training-plans/clients/${clientDni}/active`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (trainingResponse.ok) {
          const trainingData = await trainingResponse.json();
          if (trainingData && trainingData.id) {
            setActiveTrainingPlanId(trainingData.id);
          }
        }
      } catch (err) {
        console.error("Error al obtener planes activos:", err);
      } finally {
        setFetchingPlans(false);
      }
    };

    fetchActivePlans();
  }, [client]);

  // Funciones para manejar la navegación
  const handleNavigateToNutritionRecords = () => {
    if (activeNutritionPlanId) {
      navigate(`/client/nutrition-plans/${activeNutritionPlanId}/records`);
    } else {
      // Puedes mostrar un toast o mensaje indicando que no hay plan activo
      alert(
        "No tienes un plan de nutrición activo. Contacta a tu nutricionista."
      );
    }
  };

  const handleNavigateToTrainingRecords = () => {
    if (activeTrainingPlanId) {
      navigate(`/client/training-plan/${activeTrainingPlanId}/records`);
    } else {
      // Puedes mostrar un toast o mensaje indicando que no hay plan activo
      alert(
        "No tienes un plan de entrenamiento activo. Contacta a tu entrenador."
      );
    }
  };

  const handleUpdateGoal = async () => {
    try {
      setIsSaving(true);
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8080/api/v1/clients/${client?.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            goal: editedGoal,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const updatedClient = await response.json();
      setClient(updatedClient);
      setIsEditingGoal(false);
    } catch (err) {
      console.error("Error al actualizar el objetivo:", err);
      // Puedes agregar un toast o mensaje de error aquí
    } finally {
      setIsSaving(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <ClientHeader fullName={client.name + " " + client.lastName} onLogout={handleLogout} />



      {/* Navigation */}
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

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <section className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Bienvenido, {client.name}
          </h2>
          <div className="flex items-center justify-center">
            {isEditingGoal ? (
              <div className="flex items-center">
                <input
                  type="text"
                  value={editedGoal}
                  onChange={(e) => setEditedGoal(e.target.value)}
                  className="text-xl text-gray-600 border-b border-indigo-600 px-2 py-1 mr-2 focus:outline-none"
                />
                <button
                  onClick={handleUpdateGoal}
                  disabled={isSaving}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
                >
                  {isSaving ? "Guardando..." : "Guardar"}
                </button>
                <button
                  onClick={() => {
                    setIsEditingGoal(false);
                    setEditedGoal(client.goal);
                  }}
                  className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 ml-2"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <div className="flex items-center">
                <p className="text-xl text-gray-600 mr-2">
                  Tu objetivo:{" "}
                  <strong className="text-indigo-600">{client.goal}</strong>
                </p>
                <button
                  onClick={() => setIsEditingGoal(true)}
                  className="text-gray-500 hover:text-indigo-600 focus:outline-none"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
          <p className="text-gray-500">
            Estamos aquí para ayudarte a alcanzar tus metas de fitness.
          </p>
        </section>

        {/* Cards Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Personal Info Card */}
          <section className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
              Información Personal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">
                  Nombre completo
                </label>
                <p className="font-medium">
                  {client.name} {client.lastName}
                </p>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">DNI</label>
                <p className="font-medium">{client.dni}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">
                  Teléfono
                </label>
                <p className="font-medium">{client.phoneNumber}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">
                  Email
                </label>
                <p className="font-medium">{client.email}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">
                  Dirección
                </label>
                <p className="font-medium">{client.address}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">
                  Gimnasio
                </label>
                <p className="font-medium">{client.gymName}</p>
              </div>
            </div>
          </section>

          {/* Quick Actions Card */}
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
                  <span className="text-xs text-red-500 mt-1">
                    Sin plan activo
                  </span>
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
                  <span className="text-xs text-red-500 mt-1">
                    Sin plan activo
                  </span>
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
                  Ver mi progreso
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

      {/* Footer */}
      <FooterPag></FooterPag>
    </div>
  );
};

export default ClientDashboard;
