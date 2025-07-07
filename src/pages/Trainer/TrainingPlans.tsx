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
    goal: string
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
          phone: clientData.phoneNumber,
          goal: clientData.goal
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
  
      const handleLogout = () => {
  logout();
  navigate("/"); // o "/login" si tenés una ruta específica
};


  // 📭 Sin planes de entrenamiento
 if (noPlans) {
  return (
    <>
      <TrainerHeader onLogout={handleLogout}></TrainerHeader>

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
              Planes de Entrenamiento
            </h1>
            
            {/* Client Info Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {clientInfo?.name?.charAt(0)?.toUpperCase() || 'C'}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {clientInfo?.name}
                    </h2>
                    <p className="text-gray-600">
                      DNI: <span className="font-medium">{clientDni}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Client Goal - Destacado */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-400 rounded-lg p-6 mb-8 shadow-md">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">🎯</span>
                </div>
                <h3 className="text-lg font-bold text-amber-800">
                  Objetivo Principal del Cliente
                </h3>
              </div>
              <p className="text-amber-900 text-lg font-medium leading-relaxed">
                {clientInfo?.goal || 'No se ha definido un objetivo específico'}
              </p>
              <div className="mt-3 text-sm text-amber-700 bg-amber-100 rounded-md p-2 inline-block">
                💡 Este objetivo debe guiar todos los planes de entrenamiento
              </div>
            </div>
          </div>

          {/* No Plans Content */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Dumbbell className="h-5 w-5 mr-2 text-blue-600" />
                Estado de Planes de Entrenamiento
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
                No se encontraron planes de entrenamiento
              </h3>
              
              <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
                Este cliente aún no tiene planes de entrenamiento asignados. 
                <br />
                <span className="font-medium text-gray-800">
                  ¿Quieres crear el primer plan ahora?
                </span>
              </p>

              {/* Action Button */}
              <div className="space-y-4">
                <Link
                  to={`/trainer/client/${clientDni}/training-plans/new/edit`}
                  className="inline-flex items-center bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                  onClick={() => toast.info("Creando primer plan de entrenamiento")}
                >
                  <Plus className="h-5 w-5 mr-3" />
                  Crear Primer Plan de Entrenamiento
                </Link>
                
                <div className="text-sm text-gray-500 mt-4">
                  Recuerda considerar el objetivo del cliente al crear el plan
                </div>
              </div>
            </div>
          </div>

          {/* Tips Section */}
          <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h4 className="text-md font-semibold text-blue-900 mb-3 flex items-center">
              <span className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center mr-2">
                <span className="text-white text-xs">💡</span>
              </span>
              Consejos para crear un plan efectivo:
            </h4>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Considera el objetivo principal del cliente</li>
              <li>• Evalúa su nivel de experiencia actual</li>
              <li>• Incluye ejercicios progresivos</li>
              <li>• Establece metas realistas y medibles</li>
            </ul>
          </div>
        </div>
      </div>
      
      <FooterPag></FooterPag>
    </>
  )
}



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
                      <Link
                to={`/trainer/client/${clientDni}/history`}
                onClick={() => toast.info(`Viendo progreso del cliente`)}
                className="block w-200"
              >
                <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center group">
                  <svg 
                    className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-200" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
                    />
                  </svg>
                  Ver Historial de del cliente
                </button>
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
                 <p>
         Objetivo: <span className="font-medium">{clientInfo?.goal}</span>
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
                <button className="w-full bg-red-300 border border-gray-300 py-2 rounded-md">
                  Ver Progreso De Entrenamiento
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
