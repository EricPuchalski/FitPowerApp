// This file is part of the FitPower project. And the route is src/components/DashboardTrainer.tsx
"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Users, Plus, TrendingUp, Calendar, Menu, X, Dumbbell, Apple, ChevronRight, BarChart2, Home } from 'lucide-react'
import { FooterPag } from '../../components/Footer'

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
  address: string
  goal: string
  initialPhysicalCondition: string
  gymName: string
  createdAt: string // 👈 sirve como joinDate
}

interface DashboardTrainerProps {
  user?: User
}

export default function DashboardTrainer({ user }: DashboardTrainerProps) {
  console.log("✅ Entró a DashboardTrainer"); 
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<User | null>(user || null)
  const [activePlansCount, setActivePlansCount] = useState<number>(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    // Get user from localStorage if not provided as prop
    if (!currentUser) {
      const token = localStorage.getItem("token")
      const userDni = localStorage.getItem("userDni")
      
      if (token && userDni) {
        fetchTrainerInfo(userDni)
      }
    } else {
      fetchClients()
    }
  }, [currentUser])

  const fetchTrainerInfo = async (dni: string) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:8080/api/v1/trainers/${dni}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const trainerData = await response.json()

        // ✅ Guardar el ID real del entrenador en localStorage
        localStorage.setItem("trainerId", trainerData.id.toString());
        // ✅ AGREGAR ESTA LÍNEA - Guardar el rol del usuario
        localStorage.setItem("userRole", "ROLE_TRAINER");

        setCurrentUser({
          dni: trainerData.dni,
          name: trainerData.name,
          gymName: trainerData.gymName,
          role: "ROLE_TRAINER",
        })
      }
    } catch (error) {
      console.error("Error fetching trainer info:", error)
      setError("Error al cargar información del entrenador")
    }
  }

  const fetchClients = async () => {
    if (!currentUser?.gymName) return
  
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
  
      const response = await fetch(`http://localhost:8080/api/v1/gyms/clients/gym/${encodeURIComponent(currentUser.gymName)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
  
      if (response.ok) {
        const clientsData = await response.json()
        setClients(clientsData)
      } else {
        setError("Error al cargar los clientes")
      }
    } catch (err) {
      setError("Error al cargar los clientes")
      console.error("Error fetching clients:", err)
    } finally {
      setLoading(false)
    }
  }
  
  const fetchTrainingPlans = async () => {
    const trainerId = localStorage.getItem("trainerId")
    const token = localStorage.getItem("token")
    if (!trainerId || !token) return
  
    try {
      const res = await fetch(`http://localhost:8080/api/v1/training-plans/trainer/${trainerId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      if (!res.ok) throw new Error("Error al obtener planes")
      const data = await res.json()
  
      // Filtrar por campo `active` directamente
      const activos = data.filter((plan: any) => plan.active === true)
  
      setActivePlansCount(activos.length)
    } catch (err) {
      console.error("Error al cargar planes:", err)
      setActivePlansCount(0)
    }
  }

  useEffect(() => {
    if (currentUser) {
      fetchClients()
      fetchTrainingPlans()
    }
  }, [currentUser])

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100">
        <header className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white shadow-lg">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Dumbbell className="w-8 h-8" />
              <h1 className="text-2xl font-bold">FitPower Trainer</h1>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="/trainer" className="hover:text-blue-200 transition flex items-center space-x-1">
                <Home size={18} />
                <span>Inicio</span>
              </a>
              <a href="/trainer/clients" className="hover:text-blue-200 transition flex items-center space-x-1">
                <Users size={18} />
                <span>Clientes</span>
              </a>
              <a href="/exercises" className="hover:text-blue-200 transition flex items-center space-x-1">
                <Dumbbell size={18} />
                <span>Ejercicios</span>
              </a>
            </nav>
            <button 
              className="md:hidden bg-blue-800 p-2 rounded-md hover:bg-indigo-700 transition"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </header>

        {isMenuOpen && (
          <div className="md:hidden bg-indigo-800 text-white">
            <nav className="container mx-auto px-4 py-2 flex flex-col space-y-2">
              <a href="/trainer" className="hover:bg-indigo-700 py-2 px-4 rounded transition flex items-center space-x-2">
                <Home size={18} />
                <span>Inicio</span>
              </a>
              <a href="/trainer/clients" className="hover:bg-indigo-700 py-2 px-4 rounded transition flex items-center space-x-2">
                <Users size={18} />
                <span>Clientes</span>
              </a>
              <a href="/exercises" className="hover:bg-indigo-700 py-2 px-4 rounded transition flex items-center space-x-2">
                <Dumbbell size={18} />
                <span>Ejercicios</span>
              </a>
            </nav>
          </div>
        )}

        <div className="flex-grow container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
        <FooterPag />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Dumbbell className="w-8 h-8" />
            <h1 className="text-2xl font-bold">FitPower Trainer</h1>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="/trainer" className="hover:text-blue-200 transition flex items-center space-x-1">
              <Home size={18} />
              <span>Inicio</span>
            </a>
            <a href="/trainer/clients" className="hover:text-blue-200 transition flex items-center space-x-1">
              <Users size={18} />
              <span>Clientes</span>
            </a>
            <a href="/exercises" className="hover:text-blue-200 transition flex items-center space-x-1">
              <Dumbbell size={18} />
              <span>Ejercicios</span>
            </a>
          </nav>
          <button 
            className="md:hidden bg-blue-800 p-2 rounded-md hover:bg-indigo-700 transition"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {isMenuOpen && (
        <div className="md:hidden bg-indigo-800 text-white">
          <nav className="container mx-auto px-4 py-2 flex flex-col space-y-2">
            <a href="/trainer" className="hover:bg-indigo-700 py-2 px-4 rounded transition flex items-center space-x-2">
              <Home size={18} />
              <span>Inicio</span>
            </a>
            <a href="/trainer/clients" className="hover:bg-indigo-700 py-2 px-4 rounded transition flex items-center space-x-2">
              <Users size={18} />
              <span>Clientes</span>
            </a>
            <a href="/exercises" className="hover:bg-indigo-700 py-2 px-4 rounded transition flex items-center space-x-2">
              <Dumbbell size={18} />
              <span>Ejercicios</span>
            </a>
          </nav>
        </div>
      )}

      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bienvenido, {currentUser?.name || 'Entrenador'}
          </h1>
          <p className="text-gray-600">
            Gestiona los planes de entrenamiento de tus clientes en {currentUser?.gymName || 'FitPower'}
          </p>
        </div>
        {/* Acceso a Gestión de Ejercicios */}
        <div className="mb-8">
          <Link to="/exercises">
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors">
              Ir a Gestión de Ejercicios
            </button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Total Clientes</p>
                <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
              </div>
              <Users className="h-8 w-8 text-cyan-600" />
            </div>
          </div>

          <div className="bg-pink-50 border border-pink-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Planes Activos</p>
                <p className="text-2xl font-bold text-gray-900">{activePlansCount}</p>
              </div>
              <Calendar className="h-8 w-8 text-pink-600" />
            </div>
          </div>
        </div>

        {/* Clients Grid */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Mis Clientes</h2>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client) => (
            <div key={client.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200">
              <div className="bg-cyan-50 rounded-t-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900">{client.name}</h3>
                <p className="text-sm text-gray-600">DNI: {client.dni}</p>
              </div>
              <div className="p-6">
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Email:</span> {client.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Teléfono:</span> {client.phoneNumber}
                  </p>
                
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Desde:</span> {new Date(client.createdAt).toLocaleDateString("es-ES")}
                  </p>
                </div>

                <div className="flex flex-col space-y-2">
                  <Link to={`/trainer/client/${client.dni}/training-plans`}>
                    <button className="w-full bg-blue-900 hover:bg-blue-800 text-white py-2 px-4 rounded-md transition-colors">
                      Ver Planes
                    </button>
                  </Link>

                  {localStorage.getItem("trainerId") && localStorage.getItem("userRole") === "ROLE_TRAINER" ? (
                    <Link to={`/trainer/client/${client.dni}/training-plans/new/edit`}>
                      <button className="w-full bg-pink-400 hover:bg-pink-500 text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center">
                        <Plus className="h-4 w-4 mr-2" />
                        Crear Plan
                      </button>
                    </Link>
                  ) : (
                    <button 
                      disabled
                      className="w-full bg-gray-300 text-white py-2 px-4 rounded-md cursor-not-allowed flex items-center justify-center"
                      title="Cargando datos del entrenador..."
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Crear Plan
                    </button>
                  )}
                  <Link to={`/trainer/client/${client.id}/progress`}>
                    <button className="w-full bg-green-700 hover:bg-green-800 text-white py-2 px-4 rounded-md transition-colors">
                      Ver Historial Físico
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {clients.length === 0 && !loading && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay clientes asignados</h3>
            <p className="text-gray-600">Los clientes aparecerán aquí cuando sean asignados a tu gimnasio.</p>
          </div>
        )}
      </main>
      <FooterPag />
    </div>
  )
}