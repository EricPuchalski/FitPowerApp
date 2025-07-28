"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { FooterPag } from "../../components/Footer"
import { ClientHeader } from "../../components/ClientHeader"
import { useAuth } from "../../auth/hook/useAuth"
import { Calendar, Download, Dumbbell, Clock, Hash, Weight, FileText, Activity } from "lucide-react"
import { fetchActiveTrainingPlan } from "../../services/TrainingPlanService"
import { TrainingPlan } from "../../model/TrainingPlan"
import { ExerciseRoutine } from "../../model/ExerciseRoutine"
import { generateTrainingPlanPDF } from "../../services/PdfService"



const TrainingPlanPage = () => {
  const { getUserDni, logout } = useAuth()
  const [trainingPlan, setTrainingPlan] = useState<TrainingPlan | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [isDownloading, setIsDownloading] = useState<boolean>(false)
  const navigate = useNavigate()

  // Organizar ejercicios por día
  const [exercisesByDay, setExercisesByDay] = useState<Record<string, ExerciseRoutine[]>>({
    MONDAY: [],
    TUESDAY: [],
    WEDNESDAY: [],
    THURSDAY: [],
    FRIDAY: [],
    SATURDAY: [],
    SUNDAY: [],
  })

  useEffect(() => {
    const loadTrainingPlan = async () => {
      try {
        const clientDni = getUserDni()
        if (!clientDni) {
          throw new Error("No se encontró el DNI del cliente")
        }

        // Usamos el servicio 
        const plan = await fetchActiveTrainingPlan(clientDni)
        setTrainingPlan(plan)

        // Organizar ejercicios por día
        const groupedExercises = {
          MONDAY: [],
          TUESDAY: [],
          WEDNESDAY: [],
          THURSDAY: [],
          FRIDAY: [],
          SATURDAY: [],
          SUNDAY: [],
        }

        plan.exerciseRoutines?.forEach((exercise) => {
          if (groupedExercises[exercise.day]) {
            groupedExercises[exercise.day].push(exercise)
          }
        })

        setExercisesByDay(groupedExercises)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ocurrió un error desconocido")
      } finally {
        setLoading(false)
      }
    }

    loadTrainingPlan()
  }, [getUserDni])

  const dayNames: Record<string, string> = {
    MONDAY: "Lunes",
    TUESDAY: "Martes",
    WEDNESDAY: "Miércoles",
    THURSDAY: "Jueves",
    FRIDAY: "Viernes",
    SATURDAY: "Sábado",
    SUNDAY: "Domingo",
  }

  const dayIcons: Record<string, string> = {
    MONDAY: "💪",
    TUESDAY: "🔥",
    WEDNESDAY: "⚡",
    THURSDAY: "🎯",
    FRIDAY: "🚀",
    SATURDAY: "💯",
    SUNDAY: "🌟",
  }

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const generatePDF = async () => {
  if (!trainingPlan) return;

  setIsDownloading(true);

  try {
    generateTrainingPlanPDF(trainingPlan, exercisesByDay, dayNames);
  } catch (error) {
    console.error("Error al generar el PDF:", error);
    alert("Error al generar el archivo. Por favor, inténtalo nuevamente.");
  } finally {
    setIsDownloading(false);
  }
};

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <Dumbbell className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-blue-600" />
        </div>
        <p className="mt-6 text-lg text-gray-700 font-medium">Cargando tu plan de entrenamiento...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 text-center">
        <div className="max-w-md">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Error al cargar el plan</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  if (!trainingPlan) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 text-center">
        <div className="max-w-md">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">No tienes un plan de entrenamiento activo</h2>
          <p className="text-gray-600 mb-6">Tu entrenador está en proceso de realizar tu plan a medida, por favor espera!</p>
          <button 
            onClick={() => navigate('/client')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
      <ClientHeader fullName={trainingPlan.clientName} onLogout={handleLogout} />

      <nav className="bg-white shadow-sm border-b">
        <ul className="container mx-auto px-4 flex">
          <li className="flex-1 text-center hover:bg-gray-50 transition-colors">
            <button
              onClick={() => navigate("/client")}
              className="w-full py-4 font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Inicio
            </button>
          </li>
          <li className="flex-1 text-center border-b-4 border-blue-500 bg-blue-50">
            <button className="w-full py-4 font-medium text-blue-600">Plan de Entrenamiento</button>
          </li>
          <li className="flex-1 text-center hover:bg-gray-50 transition-colors">
            <button
              onClick={() => navigate("/client/nutrition-plan")}
              className="w-full py-4 font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Plan de Nutrición
            </button>
          </li>
        </ul>
      </nav>

      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Header del Plan */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Dumbbell className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">{trainingPlan.name}</h2>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Creado el {new Date(trainingPlan.createdAt).toLocaleDateString()}</span>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    trainingPlan.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {trainingPlan.active ? "Activo" : "Inactivo"}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
                onClick={() => navigate(`${trainingPlan.id}/records`)}
              >
                <FileText className="w-4 h-4" />
                <span className="font-medium">Registrar entrenamiento</span>
              </button>

              <button
                className={`flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-blue-300 hover:text-blue-700 transition-all ${
                  isDownloading ? "opacity-50 cursor-not-allowed" : "hover:shadow-md"
                }`}
                onClick={generatePDF}
                disabled={isDownloading}
              >
                <Download className={`w-4 h-4 ${isDownloading ? "animate-bounce" : ""}`} />
                <span className="font-medium">{isDownloading ? "Generando..." : "Descargar rutina"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Rutina Semanal */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Rutina Semanal</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Object.entries(exercisesByDay).map(([day, exercises]) => (
              <div
                key={day}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white text-lg">{dayNames[day]}</h4>
                    <span className="text-2xl">{dayIcons[day]}</span>
                  </div>
                  <p className="text-blue-100 text-sm mt-1">
                    {exercises.length} ejercicio{exercises.length !== 1 ? "s" : ""}
                  </p>
                </div>

                <div className="p-4">
                  {exercises.length > 0 ? (
                    <div className="space-y-4">
                      {exercises.map((exercise, index) => (
                        <div
                          key={exercise.routineId}
                          className="border border-gray-100 rounded-lg p-4 hover:border-blue-200 transition-colors"
                        >
                          <h5 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">
                              {index + 1}
                            </div>
                            {exercise.exerciseName}
                          </h5>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-2 text-sm">
                              <Hash className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600">Series:</span>
                              <span className="font-medium text-gray-800">{exercise.series}</span>
                            </div>

                            <div className="flex items-center gap-2 text-sm">
                              <Activity className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600">Reps:</span>
                              <span className="font-medium text-gray-800">{exercise.repetitions}</span>
                            </div>

                            <div className="flex items-center gap-2 text-sm">
                              <Weight className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600">Peso:</span>
                              <span className="font-medium text-gray-800">{exercise.weight} kg</span>
                            </div>

                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600">Descanso:</span>
                              <span className="font-medium text-gray-800">{exercise.restTime}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Calendar className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-sm">Día de descanso</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <FooterPag />
    </div>
  )
}

export default TrainingPlanPage