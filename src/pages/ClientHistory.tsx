import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FooterPag } from '../components/Footer';
import { ClientHistoryResponse } from "../model/ClientHistory";
import { FiArrowRight, FiTarget, FiCalendar, FiUser } from 'react-icons/fi';

const ClientHistory: React.FC = () => {
  const { dni } = useParams<{ dni: string }>();
  const [history, setHistory] = useState<ClientHistoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:8080/api/v1/clients/${dni}/history`,
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

        const data: ClientHistoryResponse = await response.json();
        setHistory(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ocurrió un error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [dni]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!history) {
    return <div>No se encontró historial para este cliente</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-indigo-800 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">FITPOWER</h1>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </header>


      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-blue-50 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-blue-800">
              Historial de {history.clientName}
            </h2>
          </div>

          <ClientInfoSection history={history} />
          <TrainingPlansSection trainingPlans={history.trainingPlans} />
          <TrainingRecordsSection trainingRecords={history.trainingRecords} />
          <NutritionPlansSection nutritionPlans={history.nutritionPlans} />
          <NutritionRecordsSection nutritionRecords={history.nutritionRecords} />
        </div>
      </main>

      {/* Footer */}
      <FooterPag />
    </div>
  );
};

const Section = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-blue-800 border-b-2 border-blue-300 pb-2">
          {title}
        </h3>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-2 bg-blue-300 text-blue-800 rounded hover:bg-blue-400 transition-colors"
        >
          {isOpen ? "Ocultar" : "Mostrar"}
        </button>
      </div>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

const ClientInfoSection = ({ history }) => (
  <Section title="Información del Cliente">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white p-4 rounded shadow">
        <p className="text-sm text-gray-600">DNI</p>
        <p className="font-medium text-blue-700">{history.clientDni}</p>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <p className="text-sm text-gray-600">Objetivo</p>
        <p className="font-medium text-blue-700">{history.clientGoal}</p>
      </div>
    </div>
  </Section>
);

const TrainingPlansSection = ({ trainingPlans }) => (
  <Section title={`Planes de Entrenamiento (${trainingPlans.length})`}>
    {trainingPlans.map((plan) => (
      <TrainingPlanCard key={plan.id} plan={plan} />
    ))}
  </Section>
);

const TrainingPlanCard = ({ plan }) => (
  <div className="mb-6 border rounded-lg p-4 bg-white shadow-lg">
    <div className="flex justify-between items-start mb-2">
      <div>
        <h4 className="font-bold text-lg text-blue-800">{plan.name}</h4>
        <p className="text-sm text-gray-600">
          Creado el: {new Date(plan.createdAt).toLocaleDateString()}
        </p>
      </div>
      <span
        className={`px-2 py-1 text-xs rounded-full ${
          plan.active
            ? "bg-green-200 text-green-800"
            : "bg-gray-200 text-gray-800"
        }`}
      >
        {plan.active ? "Activo" : "Inactivo"}
      </span>
    </div>
    <p className="text-sm mb-3">
      <span className="font-semibold text-blue-700">Entrenador:</span> {plan.trainerName} ({plan.trainerDni})
    </p>
    <p className="text-sm mb-3">
      <span className="font-semibold text-blue-700">Especialización:</span> {plan.trainerSpecification}
    </p>
    <h5 className="font-semibold mt-4 mb-2 text-blue-700">Rutinas:</h5>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-blue-100">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
              Ejercicio
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
              Series
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
              Reps
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
              Peso
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
              Día
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {plan.exerciseRoutines.map((routine) => (
            <tr key={routine.routineId}>
              <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                {routine.exerciseName}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">
                {routine.series}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">
                {routine.repetitions}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">
                {routine.weight} kg
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">
                {routine.day}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const TrainingRecordsSection = ({ trainingRecords }) => (
  <Section title={`Registros de Entrenamiento (${trainingRecords.length})`}>
    {trainingRecords.length > 0 ? (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-100">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                Observación
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                Series
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                Reps
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                Peso
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {trainingRecords.map((record) => (
              <tr key={record.id}>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">
                  {new Date(record.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">
                  {record.observation || "-"}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">
                  {record.series}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">
                  {record.repetitions}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">
                  {record.weight} kg
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <p className="text-gray-600">No hay registros de entrenamiento</p>
    )}
  </Section>
);

const NutritionPlansSection = ({ nutritionPlans }) => (
  <Section title={`Planes de Nutrición (${nutritionPlans.length})`}>
    {nutritionPlans.map((plan) => (
      <NutritionPlanCard key={plan.id} plan={plan} />
    ))}
  </Section>
);

const NutritionPlanCard = ({ plan }) => (
  <div className="mb-6 border rounded-lg p-4 bg-white shadow-lg">
    <div className="flex justify-between items-start mb-2">
      <div>
        <h4 className="font-bold text-lg text-blue-800">{plan.name}</h4>
        <p className="text-sm text-gray-600">
          Creado el: {new Date(plan.createdAt).toLocaleDateString()}
        </p>
      </div>
      <span
        className={`px-2 py-1 text-xs rounded-full ${
          plan.active ? "bg-green-200 text-green-800" : "bg-gray-200 text-gray-800"
        }`}
      >
        {plan.active ? "Activo" : "Inactivo"}
      </span>
    </div>
    <p className="text-sm mb-3">
      <span className="font-semibold text-blue-700">Nutricionista:</span> {plan.nutritionistName} ({plan.nutritionistDni})
    </p>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
      <div className="bg-blue-100 p-4 rounded">
        <p className="text-sm text-blue-700">Meta calórica</p>
        <p className="font-medium text-blue-900">{plan.caloricTarget} kcal</p>
      </div>
      <div className="bg-blue-100 p-4 rounded">
        <p className="text-sm text-blue-700">Carbohidratos</p>
        <p className="font-medium text-blue-900">{plan.dailyCarbs}g</p>
      </div>
      <div className="bg-blue-100 p-4 rounded">
        <p className="text-sm text-blue-700">Proteínas</p>
        <p className="font-medium text-blue-900">{plan.dailyProteins}g</p>
      </div>
      <div className="bg-blue-100 p-4 rounded">
        <p className="text-sm text-blue-700">Grasas</p>
        <p className="font-medium text-blue-900">{plan.dailyFats}g</p>
      </div>
    </div>
    <div>
      <p className="text-sm font-semibold mb-1 text-blue-700">Recomendaciones:</p>
      <p className="text-sm text-gray-700">{plan.recommendations}</p>
    </div>
  </div>
  
);

const NutritionRecordsSection = ({ nutritionRecords }) => (
  <Section title={`Registros de Nutrición (${nutritionRecords.length})`}>
    {nutritionRecords.length > 0 ? (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-100">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                Comida
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                Calorías
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                Momento
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                Observaciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {nutritionRecords.map((record) => (
              <tr key={record.id}>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">
                  {new Date(record.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                  {record.food}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">
                  {record.calories} kcal
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">
                  {record.mealTime}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">
                  {record.observations || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <p className="text-gray-600">No hay registros de nutrición</p>
    )}
    
  </Section>
  
);

export default ClientHistory;
