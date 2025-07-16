//src/pages/Client/TrainingRecords.tsx
"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { FooterPag } from "../../components/Footer"
import {
  Calendar,
  Plus,
  Edit3,
  Trash2,
  Dumbbell,
  Clock,
  Hash,
  Weight,
  FileText,
  ArrowLeft,
  Activity,
  Target,
  Timer,
  MessageSquare,
  Save,
  X,
  AlertTriangle,
} from "lucide-react"

interface TrainingRecord {
  id: number
  observation: string | null
  createdAt: string
  series: number
  repetitions: number
  weight: number
  restTime: string
  exerciseId: number
  trainingPlanId: number
  exerciseName?: string
}

interface Exercise {
  id: number
  name: string
}

const TrainingRecordsPage: React.FC = () => {
  const { trainingPlanId } = useParams<{ trainingPlanId: string }>()
  const [records, setRecords] = useState<TrainingRecord[]>([])
  const [filteredRecords, setFilteredRecords] = useState<TrainingRecord[]>([])
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState<boolean>(false)
  const [editingRecord, setEditingRecord] = useState<TrainingRecord | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0])
  const token = localStorage.getItem("token")
  const [formData, setFormData] = useState({
    observation: "",
    series: "",
    repetitions: "",
    weight: "",
    restTime: "01:30",
    exerciseId: 0,
  })
  const navigate = useNavigate()
  const clientDni = localStorage.getItem("userDni") || ""

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        const exercisesResponse = await fetch(`http://localhost:8080/api/v1/exercises`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!exercisesResponse.ok) throw new Error("Error al cargar ejercicios")
        const exercisesData = await exercisesResponse.json()
        setExercises(exercisesData)

        const recordsResponse = await fetch(
          `http://localhost:8080/api/v1/clients/${clientDni}/training-plans/${trainingPlanId}/records`,
          { headers: { Authorization: `Bearer ${token}` } },
        )

        if (!recordsResponse.ok) throw new Error("Error al cargar registros")

        const recordsData: TrainingRecord[] = await recordsResponse.json()
        const recordsWithExerciseNames = recordsData.map((record) => {
          const exercise = exercisesData.find((ex) => ex.id === record.exerciseId)
          return {
            ...record,
            exerciseName: exercise ? exercise.name : "Ejercicio desconocido",
          }
        })

        setRecords(recordsWithExerciseNames)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ocurrió un error desconocido")
        toast.error(err instanceof Error ? err.message : "Ocurrió un error desconocido")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [trainingPlanId, clientDni])

  useEffect(() => {
    const filtered = records.filter((record) => {
      const recordDate = new Date(record.createdAt).toISOString().split("T")[0]
      return recordDate === selectedDate
    })
    setFilteredRecords(filtered)
  }, [records, selectedDate])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("token")
      const url = editingRecord
        ? `http://localhost:8080/api/v1/clients/${clientDni}/training-plans/${trainingPlanId}/records/${editingRecord.id}`
        : `http://localhost:8080/api/v1/clients/${clientDni}/training-plans/${trainingPlanId}/records`

      const method = editingRecord ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          observation: formData.observation,
          series: Number(formData.series),
          repetitions: Number(formData.repetitions),
          weight: Number(formData.weight),
          restTime: formData.restTime,
          exerciseId: formData.exerciseId,
        }),
      })

      if (!response.ok) throw new Error("Error al guardar el registro")

      const savedRecord: TrainingRecord = await response.json()

      if (editingRecord) {
        setRecords((prev) =>
          prev.map((r) =>
            r.id === savedRecord.id
              ? {
                  ...savedRecord,
                  exerciseName:
                    exercises.find((ex) => ex.id === savedRecord.exerciseId)?.name || "Ejercicio desconocido",
                }
              : r,
          ),
        )
        toast.success("Registro actualizado correctamente")
      } else {
        setRecords((prev) => [
          {
            ...savedRecord,
            exerciseName: exercises.find((ex) => ex.id === savedRecord.exerciseId)?.name || "Ejercicio desconocido",
          },
          ...prev,
        ])
        toast.success("Registro creado correctamente")
      }

      resetForm()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Ocurrió un error al guardar"
      toast.error(errorMessage)
    }
  }

  const confirmDelete = (recordId: number) => {
    toast.warning(
      <div>
        <p>{"¿Estás seguro de que deseas eliminar este registro?"}</p>
        <div className="flex justify-end mt-4">
          <button
            onClick={() => {
              handleDelete(recordId)
              toast.dismiss()
            }}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors mr-2"
          >
            Sí
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors"
          >
            No
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      },
    )
  }

  const handleDelete = async (recordId: number) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(
        `http://localhost:8080/api/v1/clients/${clientDni}/training-plans/${trainingPlanId}/records/${recordId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (!response.ok) throw new Error("Error al eliminar el registro")

      setRecords((prev) => prev.filter((r) => r.id !== recordId))
      toast.success("Registro eliminado correctamente")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Ocurrió un error al eliminar"
      toast.error(errorMessage)
    }
  }

  const handleEdit = (record: TrainingRecord) => {
    setEditingRecord(record)
    setFormData({
      observation: record.observation || "",
      series: record.series.toString(),
      repetitions: record.repetitions.toString(),
      weight: record.weight.toString(),
      restTime: record.restTime,
      exerciseId: record.exerciseId,
    })
    setShowForm(true)
    toast.info("Editando registro existente")
  }

  const resetForm = () => {
    setFormData({
      observation: "",
      series: "",
      repetitions: "",
      weight: "",
      restTime: "01:30",
      exerciseId: exercises.length > 0 ? exercises[0].id : 0,
    })
    setEditingRecord(null)
    setShowForm(false)
  }

  const formatRestTime = (timeString: string) => {
    const [ minutes, seconds] = timeString.split(":")
    return `${minutes}' ${seconds}''`
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <Activity className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-blue-600" />
        </div>
        <p className="mt-6 text-lg text-gray-700 font-medium">Cargando registros de entrenamiento...</p>
        <ToastContainer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-pink-100 p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">¡Oops! Algo salió mal</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Intentar nuevamente
          </button>
        </div>
        <ToastContainer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-800 to-indigo-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Dumbbell className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold">FITPOWER</h1>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Plan
          </button>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <ul className="container mx-auto px-4 flex">
          <li className="flex-1 text-center hover:bg-gray-50 transition-colors">
            <button
              onClick={() => navigate("/client")}
              className="w-full py-4 font-medium text-gray-600 hover:text-gray-900"
            >
              Inicio
            </button>
          </li>
          <li className="flex-1 text-center border-b-4 border-blue-500 bg-blue-50">
            <button className="w-full py-4 font-medium text-blue-600">Plan de Entrenamiento</button>
          </li>
          <li className="flex-1 text-center hover:bg-gray-50 transition-colors">
            <button
              onClick={() => navigate("/client/nutrition-plan")}
              className="w-full py-4 font-medium text-gray-600 hover:text-gray-900"
            >
              Plan de Nutrición
            </button>
          </li>
        </ul>
      </nav>

      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Registros de Entrenamiento</h2>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <label className="text-sm font-medium text-gray-700">Fecha:</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <button
              onClick={() => {
                setEditingRecord(null)
                setFormData({
                  observation: "",
                  series: "",
                  repetitions: "",
                  weight: "",
                  restTime: "01:30",
                  exerciseId: exercises.length > 0 ? exercises[0].id : 0,
                })
                setShowForm(true)
              }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg"
            >
              <Plus className="w-4 h-4" />
              Nuevo Registro
            </button>
          </div>
        </div>

        {/* Records Section */}
        {filteredRecords.length > 0 ? (
          <div className="grid gap-4">
            {filteredRecords.map((record) => (
              <div
                key={record.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Dumbbell className="w-4 h-4 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">{record.exerciseName}</h3>
                      <span className="text-sm text-gray-500">{new Date(record.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Hash className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Series:</span>
                        <span className="font-medium text-gray-800">{record.series}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Reps:</span>
                        <span className="font-medium text-gray-800">{record.repetitions}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Weight className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Peso:</span>
                        <span className="font-medium text-gray-800">{record.weight} kg</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Timer className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Descanso:</span>
                        <span className="font-medium text-gray-800">{formatRestTime(record.restTime)}</span>
                      </div>
                    </div>

                    {record.observation && (
                      <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                        <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div>
                          <span className="text-sm text-gray-600">Observación:</span>
                          <p className="text-sm text-gray-800 mt-1">{record.observation}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(record)}
                      className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span className="hidden sm:inline">Editar</span>
                    </button>
                    <button
                      onClick={() => confirmDelete(record.id)}
                      className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Eliminar</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No hay registros para esta fecha</h3>
            <p className="text-gray-500 mb-6">Comienza registrando tu primer entrenamiento del día</p>
            <button
              onClick={() => {
                setEditingRecord(null)
                setFormData({
                  observation: "",
                  series: "",
                  repetitions: "",
                  weight: "",
                  restTime: "01:30",
                  exerciseId: exercises.length > 0 ? exercises[0].id : 0,
                })
                setShowForm(true)
              }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg mx-auto"
            >
              <Plus className="w-4 h-4" />
              Crear Primer Registro
            </button>
          </div>
        )}

        {/* Modal Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      {editingRecord ? (
                        <Edit3 className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Plus className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {editingRecord ? "Editar Registro" : "Nuevo Registro de Entrenamiento"}
                    </h3>
                  </div>
                  <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-6">
                  {/* Exercise Selection */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Dumbbell className="w-4 h-4" />
                      Ejercicio *
                    </label>
                    <select
                      name="exerciseId"
                      value={formData.exerciseId}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                    >
                      <option value="">Selecciona un ejercicio</option>
                      {exercises.map((exercise) => (
                        <option key={exercise.id} value={exercise.id}>
                          {exercise.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Exercise Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Hash className="w-4 h-4" />
                        Series *
                      </label>
                      <input
                        type="number"
                        name="series"
                        min="1"
                        value={formData.series}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        required
                        placeholder="Ej: 3"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Target className="w-4 h-4" />
                        Repeticiones *
                      </label>
                      <input
                        type="number"
                        name="repetitions"
                        min="1"
                        value={formData.repetitions}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        required
                        placeholder="Ej: 10"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Weight className="w-4 h-4" />
                        Peso (kg) *
                      </label>
                      <input
                        type="number"
                        name="weight"
                        step="0.1"
                        min="0"
                        value={formData.weight}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        required
                        placeholder="Ej: 20.5"
                      />
                    </div>
                  </div>

                  {/* Rest Time */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Timer className="w-4 h-4" />
                      Tiempo de Descanso *
                    </label>
                    <input
                      type="text"
                      name="restTime"
                      value={formData.restTime}
                      onChange={handleInputChange}
                      placeholder="01:30"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                      pattern="\d{2}:\d{2}"
                      title="Formato mm:ss"
                    />
                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Ejemplo: 01:30 para 1 minuto y 30 segundos
                    </p>
                  </div>

                  {/* Observations */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <MessageSquare className="w-4 h-4" />
                      Observaciones
                    </label>
                    <textarea
                      name="observation"
                      value={formData.observation}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                      placeholder="Agrega cualquier observación sobre este ejercicio..."
                    />
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
                  >
                    <Save className="w-4 h-4" />
                    {editingRecord ? "Actualizar" : "Guardar"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <FooterPag />
    </div>
  )
}

export default TrainingRecordsPage