//src/components/TrainingPlanEdit.tsx
"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react'

interface Exercise {
  id?: number
  exerciseName: string
  series: number
  repetitions: number
  weight: number
  dayOfWeek: string
  restTime: number
  notes: string
}

interface TrainingPlan {
  id?: number
  name: string
  description: string
  startDate: string
  endDate: string
  clientDni: string
  exercises: Exercise[]
}

const DAYS_OF_WEEK = [
  { value: "MONDAY", label: "Lunes" },
  { value: "TUESDAY", label: "Martes" },
  { value: "WEDNESDAY", label: "Miércoles" },
  { value: "THURSDAY", label: "Jueves" },
  { value: "FRIDAY", label: "Viernes" },
  { value: "SATURDAY", label: "Sábado" },
  { value: "SUNDAY", label: "Domingo" },
]

export default function TrainingPlanEdit() {
  const { clientId, planId } = useParams<{ clientId: string; planId: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [plan, setPlan] = useState<TrainingPlan>({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    clientDni: clientId || "",
    exercises: [],
  })
  const [authError, setAuthError] = useState<string | null>(null)

  const isNewPlan = planId === "new"

  useEffect(() => {
    if (isNewPlan) {
      setPlan({
        name: "",
        description: "",
        startDate: new Date().toISOString().split("T")[0],
        endDate: "",
        clientDni: clientId || "",
        exercises: [],
      })
      setLoading(false)
    } else {
      fetchTrainingPlan()
    }
  }, [planId, isNewPlan, clientId])

  const fetchTrainingPlan = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      
      if (!token) {
        setAuthError("No se encontró token de autenticación. Por favor inicie sesión nuevamente.")
        return
      }

      // Obtener detalles del plan
      const planResponse = await fetch(`http://localhost:8080/api/v1/training-plans/${planId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!planResponse.ok) {
        if (planResponse.status === 401 || planResponse.status === 403) {
          setAuthError("No tienes permisos para acceder a este plan. Por favor verifica tus credenciales.")
          return
        }
        throw new Error(`Error al obtener el plan: ${planResponse.statusText}`)
      }

      const planData = await planResponse.json()
      
      // Obtener ejercicios del plan
      const exercisesResponse = await fetch(`http://localhost:8080/api/v1/training-plans/${planId}/exercises`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      let exercises = []
      if (exercisesResponse.ok) {
        exercises = await exercisesResponse.json()
      }

      setPlan({
        id: planData.id,
        name: planData.name,
        description: planData.description,
        startDate: planData.startDate,
        endDate: planData.endDate,
        clientDni: clientId || "",
        exercises: exercises
      })
    } catch (error) {
      console.error("Error fetching training plan:", error)
      setAuthError("Ocurrió un error al cargar el plan. Por favor intenta nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  const addExercise = () => {
    const newExercise: Exercise = {
      exerciseName: "",
      series: 3,
      repetitions: 10,
      weight: 0,
      dayOfWeek: "MONDAY",
      restTime: 60,
      notes: "",
    }
    setPlan((prev) => ({
      ...prev,
      exercises: [...prev.exercises, newExercise],
    }))
  }

  const updateExercise = (exerciseIndex: number, field: keyof Exercise, value: any) => {
    setPlan((prev) => ({
      ...prev,
      exercises: prev.exercises.map((exercise, index) =>
        index === exerciseIndex ? { ...exercise, [field]: value } : exercise
      ),
    }))
  }

  const removeExercise = (exerciseIndex: number) => {
    setPlan((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((_, index) => index !== exerciseIndex),
    }))
  }

  const savePlan = async () => {
    setSaving(true)
    setAuthError(null)
    
    if (!plan.name) {
      alert("Completa el nombre del plan.")
      setSaving(false)
      return
    }

    const token = localStorage.getItem("token")
    const trainerIdStr = localStorage.getItem("trainerId")
    const userRole = localStorage.getItem("userRole")

    // Debug authentication info
    console.log("Auth Debug:", {
      tokenExists: !!token,
      tokenLength: token?.length,
      trainerId: trainerIdStr,
      userRole: userRole
    })

    if (!token) {
      setAuthError("No se encontró token de autenticación. Por favor inicie sesión nuevamente.")
      setSaving(false)
      return
    }

    if (!trainerIdStr) {
      alert("No se encontró el ID del entrenador. Por favor vuelve a intentar.")
      setSaving(false)
      return
    }

    const trainerId = Number(trainerIdStr)
    if (isNaN(trainerId) || trainerId <= 0) {
      alert("El ID del entrenador no es válido.")
      setSaving(false)
      return
    }

    const clientIdNum = Number(clientId)
    if (isNaN(clientIdNum)) {
      alert("El DNI del cliente no es válido.")
      setSaving(false)
      return
    }

    try {
      // Verificar que el cliente existe antes de crear el plan
      const clientCheckRes = await fetch(`http://localhost:8080/api/v1/clients/${clientIdNum}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!clientCheckRes.ok) {
        if (clientCheckRes.status === 401 || clientCheckRes.status === 403) {
          setAuthError("No tienes permisos para acceder a este cliente. Por favor verifica tus credenciales.")
          return
        }
        const errorText = await clientCheckRes.text()
        console.error("Cliente no encontrado - Error completo:", errorText)
        alert("El cliente no existe en la base de datos o no tienes permisos para acceder.")
        return
      }
      
      const clientData = await clientCheckRes.json()
      console.log("Cliente encontrado:", clientData)

      // Crear payload completamente limpio sin ningún id
      const planPayload = {
        name: plan.name.trim(),
        description: plan.description.trim(),
        startDate: plan.startDate,
        endDate: plan.endDate,
        trainerId: trainerId,
        clientId: clientData.id  // AGREGADO 
      }

      const createRes = await fetch('http://localhost:8080/api/v1/training-plans', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(planPayload)
      })

      if (!createRes.ok) {
        if (createRes.status === 401 || createRes.status === 403) {
          setAuthError("No tienes permisos para crear planes. Por favor verifica tus credenciales.")
          return
        }
        const errorText = await createRes.text()
        console.error("Error response body:", errorText)
        throw new Error("No se creó el plan.")
      }

      const createdPlan = await createRes.json()
      console.log("Plan creado exitosamente:", createdPlan)

      // Enviar ejercicios correctamente formateados
      for (const ex of plan.exercises) {
        const exPayload = {
          exerciseName: ex.exerciseName,
          series: ex.series,
          repetitions: ex.repetitions,
          weight: ex.weight,
          dayOfWeek: ex.dayOfWeek,
          restTime: ex.restTime,
          notes: ex.notes
        }
        
        const exRes = await fetch(
          `http://localhost:8080/api/v1/training-plans/${createdPlan.id}/exercises`,
          {
            method: 'POST',
            headers: { 
              'Authorization': `Bearer ${token}`, 
              'Content-Type': 'application/json' 
            },
            body: JSON.stringify(exPayload)
          }
        )
        
        if (!exRes.ok) {
          console.error("Error creando ejercicio:", await exRes.text())
        }
      }

      navigate(`/trainer/client/${clientId}/training-plans`)
    } catch (err) {
      console.error("Error completo:", err)
      setAuthError("Error al guardar el plan. Por favor verifica tus permisos e intenta nuevamente.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-48 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  if (authError) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {authError}
              </p>
              <div className="mt-4">
                <Link to="/login" className="text-sm font-medium text-red-700 hover:text-red-600">
                  Volver a iniciar sesión <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link to={`/trainer/client/${clientId}/training-plans`}>
            <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
              <ArrowLeft className="h-4 w-4" />
              <span>Volver</span>
            </button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            {isNewPlan ? "Crear Plan de Entrenamiento" : "Editar Plan de Entrenamiento"}
          </h1>
        </div>

        <button 
          onClick={savePlan} 
          disabled={saving} 
          className="bg-pink-400 hover:bg-pink-500 text-white px-4 py-2 rounded-md flex items-center space-x-2 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          <span>{saving ? "Guardando..." : "Guardar Plan"}</span>
        </button>
      </div>

      {/* Error message */}
      {authError && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {authError}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Plan Details */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-8">
        <div className="bg-cyan-50 rounded-t-lg p-4">
          <h2 className="text-lg font-semibold text-gray-900">Detalles del Plan</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Plan *
              </label>
              <input
                id="name"
                type="text"
                value={plan.name}
                onChange={(e) => setPlan((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Ej: Plan de Fuerza - Principiante"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Inicio *
              </label>
              <input
                id="startDate"
                type="date"
                value={plan.startDate}
                onChange={(e) => setPlan((prev) => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                id="description"
                value={plan.description}
                onChange={(e) => setPlan((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Describe los objetivos y características del plan..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Fin *
              </label>
              <input
                id="endDate"
                type="date"
                value={plan.endDate}
                onChange={(e) => setPlan((prev) => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Exercises */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="bg-cyan-50 rounded-t-lg p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Ejercicios</h2>
            <button 
              onClick={addExercise} 
              className="bg-pink-400 hover:bg-pink-500 text-white px-3 py-1 rounded-md flex items-center space-x-2 text-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Agregar Ejercicio</span>
            </button>
          </div>
        </div>
        <div className="p-6">
          {plan.exercises.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No hay ejercicios en este plan</p>
              <button 
                onClick={addExercise} 
                className="bg-pink-400 hover:bg-pink-500 text-white px-4 py-2 rounded-md flex items-center space-x-2 mx-auto"
              >
                <Plus className="h-4 w-4" />
                <span>Agregar Primer Ejercicio</span>
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {plan.exercises.map((exercise, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium text-gray-900">Ejercicio {index + 1}</h4>
                    <button
                      onClick={() => removeExercise(index)}
                      className="text-red-600 border border-red-300 hover:bg-red-50 px-2 py-1 rounded-md flex items-center space-x-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Ejercicio</label>
                      <input
                        type="text"
                        value={exercise.exerciseName}
                        onChange={(e) => updateExercise(index, "exerciseName", e.target.value)}
                        placeholder="Ej: Sentadillas"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Series</label>
                      <input
                        type="number"
                        value={exercise.series}
                        onChange={(e) => updateExercise(index, "series", Number.parseInt(e.target.value) || 0)}
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Repeticiones</label>
                      <input
                        type="number"
                        value={exercise.repetitions}
                        onChange={(e) => updateExercise(index, "repetitions", Number.parseInt(e.target.value) || 0)}
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Peso (kg)</label>
                      <input
                        type="number"
                        value={exercise.weight}
                        onChange={(e) => updateExercise(index, "weight", Number.parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.5"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Día</label>
                      <select
                        value={exercise.dayOfWeek}
                        onChange={(e) => updateExercise(index, "dayOfWeek", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {DAYS_OF_WEEK.map((day) => (
                          <option key={day.value} value={day.value}>
                            {day.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Descanso (seg)</label>
                      <input
                        type="number"
                        value={exercise.restTime}
                        onChange={(e) => updateExercise(index, "restTime", Number.parseInt(e.target.value) || 0)}
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="md:col-span-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
                      <input
                        type="text"
                        value={exercise.notes}
                        onChange={(e) => updateExercise(index, "notes", e.target.value)}
                        placeholder="Instrucciones adicionales..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}