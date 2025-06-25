//src/components/ExerciseManager.tsx
import { useEffect, useState } from "react"

interface Exercise {
  id: number
  name: string
}

export default function ExerciseManager() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [newExerciseName, setNewExerciseName] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchExercises = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch("http://localhost:8080/api/v1/exercises", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (!res.ok) throw new Error("Error al obtener ejercicios")

      const data = await res.json()
      setExercises(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateExercise = async () => {
    if (!newExerciseName.trim()) return

    const token = localStorage.getItem("token")

    try {
      const res = await fetch("http://localhost:8080/api/v1/exercises", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name: newExerciseName })
      })

      if (!res.ok) throw new Error("Error al crear ejercicio")

      setNewExerciseName("")
      await fetchExercises()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    }
  }

  useEffect(() => {
    fetchExercises()
  }, [])

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 border border-gray-200 rounded-md shadow-md bg-white">
      <h2 className="text-2xl font-bold mb-4">Gestión de Ejercicios</h2>

      <div className="mb-6">
        <input
          type="text"
          value={newExerciseName}
          onChange={(e) => setNewExerciseName(e.target.value)}
          placeholder="Nombre del ejercicio"
          className="border border-gray-300 px-4 py-2 rounded-md w-full mb-2"
        />
        <button
          onClick={handleCreateExercise}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Crear Ejercicio
        </button>
      </div>

      <h3 className="text-lg font-semibold mb-2">Ejercicios existentes:</h3>
      {loading ? (
        <p>Cargando ejercicios...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : exercises.length === 0 ? (
        <p>No hay ejercicios registrados.</p>
      ) : (
        <ul className="list-disc pl-5 space-y-1">
          {exercises.map((ex) => (
            <li key={ex.id}>{ex.name}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
