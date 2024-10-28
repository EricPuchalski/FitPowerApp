"use client"

import { useState, useEffect } from 'react'
import { Dumbbell, Plus, Edit, Trash2, ChevronDown, ChevronUp, User, Calendar } from 'lucide-react'

type Exercise = {
  id: string
  name: string
  sets: number
  reps: number
  rest: number
  description: string
}

type Routine = {
  id: string
  name: string
  clientId: string
  exercises: Exercise[]
  goal: string
  frequency: number
}

type Client = {
  id: string
  name: string
  goal: string
}

export default function EntrenadoresManager() {
  const [routines, setRoutines] = useState<Routine[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [expandedRoutine, setExpandedRoutine] = useState<string | null>(null)
  const [newRoutine, setNewRoutine] = useState<Omit<Routine, 'id' | 'exercises'>>({ name: '', clientId: '', goal: '', frequency: 3 })
  const [newExercise, setNewExercise] = useState<Omit<Exercise, 'id'>>({ name: '', sets: 0, reps: 0, rest: 60, description: '' })
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null)
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null)

  useEffect(() => {
    setClients([
      { id: '1', name: 'Juan Pérez', goal: 'Pérdida de peso' },
      { id: '2', name: 'María García', goal: 'Aumento de masa muscular' },
    ])
    setRoutines([
      {
        id: '1',
        name: 'Rutina de Fuerza',
        clientId: '1',
        exercises: [
          { id: '1', name: 'Sentadillas', sets: 3, reps: 10, rest: 60, description: 'Mantener la espalda recta' },
          { id: '2', name: 'Press de Banca', sets: 3, reps: 8, rest: 90, description: 'Bajar la barra hasta el pecho' },
        ],
        goal: 'Aumento de fuerza',
        frequency: 3
      },
    ])
  }, [])

  const toggleRoutine = (routineId: string) => {
    setExpandedRoutine(expandedRoutine === routineId ? null : routineId)
  }

  const addRoutine = () => {
    if (newRoutine.name && newRoutine.clientId) {
      setRoutines([...routines, { ...newRoutine, id: Date.now().toString(), exercises: [] }])
      setNewRoutine({ name: '', clientId: '', goal: '', frequency: 3 })
    }
  }

  const addExercise = (routineId: string) => {
    if (newExercise.name && newExercise.sets > 0 && newExercise.reps > 0) {
      setRoutines(routines.map(routine => 
        routine.id === routineId 
          ? { ...routine, exercises: [...routine.exercises, { ...newExercise, id: Date.now().toString() }] }
          : routine
      ))
      setNewExercise({ name: '', sets: 0, reps: 0, rest: 60, description: '' })
    }
  }

  const updateRoutine = () => {
    if (editingRoutine) {
      setRoutines(routines.map(routine => 
        routine.id === editingRoutine.id ? editingRoutine : routine
      ))
      setEditingRoutine(null)
    }
  }

  const updateExercise = (routineId: string) => {
    if (editingExercise) {
      setRoutines(routines.map(routine => 
        routine.id === routineId 
          ? { ...routine, exercises: routine.exercises.map(exercise => 
              exercise.id === editingExercise.id ? editingExercise : exercise
            )}
          : routine
      ))
      setEditingExercise(null)
    }
  }

  const deleteRoutine = (routineId: string) => {
    setRoutines(routines.filter(routine => routine.id !== routineId))
  }

  const deleteExercise = (routineId: string, exerciseId: string) => {
    setRoutines(routines.map(routine => 
      routine.id === routineId 
        ? { ...routine, exercises: routine.exercises.filter(exercise => exercise.id !== exerciseId) }
        : routine
    ))
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 bg-[url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-YvCF4KpXY1jsLNXwzpWz4NDhnZ3pGG.png')] bg-cover bg-center bg-no-repeat">
      <header className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Dumbbell className="w-8 h-8" />
            <h1 className="text-2xl font-bold">FITPOWER Entrenadores</h1>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Gestión de Rutinas de Ejercicio</h2>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Crear Nueva Rutina</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={newRoutine.name}
                onChange={(e) => setNewRoutine({ ...newRoutine, name: e.target.value })}
                placeholder="Nombre de la rutina"
                className="w-full p-2 border rounded"
              />
              <select
                value={newRoutine.clientId}
                onChange={(e) => setNewRoutine({ ...newRoutine, clientId: e.target.value })}
                className="w-full p-2 border rounded"
              >
                <option value="">Seleccionar cliente</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
              </select>
              <input
                type="text"
                value={newRoutine.goal}
                onChange={(e) => setNewRoutine({ ...newRoutine, goal: e.target.value })}
                placeholder="Objetivo de la rutina"
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                value={newRoutine.frequency}
                onChange={(e) => setNewRoutine({ ...newRoutine, frequency: parseInt(e.target.value) })}
                placeholder="Frecuencia semanal"
                className="w-full p-2 border rounded"
              />
            </div>
            <button onClick={addRoutine} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
              <Plus className="inline-block mr-2 h-4 w-4" /> Crear Rutina
            </button>
          </div>

          {routines.map(routine => (
            <div key={routine.id} className="mb-4 border rounded-lg p-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{routine.name}</h3>
                <div className="flex space-x-2">
                  <button onClick={() => setEditingRoutine(routine)} className="text-blue-600 hover:text-blue-800">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button onClick={() => deleteRoutine(routine.id)} className="text-red-600 hover:text-red-800">
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <button onClick={() => toggleRoutine(routine.id)} className="text-gray-600 hover:text-gray-800">
                    {expandedRoutine === routine.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              {expandedRoutine === routine.id && (
                <div className="mt-4">
                  <div className="mb-4">
                    <p><User className="inline mr-2" /> Cliente: {clients.find(c => c.id === routine.clientId)?.name}</p>
                    <p><Calendar className="inline mr-2" /> Frecuencia: {routine.frequency} veces por semana</p>
                    <p>Objetivo: {routine.goal}</p>
                  </div>
                  <h4 className="font-semibold mb-2">Ejercicios:</h4>
                  {routine.exercises.map(exercise => (
                    <div key={exercise.id} className="mb-2 p-2 bg-gray-100 rounded">
                      <div className="flex justify-between items-center">
                        <span>{exercise.name} - {exercise.sets} series x {exercise.reps} repeticiones (Descanso: {exercise.rest}s)</span>
                        <div className="flex space-x-2">
                          <button onClick={() => setEditingExercise(exercise)} className="text-blue-600 hover:text-blue-800">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button onClick={() => deleteExercise(routine.id, exercise.id)} className="text-red-600 hover:text-red-800">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{exercise.description}</p>
                    </div>
                  ))}
                  <div className="mt-4">
                    <h5 className="font-semibold mb-2">Agregar Nuevo Ejercicio</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={newExercise.name}
                        onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                        placeholder="Nombre del ejercicio"
                        className="w-full p-2 border rounded"
                      />
                      <input
                        type="number"
                        value={newExercise.sets}
                        onChange={(e) => setNewExercise({ ...newExercise, sets: parseInt(e.target.value) })}
                        placeholder="Series"
                        className="w-full p-2 border rounded"
                      />
                      <input
                        type="number"
                        value={newExercise.reps}
                        onChange={(e) => setNewExercise({ ...newExercise, reps: parseInt(e.target.value) })}
                        placeholder="Repeticiones"
                        className="w-full p-2 border rounded"
                      />
                      <input
                        type="number"
                        value={newExercise.rest}
                        onChange={(e) => setNewExercise({ ...newExercise, rest: parseInt(e.target.value) })}
                        placeholder="Tiempo de descanso (segundos)"
                        className="w-full p-2 border rounded"
                      />
                      <textarea
                        value={newExercise.description}
                        onChange={(e) => setNewExercise({ ...newExercise, description: e.target.value })}
                        placeholder="Descripción o instrucciones"
                        className="col-span-2 w-full p-2 border rounded"
                      />
                    </div>
                    <button onClick={() => addExercise(routine.id)} className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
                      <Plus className="inline-block mr-2 h-4 w-4" /> Agregar Ejercicio
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
      <footer className="bg-gray-800/90 backdrop-blur-sm text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2023 FITPOWER. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}