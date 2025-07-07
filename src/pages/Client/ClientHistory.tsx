"use client"
import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { FooterPag } from "../../components/Footer"
import type { ClientHistoryResponse } from "../../model/ClientHistory"
import {
  FiTarget,
  FiCalendar,
  FiUser,
  FiActivity,
  FiHeart,
  FiClipboard,
  FiBook,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi"

// Interfaces
export interface NutritionRecordResponseDto {
  id: number
  createdAt: string
  calories: number
  proteins: number
  carbohydrates: number
  fats: number
  food: string
  mealTime: string
  observations: string
  clientDni: string
  nutritionPlanId: number
}

export interface NutritionPlanResponseDto {
  id: number
  name: string
  createdAt: string
  updatedAt: string
  caloricTarget: number
  dailyCarbs: number
  dailyProteins: number
  dailyFats: number
  recommendations: string
  active: boolean
  nutritionistId: number
  nutritionistName: string
  clientDni: string
  clientName: string
}

export type TrainingRecord = {
  id: number
  observation: string | null
  createdAt: string
  series: number
  repetitions: number
  weight: number
  restTime: string
  exerciseId: number
  trainingPlanId: number
  exerciseName: string
}

export interface TrainingPlan {
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

export interface ExerciseRoutine {
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

const ClientHistory: React.FC = () => {
  const { dni } = useParams<{ dni: string }>()
  const [history, setHistory] = useState<ClientHistoryResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openCategory, setOpenCategory] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await fetch(`http://localhost:8080/api/v1/clients/${dni}/history`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }
        const data: ClientHistoryResponse = await response.json()
        setHistory(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ocurrió un error desconocido")
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [dni])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
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
    )
  }

  if (!history) {
    return <div>No se encontró historial para este cliente</div>
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
        {/* Client Information - Always Visible at Top */}
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
        {/* Categories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Training Plans Section */}
          <CategorySection
            title="Planes de Entrenamiento"
            icon={<FiActivity className="text-2xl" />}
            count={history.trainingPlans.length}
            color="green"
            isOpen={openCategory === "trainingPlans"}
            onToggle={() => setOpenCategory(openCategory === "trainingPlans" ? null : "trainingPlans")}
          >
            <TrainingPlansContent trainingPlans={history.trainingPlans} />
          </CategorySection>
          {/* Nutrition Plans Section */}
          <CategorySection
            title="Planes de Nutrición"
            icon={<FiHeart className="text-2xl" />}
            count={history.nutritionPlans.length}
            color="orange"
            isOpen={openCategory === "nutritionPlans"}
            onToggle={() => setOpenCategory(openCategory === "nutritionPlans" ? null : "nutritionPlans")}
          >
            <NutritionPlansContent nutritionPlans={history.nutritionPlans} />
          </CategorySection>
          {/* Training Records Section */}
          <CategorySection
            title="Registros de Entrenamiento"
            icon={<FiBook className="text-2xl" />}
            count={history.trainingRecords.length}
            color="purple"
            isOpen={openCategory === "trainingRecords"}
            onToggle={() => setOpenCategory(openCategory === "trainingRecords" ? null : "trainingRecords")}
          >
            <TrainingRecordsContent trainingRecords={history.trainingRecords} />
          </CategorySection>
          {/* Nutrition Records Section */}
          <CategorySection
            title="Registros de Nutrición"
            icon={<FiCalendar className="text-2xl" />}
            count={history.nutritionRecords.length}
            color="pink"
            isOpen={openCategory === "nutritionRecords"}
            onToggle={() => setOpenCategory(openCategory === "nutritionRecords" ? null : "nutritionRecords")}
          >
            <NutritionRecordsContent nutritionRecords={history.nutritionRecords} />
          </CategorySection>
        </div>
      </main>
      {/* Footer */}
      <FooterPag />
    </div>
  )
}

// Category Section Component
const CategorySection = ({ title, icon, count, color, isOpen, onToggle, children }) => {
  const colorClasses = {
    green: {
      bg: "bg-green-50",
      border: "border-green-200",
      header: "bg-green-100",
      text: "text-green-800",
      button: "bg-green-200 hover:bg-green-300 text-green-800",
    },
    orange: {
      bg: "bg-orange-50",
      border: "border-orange-200",
      header: "bg-orange-100",
      text: "text-orange-800",
      button: "bg-orange-200 hover:bg-orange-300 text-orange-800",
    },
    purple: {
      bg: "bg-purple-50",
      border: "border-purple-200",
      header: "bg-purple-100",
      text: "text-purple-800",
      button: "bg-purple-200 hover:bg-purple-300 text-purple-800",
    },
    pink: {
      bg: "bg-pink-50",
      border: "border-pink-200",
      header: "bg-pink-100",
      text: "text-pink-800",
      button: "bg-pink-200 hover:bg-pink-300 text-pink-800",
    },
  }

  const colors = colorClasses[color]

  return (
    <div className={`${colors.bg} ${colors.border} border-2 rounded-lg shadow-lg overflow-hidden`}>
      <div className={`${colors.header} p-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`${colors.text} mr-3`}>{icon}</div>
            <div>
              <h3 className={`text-xl font-bold ${colors.text}`}>{title}</h3>
              <p className={`text-sm ${colors.text} opacity-75`}>
                {count} {count === 1 ? "elemento" : "elementos"}
              </p>
            </div>
          </div>
          <button
            onClick={onToggle}
            className={`px-3 py-2 rounded-lg transition-colors ${colors.button} flex items-center`}
          >
            {isOpen ? <FiChevronUp /> : <FiChevronDown />}
            <span className="ml-1">{isOpen ? "Ocultar" : "Mostrar"}</span>
          </button>
        </div>
      </div>
      <div
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <div className="p-4">{children}</div>
      </div>
    </div>
  )
}

// Training Plans Content
const TrainingPlansContent = ({ trainingPlans }) => (
  <div className="space-y-4">
    {trainingPlans.length > 0 ? (
      trainingPlans.map((plan) => <TrainingPlanCard key={plan.id} plan={plan} />)
    ) : (
      <p className="text-gray-600 text-center py-4">No hay planes de entrenamiento</p>
    )}
  </div>
)

const TrainingPlanCard = ({ plan }) => (
  <div className="bg-white border rounded-lg p-4 shadow-sm">
    <div className="flex justify-between items-start mb-3">
      <div>
        <h4 className="font-bold text-lg text-gray-800">{plan.name}</h4>
        <p className="text-sm text-gray-600">Creado el: {new Date(plan.createdAt).toLocaleDateString()}</p>
      </div>
      <span
        className={`px-2 py-1 text-xs rounded-full ${
          plan.active ? "bg-green-200 text-green-800" : "bg-gray-200 text-gray-800"
        }`}
      >
        {plan.active ? "Activo" : "Inactivo"}
      </span>
    </div>
    <div className="mb-3 space-y-1">
      <p className="text-sm">
        <span className="font-semibold text-gray-700">Entrenador:</span> {plan.trainerName}
      </p>
      <p className="text-sm">
        <span className="font-semibold text-gray-700">Especialización:</span> {plan.trainerSpecification}
      </p>
    </div>
    {plan.exercises && plan.exercises.length > 0 && (
      <div>
        <h5 className="font-semibold mb-2 text-gray-700">Rutinas:</h5>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ejercicio</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Series</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Reps</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Peso</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Día</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {plan.exercises.map((routine) => (
                <tr key={routine.routineId}>
                  <td className="px-3 py-2 text-gray-900">{routine.exerciseName}</td>
                  <td className="px-3 py-2 text-gray-600">{routine.series}</td>
                  <td className="px-3 py-2 text-gray-600">{routine.repetitions}</td>
                  <td className="px-3 py-2 text-gray-600">{routine.weight} kg</td>
                  <td className="px-3 py-2 text-gray-600">{routine.day}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )}
  </div>
)

// Nutrition Plans Content
const NutritionPlansContent = ({ nutritionPlans }) => (
  <div className="space-y-4">
    {nutritionPlans.length > 0 ? (
      nutritionPlans.map((plan) => <NutritionPlanCard key={plan.id} plan={plan} />)
    ) : (
      <p className="text-gray-600 text-center py-4">No hay planes de nutrición</p>
    )}
  </div>
)

const NutritionPlanCard = ({ plan }) => (
  <div className="bg-white border rounded-lg p-4 shadow-sm">
    <div className="flex justify-between items-start mb-3">
      <div>
        <h4 className="font-bold text-lg text-gray-800">{plan.name}</h4>
        <p className="text-sm text-gray-600">Creado el: {new Date(plan.createdAt).toLocaleDateString()}</p>
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
      <span className="font-semibold text-gray-700">Nutricionista:</span> {plan.nutritionistName}
    </p>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
      <div className="bg-orange-50 p-3 rounded">
        <p className="text-xs text-orange-700">Meta calórica</p>
        <p className="font-medium text-orange-900">{plan.caloricTarget} kcal</p>
      </div>
      <div className="bg-orange-50 p-3 rounded">
        <p className="text-xs text-orange-700">Carbohidratos</p>
        <p className="font-medium text-orange-900">{plan.dailyCarbs}g</p>
      </div>
      <div className="bg-orange-50 p-3 rounded">
        <p className="text-xs text-orange-700">Proteínas</p>
        <p className="font-medium text-orange-900">{plan.dailyProteins}g</p>
      </div>
      <div className="bg-orange-50 p-3 rounded">
        <p className="text-xs text-orange-700">Grasas</p>
        <p className="font-medium text-orange-900">{plan.dailyFats}g</p>
      </div>
    </div>
    <div>
      <p className="text-sm font-semibold mb-1 text-gray-700">Recomendaciones:</p>
      <p className="text-sm text-gray-600">{plan.recommendations}</p>
    </div>
  </div>
)

// Training Records Content
const TrainingRecordsContent = ({ trainingRecords }) => (
  <div>
    {trainingRecords.length > 0 ? (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ejercicio</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Series</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Reps</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Peso</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Observación</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {trainingRecords.map((record) => (
              <tr key={record.id}>
                <td className="px-3 py-2 text-gray-600">{new Date(record.createdAt).toLocaleString()}</td>
                <td className="px-3 py-2 text-gray-900">{record.exerciseName || "-"}</td>
                <td className="px-3 py-2 text-gray-600">{record.series}</td>
                <td className="px-3 py-2 text-gray-600">{record.repetitions}</td>
                <td className="px-3 py-2 text-gray-600">{record.weight} kg</td>
                <td className="px-3 py-2 text-gray-600">{record.observation || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <p className="text-gray-600 text-center py-4">No hay registros de entrenamiento</p>
    )}
  </div>
)

// Nutrition Records Content
const NutritionRecordsContent = ({ nutritionRecords }) => (
  <div>
    {nutritionRecords.length > 0 ? (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Comida</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Calorías</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Momento</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Observaciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {nutritionRecords.map((record) => (
              <tr key={record.id}>
                <td className="px-3 py-2 text-gray-600">{new Date(record.createdAt).toLocaleString()}</td>
                <td className="px-3 py-2 text-gray-900">{record.food}</td>
                <td className="px-3 py-2 text-gray-600">{record.calories} kcal</td>
                <td className="px-3 py-2 text-gray-600">{record.mealTime}</td>
                <td className="px-3 py-2 text-gray-600">{record.observations || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <p className="text-gray-600 text-center py-4">No hay registros de nutrición</p>
    )}
  </div>
)

export default ClientHistory
