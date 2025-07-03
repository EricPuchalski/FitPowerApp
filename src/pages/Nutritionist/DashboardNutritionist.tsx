// src/components/DashboardNutritionist.tsx
"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Users, Plus, Salad, Calendar } from "lucide-react"

interface Nutritionist {
  dni: string
  name: string
  gymName: string
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

export default function DashboardNutritionist() {
  const [nutritionist, setNutritionist] = useState<Nutritionist | null>(null)
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const dni = localStorage.getItem("userDni")

    if (token && dni) {
      fetchNutritionist(dni)
    }
  }, [])

  const fetchNutritionist = async (dni: string) => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`http://localhost:8080/api/v1/nutritionists/${dni}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!res.ok) throw new Error("No se pudo obtener nutricionista")
      const data = await res.json()
      setNutritionist({
        dni: data.dni,
        name: data.name,
        gymName: data.gymName
      })
    } catch (err) {
      console.error("Error:", err)
      setError("Error al obtener nutricionista")
    }
  }

  useEffect(() => {
    if (nutritionist?.gymName) {
      fetchClientsByGym(nutritionist.gymName)
    }
  }, [nutritionist])

  const fetchClientsByGym = async (gymName: string) => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`http://localhost:8080/api/v1/gyms/${encodeURIComponent(gymName)}/clients`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!res.ok) throw new Error("No se pudo obtener clientes")
      const data = await res.json()
      setClients(data)
    } catch (err) {
      console.error("Error:", err)
      setError("Error al obtener clientes del gimnasio")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <p className="text-center py-6">Cargando...</p>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Bienvenido, {nutritionist?.name}
      </h1>
      <p className="text-gray-600 mb-6">
        Clientes activos en tu gimnasio: {nutritionist?.gymName}
      </p>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {clients.map((client) => (
          <div key={client.id} className="border rounded-lg shadow-sm p-4 bg-white">
            <h3 className="text-lg font-semibold text-gray-900">
              {client.name} {client.lastName}
            </h3>
            <p className="text-sm text-gray-600">DNI: {client.dni}</p>
            <p className="text-sm text-gray-600">Email: {client.email}</p>
            <p className="text-sm text-gray-600">Teléfono: {client.phoneNumber}</p>
            <p className="text-sm text-gray-600">Desde: {new Date(client.createdAt).toLocaleDateString("es-ES")}</p>

            <div className="flex flex-col gap-2 mt-4">
              <Link to={`/nutritionist/client/${client.dni}/nutrition-plans`}>
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center justify-center">
                  <Salad className="h-4 w-4 mr-2" />
                  Ver Planes
                </button>
              </Link>

              <Link to={`/nutritionist/client/${client.dni}/nutrition-plans/new/edit`}>
                <button className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md flex items-center justify-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Plan
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {clients.length === 0 && (
        <div className="text-center py-12 text-gray-600">
          <Users className="h-12 w-12 mx-auto mb-4" />
          <p>No hay clientes activos aún en tu gimnasio.</p>
        </div>
      )}
    </div>
  )
}
