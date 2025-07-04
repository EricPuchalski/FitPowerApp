// src/components/ExerciseCrud.tsx

"use client"

import { useEffect, useState } from "react"
import { Plus, Check, X, Edit2, Dumbbell, Home, Users, Menu as MenuIcon } from "lucide-react"
import { FooterPag } from "../../components/Footer"

interface Exercise {
  id: number
  name: string
}

export default function ExerciseCrud() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [newExercise, setNewExercise] = useState({ name: "" })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Edit state
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editName, setEditName] = useState("")

  const token = localStorage.getItem("token")

  useEffect(() => {
    fetchExercises()
  }, [])

  const fetchExercises = async () => {
    setLoading(true)
    try {
      const res = await fetch("http://localhost:8080/api/v1/exercises", {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error()
      const data: Exercise[] = await res.json()
      setExercises(data)
    } catch {
      setError("Error al cargar ejercicios.")
    } finally {
      setLoading(false)
    }
  }

  const createExercise = async () => {
    if (!newExercise.name.trim()) {
      alert("El nombre del ejercicio es obligatorio")
      return
    }
    try {
      const res = await fetch("http://localhost:8080/api/v1/exercises", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newExercise)
      })
      if (!res.ok) throw new Error()
      setNewExercise({ name: "" })
      fetchExercises()
    } catch {
      alert("No se pudo crear el ejercicio")
    }
  }

  const startEdit = (exercise: Exercise) => {
    setEditingId(exercise.id)
    setEditName(exercise.name)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditName("")
  }

  const saveEdit = async (id: number) => {
    if (!editName.trim()) {
      alert("El nombre no puede estar vacío")
      return
    }
    try {
      const res = await fetch(`http://localhost:8080/api/v1/exercises/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: editName })
      })
      if (!res.ok) throw new Error()
      cancelEdit()
      fetchExercises()
    } catch {
      alert("No se pudo actualizar el ejercicio")
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-900 to-lime-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Dumbbell className="w-8 h-8" />
            <h1 className="text-2xl font-bold">FitPower Ejercicios</h1>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="/nutritionist/dashboard" className="hover:text-green-200 flex items-center space-x-1">
              <Home size={18} /><span>Inicio</span>
            </a>
            <a href="/exercises" className="hover:text-green-200 flex items-center space-x-1">
              <Users size={18} /><span>Ejercicios</span>
            </a>
          </nav>
          <button
            className="md:hidden bg-green-800 p-2 rounded"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-lime-800 text-white">
          <nav className="p-4 flex flex-col space-y-2">
            <a href="/nutritionist/dashboard" className="hover:bg-lime-700 p-2 rounded flex items-center space-x-2">
              <Home size={18} /><span>Inicio</span>
            </a>
            <a href="/exercises" className="hover:bg-lime-700 p-2 rounded flex items-center space-x-2">
              <Users size={18} /><span>Ejercicios</span>
            </a>
          </nav>
        </div>
      )}

      {/* Main */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Crear */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Crear nuevo ejercicio</h2>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <input
              type="text"
              placeholder="Nombre del ejercicio"
              value={newExercise.name}
              onChange={(e) => setNewExercise({ name: e.target.value })}
              className="w-full md:w-1/2 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-lime-500"
            />
            <button
              onClick={createExercise}
              className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-md flex items-center shadow"
            >
              <Plus className="w-4 h-4 mr-2" />Crear
            </button>
          </div>
        </div>

        {/* Listado */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Listado de Ejercicios</h2>
        {loading ? (
          <p className="text-center text-gray-600">Cargando ejercicios...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {exercises.map((exercise) => (
              <div
                key={exercise.id}
                className="bg-white p-6 rounded-lg border shadow hover:shadow-lg transition relative"
              >
                {editingId === exercise.id ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
                    />
                    <div className="flex justify-end space-x-2">
                      <button onClick={() => saveEdit(exercise.id)} className="flex items-center px-3 py-1 rounded bg-green-600 text-white">
                        <Check className="w-4 h-4 mr-1" /> Guardar
                      </button>
                      <button onClick={cancelEdit} className="flex items-center px-3 py-1 rounded bg-gray-300">
                        <X className="w-4 h-4 mr-1" /> Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{exercise.name}</h3>
                    <button
                      onClick={() => startEdit(exercise)}
                      className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {exercises.length === 0 && !loading && (
          <div className="text-center mt-12 text-gray-600">No hay ejercicios disponibles.</div>
        )}
      </main>

      <FooterPag />
    </div>
  )
}
