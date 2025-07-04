// src/pages/Nutritionist/DashboardNutritionistPlans.tsx
"use client"

import { useEffect, useState } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import { Plus, Edit2, Trash2, ArrowLeft } from "lucide-react"
import { toast, ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'

interface NutritionPlan {
  id: number
  name: string
  description: string
  startDate: string
  endDate: string
}

export default function DashboardNutritionistPlans() {
  const { clientDni } = useParams<{ clientDni: string }>()
  const [plans, setPlans] = useState<NutritionPlan[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")

    const fetchActivePlan = async () => {
      setLoading(true)
      try {
        const response = await fetch(
          `http://localhost:8080/api/v1/clients/${clientDni}/nutrition-plans/active`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        )

        if (response.status === 404) {
          // Sin plan activo
          setPlans([])
        } else if (!response.ok) {
          throw new Error("Error al obtener el plan activo")
        } else {
          const data: NutritionPlan = await response.json()
          setPlans([data])  // lo metemos en un array para reutilizar la UI de tabla
        }
      } catch (error) {
        console.error(error)
        toast.error("Error al cargar el plan nutricional activo")
      } finally {
        setLoading(false)
      }
    }

    fetchActivePlan()
  }, [clientDni])

  const deletePlan = async (planId: number) => {
    const confirmed = window.confirm("¿Estás seguro de que deseas eliminar este plan?")
    if (!confirmed) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(//nutrition-plans //${planId}
        `http://localhost:8080/api/v1/clients/${clientDni}/nutrition-plans/${planId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      if (!response.ok) {
        throw new Error("Error al eliminar el plan")
      }

      setPlans(prev => prev.filter(p => p.id !== planId))
      toast.success("Plan eliminado correctamente")
    } catch (error) {
      console.error(error)
      toast.error("Error al eliminar el plan")
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-center">Cargando plan activo…</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <Link to="/dashboard-nutritionist" className="text-sm text-gray-600 hover:text-gray-900 flex items-center space-x-1">
          <ArrowLeft className="w-4 h-4" />
          <span>Volver</span>
        </Link>
        <h1 className="text-2xl font-bold">Plan Nutricional Activo de {clientDni}</h1>
        <button
          onClick={() => navigate(`/nutritionist/client/${clientDni}/nutrition-plans/new/edit`)}
          className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-md flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Plan</span>
        </button>
      </div>

      <div className="bg-white shadow rounded-lg border">
        <div className="p-4">
          {plans.length === 0 ? (
            <p className="text-gray-500 text-center py-6">
              No hay plan activo. Crea uno nuevo desde el botón arriba.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {plans.map(plan => (
                    <tr key={plan.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {plan.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => navigate(`/nutritionist/client/${clientDni}/nutrition-plans/${plan.id}/edit`)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deletePlan(plan.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <ToastContainer />
    </div>
  )
}
