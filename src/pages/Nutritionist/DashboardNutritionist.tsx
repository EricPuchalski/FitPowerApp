// src/components/DashboardNutritionist.tsx
"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  Users,
  Plus,
  Menu,
  X,
  HeartPulse,
  Home
} from 'lucide-react'
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
  createdAt: string
}

interface DashboardNutritionistProps {
  user?: User
}

export default function DashboardNutritionist({ user }: DashboardNutritionistProps) {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<User | null>(user || null)
  const [activePlansCount, setActivePlansCount] = useState<number>(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    if (!currentUser) {
      const token = localStorage.getItem("token")
      const userDni = localStorage.getItem("userDni")
      if (token && userDni) {
        fetchNutritionistInfo(userDni)
      }
    } else {
      loadData()
    }
  }, [currentUser, showAll])

  const loadData = () => {
    setLoading(true)
    setError(null)

    const loader = showAll ? fetchAllClients : fetchMyClients
    loader()
      .then(() => fetchNutritionPlans())
      .catch(() => setError("Error al cargar los clientes"))
      .finally(() => setLoading(false))
  }

  const fetchNutritionistInfo = async (dni: string) => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`http://localhost:8080/api/v1/nutritionists/${dni}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      localStorage.setItem("nutritionistId", data.id.toString())
      localStorage.setItem("userRole", "ROLE_NUTRITIONIST")
      setCurrentUser({
        dni: data.dni,
        name: data.name,
        gymName: data.gymName,
        role: "ROLE_NUTRITIONIST"
      })
    } catch {
      setError("Error al cargar información del nutricionista")
      setLoading(false)
    }
  }

  const fetchMyClients = async () => {
    const nutritionistId = localStorage.getItem("nutritionistId")
    const token = localStorage.getItem("token")
    if (!nutritionistId || !token) throw new Error()

    const res = await fetch(
      `http://localhost:8080/api/v1/nutritionists/${nutritionistId}/clients/active`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    )
    if (!res.ok) {
      if (res.status === 404) {
        setClients([])
        return
      }
      throw new Error()
    }
    const data: Client[] = await res.json()
    setClients(data)
  }

  const fetchAllClients = async () => {
    const token = localStorage.getItem("token")
    const gymName = currentUser?.gymName
    if (!gymName || !token) throw new Error()

    const res = await fetch(
      `http://localhost:8080/api/v1/gyms/${encodeURIComponent(gymName)}/clients`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    )
    if (!res.ok) throw new Error()
    const data: Client[] = await res.json()
    setClients(data)
  }

  const fetchNutritionPlans = async () => {
    const nutritionistId = localStorage.getItem("nutritionistId")
    const token = localStorage.getItem("token")
    if (!nutritionistId || !token) return

    try {
      const res = await fetch(
        `http://localhost:8080/api/v1/nutrition-plans/nutritionist/${nutritionistId}`,
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

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100">
        <p className="p-8 text-center">Cargando datos…</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-gradient-to-r from-green-900 to-emerald-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <HeartPulse className="w-8 h-8" />
            <h1 className="text-2xl font-bold">FitPower Nutritionist</h1>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="/nutritionist" className="hover:text-green-200 flex items-center space-x-1">
              <Home size={18} /><span>Inicio</span>
            </a>
            <a href="/nutritionist/clients" className="hover:text-green-200 flex items-center space-x-1">
              <Users size={18} /><span>Clientes</span>
            </a>
          </nav>
          <button className="md:hidden bg-green-800 p-2 rounded" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24}/> : <Menu size={24}/>}
          </button>
        </div>
      </header>
      {isMenuOpen && (
        <div className="md:hidden bg-emerald-800 text-white">
          <nav className="p-4 flex flex-col space-y-2">
            <a href="/nutritionist" className="hover:bg-emerald-700 p-2 rounded flex items-center space-x-2">
              <Home size={18}/><span>Inicio</span>
            </a>
            <a href="/nutritionist/clients" className="hover:bg-emerald-700 p-2 rounded flex items-center space-x-2">
              <Users size={18}/><span>Clientes</span>
            </a>
          </nav>
        </div>
      )}

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{`Bienvenido, ${currentUser?.name}`}</h1>
          <p className="text-gray-600">{`Gimnasio: ${currentUser?.gymName}`}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="p-6 bg-emerald-50 rounded-lg border flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">Total Clientes</p>
              <p className="text-2xl font-bold">{clients.length}</p>
            </div>
            <Users className="h-8 w-8 text-emerald-600"/>
          </div>
        </div>

        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setShowAll(false)}
            className={`px-4 py-2 rounded ${!showAll ? 'bg-green-900 text-white' : 'bg-gray-200'}`}
          >
            Mis Clientes
          </button>
          <button
            onClick={() => setShowAll(true)}
            className={`px-4 py-2 rounded ${showAll ? 'bg-green-900 text-white' : 'bg-gray-200'}`}
          >
            Todos los Clientes
          </button>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold">
            {showAll ? 'Todos los Clientes del Gimnasio' : 'Mis Clientes con Planes Nutricionales'}
          </h2>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-800 border rounded">
            {error}
          </div>
        )}

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
                <Link to={`/nutritionist/client/${client.dni}/nutrition-plans`}>
                  <button className="w-full bg-green-800 text-white py-2 rounded">
                    Ver Planes Nutricionales
                  </button>
                </Link>

                {!showAll && localStorage.getItem("userRole") === "ROLE_NUTRITIONIST" && (
                  <Link to={`/nutritionist/client/${client.dni}/nutrition-plans/new/edit`}>
                    <button className="w-full bg-pink-400 text-white py-2 rounded flex items-center justify-center">
                      <Plus className="h-4 w-4 mr-2"/> Crear Plan
                    </button>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {clients.length === 0 && !loading && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4"/>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {showAll ? 'No hay clientes en el gimnasio' : 'No tienes clientes activos'}
            </h3>
            <p className="text-gray-600">
              {showAll
                ? 'Los clientes aparecerán aquí cuando se registren en el gimnasio.'
                : 'Los clientes aparecerán aquí cuando tengan planes nutricionales contigo.'}
            </p>
          </div>
        )}
      </main>

      <FooterPag />
    </div>
  )
}
