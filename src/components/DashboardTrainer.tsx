"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Users, Plus, TrendingUp, Calendar } from 'lucide-react'

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
  email: string
  phone: string
  membershipType: string
  joinDate: string
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

      const response = await fetch(`http://localhost:8080/api/v1/clients/gym/${encodeURIComponent(currentUser.gymName)}`, {
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

  useEffect(() => {
    if (currentUser) {
      fetchClients()
    }
  }, [currentUser])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Bienvenido, {currentUser?.name || 'Entrenador'}
        </h1>
        <p className="text-gray-600">
          Gestiona los planes de entrenamiento de tus clientes en {currentUser?.gymName || 'FitPower'}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
              <p className="text-2xl font-bold text-gray-900">-</p>
            </div>
            <Calendar className="h-8 w-8 text-pink-600" />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Progreso Semanal</p>
              <p className="text-2xl font-bold text-gray-900">-</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-600" />
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
                  <span className="font-medium">Teléfono:</span> {client.phone}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Membresía:</span> {client.membershipType}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Desde:</span> {new Date(client.joinDate).toLocaleDateString("es-ES")}
                </p>
              </div>

              <div className="flex flex-col space-y-2">
                <Link to={`/trainer/client/${client.dni}/training-plans`}>
                  <button className="w-full bg-blue-900 hover:bg-blue-800 text-white py-2 px-4 rounded-md transition-colors">
                    Ver Planes
                  </button>
                </Link>

                <Link to={`/trainer/client/${client.dni}/training-plans/new/edit`}>
                  <button className="w-full bg-pink-400 hover:bg-pink-500 text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center">
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Plan
                  </button>
                </Link>

                <Link to={`/trainer/client/${client.dni}/progress`}>
                  <button className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 px-4 rounded-md transition-colors flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Ver Progreso
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
    </div>
  )
}