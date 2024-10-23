"use client"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { PlusCircle, Save } from "lucide-react"
import { Toast } from "./ui/toast"
import { toast } from "../hooks/use-toast"
import { FooterPag } from "./Footer"
import NavBarTrainer from "./NavBarTrainer"

// Tipos
type Client = {
  id: number
  dni: string
  name: string
}

type Exercise = {
  name: string
  repetitions: number
  sets: number
}

type Session = {
  id: number
  exercises: Exercise[]
}

type Routine = {
  id: number
  name: string
  sessions: Session[]
}

type ClientRoutines = {
  [clientId: number]: Routine[]
}

// Datos de ejemplo
const initialClients: Client[] = [
  { id: 1, name: "Juan Pérez", dni: "23232323" },
  { id: 2, name: "María García", dni: "1111323" },
  { id: 3, name: "Carlos Rodríguez", dni: "2222323" },
]

export default function DashboardTrainer() {
  const [clients] = useState<Client[]>(initialClients)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [clientRoutines, setClientRoutines] = useState<ClientRoutines>({})
  const [newRoutineName, setNewRoutineName] = useState("")

  const handleAddRoutine = () => {
    if (selectedClient && newRoutineName) {
      const newRoutine: Routine = {
        id: Date.now(),
        name: newRoutineName,
        sessions: [],
      }
      setClientRoutines(prev => ({
        ...prev,
        [selectedClient.id]: [...(prev[selectedClient.id] || []), newRoutine]
      }))
      setNewRoutineName("")
    }
  }

  const handleAddSession = (routineId: number) => {
    if (selectedClient) {
      setClientRoutines(prev => ({
        ...prev,
        [selectedClient.id]: prev[selectedClient.id].map(routine =>
          routine.id === routineId
            ? {
                ...routine,
                sessions: [
                  ...routine.sessions,
                  { id: Date.now(), exercises: [] },
                ],
              }
            : routine
        )
      }))
    }
  }

  const handleAddExercise = (routineId: number, sessionId: number) => {
    if (selectedClient) {
      setClientRoutines(prev => ({
        ...prev,
        [selectedClient.id]: prev[selectedClient.id].map(routine =>
          routine.id === routineId
            ? {
                ...routine,
                sessions: routine.sessions.map(session =>
                  session.id === sessionId
                    ? {
                        ...session,
                        exercises: [
                          ...session.exercises,
                          { name: "", repetitions: 0, sets: 0 },
                        ],
                      }
                    : session
                ),
              }
            : routine
        )
      }))
    }
  }

  const handleUpdateExercise = (
    routineId: number,
    sessionId: number,
    exerciseIndex: number,
    field: keyof Exercise,
    value: string | number
  ) => {
    if (selectedClient) {
      setClientRoutines(prev => ({
        ...prev,
        [selectedClient.id]: prev[selectedClient.id].map(routine =>
          routine.id === routineId
            ? {
                ...routine,
                sessions: routine.sessions.map(session =>
                  session.id === sessionId
                    ? {
                        ...session,
                        exercises: session.exercises.map((exercise, index) =>
                          index === exerciseIndex
                            ? { ...exercise, [field]: value }
                            : exercise
                        ),
                      }
                    : session
                ),
              }
            : routine
        )
      }))
    }
  }

  const handleSaveRoutine = (routineId: number) => {
    // Aquí iría la lógica para guardar la rutina en el backend
    toast({
      title: "Rutina guardada",
      description: "La rutina se ha guardado exitosamente.",
    })
  }

  return (
<div className="flex flex-col min-h-screen bg-cover bg-center" style={{ backgroundImage: 'url(/path/to/your/image.jpg)' }}>
  <NavBarTrainer></NavBarTrainer>
  <div className="flex-grow p-4 space-y-6">
    <h1 className="text-3xl font-bold text-primary">Panel del Entrenador</h1>
    
    <Card>
      <CardHeader>
        <CardTitle>Selección de Cliente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center gap-4">
          <Label htmlFor="client-select">Seleccionar Cliente</Label>
          <Select
            onValueChange={(value) => {
              const client = clients.find((c) => c.id === parseInt(value));
              setSelectedClient(client || null);
            }}
          >
            <SelectTrigger className="bg-white bg-opacity-100">
              <SelectValue placeholder="Seleccione un cliente" />
            </SelectTrigger>
            <SelectContent className="bg-white bg-opacity-100 shadow-lg">
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id.toString()}>
                  {client.name} - DNI: {client.dni} {/* Mostrar nombre y DNI */}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>

    {selectedClient && (
      <Card>
        <CardHeader>
          <CardTitle>Rutinas de {selectedClient.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Nombre de la nueva rutina"
              value={newRoutineName}
              onChange={(e) => setNewRoutineName(e.target.value)}
            />
            <Button onClick={handleAddRoutine}>Agregar Rutina</Button>
          </div>

          {clientRoutines[selectedClient.id]?.map((routine) => (
            <Card key={routine.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl">{routine.name}</CardTitle>
                <Button onClick={() => handleSaveRoutine(routine.id)} variant="outline" size="sm">
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Rutina
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {routine.sessions.map((session, sessionIndex) => (
                  <Card key={session.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">Sesión {sessionIndex + 1}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {session.exercises.map((exercise, exerciseIndex) => (
                        <div key={exerciseIndex} className="grid grid-cols-3 gap-2">
                          <Input
                            placeholder="Ejercicio"
                            value={exercise.name}
                            onChange={(e) =>
                              handleUpdateExercise(
                                routine.id,
                                session.id,
                                exerciseIndex,
                                "name",
                                e.target.value
                              )
                            }
                          />
                          <Input
                            type="number"
                            placeholder="Repeticiones"
                            value={exercise.repetitions}
                            onChange={(e) =>
                              handleUpdateExercise(
                                routine.id,
                                session.id,
                                exerciseIndex,
                                "repetitions",
                                parseInt(e.target.value)
                              )
                            }
                          />
                          <Input
                            type="number"
                            placeholder="Series"
                            value={exercise.sets}
                            onChange={(e) =>
                              handleUpdateExercise(
                                routine.id,
                                session.id,
                                exerciseIndex,
                                "sets",
                                parseInt(e.target.value)
                              )
                            }
                          />
                        </div>
                      ))}
                      <Button
                        onClick={() => handleAddExercise(routine.id, session.id)}
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Agregar Ejercicio
                      </Button>
                    </CardContent>
                  </Card>
                ))}
                <Button
                  onClick={() => handleAddSession(routine.id)}
                  variant="outline"
                  className="w-full"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Agregar Sesión
                </Button>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    )}
  </div>
  <FooterPag />
</div>
  )
  
}
  