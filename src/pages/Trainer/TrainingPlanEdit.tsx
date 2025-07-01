// src/components/TrainingPlanEdit.tsx
"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

interface SimpleExercise {
  id: number
  name: string
}

interface Exercise {
  id?: number
  exerciseId: number
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
  const { clientDni, planId } = useParams<{ clientDni: string; planId: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [allExercises, setAllExercises] = useState<SimpleExercise[]>([])
  const [plan, setPlan] = useState<TrainingPlan>({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    clientDni: clientDni || "",
    exercises: [],
  })
  const [authError, setAuthError] = useState<string | null>(null)

  const isNewPlan = planId === "new"

  useEffect(() => {
    const token = localStorage.getItem("token")
    
    const fetchExercises = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/v1/exercises", {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        const data = await res.json()
        setAllExercises(data)
        toast.success("Ejercicios cargados correctamente")

        if (isNewPlan) {
          setPlan({
            name: "",
            description: "",
            startDate: new Date().toISOString().split("T")[0],
            endDate: "",
            clientDni: clientDni || "",
            exercises: [],
          })
          setLoading(false)
        } else {
          // ⚠️ Solo cargar el plan luego de tener los ejercicios disponibles
          await fetchTrainingPlan(data)
        }
      } catch (error) {
        console.error("Error al cargar ejercicios:", error)
        toast.error("Error al cargar ejercicios. Por favor intenta nuevamente.")
        setAuthError("Error al cargar ejercicios. Por favor intenta nuevamente.")
      }
    }

    fetchExercises()
  }, [planId, isNewPlan, clientDni])

  const fetchTrainingPlan = async (exerciseCatalog: SimpleExercise[]) => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      if (!token) {
        toast.error("No se encontró token de autenticación")
        setAuthError("No se encontró token de autenticación. Por favor inicie sesión nuevamente.")
        return
      }

      const [planResponse, exercisesResponse] = await Promise.all([
        fetch(`http://localhost:8080/api/v1/training-plans/${planId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch(`http://localhost:8080/api/v1/training-plans/${planId}/exercises`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      ])

      if (!planResponse.ok) {
        if (planResponse.status === 401 || planResponse.status === 403) {
          toast.error("No tienes permisos para acceder a este plan")
          setAuthError("No tienes permisos para acceder a este plan. Por favor verifica tus credenciales.")
        }
        throw new Error(`Error al obtener el plan: ${planResponse.statusText}`)
      }

      const planData = await planResponse.json()
      let exercises: Exercise[] = []
      if (exercisesResponse.ok) {
        const exercisesData = await exercisesResponse.json()
        
        // =================================================================
        // ✅ INICIO DE LA CORRECCIÓN APLICADA
        // =================================================================
        
        exercises = exercisesData.map((ex: any) => {
          // Busca en el catálogo global (exerciseCatalog) que ya tiene todos los nombres
          const match = exerciseCatalog.find(e => e.id === ex.exerciseId || e.id === ex.exercise?.id);
          
          return {
            id: ex.id,
            exerciseId: ex.exerciseId || ex.exercise?.id || 0,
            exerciseName: match?.name || "Sin nombre", // <-- Se usa el nombre del catálogo
            series: ex.series,
            repetitions: ex.repetitions,
            weight: ex.weight,
            restTime: ex.restTime,
            dayOfWeek: ex.day,
            notes: ex.notes || ""
          };
        })

        // =================================================================
        // ✅ FIN DE LA CORRECCIÓN APLICADA
        // =================================================================
      }

      setPlan({
        id: planData.id,
        name: planData.name,
        description: planData.description,
        startDate: planData.startDate,
        endDate: planData.endDate,
        clientDni: clientDni || "",
        exercises: exercises
      })
      
      toast.success("Plan de entrenamiento cargado correctamente")
    } catch (error) {
      console.error("Error fetching training plan:", error)
      toast.error("Error al cargar el plan de entrenamiento")
      setAuthError("Ocurrió un error al cargar el plan. Por favor intenta nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  const addExercise = () => {
    const newExercise: Exercise = {
      exerciseId: 0,
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
    toast.success("Nuevo ejercicio agregado")
  }

  const updateExercise = (exerciseIndex: number, field: keyof Exercise, value: any) => {
    setPlan((prev) => ({
      ...prev,
      exercises: prev.exercises.map((exercise, index) => {
        if (index === exerciseIndex) {
          // Si estamos actualizando el ID del ejercicio, también actualizamos el nombre
          if (field === "exerciseId") {
            const selectedExercise = allExercises.find(ex => ex.id === Number(value))
            if (selectedExercise) {
              toast.info(`Ejercicio cambiado a: ${selectedExercise.name}`)
            }
            return {
              ...exercise,
              exerciseId: Number(value),
              exerciseName: selectedExercise?.name || ""
            }
          }
          return { ...exercise, [field]: value }
        }
        return exercise
      }),
    }))
  }

  const removeExercise = async (exerciseIndex: number) => {
    const exercise = plan.exercises[exerciseIndex]
    const token = localStorage.getItem("token")

    if (exercise.id) {
      const exerciseName = exercise.exerciseName || allExercises.find(ex => ex.id === exercise.exerciseId)?.name || "este ejercicio"
      const confirmed = window.confirm(`¿Seguro que deseas eliminar "${exerciseName}" permanentemente?`)
      if (!confirmed) return

      try {
        const response = await fetch(`http://localhost:8080/api/v1/training-plans/${plan.id}/exercises/${exercise.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
        
        if (response.ok) {
          toast.success(`Ejercicio "${exerciseName}" eliminado correctamente`)
        } else {
          throw new Error('Error en la respuesta del servidor')
        }
      } catch (error) {
        console.error("Error al eliminar ejercicio:", error)
        toast.error("Error al eliminar ejercicio del servidor")
        return
      }
    } else {
      toast.success("Ejercicio eliminado")
    }

    // Actualiza el estado local
    setPlan((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((_, index) => index !== exerciseIndex),
    }))
  }

  const savePlan = async () => {
    setSaving(true)
    setAuthError(null)
    if (!plan.name) {
      toast.error("Por favor completa el nombre del plan")
      setSaving(false)
      return
    }

    // Validar que todos los ejercicios tengan un exerciseId válido
    for (const ex of plan.exercises) {
      if (ex.exerciseId <= 0) {
        toast.error("Por favor selecciona un ejercicio válido para todas las rutinas")
        setSaving(false)
        return
      }
    }

    const token = localStorage.getItem("token")
    const trainerIdStr = localStorage.getItem("trainerId")
    const userRole = localStorage.getItem("userRole")

    if (!token) {
      toast.error("No se encontró token de autenticación")
      setAuthError("No se encontró token de autenticación. Por favor inicie sesión nuevamente.")
      setSaving(false)
      return
    }

    if (!trainerIdStr) {
      toast.error("No se encontró el ID del entrenador")
      setSaving(false)
      return
    }

    const trainerId = Number(trainerIdStr)
    if (isNaN(trainerId)) {
      toast.error("El ID del entrenador no es válido")
      setSaving(false)
      return
    }

    const clientIdNum = Number(clientDni)
    if (isNaN(clientIdNum)) {
      toast.error("El DNI del cliente no es válido")
      setSaving(false)
      return
    }

    try {
      toast.info("Guardando plan de entrenamiento...")
      
      const clientCheckRes = await fetch(`http://localhost:8080/api/v1/clients/${clientIdNum}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      if (!clientCheckRes.ok) {
        if (clientCheckRes.status === 401 || clientCheckRes.status === 403) {
          toast.error("No tienes permisos para acceder a este cliente")
          setAuthError("No tienes permisos para acceder a este cliente. Por favor verifica tus credenciales.")
          return
        }
        const errorText = await clientCheckRes.text()
        console.error("Cliente no encontrado - Error completo:", errorText)
        toast.error("El cliente no existe o no tienes permisos para acceder")
        return
      }
      const clientData = await clientCheckRes.json()

      if (isNewPlan) {
        const planPayload = {
          name: plan.name.trim(),
          trainerId: trainerId,
          clientId: clientData.id
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
          throw new Error("No se creó el plan.")
        }

        const createdPlan = await createRes.json()
        toast.success("Plan de entrenamiento creado exitosamente")

        // Agregar ejercicios al plan creado
        for (const ex of plan.exercises) {
          const exPayload = {
            exerciseId: ex.exerciseId,
            series: ex.series,
            repetitions: ex.repetitions,
            weight: ex.weight,
            day: ex.dayOfWeek,
            restTime: ex.restTime,
            notes: ex.notes
          }
          await fetch(
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
        }

        toast.success("Ejercicios agregados al plan correctamente")
        navigate(`/trainer/client/${clientDni}/training-plans/${createdPlan.id}/edit`)
        return
      } else {
        // Actualización de plan existente
        for (const ex of plan.exercises) {
          const exPayload = {
            exerciseId: ex.exerciseId,
            series: ex.series,
            repetitions: ex.repetitions,
            weight: ex.weight,
            day: ex.dayOfWeek,
            restTime: ex.restTime,
            notes: ex.notes
          }

          const endpoint = ex.id
            ? `http://localhost:8080/api/v1/training-plans/exercises/${ex.id}`
            : `http://localhost:8080/api/v1/training-plans/${plan.id}/exercises`

          const method = ex.id ? 'PUT' : 'POST'

          await fetch(endpoint, {
            method,
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(exPayload),
          })
        }

        toast.success("Plan de entrenamiento actualizado correctamente")
        navigate(`/trainer/client/${clientDni}/training-plans/${plan.id}/edit`)
      }
    } catch (err) {
      console.error("Error completo:", err)
      toast.error("Error al guardar el plan. Por favor intenta nuevamente.")
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
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
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
                  Volver a iniciar sesión <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link to={`/trainer/client/${clientDni}/training-plans`}>
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
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-8">
        <div className="bg-green-50 rounded-t-lg p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Ejercicios del Plan</h2>
          <button
            onClick={addExercise}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md flex items-center space-x-1"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Ejercicio</span>
          </button>
        </div>
        <div className="p-6 space-y-6">
          {plan.exercises.map((exercise, index) => (
            <div
              key={index}
              className="border border-gray-300 p-4 rounded-md space-y-4"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-md font-semibold">
                    {`Ejercicio #${index + 1}: ${exercise.exerciseName || "Sin nombre"}`}
                  </h3>
                  {exercise.exerciseName && (
                    <div className="mt-2 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                      <p className="text-sm text-blue-800">
                        <span className="font-semibold">Ejercicio actual:</span> {exercise.exerciseName}
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        {exercise.series} series × {exercise.repetitions} repeticiones
                        {exercise.weight > 0 && ` - ${exercise.weight}kg`}
                      </p>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => removeExercise(index)}
                  className="text-red-500 hover:text-red-600 flex items-center space-x-1"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Eliminar</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {exercise.exerciseName ? "Cambiar ejercicio" : "Seleccionar ejercicio"} *
                  </label>
                  <select
                    value={exercise.exerciseId || ""}
                    onChange={(e) => {
                      const selectedId = Number(e.target.value)
                      updateExercise(index, "exerciseId", selectedId)
                    }}
                    className="border px-3 py-2 rounded-md w-full"
                  >
                    <option value="" disabled>
                      — Selecciona ejercicio —
                    </option>
                    {allExercises.map((ex) => (
                      <option key={ex.id} value={ex.id}>
                        {ex.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Día de la semana *</label>
                  <select
                    value={exercise.dayOfWeek}
                    onChange={(e) =>
                      updateExercise(index, "dayOfWeek", e.target.value)
                    }
                    className="border px-3 py-2 rounded-md w-full"
                  >
                    {DAYS_OF_WEEK.map((day) => (
                      <option key={day.value} value={day.value}>
                        {day.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Series *</label>
                  <input
                    type="number"
                    value={exercise.series}
                    onChange={(e) =>
                      updateExercise(index, "series", Number(e.target.value))
                    }
                    className="border px-3 py-2 rounded-md w-full"
                    placeholder="Ej: 3"
                    min={0}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Repeticiones *</label>
                  <input
                    type="number"
                    value={exercise.repetitions}
                    onChange={(e) =>
                      updateExercise(index, "repetitions", Number(e.target.value))
                    }
                    className="border px-3 py-2 rounded-md w-full"
                    placeholder="Ej: 10"
                    min={0}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Peso (kg)</label>
                  <input
                    type="number"
                    value={exercise.weight}
                    onChange={(e) =>
                      updateExercise(index, "weight", Number(e.target.value))
                    }
                    className="border px-3 py-2 rounded-md w-full"
                    placeholder="Ej: 0"
                    min={0}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descanso (seg)</label>
                  <input
                    type="number"
                    value={exercise.restTime}
                    onChange={(e) =>
                      updateExercise(index, "restTime", Number(e.target.value))
                    }
                    className="border px-3 py-2 rounded-md w-full"
                    placeholder="Ej: 60"
                    min={0}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
                <textarea
                  placeholder="Notas opcionales para este ejercicio..."
                  value={exercise.notes}
                  onChange={(e) =>
                    updateExercise(index, "notes", e.target.value)
                  }
                  className="border px-3 py-2 rounded-md w-full"
                  rows={2}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  )
}