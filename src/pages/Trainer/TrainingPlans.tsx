"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import {
  Calendar,
  Plus,
  Dumbbell,
  ArrowLeft,
  Clock,
  Target,
  User,
  Mail,
  Phone,
  Trophy,
  Activity,
  Weight,
  RotateCcw,
  CalendarDays,
} from "lucide-react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { FooterPag } from "../../components/Footer"
import { TrainerHeader } from "../../components/TrainerHeader"
import { useAuth } from "../../auth/hook/useAuth"

// Definición de tipos basados en tus modelos
interface ExerciseRoutine {
  id?: number
  routineId: number
  exerciseId: number
  exerciseName: string
  series: number
  repetitions: number
  weight: number | null
  restTime: string
  day: string
  trainingPlanId?: number
}

interface TrainingPlan {
  id: number
  name: string
  createdAt: string
  trainerDni: string
  trainerName: string
  clientDni: string
  clientName: string
  trainerSpecification: string
  clientGoal: string
  active: boolean
  exercises: ExerciseRoutine[]
}

interface ClientInfo {
  name: string
  email: string
  phone: string
  goal: string
}

export default function TrainingPlanDetail() {
  const { clientDni } = useParams<{ clientDni: string }>()
  const [plan, setPlan] = useState<TrainingPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [noPlans, setNoPlans] = useState(false)
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [clientInfo, setClientInfo] = useState<ClientInfo | null>(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)
      setNoPlans(false)
      const token = localStorage.getItem("token")

      try {
        // 1️⃣ Obtener información del cliente
        const clientRes = await fetch(`http://localhost:8080/api/v1/clients/${clientDni}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!clientRes.ok) {
          throw new Error("Error al cargar la información del cliente")
        }

        const clientData = await clientRes.json()
        setClientInfo({
          name: clientData.name,
          email: clientData.email,
          phone: clientData.phoneNumber,
          goal: clientData.goal,
        })

        // 2️⃣ Obtener plan de entrenamiento activo
        const plansRes = await fetch(`http://localhost:8080/api/v1/clients/${clientDni}/training-plans/active`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (plansRes.status === 404) {
          setNoPlans(true)
        } else if (!plansRes.ok) {
          throw new Error(`Error al cargar el plan (${plansRes.status})`)
        } else {
        
          const raw = await plansRes.json()
          console.log("Plan de entrenamiento activo:", raw)
          const trainingPlan: TrainingPlan = {
            ...raw,
            exercises: raw.exercises ?? raw.exerciseRoutines ?? [],
          }

          if (!trainingPlan.exercises.length && !trainingPlan.active) {
            setNoPlans(true)
          } else {
            setPlan(trainingPlan)
          }
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Error desconocido"
        setError(msg)
        toast.error(msg)
      } finally {
        setLoading(false)
      }
    }

    if (clientDni) fetchData()
  }, [clientDni])

  const handleLogout = () => {
    logout()
    navigate("/")
  }


  const traducirDia = (day: string): string => {
    const dias: Record<string, string> = {
      MONDAY: "Lunes",
      TUESDAY: "Martes",
      WEDNESDAY: "Miércoles",
      THURSDAY: "Jueves",
      FRIDAY: "Viernes",
      SATURDAY: "Sábado",
      SUNDAY: "Domingo",
    }
  
    return dias[day.toUpperCase()] || day // en caso de que venga ya traducido o no exista
  }

  // Agrupar ejercicios por día
  const exercisesByDay =
  plan?.exercises.reduce(
    (acc, exercise) => {
      const day = traducirDia(exercise.day || "Sin día asignado")
      if (!acc[day]) {
        acc[day] = []
      }
      acc[day].push(exercise)
      return acc
    },
    {} as Record<string, ExerciseRoutine[]>,
  ) || {}

  const daysOrder = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]
  const sortedDays = Object.keys(exercisesByDay).sort((a, b) => {
    const indexA = daysOrder.indexOf(a)
    const indexB = daysOrder.indexOf(b)
    if (indexA === -1 && indexB === -1) return a.localeCompare(b)
    if (indexA === -1) return 1
    if (indexB === -1) return -1
    return indexA - indexB
  })

  // 🌀 Skeleton de carga
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
        <ToastContainer />
      </div>
    )
  }

  // ⚠️ Error inesperado
  if (error && !noPlans) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
        </div>
        <ToastContainer />
      </div>
    )
  }

  // 📭 Sin planes de entrenamiento
  if (noPlans) {
    return (
      <>
        <TrainerHeader onLogout={handleLogout} />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <ToastContainer />

            {/* Navigation */}
            <Link
              to="/trainer/dashboard"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 mb-6 group"
            >
              <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="font-medium">Volver al dashboard</span>
            </Link>

            {/* Header Section */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
                Plan Activo del Cliente
              </h1>

              {/* Client Info Card */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {clientInfo?.name?.charAt(0)?.toUpperCase() || "C"}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{clientInfo?.name}</h2>
                      <p className="text-gray-600">
                        DNI: <span className="font-medium">{clientDni}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Client Goal */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-400 rounded-lg p-6 mb-8 shadow-md">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-sm">🎯</span>
                  </div>
                  <h3 className="text-lg font-bold text-amber-800">Objetivo Principal del Cliente</h3>
                </div>
                <p className="text-amber-900 text-lg font-medium leading-relaxed">
                  {clientInfo?.goal || "No se ha definido un objetivo específico"}
                </p>
              </div>
            </div>

            {/* No Plans Content */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Dumbbell className="h-5 w-5 mr-2 text-blue-600" />
                  Estado del Plan de Entrenamiento
                </h3>
              </div>
              <div className="text-center py-16 px-6">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Dumbbell className="h-12 w-12 text-gray-500" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">!</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  No se encontró un plan de entrenamiento activo
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
                  Este cliente aún no tiene un plan de entrenamiento activo asignado.
                </p>

                <Link
                  to={`/trainer/client/${clientDni}/training-plans/new/edit`}
                  className="inline-flex items-center bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                  onClick={() => toast.info("Creando primer plan de entrenamiento")}
                >
                  <Plus className="h-5 w-5 mr-3" />
                  Crear Plan de Entrenamiento
                </Link>
              </div>
            </div>
          </div>
        </div>
        <FooterPag />
      </>
    )
  }

  // ✅ Mostrar plan activo completo
  return (
    <>
      <TrainerHeader onLogout={handleLogout} />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ToastContainer />

          {/* Navigation y botones de acción */}
          <div className="flex justify-between items-center mb-8">
        <Link
  to="/trainer/dashboard"
  className="group relative inline-flex items-center overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 px-6 py-3 text-white font-semibold shadow-lg transition-all duration-300 ease-out hover:shadow-xl hover:shadow-blue-500/25 active:scale-95 mb-6"
>
  {/* Efecto de brillo animado */}
  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
  
  {/* Resplandor de fondo */}
  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-300/20 to-blue-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
  
  {/* Contenido del botón */}
  <div className="relative flex items-center">
    <ArrowLeft className="h-5 w-5 mr-3 group-hover:-translate-x-2 transition-all duration-300 ease-out drop-shadow-sm" />
    <span className="font-medium tracking-wide">Volver al dashboard</span>
  </div>
  
  {/* Indicador de interacción */}
  <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-blue-300 group-hover:w-full transition-all duration-300 ease-out" />
</Link>
            <div className="flex space-x-4">
              <Link
                to={`/trainer/client/${clientDni}/training-plans/new/edit`}
                className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-md flex items-center"
                onClick={() => toast.info("Creando nuevo plan")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Crear nuevo plan
              </Link>
              <Link
                to={`/trainer/client/${clientDni}/history`}
                onClick={() => toast.info(`Viendo progreso del cliente`)}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center"
              >
                <Activity className="w-4 h-4 mr-2" />
                Ver Historial del cliente
              </Link>
            </div>
          </div>

          {/* Título principal */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
              Plan Activo del Cliente
            </h1>
          </div>

          {/* Información del cliente */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">
                    {clientInfo?.name?.charAt(0)?.toUpperCase() || "C"}
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                    <User className="h-5 w-5 mr-2 text-blue-600" />
                    {clientInfo?.name}
                  </h2>
                  <p className="text-gray-600">DNI: {clientDni}</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="flex items-center text-gray-700">
                  <Mail className="h-4 w-4 mr-2 text-blue-600" />
                  {clientInfo?.email}
                </p>
                <p className="flex items-center text-gray-700">
                  <Phone className="h-4 w-4 mr-2 text-blue-600" />
                  {clientInfo?.phone}
                </p>
              </div>
            </div>

            {/* Objetivo del cliente */}
            <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-400 rounded-lg">
              <div className="flex items-center mb-2">
                <Target className="h-5 w-5 mr-2 text-amber-600" />
                <h3 className="text-lg font-semibold text-amber-800">Objetivo Principal</h3>
              </div>
              <p className="text-amber-900 font-medium">{clientInfo?.goal}</p>
            </div>
          </div>

          {/* Información del plan */}
          {plan && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Trophy className="h-6 w-6 mr-2 text-green-600" />
                  {plan.name}
                </h2>
                <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full font-semibold">Plan Activo</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                  <Calendar className="h-8 w-8 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Fecha de creación</p>
                    <p className="font-semibold">{new Date(plan.createdAt).toLocaleDateString("es-ES")}</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-pink-50 rounded-lg">
                  <Dumbbell className="h-8 w-8 text-pink-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Total ejercicios</p>
                    <p className="font-semibold">{plan.exercises.length}</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-purple-50 rounded-lg">
                  <CalendarDays className="h-8 w-8 text-purple-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Días de entrenamiento</p>
                    <p className="font-semibold">{Object.keys(exercisesByDay).length}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Especialización del Entrenador</h4>
                  <p className="text-gray-700">{plan.trainerSpecification}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Entrenador Asignado</h4>
                  <p className="text-gray-700">{plan.trainerName}</p>
                </div>
              </div>

 {/* Botones de acción del plan */}
<div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
  <Link
    to={`/trainer/client/${clientDni}/training-plans/${plan.id}/edit`}
    onClick={() => toast.info(`Editando plan: ${plan.name}`)}
  >
    <button className="w-full bg-blue-900 hover:bg-blue-800 text-white py-3 rounded-lg font-semibold transition-colors">
      Editar Ejercicios
    </button>
  </Link>
  <Link
    to={`/trainer/client/${clientDni}/training-plans/${plan.id}/records`}
    onClick={() => toast.info(`Viendo registros del plan`)}
  >
    <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition-colors">
      Ver Registros del Plan
    </button>
  </Link>
  <Link
    to={`/trainer/client/${clientDni}/progress`}
    onClick={() => toast.info(`Viendo progreso del cliente`)}
  >
    <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors">
      Ver Progreso De Entrenamiento
    </button>
  </Link>
  <Link
    to={`/trainer/client/${clientDni}/training-plans/report`}
    onClick={() => toast.info(`Creando informe de progreso`)}
  >
    <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition-colors">
      Crear Informe
    </button>
  </Link>
</div>
            </div>
          )}

          {/* Rutinas de ejercicios por día */}
          {plan && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Dumbbell className="h-6 w-6 mr-2 text-blue-600" />
                Rutinas de Ejercicios
              </h2>

              {sortedDays.map((day) => (
                <div key={day} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                    <h3 className="text-xl font-bold text-white flex items-center">
                      <CalendarDays className="h-5 w-5 mr-2" />
                      {day}
                      <span className="ml-auto bg-black bg-opacity-20 px-3 py-1 rounded-full text-sm">
                        {exercisesByDay[day].length} ejercicios
                      </span>
                    </h3>
                  </div>

                  <div className="p-6">
                    <div className="grid gap-4">
                      {exercisesByDay[day].map((exercise, index) => (
                        <div
                          key={exercise.id || index}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                              <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                                {index + 1}
                              </span>
                              {exercise.exerciseName}
                            </h4>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="flex items-center">
                              <Activity className="h-4 w-4 text-green-600 mr-2" />
                              <div>
                                <p className="text-gray-600">Series</p>
                                <p className="font-semibold">{exercise.series}</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <RotateCcw className="h-4 w-4 text-blue-600 mr-2" />
                              <div>
                                <p className="text-gray-600">Repeticiones</p>
                                <p className="font-semibold">{exercise.repetitions}</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Weight className="h-4 w-4 text-purple-600 mr-2" />
                              <div>
                                <p className="text-gray-600">Peso</p>
                                <p className="font-semibold">
                                  {exercise.weight ? `${exercise.weight} kg` : "Sin peso"}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 text-orange-600 mr-2" />
                              <div>
                                <p className="text-gray-600">Descanso</p>
                                <p className="font-semibold">{exercise.restTime}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <FooterPag />
    </>
  )
}
