// src/components/ClientProgress.tsx
"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { ArrowLeft } from 'lucide-react'
import PhysicalStatusHistory from "./PhysicalStatusHistory"

// Modelo del cliente
interface Client {
  dni: string
  name: string
}

// Modelo de estado físico
import { ClientStats } from "../model/ClientStatus";


export default function ClientProgress() {
  const { clientId } = useParams<{ clientId: string }>()
  const [client, setClient] = useState<Client | null>(null)
  const [stats, setStats] = useState<ClientStats[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (clientId) {
      fetchClientInfo()
      fetchClientStats()
    }
  }, [clientId])

  const fetchClientInfo = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/v1/clients/${clientId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const clientData = await response.json()
        setClient({
          dni: clientData.dni,
          name: clientData.name
        })
      }
    } catch (error) {
      console.error("Error al obtener cliente:", error)
    }
  }

  const fetchClientStats = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/v1/physical-stats/client/${clientId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const statsData = await response.json()
        setStats(statsData)
      } else {
        console.error("Error al obtener historial físico")
      }
    } catch (error) {
      console.error("Error al obtener historial físico:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <Link to="/trainer/dashboard">
          <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
            <ArrowLeft className="h-4 w-4" />
            <span>Volver</span>
          </button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Progreso del Cliente</h1>
          <p className="text-gray-600">
            {client?.name} ({client?.dni})
          </p>
        </div>
      </div>

      {/* Historial de estados físicos */}
      {stats.length > 0 ? (
        <PhysicalStatusHistory clientStats={stats} />
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600">Este cliente aún no tiene historial de estado físico registrado.</p>
        </div>
      )}
    </div>
  )
}
