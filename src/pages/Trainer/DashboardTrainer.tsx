// src/components/DashboardTrainer.tsx
"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  Users,
  Plus,
  TrendingUp,
  Menu,
  X,
  Dumbbell,
  Home
} from 'lucide-react'
import { FooterPag } from '../../components/Footer'
import { TrainerHeader } from "../../components/TrainerHeader"
import { useAuth } from "../../auth/hook/useAuth"

interface User {
  dni: string
  name: string
  gymName: string
  role: string
}

interface Client {
  id: number
  dni: string
  name: string
  lastName: string
  email: string
  phoneNumber: string
  createdAt: string
}

interface DashboardTrainerProps {
  user?: User
}

export default function DashboardTrainer({ user }: DashboardTrainerProps) {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<User | null>(user || null)
  const [activePlansCount, setActivePlansCount] = useState<number>(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showAll, setShowAll] = useState(false)
      const navigate = useNavigate();
      const { logout } = useAuth();

  // Carga inicial del entrenador y luego de los clientes/plans
  useEffect(() => {
    if (!currentUser) {
      const token = localStorage.getItem("token")
      const userDni = localStorage.getItem("userDni")
      if (token && userDni) {
        fetchTrainerInfo(userDni)
      }
    } else {
      loadData()
    }
  }, [currentUser, showAll])

  // Helper que lanza la función correcta de fetch
  const loadData = () => {
    setLoading(true)
    setError(null)

    const loader = showAll ? fetchAllClients : fetchMyClients
    loader()
      .then(() => fetchTrainingPlans())
      .catch(() => {
        setError("Error al cargar los clientes")
      })
      .finally(() => {
        setLoading(false)
      })
  }

  // Obtiene datos del entrenador y guarda trainerId en localStorage
  const fetchTrainerInfo = async (dni: string) => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`http://localhost:8080/api/v1/trainers/${dni}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      localStorage.setItem("trainerId", data.id.toString())
      localStorage.setItem("userRole", "ROLE_TRAINER")
      setCurrentUser({
        dni: data.dni,
        name: data.name,
        gymName: data.gymName,
        role: "ROLE_TRAINER"
      })
    } catch {
      setError("Error al cargar información del entrenador")
      setLoading(false)
    }
  }

  // Fetch solo “Mis Clientes”
  const fetchMyClients = async () => {
    const trainerId = localStorage.getItem("trainerId")
    const token     = localStorage.getItem("token")
    if (!trainerId || !token) throw new Error()

    const res = await fetch(
      `http://localhost:8080/api/v1/trainers/${trainerId}/clients/active`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type':  'application/json'
        }
      }
    )
    if (!res.ok) {
      // Si 404 o vacío, devolvemos array vacío
      if (res.status === 404) {
        setClients([])
        return
      }
      throw new Error()
    }
    const data: Client[] = await res.json()
    setClients(data)
  }

  // Fetch “Todos los Clientes del Gimnasio”
  const fetchAllClients = async () => {
    const token   = localStorage.getItem("token")
    const gymName = currentUser?.gymName
    if (!gymName || !token) throw new Error()

    const res = await fetch(
      `http://localhost:8080/api/v1/gyms/${encodeURIComponent(gymName)}/clients`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type':  'application/json'
        }
      }
    )
    if (!res.ok) throw new Error()
    const data: Client[] = await res.json()
    setClients(data)
  }

  // Fetch contador de planes activos
  const fetchTrainingPlans = async () => {
    const trainerId = localStorage.getItem("trainerId")
    const token     = localStorage.getItem("token")
    if (!trainerId || !token) return

    try {
      const res  = await fetch(
        `http://localhost:8080/api/v1/training-plans/trainer/${trainerId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (!res.ok) throw new Error()
      const data: any[] = await res.json()
      const activos = data.filter(plan => plan.active)
      setActivePlansCount(activos.length)
    } catch {
      setActivePlansCount(0)
    }
  }

    const handleLogout = () => {
  logout();
  navigate("/"); // o "/login" si tenés una ruta específica
};

  // Loading skeleton
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100">
        {/* … tu código de loading idéntico … */}
        <p className="p-8 text-center">Cargando datos…</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header y menú */}
      <TrainerHeader onLogout={handleLogout}></TrainerHeader>
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Bienvenida */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{`Bienvenido, ${currentUser?.name}`}</h1>
          <p className="text-gray-600">{`Gimnasio: ${currentUser?.gymName}`}</p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="p-6 bg-cyan-50 rounded-lg border flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">Total Clientes</p>
              <p className="text-2xl font-bold">{clients.length}</p>
            </div>
            <Users className="h-8 w-8 text-cyan-600"/>
          </div>
          
        </div>

        {/* Toggle de vista */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setShowAll(false)}
            className={`px-4 py-2 rounded ${!showAll ? 'bg-blue-900 text-white' : 'bg-gray-200'}`}
          >
            Mis Clientes
          </button>
          <button
            onClick={() => setShowAll(true)}
            className={`px-4 py-2 rounded ${ showAll ? 'bg-blue-900 text-white' : 'bg-gray-200'}`}
          >
            Todos los Clientes
          </button>
        </div>

        {/* Título y descripción */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold">
            {showAll ? 'Todos los Clientes del Gimnasio' : 'Mis Clientes Activos'}
          </h2>
          {!showAll && (
            <p className="text-sm text-gray-600">
              Clientes con planes de entrenamiento activos contigo
            </p>
          )}
        </div>

        {/* Error de carga */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-800 border rounded">
            {error}
          </div>
        )}

        {/* Grilla de clientes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map(client => (
            <div key={client.id} className="bg-white rounded-lg shadow-sm hover:shadow-lg transition p-6">
              <h3 className="font-semibold text-gray-900 text-lg">
                {client.name} {client.lastName}
              </h3>
              <p className="text-gray-600 text-sm mb-4">DNI: {client.dni}</p>

              <div className="space-y-2 mb-4 text-gray-700">
                <div>Email: {client.email}</div>
                <div>Teléfono: {client.phoneNumber}</div>
                <div>Desde: {new Date(client.createdAt).toLocaleDateString("es-ES")}</div>
              </div>

              <div className="flex flex-col space-y-2">
                <Link to={`/trainer/client/${client.dni}/training-plans`}>
                  <button className="w-full bg-blue-900 text-white py-2 rounded">
                    Ver Planes
                  </button>
                </Link>

                {!showAll && localStorage.getItem("userRole") === "ROLE_TRAINER" && (
                  <Link to={`/trainer/client/${client.dni}/training-plans/new/edit`}>
                    <button className="w-full bg-pink-400 text-white py-2 rounded flex items-center justify-center">
                      <Plus className="h-4 w-4 mr-2"/> Crear Plan
                    </button>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Estado “sin clientes” */}
        {clients.length === 0 && !loading && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4"/>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {showAll ? 'No hay clientes en el gimnasio' : 'No tienes clientes activos'}
            </h3>
            <p className="text-gray-600">
              {showAll
                ? 'Los clientes aparecerán aquí cuando se registren en el gimnasio.'
                : 'Los clientes aparecerán aquí cuando tengan planes activos contigo.'}
            </p>
          </div>
        )}
      </main>

      <FooterPag />
    </div>
  )
}
