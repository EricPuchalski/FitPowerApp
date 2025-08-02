// src/pages/Nutritionist/ClientNutritionRecords.tsx
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { MealTime } from '../../model/MealTime'
import { FooterPag } from '../../components/Footer'
import { NutritionistHeader } from '../../components/NutritionistHeader'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { NutritionRecordResponseDto } from '../../model/NutritionRecordResponseDto'
import {
  ArrowLeft,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Utensils,
} from "lucide-react";

interface DayRecords {
  date: string;
  dayName: string;
  records: NutritionRecordResponseDto[];
  isRestDay?: boolean;
}

export function ClientNutritionRecords() {
  const { dni, planId } = useParams<{ dni: string; planId: string }>()
  const [dayRecords, setDayRecords] = useState<DayRecords[]>([])
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0)
  const navigate = useNavigate()

  // Función para obtener el rango de la semana (Domingo a Sábado)
  const getWeekRange = (weekOffset: number) => {
    const now = new Date();
    now.setDate(now.getDate() + weekOffset * 7);

    // Ajustar para que la semana empiece en domingo (0) y termine en sábado (6)
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Restamos el día actual para llegar al domingo

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Añadimos 6 días para llegar al sábado

    return { startOfWeek, endOfWeek };
  };

  // Función para formatear fecha
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
        timeZone: "UTC",
      });
    } catch (e) {
      console.error("Error formateando fecha:", dateString, e);
      return dateString;
    }
  };

  // Función para formatear el rango de la semana
  const formatWeekRange = () => {
    const { startOfWeek, endOfWeek } = getWeekRange(currentWeekOffset);
    return `${formatDate(startOfWeek.toISOString())} - ${formatDate(
      endOfWeek.toISOString()
    )}`;
  };

  // Función para obtener el nombre del día
  const getDayName = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return (
        date
          .toLocaleDateString("es-ES", {
            weekday: "long",
            timeZone: "UTC",
          })
          .charAt(0)
          .toUpperCase() +
        date
          .toLocaleDateString("es-ES", {
            weekday: "long",
            timeZone: "UTC",
          })
          .slice(1)
      );
    } catch (e) {
      console.error("Error obteniendo día:", dateString, e);
      return dateString;
    }
  };

  useEffect(() => {
    async function fetchRecords() {
      if (!dni || !planId) return;
      
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');

      try {
        const { startOfWeek, endOfWeek } = getWeekRange(currentWeekOffset);

        const response = await fetch(
          `http://localhost:8080/api/v1/clients/${dni}/nutrition-plans/${planId}/nutrition-records?startDate=${
            startOfWeek.toISOString().split("T")[0]
          }&endDate=${endOfWeek.toISOString().split("T")[0]}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        if (!response.ok) {
          throw new Error("Error al cargar los registros");
        }

        const data: NutritionRecordResponseDto[] = await response.json();

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
            records: [],
            isRestDay: true,
          });
        }

        // Procesamos los registros de la API
        data.forEach((record: NutritionRecordResponseDto) => {
          try {
            const recordDate = new Date(record.createdAt);
            if (isNaN(recordDate.getTime())) return;

            const dateKey = recordDate.toISOString().split("T")[0];

            // Buscamos el día correspondiente en la semana
            const dayIndex = weekDays.findIndex((day) => day.date === dateKey);
            if (dayIndex === -1) return;

            // Marcamos que no es día de descanso
            weekDays[dayIndex].isRestDay = false;
            weekDays[dayIndex].records.push(record);
          } catch (e) {
            console.error("Error procesando registro:", record, e);
          }
        });

        setDayRecords(weekDays);
      } catch (err) {
        console.error("Error en fetchRecords:", err);
        const msg = err instanceof Error ? err.message : "Error desconocido";
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    }

    fetchRecords();
  }, [dni, planId, currentWeekOffset]);

  // Mantener la funcionalidad original del filtro por fecha
  const filtered = dayRecords.find(d => d.date === selectedDate)?.records || []

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
      <NutritionistHeader onLogout={() => navigate('/')} />
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Navegación */}
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-xl shadow-sm hover:bg-green-200 hover:text-green-900 transition-colors duration-200 group"
            >
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="font-semibold">Volver</span>
            </button>
          </div>

          {/* Título y navegación de semanas */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center mb-4 md:mb-0">
              <Utensils className="h-8 w-8 text-green-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">
                Registros de Nutrición - {dni} — Plan {planId}
              </h1>
            </div>

            <div className="flex items-center space-x-4 bg-white rounded-xl shadow-md border border-gray-200 p-3">
              <button
                onClick={() => setCurrentWeekOffset((prev) => prev - 1)}
                className="p-2 rounded-lg hover:bg-green-50 hover:text-green-600 transition-all duration-200 text-gray-600"
              >
                <ChevronLeft className="h-5 w-5" />
                <span className="sr-only">Semana anterior</span>
              </button>

              <span className="font-semibold text-gray-700 px-3 py-1 bg-gray-50 rounded-lg">
                {formatWeekRange()}
              </span>

              <button
                onClick={() => setCurrentWeekOffset((prev) => prev + 1)}
                className="p-2 rounded-lg hover:bg-green-50 hover:text-green-600 transition-all duration-200 text-gray-600"
              >
                <ChevronRight className="h-5 w-5" />
                <span className="sr-only">Semana siguiente</span>
              </button>
            </div>
          </div>

          {/* Selector de fecha original mantenido */}
          <div className="mb-6 bg-white rounded-xl shadow-md border border-gray-200 p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Seleccionar fecha específica:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Tabla de registros mejorada */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        Día
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        Hora
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center">
                        <Utensils className="h-4 w-4 mr-2" />
                        Comida
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Calorías
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Proteínas
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Carbs
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Grasas
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Observaciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dayRecords.map((day, dayIndex) => (
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
                            colSpan={7}
                            className="px-6 py-6 border-b border-gray-100"
                          >
                            <div className="flex items-center justify-center text-gray-500">
                              <div className="text-center">
                                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-2 mx-auto">
                                  <Utensils className="h-6 w-6 text-gray-400" />
                                </div>
                                <span className="italic font-medium">
                                  Sin registros nutricionales
                                </span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ) : day.records.length === 0 ? (
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
                            colSpan={7}
                            className="px-6 py-6 border-b border-gray-100"
                          >
                            <div className="flex items-center justify-center text-orange-600">
                              <div className="text-center">
                                <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center mb-2 mx-auto">
                                  <Calendar className="h-6 w-6 text-orange-500" />
                                </div>
                                <span className="italic font-medium">
                                  No registró comidas este día
                                </span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        day.records.map((record, recordIndex) => (
                          <tr
                            key={`${day.date}-${record.id}`}
                            className={`${
                              recordIndex === 0
                                ? "border-t-2 border-green-100"
                                : ""
                            } hover:bg-green-50 transition-colors duration-150`}
                          >
                            {recordIndex === 0 && (
                              <td
                                className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-green-50 to-transparent"
                                rowSpan={day.records.length}
                              >
                                <div className="flex flex-col">
                                  <span className="font-semibold text-gray-900">
                                    {day.dayName}
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    {formatDate(day.date)}
                                  </span>
                                  <div className="mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full inline-block w-fit">
                                    {day.records.length} registro
                                    {day.records.length > 1 ? "s" : ""}
                                  </div>
                                </div>
                              </td>
                            )}
                            <td className="px-6 py-4 border-b border-gray-100">
                              <span className="text-sm text-gray-600">
                                {new Date(record.createdAt).toLocaleTimeString()}
                              </span>
                            </td>
                            <td className="px-6 py-4 border-b border-gray-100">
                              <span className="font-medium text-gray-900">
                                {record.food}
                              </span>
                            </td>
                            <td className="px-6 py-4 border-b border-gray-100">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                {record.calories}
                              </span>
                            </td>
                            <td className="px-6 py-4 border-b border-gray-100">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {record.proteins}g
                              </span>
                            </td>
                            <td className="px-6 py-4 border-b border-gray-100">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                {record.carbohydrates}g
                              </span>
                            </td>
                            <td className="px-6 py-4 border-b border-gray-100">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                {record.fats}g
                              </span>
                            </td>
                            <td className="px-6 py-4 border-b border-gray-100">
                              {record.observations ? (
                                <div className="max-w-xs">
                                  <p
                                    className="text-sm text-gray-600 truncate"
                                    title={record.observations}
                                  >
                                    {record.observations}
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

          {/* Tabla original para fecha específica (mantenida para compatibilidad) */}
          {selectedDate && filtered.length > 0 && (
            <div className="mt-8 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Detalle del {formatDate(selectedDate)}
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-4 py-3 text-left font-semibold">Hora</th>
                      <th className="border px-4 py-3 text-left font-semibold">Comida</th>
                      <th className="border px-4 py-3 text-left font-semibold">Calorías</th>
                      <th className="border px-4 py-3 text-left font-semibold">Proteínas</th>
                      <th className="border px-4 py-3 text-left font-semibold">Carbs</th>
                      <th className="border px-4 py-3 text-left font-semibold">Grasas</th>
                      <th className="border px-4 py-3 text-left font-semibold">Obs.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(r => (
                      <tr key={r.id} className="hover:bg-gray-50">
                        <td className="border px-4 py-3">
                          {new Date(r.createdAt).toLocaleTimeString()}
                        </td>
                        <td className="border px-4 py-3 font-medium">{r.food}</td>
                        <td className="border px-4 py-3">{r.calories}</td>
                        <td className="border px-4 py-3">{r.proteins}g</td>
                        <td className="border px-4 py-3">{r.carbohydrates}g</td>
                        <td className="border px-4 py-3">{r.fats}g</td>
                        <td className="border px-4 py-3">{r.observations || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {dayRecords.length === 0 && (
            <div className="text-center py-12">
              <Utensils className="h-24 w-24 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay registros para esta semana
              </h3>
              <p className="text-gray-500">
                Los registros de nutrición aparecerán aquí una vez que se realicen.
              </p>
            </div>
          )}
        </div>
      </div>
      <FooterPag />
      <ToastContainer position="top-right" />
    </>
  )
}