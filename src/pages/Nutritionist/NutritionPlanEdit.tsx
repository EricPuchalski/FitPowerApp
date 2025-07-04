"use client"

import { useEffect, useState } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import { ArrowLeft, Save, Trash2 } from "lucide-react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

interface NutritionPlan {
  id?: number
  name: string
  description: string
  clientDni: string
}

export default function NutritionPlanEdit() {
  const { clientDni, planId } = useParams<{ clientDni: string; planId: string }>()
  const navigate = useNavigate()
  const isNewPlan = planId === "new"

  const [plan, setPlan] = useState<NutritionPlan>({
    name: "",
    description: "",
    clientDni: clientDni || ""
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isNewPlan) {
      fetchPlan()
    } else {
      setLoading(false)
    }
  }, [planId])

  const fetchPlan = async () => {
    const token = localStorage.getItem("token")
    try {
      const res = await fetch(`http://localhost:8080/api/v1/nutrition-plans/${planId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })

      if (!res.ok) {
        throw new Error("No se pudo cargar el plan nutricional.")
      }

      const data = await res.json()
      setPlan({
        id: data.id,
        name: data.name,
        description: data.description,
        clientDni: clientDni || ""
      })
    } catch (error) {
      console.error("Error al cargar el plan:", error)
      toast.error("Error al cargar el plan nutricional")
    } finally {
      setLoading(false)
    }
  }

  const savePlan = async () => {
    setSaving(true)
    const token = localStorage.getItem("token")
    const nutritionistId = localStorage.getItem("nutritionistId")

    if (!token || !nutritionistId) {
      toast.error("Faltan credenciales o sesión expirada")
      setSaving(false)
      return
    }

    if (!plan.name) {
      toast.error("El nombre del plan es obligatorio")
      setSaving(false)
      return
    }

    try {
      const clientRes = await fetch(`http://localhost:8080/api/v1/clients/${clientDni}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (!clientRes.ok) {
        toast.error("Cliente no encontrado")
        return
      }

      const clientData = await clientRes.json()
      let planIdResult = plan.id

      if (isNewPlan) {
        const res = await fetch("http://localhost:8080/api/v1/nutrition-plans", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: plan.name,
            description: plan.description,
            nutritionistId: parseInt(nutritionistId),
            clientId: clientData.id
          })
        })

        if (!res.ok) throw new Error("No se pudo crear el plan nutricional")

        const newPlan = await res.json()
        planIdResult = newPlan.id
        toast.success("Plan nutricional creado con éxito")
      } else {
        const res = await fetch(`http://localhost:8080/api/v1/nutrition-plans/${plan.id}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: plan.name,
            description: plan.description
          })
        })

        if (!res.ok) throw new Error("No se pudo actualizar el plan")
        toast.success("Plan nutricional actualizado")
      }

      navigate(`/nutritionist/client/${clientDni}/nutrition-plans/${planIdResult}/edit`)
    } catch (err) {
      console.error(err)
      toast.error("Error al guardar el plan nutricional")
    } finally {
      setSaving(false)
    }
  }

  const deletePlan = async () => {
    const confirmed = window.confirm("¿Estás seguro que deseas eliminar este plan nutricional?")
    if (!confirmed || !plan.id) return

    const token = localStorage.getItem("token")
    try {
      const res = await fetch(`http://localhost:8080/api/v1/nutrition-plans/${plan.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (!res.ok) throw new Error("Error al eliminar el plan")

      toast.success("Plan eliminado correctamente")
      navigate(`/nutritionist/client/${clientDni}/nutrition-plans`)
    } catch (err) {
      console.error(err)
      toast.error("No se pudo eliminar el plan")
    }
  }

  if (loading) {
    return <div className="p-8 text-gray-500">Cargando...</div>
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <Link to={`/nutritionist/client/${clientDni}/nutrition-plans`}>
          <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
            <ArrowLeft className="w-4 h-4" />
            <span>Volver</span>
          </button>
        </Link>
        <div className="space-x-2">
          {!isNewPlan && (
            <button
              onClick={deletePlan}
              className="text-red-600 hover:text-red-800 flex items-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Eliminar</span>
            </button>
          )}
          <button
            onClick={savePlan}
            disabled={saving}
            className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Guardando..." : "Guardar"}</span>
          </button>
        </div>
      </div>

      <div className="bg-white p-6 border rounded-lg shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del Plan *
          </label>
          <input
            type="text"
            value={plan.name}
            onChange={(e) => setPlan({ ...plan, name: e.target.value })}
            className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: Plan Keto Semana 1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            value={plan.description}
            onChange={(e) => setPlan({ ...plan, description: e.target.value })}
            className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Detalles o pautas nutricionales..."
          />
        </div>
      </div>

      <ToastContainer />
    </div>
  )
}
