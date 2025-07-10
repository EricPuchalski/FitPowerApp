// src/pages/Nutritionist/DashboardNutritionist.tsx
"use client"

import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  Users,
  Menu,
  X,
  Utensils,
  Home,
  PlusCircle
} from "lucide-react"
import { FooterPag } from "../../components/Footer"
import { NutritionistHeader } from "../../components/NutritionistHeader"
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

type ViewMode = "ALL" | "MINE"

export default function DashboardNutritionist() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>("ALL")
    const navigate = useNavigate();
    const { logout } = useAuth();

  useEffect(() => {
    const dni = localStorage.getItem("userDni")
    const token = localStorage.getItem("token")

    if (!dni || !token) {
      setError("No hay sesión activa.")
      setLoading(false)
      return
    }

    loadNutritionistInfo(dni, token)
  }, [])

  const loadNutritionistInfo = async (dni: string, token: string) => {
    try {
      const res = await fetch(`http://localhost:8080/api/v1/nutritionists/${dni}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      if (!res.ok) throw new Error("No se pudo cargar el nutricionista")

      const data = await res.json()
      localStorage.setItem("nutritionistId", data.id.toString())
      localStorage.setItem("userRole", "ROLE_NUTRITIONIST")

      setCurrentUser({
        dni: data.dni,
        name: data.name,
        gymName: data.gymName,
        role: "ROLE_NUTRITIONIST",
      })

      // Carga inicial: todos los clientes
      await loadClientsByGym(data.gymName)
    } catch (err) {
      setError("Error al cargar información del nutricionista")
      setLoading(false)
    }
  }

  const loadClientsByGym = async (gymName: string) => {
    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(
        `http://localhost:8080/api/v1/gyms/${encodeURIComponent(gymName)}/clients`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      if (!res.ok) throw new Error("Error al cargar los clientes del gimnasio")
      const data: Client[] = await res.json()
      setClients(data)
    } catch (err) {
      setError("Error al obtener los clientes del gimnasio")
    } finally {
      setLoading(false)
    }
  }

  const loadMyClients = async () => {
    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem("token")
      const nutritionistId = localStorage.getItem("nutritionistId")
      if (!nutritionistId) throw new Error("ID de nutricionista no encontrado")
      const res = await fetch(
        `http://localhost:8080/api/v1/nutritionists/${nutritionistId}/clients/active`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      if (!res.ok) throw new Error("Error al cargar mis clientes")
      const data: Client[] = await res.json()
      setClients(data)
    } catch (err) {
      setError("Error al obtener mis clientes")
    } finally {
      setLoading(false)
    }
  }

  const handleViewChange = (mode: ViewMode) => {
    setViewMode(mode)
    if (mode === "ALL" && currentUser) {
      loadClientsByGym(currentUser.gymName)
    } else if (mode === "MINE") {
      loadMyClients()
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100">
        <p className="p-8 text-center">Cargando datos…</p>
      </div>
    )
  }

  const handleLogout = () => {
  logout();
  navigate("/"); // o "/login" si tenés una ruta específica
};

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <NutritionistHeader onLogout={handleLogout}></NutritionistHeader>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{`Bienvenido/a, ${currentUser?.name}`}</h1>
          <p className="text-gray-600">{`Gimnasio: ${currentUser?.gymName}`}</p>
        </div>
        <div className="mt-4">
 
</div>

{/* Botones de filtro */}
<div className="mt-4 flex space-x-4 mb-6">
  <button
    onClick={() => handleViewChange("ALL")}
    className={`px-4 py-2 rounded ${viewMode === "ALL" ? "bg-green-800 text-white" : "bg-gray-200 text-gray-700"}`}
  >
    Todos los clientes
  </button>
          <button
            onClick={() => handleViewChange("MINE")}
            className={`px-4 py-2 rounded ${viewMode === "MINE" ? "bg-green-800 text-white" : "bg-gray-200 text-gray-700"}`}
          >
            Mis clientes
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="p-6 bg-green-50 rounded-lg border flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">Total Clientes</p>
              <p className="text-2xl font-bold">{clients.length}</p>
            </div>
            <Users className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold">
            {viewMode === "ALL" ? "Clientes del Gimnasio" : "Mis Clientes"}
          </h2>
          <p className="text-sm text-gray-600">Gestiona sus planes nutricionales</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-800 border rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client) => (
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
                    Ver Cliente
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {clients.length === 0 && !loading && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay clientes para mostrar
            </h3>
            <p className="text-gray-600">
              {viewMode === "ALL"
                ? "Los clientes aparecerán aquí cuando estén registrados en tu gimnasio."
                : "No tienes clientes asignados en este momento."}
            </p>
          </div>
        )}
      </main>

      <FooterPag />
    </div>
  )
}
