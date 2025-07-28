"use client";

import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Weight,
  RotateCcw,
} from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TrainerHeader } from "../../components/TrainerHeader";
import { FooterPag } from "../../components/Footer";
import { useAuth } from "../../auth/hook/useAuth";
import { TrainingRecord } from "../../model/TrainingRecord";
import { formatDate, getDayName, getWeekRange, formatWeekRange } from "../../utils/DateUtils";
import { fetchTrainingRecords } from "../../services/TrainingRecordService";

interface DayRecords {
  date: string;
  dayName: string;
  exercises: TrainingRecord[];
  isRestDay?: boolean;
}

export default function TrainingPlanRecords() {
  const { clientDni, idPlan } = useParams<{
    clientDni: string;
    idPlan: string;
  }>();
  const [records, setRecords] = useState<DayRecords[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    async function fetchRecords() {
      setLoading(true);
      setError(null);

      try {
        const { startOfWeek } = getWeekRange(currentWeekOffset);
        const data = await fetchTrainingRecords(clientDni!, idPlan!);

        // Primero creamos todos los días de la semana
        const weekDays: DayRecords[] = [];
        const currentDate = new Date(startOfWeek);

        // Generamos los 7 días de la semana
        for (let i = 0; i < 7; i++) {
          const date = new Date(currentDate);
          date.setDate(currentDate.getDate() + i);
          const dateKey = date.toISOString().split("T")[0];
          const dayName = getDayName(dateKey);

          weekDays.push({
            date: dateKey,
            dayName: dayName,
            exercises: [],
            isRestDay: true,
          });
        }

        // Procesamos los registros de la API
        data.forEach((record: TrainingRecord) => {
          try {
            const recordDate = new Date(record.createdAt);
            if (isNaN(recordDate.getTime())) return;

            const dateKey = recordDate.toISOString().split("T")[0];

            // Buscamos el día correspondiente en la semana
            const dayIndex = weekDays.findIndex((day) => day.date === dateKey);
            if (dayIndex === -1) return;

            // Marcamos que no es día de descanso
            weekDays[dayIndex].isRestDay = false;
            weekDays[dayIndex].exercises.push(record);
          } catch (e) {
            console.error("Error procesando registro:", record, e);
          }
        });

        setRecords(weekDays);
      } catch (err) {
        console.error("Error en fetchRecords:", err);
        const msg = err instanceof Error ? err.message : "Error desconocido";
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    }

    if (clientDni && idPlan) fetchRecords();
  }, [clientDni, idPlan, currentWeekOffset]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <TrainerHeader onLogout={handleLogout} />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Navegación */}
          <div className="flex justify-between items-center mb-8">
            <Link
              to={`/trainer/client/${clientDni}/training-plans`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-xl shadow-sm hover:bg-blue-200 hover:text-blue-900 transition-colors duration-200 group"
            >
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="font-semibold">Volver al plan</span>
            </Link>
          </div>

          {/* Título y navegación de semanas */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center mb-4 md:mb-0">
              <Calendar className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">
                Registros de Entrenamiento
              </h1>
            </div>

            <div className="flex items-center space-x-4 bg-white rounded-xl shadow-md border border-gray-200 p-3">
              <button
                onClick={() => setCurrentWeekOffset((prev) => prev - 1)}
                className="p-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 text-gray-600"
              >
                <ChevronLeft className="h-5 w-5" />
                <span className="sr-only">Semana anterior</span>
              </button>

              <span className="font-semibold text-gray-700 px-3 py-1 bg-gray-50 rounded-lg">
                {formatWeekRange(currentWeekOffset)}
              </span>

              <button
                onClick={() => setCurrentWeekOffset((prev) => prev + 1)}
                className="p-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 text-gray-600"
              >
                <ChevronRight className="h-5 w-5" />
                <span className="sr-only">Semana siguiente</span>
              </button>
            </div>
          </div>

          {/* Tabla de registros mejorada */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        Día
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Ejercicio
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Series
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Repeticiones
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center">
                        <Weight className="h-4 w-4 mr-2" />
                        Peso (kg)
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Descanso
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Observaciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((day, dayIndex) => (
                    <>
                      {day.isRestDay ? (
                        <tr
                          key={day.date}
                          className="bg-gray-50 hover:bg-gray-100 transition-colors duration-150"
                        >
                          <td className="px-6 py-6 border-b border-gray-100">
                            <div className="flex flex-col">
                              <span className="font-semibold text-gray-900">
                                {day.dayName}
                              </span>
                              <span className="text-sm text-gray-500">
                                {formatDate(day.date)}
                              </span>
                            </div>
                          </td>
                          <td
                            colSpan={6}
                            className="px-6 py-6 border-b border-gray-100"
                          >
                            <div className="flex items-center justify-center text-gray-500">
                              <div className="text-center">
                                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-2 mx-auto">
                                  <Clock className="h-6 w-6 text-gray-400" />
                                </div>
                                <span className="italic font-medium">
                                  Día de descanso
                                </span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ) : day.exercises.length === 0 ? (
                        <tr
                          key={day.date}
                          className="bg-orange-50 hover:bg-orange-100 transition-colors duration-150"
                        >
                          <td className="px-6 py-6 border-b border-gray-100">
                            <div className="flex flex-col">
                              <span className="font-semibold text-gray-900">
                                {day.dayName}
                              </span>
                              <span className="text-sm text-gray-500">
                                {formatDate(day.date)}
                              </span>
                            </div>
                          </td>
                          <td
                            colSpan={6}
                            className="px-6 py-6 border-b border-gray-100"
                          >
                            <div className="flex items-center justify-center text-orange-600">
                              <div className="text-center">
                                <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center mb-2 mx-auto">
                                  <Calendar className="h-6 w-6 text-orange-500" />
                                </div>
                                <span className="italic font-medium">
                                  No entrenó este día
                                </span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        day.exercises.map((exercise, exerciseIndex) => (
                          <tr
                            key={`${day.date}-${exercise.id}`}
                            className={`${
                              exerciseIndex === 0
                                ? "border-t-2 border-blue-100"
                                : ""
                            } hover:bg-blue-50 transition-colors duration-150`}
                          >
                            {exerciseIndex === 0 && (
                              <td
                                className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-transparent"
                                rowSpan={day.exercises.length}
                              >
                                <div className="flex flex-col">
                                  <span className="font-semibold text-gray-900">
                                    {day.dayName}
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    {formatDate(day.date)}
                                  </span>
                                  <div className="mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full inline-block w-fit">
                                    {day.exercises.length} ejercicio
                                    {day.exercises.length > 1 ? "s" : ""}
                                  </div>
                                </div>
                              </td>
                            )}
                            <td className="px-6 py-4 border-b border-gray-100">
                              <span className="font-medium text-gray-900">
                                {exercise.exerciseName}
                              </span>
                            </td>
                            <td className="px-6 py-4 border-b border-gray-100">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {exercise.series}
                              </span>
                            </td>
                            <td className="px-6 py-4 border-b border-gray-100">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {exercise.repetitions}
                              </span>
                            </td>
                            <td className="px-6 py-4 border-b border-gray-100">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                {exercise.weight} kg
                              </span>
                            </td>
                            <td className="px-6 py-4 border-b border-gray-100">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                {exercise.restTime}
                              </span>
                            </td>
                            <td className="px-6 py-4 border-b border-gray-100">
                              {exercise.observation ? (
                                <div className="max-w-xs">
                                  <p
                                    className="text-sm text-gray-600 truncate"
                                    title={exercise.observation}
                                  >
                                    {exercise.observation}
                                  </p>
                                </div>
                              ) : (
                                <span className="text-gray-400 text-sm italic">
                                  Sin observaciones
                                </span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {records.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="h-24 w-24 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay registros para esta semana
              </h3>
              <p className="text-gray-500">
                Los registros de entrenamiento aparecerán aquí una vez que se
                realicen.
              </p>
            </div>
          )}
        </div>
      </div>
      <FooterPag />
    </>
  );
}