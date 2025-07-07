"use client"

import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FooterPag } from "../../components/Footer";
import {
  FiTarget,
  FiCalendar,
  FiUser,
  FiActivity,
  FiHeart,
  FiClipboard,
  FiBook,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

// Utility function to get today's date in YYYY-MM-DD format
// Función utilitaria para obtener la fecha local en formato YYYY-MM-DD
const getLocalISODate = (date) => {
  const d = new Date(date);
  // Ajustamos la fecha según la zona horaria local
  const offset = d.getTimezoneOffset() * 60000; // offset en milisegundos
  const localDate = new Date(d.getTime() - offset);
  return localDate.toISOString().split('T')[0];
};

// Función utilitaria para verificar coincidencia de fechas
const isDateMatch = (recordDate, selectedDate) => {
  const recordDateOnly = getLocalISODate(recordDate);
  return recordDateOnly === selectedDate;
};

// Función para obtener la fecha actual en formato YYYY-MM-DD (local)
const getTodayDate = () => {
  return getLocalISODate(new Date());
};
const DateNavigation = ({ selectedDate, onDateChange }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const dateInputRef = useRef(null);

  const formatDisplayDate = (dateString) => {
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset() * 60000;
    const adjustedDate = new Date(date.getTime() + offset);
    return adjustedDate.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handlePreviousDay = () => {
    const previousDate = new Date(selectedDate);
    previousDate.setDate(previousDate.getDate() - 1);
    onDateChange(previousDate.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const nextDate = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() + 1);
    const nextDateStr = nextDate.toISOString().split('T')[0];
    const todayStr = getTodayDate();
    
    if (nextDateStr <= todayStr) {
      onDateChange(nextDateStr);
    }
  };

  const isNextDisabled = () => {
    const nextDate = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() + 1);
    return nextDate.toISOString().split('T')[0] > getTodayDate();
  };

  const handleDateChange = (e) => {
    onDateChange(e.target.value);
    setShowDatePicker(false);
  };

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <button
          onClick={handlePreviousDay}
          className="flex items-center px-3 py-2 rounded-lg transition-colors bg-blue-500 text-white hover:bg-blue-600"
        >
          <FiChevronLeft className="mr-1" />
          Día Anterior
        </button>

        <div className="relative">
          <button
            onClick={toggleDatePicker}
            className="flex items-center px-3 py-2 rounded-lg transition-colors bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            <FiCalendar className="mr-2" />
            <span className="text-sm font-medium">
              {formatDisplayDate(selectedDate)}
            </span>
          </button>
          
          {showDatePicker && (
            <div className="absolute mt-1 z-10 bg-white p-2 rounded-lg shadow-lg border border-gray-200">
              <input
                type="date"
                ref={dateInputRef}
                value={selectedDate}
                onChange={handleDateChange}
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                max={getTodayDate()}
              />
            </div>
          )}
        </div>

        <button
          onClick={handleNextDay}
          disabled={isNextDisabled()}
          className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
            isNextDisabled()
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          Día Siguiente
          <FiChevronRight className="ml-1" />
        </button>
      </div>
    </div>
  );
};
const TrainingPlanCard = ({ plan }) => {
  const groupByDay = (routines) => {
    return routines.reduce((acc, routine) => {
      const day = routine.day.toUpperCase();
      if (!acc[day]) acc[day] = [];
      acc[day].push(routine);
      return acc;
    }, {});
  };

  const routinesByDay = groupByDay(plan.exerciseRoutines || []);

  const dayOrder = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

  const dayLabels = {
    MONDAY: "Lunes",
    TUESDAY: "Martes",
    WEDNESDAY: "Miércoles",
    THURSDAY: "Jueves",
    FRIDAY: "Viernes",
    SATURDAY: "Sábado",
    SUNDAY: "Domingo",
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-bold text-xl">{plan.name}</h4>
            <p className="text-blue-100 text-sm opacity-90">
              Creado el {new Date(plan.createdAt).toLocaleDateString()}
            </p>
          </div>
          <span
            className={`px-3 py-1 text-xs rounded-full font-semibold ${
              plan.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
            }`}
          >
            {plan.active ? "Activo" : "Inactivo"}
          </span>
        </div>
      </div>

      {/* Trainer Info */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0 bg-indigo-100 p-2 rounded-full">
            <FiUser className="text-indigo-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{plan.trainerName}</p>
            <p className="text-sm text-gray-500">{plan.trainerSpecification}</p>
          </div>
        </div>
      </div>

      {/* Client Goal */}
      <div className="p-4 bg-blue-50 border-b border-blue-100">
        <div className="flex items-start">
          <FiTarget className="flex-shrink-0 text-blue-500 mt-0.5 mr-2" />
          <div>
            <p className="text-sm font-semibold text-blue-800">Objetivo del cliente:</p>
            <p className="text-gray-700">{plan.clientGoal}</p>
          </div>
        </div>
      </div>

      {/* Exercise Routines */}
      {plan.exerciseRoutines?.length > 0 && (
        <div className="p-4">
          <div className="flex items-center mb-4 text-indigo-700">
            <FiActivity className="mr-2" />
            <h5 className="font-semibold text-lg">Rutinas de Ejercicios</h5>
            <span className="ml-auto bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {plan.exerciseRoutines.length} ejercicios
            </span>
          </div>

          <div className="space-y-4">
            {dayOrder.map((day) => (
              routinesByDay[day]?.length > 0 && (
                <div key={day} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                    <h6 className="font-medium text-gray-800 flex items-center">
                      <FiCalendar className="mr-2 text-indigo-500" />
                      {dayLabels[day] || day}
                    </h6>
                  </div>
                  <ul className="divide-y divide-gray-200">
                    {routinesByDay[day].map((routine, index) => (
                      <li key={index} className="p-3 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between">
                          <p className="font-medium text-gray-900">{routine.exerciseName}</p>
                          <div className="flex space-x-3 text-xs text-gray-500">
                            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                              {routine.series} series
                            </span>
                            <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                              {routine.repetitions} repes
                            </span>
                            {routine.weight && (
                              <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                                {routine.weight} kg
                              </span>
                            )}
                          </div>
                        </div>
                        {routine.restTime && (
                          <p className="text-xs text-gray-500 mt-1">
                            <span className="font-medium">Descanso:</span> {routine.restTime}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const TrainingRecordsContent = ({ trainingRecords, selectedDate, onDateChange }) => (
  <div>
    <DateNavigation selectedDate={selectedDate} onDateChange={onDateChange} />
    {trainingRecords.length > 0 ? (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Hora</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ejercicio</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Series</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Reps</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Peso</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Descanso</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Observación</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {trainingRecords.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="px-3 py-2 text-gray-600">
                  {new Date(record.createdAt).toLocaleTimeString()}
                </td>
                <td className="px-3 py-2 text-gray-900 font-medium">
                  {record.exerciseName || "-"}
                </td>
                <td className="px-3 py-2 text-gray-600">{record.series}</td>
                <td className="px-3 py-2 text-gray-600">{record.repetitions}</td>
                <td className="px-3 py-2 text-gray-600">{record.weight} kg</td>
                <td className="px-3 py-2 text-gray-600">{record.restTime || "-"}</td>
                <td className="px-3 py-2 text-gray-600">
                  {record.observation || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <div className="text-center py-8">
        <FiCalendar className="mx-auto text-4xl text-gray-400 mb-2" />
        <p className="text-gray-600">No hay registros de entrenamiento para esta fecha</p>
      </div>
    )}
  </div>
);

const PaginationControls = ({ currentIndex, totalItems, onPrevious, onNext, itemName }) => (
  <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
    <button
      onClick={onPrevious}
      disabled={currentIndex === 0}
      className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
        currentIndex === 0
          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
          : 'bg-blue-500 text-white hover:bg-blue-600'
      }`}
    >
      <FiChevronLeft className="mr-1" />
      Anterior
    </button>

    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600">
        {itemName} {currentIndex + 1} de {totalItems}
      </span>
    </div>

    <button
      onClick={onNext}
      disabled={currentIndex === totalItems - 1}
      className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
        currentIndex === totalItems - 1
          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
          : 'bg-blue-500 text-white hover:bg-blue-600'
      }`}
    >
      Siguiente
      <FiChevronRight className="ml-1" />
    </button>
  </div>
);

const TrainingPlansContent = ({ trainingPlans, currentPlan, setCurrentPlan }) => {
  if (trainingPlans.length === 0) {
    return <p className="text-gray-600 text-center py-4">No hay planes de entrenamiento</p>;
  }

  const handlePrevious = () => {
    if (currentPlan > 0) {
      setCurrentPlan(currentPlan - 1);
    }
  };

  const handleNext = () => {
    if (currentPlan < trainingPlans.length - 1) {
      setCurrentPlan(currentPlan + 1);
    }
  };

  return (
    <div>
      <PaginationControls
        currentIndex={currentPlan}
        totalItems={trainingPlans.length}
        onPrevious={handlePrevious}
        onNext={handleNext}
        itemName="Plan"
      />
      <TrainingPlanCard plan={trainingPlans[currentPlan]} />
    </div>
  );
};

const NutritionPlanCard = ({ plan }) => (
  <div className="bg-white border rounded-lg p-4 shadow-sm">
    <div className="flex justify-between items-start mb-3">
      <div>
        <h4 className="font-bold text-lg text-gray-800">{plan.name}</h4>
        <p className="text-sm text-gray-600">Creado el: {new Date(plan.createdAt).toLocaleDateString()}</p>
        <p className="text-sm text-gray-600">Actualizado el: {new Date(plan.updatedAt).toLocaleDateString()}</p>
      </div>
      <span
        className={`px-2 py-1 text-xs rounded-full ${
          plan.active ? "bg-green-200 text-green-800" : "bg-gray-200 text-gray-800"
        }`}
      >
        {plan.active ? "Activo" : "Inactivo"}
      </span>
    </div>

    <p className="text-sm mb-4">
      <span className="font-semibold text-gray-700">Nutricionista:</span> {plan.nutritionistName}
    </p>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
      <div className="bg-orange-50 p-3 rounded-lg text-center">
        <FiTarget className="mx-auto mb-1 text-orange-600" />
        <p className="text-xs text-orange-700">Meta calórica</p>
        <p className="font-bold text-orange-900">{plan.caloricTarget}</p>
        <p className="text-xs text-orange-700">kcal</p>
      </div>
      <div className="bg-orange-50 p-3 rounded-lg text-center">
        <p className="text-xs text-orange-700">Carbohidratos</p>
        <p className="font-bold text-orange-900">{plan.dailyCarbs}</p>
        <p className="text-xs text-orange-700">gramos</p>
      </div>
      <div className="bg-orange-50 p-3 rounded-lg text-center">
        <p className="text-xs text-orange-700">Proteínas</p>
        <p className="font-bold text-orange-900">{plan.dailyProteins}</p>
        <p className="text-xs text-orange-700">gramos</p>
      </div>
      <div className="bg-orange-50 p-3 rounded-lg text-center">
        <p className="text-xs text-orange-700">Grasas</p>
        <p className="font-bold text-orange-900">{plan.dailyFats}</p>
        <p className="text-xs text-orange-700">gramos</p>
      </div>
    </div>

    <div className="bg-gray-50 p-3 rounded-lg">
      <p className="text-sm font-semibold mb-2 text-gray-700">Recomendaciones:</p>
      <p className="text-sm text-gray-600">{plan.recommendations}</p>
    </div>
  </div>
);

const NutritionPlansContent = ({ nutritionPlans, currentPlan, setCurrentPlan }) => {
  if (nutritionPlans.length === 0) {
    return <p className="text-gray-600 text-center py-4">No hay planes de nutrición</p>;
  }

  const handlePrevious = () => {
    if (currentPlan > 0) {
      setCurrentPlan(currentPlan - 1);
    }
  };

  const handleNext = () => {
    if (currentPlan < nutritionPlans.length - 1) {
      setCurrentPlan(currentPlan + 1);
    }
  };

  return (
    <div>
      <PaginationControls
        currentIndex={currentPlan}
        totalItems={nutritionPlans.length}
        onPrevious={handlePrevious}
        onNext={handleNext}
        itemName="Plan"
      />
      <NutritionPlanCard plan={nutritionPlans[currentPlan]} />
    </div>
  );
};

const NutritionRecordsContent = ({ nutritionRecords, selectedDate, onDateChange }) => (
  <div>
    <DateNavigation selectedDate={selectedDate} onDateChange={onDateChange} />
    {nutritionRecords.length > 0 ? (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Hora</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Comida</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Momento</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Calorías</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Proteínas</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Carbohidratos</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Grasas</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Observaciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {nutritionRecords.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="px-3 py-2 text-gray-600">
                  {new Date(record.createdAt).toLocaleTimeString()}
                </td>
                <td className="px-3 py-2 text-gray-900 font-medium">{record.food}</td>
                <td className="px-3 py-2 text-gray-600">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {record.mealTime}
                  </span>
                </td>
                <td className="px-3 py-2 text-gray-600">{record.calories} kcal</td>
                <td className="px-3 py-2 text-gray-600">{record.proteins}g</td>
                <td className="px-3 py-2 text-gray-600">{record.carbohydrates}g</td>
                <td className="px-3 py-2 text-gray-600">{record.fats}g</td>
                <td className="px-3 py-2 text-gray-600">
                  {record.observations || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <div className="text-center py-8">
        <FiHeart className="mx-auto text-4xl text-gray-400 mb-2" />
        <p className="text-gray-600">No hay registros de nutrición para esta fecha</p>
        <p className="text-sm text-gray-500 mt-1">
          Fecha seleccionada: {new Date(selectedDate).toLocaleDateString()}
        </p>
      </div>
    )}
  </div>
);

const ClientHistory = () => {
  const { dni } = useParams<{ dni: string }>();
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('trainingPlans');
  const [currentTrainingPlan, setCurrentTrainingPlan] = useState(0);
  const [currentNutritionPlan, setCurrentNutritionPlan] = useState(0);
  const [trainingRecordsDate, setTrainingRecordsDate] = useState(getTodayDate());
  const [nutritionRecordsDate, setNutritionRecordsDate] = useState(getTodayDate());

  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:8080/api/v1/clients/${dni}/history`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
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

  const filteredTrainingRecords = history.trainingRecords.filter(record =>
    isDateMatch(record.createdAt, trainingRecordsDate)
  );

  const filteredNutritionRecords = history.nutritionRecords.filter(record =>
    isDateMatch(record.createdAt, nutritionRecordsDate)
  );

  const tabs = [
    {
      id: 'trainingPlans',
      title: 'Planes de Entrenamiento',
      icon: <FiActivity className="mr-2" />,
      count: history.trainingPlans.length,
      color: 'green'
    },
    {
      id: 'nutritionPlans',
      title: 'Planes de Nutrición',
      icon: <FiHeart className="mr-2" />,
      count: history.nutritionPlans.length,
      color: 'orange'
    },
    {
      id: 'trainingRecords',
      title: 'Registros de Entrenamiento',
      icon: <FiBook className="mr-2" />,
      count: filteredTrainingRecords.length,
      color: 'purple'
    },
    {
      id: 'nutritionRecords',
      title: 'Registros de Nutrición',
      icon: <FiCalendar className="mr-2" />,
      count: filteredNutritionRecords.length,
      color: 'pink'
    }
  ];

  const getActiveContent = () => {
    switch (activeTab) {
      case 'trainingPlans':
        return (
          <TrainingPlansContent
            trainingPlans={history.trainingPlans}
            currentPlan={currentTrainingPlan}
            setCurrentPlan={setCurrentTrainingPlan}
          />
        );
      case 'nutritionPlans':
        return (
          <NutritionPlansContent
            nutritionPlans={history.nutritionPlans}
            currentPlan={currentNutritionPlan}
            setCurrentPlan={setCurrentNutritionPlan}
          />
        );
      case 'trainingRecords':
        return (
          <TrainingRecordsContent
            trainingRecords={filteredTrainingRecords}
            selectedDate={trainingRecordsDate}
            onDateChange={setTrainingRecordsDate}
          />
        );
      case 'nutritionRecords':
        return (
          <NutritionRecordsContent
            nutritionRecords={filteredNutritionRecords}
            selectedDate={nutritionRecordsDate}
            onDateChange={setNutritionRecordsDate}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
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

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg p-6 mb-8 text-white">
          <div className="flex items-center mb-4">
            <FiUser className="text-3xl mr-3" />
            <div>
              <h2 className="text-3xl font-bold">{history.clientName}</h2>
              <p className="text-blue-100">Historial Completo del Cliente</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center mb-2">
                <FiClipboard className="text-xl mr-2" />
                <span className="font-semibold">DNI</span>
              </div>
              <p className="text-xl font-bold">{history.clientDni}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center mb-2">
                <FiTarget className="text-xl mr-2" />
                <span className="font-semibold">Objetivo</span>
              </div>
              <p className="text-xl font-bold">{history.clientGoal}</p>
            </div>
          </div>
        </div>

        {/* Navegación por pestañas */}
        <div className="mb-6">
          <nav className="flex flex-wrap gap-2" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.id
                    ? `bg-${tab.color}-500 text-white shadow`
                    : `text-${tab.color}-700 hover:text-${tab.color}-900 hover:bg-${tab.color}-100`
                }`}
              >
                {tab.icon}
                {tab.title}
                {tab.count > 0 && (
                  <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                    activeTab === tab.id ? 'bg-white text-' + tab.color + '-600' : 'bg-' + tab.color + '-200 text-' + tab.color + '-800'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Contenido activo */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {getActiveContent()}
        </div>
      </main>

      <FooterPag />
    </div>
  );
};

export default ClientHistory;