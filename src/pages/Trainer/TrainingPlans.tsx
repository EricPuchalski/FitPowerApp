// src/pages/Client/TrainingPlans.tsx
"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import {
  Calendar,
  Plus,
  Dumbbell,
  ArrowLeft,
  Users,
  History
} from 'lucide-react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { FooterPag } from "../../components/Footer"
import { TrainerHeader } from "../../components/TrainerHeader"
import { useAuth } from "../../auth/hook/useAuth"

// Definición de tipos
interface Exercise {
  routineId: number
  exerciseName: string
  series: number
  repetitions: number
  weight?: number
  day?: string
}

interface TrainingPlan {
  id: number
  name: string
  clientGoal: string
  trainerSpecification: string
  active: boolean
  createdAt: string
  exercises: Exercise[]
}

export default function TrainingPlans() {
  const { clientDni } = useParams<{ clientDni: string }>()
  const [plans, setPlans] = useState<TrainingPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [noPlans, setNoPlans] = useState(false)
        const navigate = useNavigate();
        const { logout } = useAuth();
  const [clientInfo, setClientInfo] = useState<{
    name: string
    email: string
    phone: string
  } | null>(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)
      setNoPlans(false)

      const token = localStorage.getItem("token")

      try {
        // 1️⃣ Obtener información del cliente
        const clientRes = await fetch(
          `http://localhost:8080/api/v1/clients/${clientDni}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        if (!clientRes.ok) {
          throw new Error("Error al cargar la información del cliente")
        }
        const clientData = await clientRes.json()
        setClientInfo({
          name: clientData.name,
          email: clientData.email,
          phone: clientData.phoneNumber
        })

        // 2️⃣ Obtener planes de entrenamiento
        const plansRes = await fetch(
          `http://localhost:8080/api/v1/training-plans/clients/${clientDni}/active`,
          { headers: { Authorization: `Bearer ${token}` } }
        )

        if (plansRes.status === 404) {
          // No existe plan activo
          setPlans([])
          setNoPlans(true)
        } else if (!plansRes.ok) {
          throw new Error(`Error al cargar los planes (${plansRes.status})`)
        } else {
          const raw = await plansRes.json()
          const plan: TrainingPlan = {
            ...raw,
            exercises: raw.exercises ?? raw.exerciseRoutines ?? []
          }
          // Si la lista de ejercicios viene vacía e incluso active=false, lo tratamos como “sin planes”
          if ((!plan.exercises.length && plan.active === false) || !plan.active) {
            setNoPlans(true)
          }
          setPlans([plan])
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

  // ⚠️ Error inesperado (noPlans=false)
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ToastContainer />
        <Link
          to="/trainer/dashboard"
          className="flex items-center text-blue-600 hover:underline mb-4"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Volver al dashboard
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Planes de Entrenamiento</h1>
        <p className="text-gray-600 mb-6">
          Cliente: <span className="font-medium">{clientInfo?.name}</span> (DNI {clientDni})
        </p>
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <Dumbbell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No se encontraron planes de entrenamiento
          </h3>
          <p className="text-gray-600 mb-4">
            ¿Estás seguro de que el cliente tiene algún plan activo?
          </p>
          <Link
            to={`/trainer/client/${clientDni}/training-plans/new/edit`}
            className="inline-flex items-center bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded"
            onClick={() => toast.info("Creando primer plan de entrenamiento")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Crear primer plan
          </Link>
        </div>
      </div>
    )
  }


      const handleLogout = () => {
  logout();
  navigate("/"); // o "/login" si tenés una ruta específica
};


  // ✅ Listado de planes existente
  return (

    <>
    <TrainerHeader onLogout={handleLogout}></TrainerHeader>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ToastContainer />
      {/* ↩️ Volver + nueva creación */}
      <div className="flex justify-between items-center mb-8">
        <Link
          to="/trainer/dashboard"
          className="flex items-center text-blue-600 hover:underline"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Volver al dashboard
        </Link>
        <Link
          to={`/trainer/client/${clientDni}/training-plans/new/edit`}
          className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-md flex items-center"
          onClick={() => toast.info("Creando nuevo plan")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Crear nuevo plan
        </Link>
      </div>

      {/* Título e info de cliente */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Planes de Entrenamiento</h1>
        <div className="flex items-center text-gray-600">
          <Users className="h-5 w-5 mr-2" />
          <div>
            <p>
              Cliente: <span className="font-medium">{clientInfo?.name}</span>
            </p>
            <p className="text-sm">DNI: {clientDni}</p>
          </div>
        </div>
      </div>

      {/* 📊 Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-6 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-700">Total Planes</p>
            <p className="text-2xl font-bold">{plans.length}</p>
          </div>
          <Calendar className="h-8 w-8 text-cyan-600" />
        </div>
        <div className="bg-pink-50 border border-pink-200 rounded-lg p-6 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-700">Planes Activos</p>
            <p className="text-2xl font-bold">{plans.filter((p) => p.active).length}</p>
          </div>
          <Dumbbell className="h-8 w-8 text-pink-600" />
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-700">Ejercicios Totales</p>
            <p className="text-2xl font-bold">
              {plans.reduce((sum, p) => sum + p.exercises.length, 0)}
            </p>
          </div>
          <Plus className="h-8 w-8 text-blue-600" />
        </div>
      </div>

      {/* 📋 Listado de planes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition"
          >
            <div className={`p-4 ${plan.active ? 'bg-green-50' : 'bg-gray-50'}`}>
              <div className="flex justify-between items-start">
                <h2 className="font-semibold text-lg">{plan.name}</h2>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded ${
                    plan.active ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {plan.active ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Creado el {new Date(plan.createdAt).toLocaleDateString('es-ES')}
              </p>
            </div>
            <div className="p-4 space-y-2">
              <p>
                <span className="font-medium">Objetivo:</span> {plan.clientGoal}
              </p>
              <p>
                <span className="font-medium">Especialización:</span> {plan.trainerSpecification}
              </p>
              <p>
                <span className="font-medium">Ejercicios:</span> {plan.exercises.length}
              </p>
            </div>
            <div className="p-4 border-t space-y-2">
              <Link
                to={`/trainer/client/${clientDni}/training-plans/${plan.id}/edit`}
                onClick={() => toast.info(`Editando plan: ${plan.name}`)}
              >
                <button className="w-full bg-blue-900 text-white py-2 rounded-md">
                  Editar Ejercicios
                </button>
              </Link>
              <Link
                to={`/trainer/client/${clientDni}/progress`}
                onClick={() => toast.info(`Viendo progreso del cliente`)}
              >
                <button className="w-full border border-gray-300 py-2 rounded-md">
                  Ver Progreso De Entrenamiento
                </button>
              </Link>
                            <Link
                to={`/trainer/client/${clientDni}/history`}
                onClick={() => toast.info(`Viendo progreso del cliente`)}
              >
                <button className="w-full border border-gray-300 py-2 rounded-md">
                  Ver Historial
                </button>
              </Link>
              <Link
                to={`/trainer/client/${clientDni}/training-plans/report`}
                onClick={() => toast.info(`Creando informe de progreso`)}
              >
                <button className="w-full border border-gray-300 py-2 rounded-md">
                  Crear Informe
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
          <FooterPag></FooterPag>

    </>
  )
}
