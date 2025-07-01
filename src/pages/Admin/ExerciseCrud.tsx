// src/components/ExerciseCrud.tsx

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

interface Exercise {
  id: number;
  name: string;
  description: string;
}

export default function ExerciseCrud() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [newExercise, setNewExercise] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/v1/exercises", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setExercises(data);
    } catch (err) {
      setError("Error al cargar ejercicios.");
    } finally {
      setLoading(false);
    }
  };

  const createExercise = async () => {
    if (!newExercise.name.trim()) {
      alert("El nombre del ejercicio es obligatorio");
      return;
    }
    try {
      const res = await fetch("http://localhost:8080/api/v1/exercises", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newExercise),
      });
      if (!res.ok) throw new Error("Error al crear ejercicio");
      setNewExercise({ name: "", description: "" });
      fetchExercises();
    } catch (err) {
      alert("No se pudo crear el ejercicio");
    }
  };

  const deleteExercise = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar este ejercicio?")) return;
    try {
      const res = await fetch(`http://localhost:8080/api/v1/exercises/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Error al eliminar ejercicio");
      fetchExercises();
    } catch (err) {
      alert("No se pudo eliminar el ejercicio");
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Gestión de Ejercicios</h1>

      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Nuevo Ejercicio</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Nombre"
            value={newExercise.name}
            onChange={(e) => setNewExercise((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 border rounded-md"
          />
          <textarea
            placeholder="Descripción"
            value={newExercise.description}
            onChange={(e) => setNewExercise((prev) => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-2 border rounded-md"
          />
          <button
            onClick={createExercise}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" /> Crear
          </button>
        </div>
      </div>

      <h2 className="text-lg font-semibold text-gray-700 mb-4">Listado de Ejercicios</h2>
      {loading ? (
        <p>Cargando ejercicios...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <ul className="space-y-4">
          {exercises.map((exercise) => (
            <li
              key={exercise.id}
              className="bg-white border border-gray-200 rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-medium text-gray-900">{exercise.name}</p>
                <p className="text-sm text-gray-600">{exercise.description}</p>
              </div>
              <button
                onClick={() => deleteExercise(exercise.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
