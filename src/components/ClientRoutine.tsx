"use client"

import { useEffect, useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordion"
import { ScrollArea } from "../../components/ui/scroll-area"
import { Plus, Save, Clock, Dumbbell } from "lucide-react"
import { NavBarClient } from "./NavBarClient"
import { FooterPag } from "./Footer"

type Session = {
  id: number
  sets: number
  reps: number
  weight: number
  restTime: string
  exerciseName: string
}

type Routine = {
  id: number
  name: string
  sessions: Session[]
}

const initialRoutine: Routine = {
  id: 1,
  name: "Rutina de Fuerza",
  sessions: []
}

export default function ClientRoutine() {
  const [routine, setRoutine] = useState<Routine>(initialRoutine)
  const [newSession, setNewSession] = useState<Omit<Session, 'id'>>({
    sets: 1,
    reps: 1,
    weight: 0,
    restTime: "00:01:00",
    exerciseName: ""
  })
  const [exerciseOptions, setExerciseOptions] = useState<string[]>([])

  useEffect(() => {
    // Fetch exercises from API
    fetch('http://localhost:8080/api/exercises')
      .then(response => response.json())
      .then(data => {
        // Assuming the API returns an array of exercise names
        setExerciseOptions(data.map((exercise: { name: any }) => exercise.name))
      })
      .catch(error => console.error('Error fetching exercises:', error))

    // Fetch active routine from API
    fetch('http://localhost:8080/api/routines/active/email/damian_betum@gmail.com')
      .then(response => response.json())
      .then(data => setRoutine(data))
      .catch(error => console.error('Error fetching routine:', error))
  }, [])

  const handleSessionChange = (sessionId: number, field: keyof Session, value: string | number) => {
    setRoutine(prevRoutine => ({
      ...prevRoutine,
      sessions: prevRoutine.sessions.map(session =>
        session.id === sessionId ? { ...session, [field]: value } : session
      )
    }))
  }

  const handleAddSession = () => {
    const newId = Math.max(...routine.sessions.map(s => s.id), 0) + 1
    setRoutine(prevRoutine => ({
      ...prevRoutine,
      sessions: [...prevRoutine.sessions, { id: newId, ...newSession }]
    }))
    setNewSession({
      sets: 1,
      reps: 1,
      weight: 0,
      restTime: "00:01:00",
      exerciseName: exerciseOptions[0]
    })
  }

  const handleSaveRoutine = () => {
    console.log("Rutina guardada:", routine)
    // Aquí iría la lógica para guardar la rutina en el backend
  }

  const handleSaveSession = (session: Session) => {
    fetch(`http://localhost:8080/api/training-diaries/${routine.id}/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        reps: session.reps,
        exerciseName: session.exerciseName,
        weight: session.weight
      })
    })
      .then(response => response.json())
      .then(data => console.log('Session saved:', data))
      .catch(error => console.error('Error saving session:', error))
  }

  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
      <NavBarClient />
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">{routine.name}</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Sesiones de Entrenamiento</CardTitle>
          <CardDescription>Visualiza y edita los detalles de cada sesión</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] w-full rounded-md border p-4">
            <Accordion type="single" collapsible className="w-full">
              {routine.sessions.map((session, index) => (
                <AccordionItem key={session.id} value={`session-${session.id}`}>
                  <AccordionTrigger className="text-lg font-medium">
                    {index + 1}. {session.exerciseName}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`exercise-${session.id}`}>Ejercicio</Label>
                        <Select
                          value={session.exerciseName}
                          onValueChange={(value) => handleSessionChange(session.id, "exerciseName", value)}
                        >
                          <SelectTrigger id={`exercise-${session.id}`}>
                            <SelectValue placeholder="Selecciona un ejercicio" />
                          </SelectTrigger>
                          <SelectContent>
                            {exerciseOptions.map((exercise) => (
                              <SelectItem key={exercise} value={exercise}>
                                {exercise}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor={`sets-${session.id}`}>Series</Label>
                        <Input
                          id={`sets-${session.id}`}
                          type="number"
                          value={session.sets}
                          onChange={(e) => handleSessionChange(session.id, "sets", parseInt(e.target.value))}
                          min={1}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`reps-${session.id}`}>Repeticiones</Label>
                        <Input
                          id={`reps-${session.id}`}
                          type="number"
                          value={session.reps}
                          onChange={(e) => handleSessionChange(session.id, "reps", parseInt(e.target.value))}
                          min={1}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`weight-${session.id}`}>Peso (kg)</Label>
                        <Input
                          id={`weight-${session.id}`}
                          type="number"
                          value={session.weight}
                          onChange={(e) => handleSessionChange(session.id, "weight", parseFloat(e.target.value))}
                          min={0}
                          step={0.5}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`rest-${session.id}`}>Tiempo de Descanso</Label>
                        <Input
                          id={`rest-${session.id}`}
                          type="time"
                          value={session.restTime}
                          onChange={(e) => handleSessionChange(session.id, "restTime", e.target.value)}
                          step="1"
                        />
                      </div>
                      <Button onClick={() => handleSaveSession(session)} className="mt-4 w-full">
                        <Save className="w-4 h-4 mr-2" /> Guardar Sesión
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ScrollArea>
        </CardContent>
      </Card>
      {/* <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Añadir Nueva Sesión</CardTitle>
          <CardDescription>Agrega un nuevo ejercicio a tu rutina</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="new-exercise">Ejercicio</Label>
              <Select
                value={newSession.exerciseName}
                onValueChange={(value) => setNewSession({ ...newSession, exerciseName: value })}
              >
                <SelectTrigger id="new-exercise">
                  <SelectValue placeholder="Selecciona un ejercicio" />
                </SelectTrigger>
                <SelectContent>
                  {exerciseOptions.map((exercise) => (
                    <SelectItem key={exercise} value={exercise}>
                      {exercise}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="new-sets">Series</Label>
              <Input
                id="new-sets"
                type="number"
                value={newSession.sets}
                onChange={(e) => setNewSession({ ...newSession, sets: parseInt(e.target.value) })}
                min={1}
              />
            </div>
            <div>
              <Label htmlFor="new-reps">Repeticiones</Label>
              <Input
                id="new-reps"
                type="number"
                value={newSession.reps}
                onChange={(e) => setNewSession({ ...newSession, reps: parseInt(e.target.value) })}
                min={1}
              />
            </div>
            <div>
              <Label htmlFor="new-weight">Peso (kg)</Label>
              <Input
                id="new-weight"
                type="number"
                value={newSession.weight}
                onChange={(e) => setNewSession({ ...newSession, weight: parseFloat(e.target.value) })}
                min={0}
                step={0.5}
              />
            </div>
            <div>
              <Label htmlFor="new-rest">Tiempo de Descanso</Label>
              <Input
                id="new-rest"
                type="time"
                value={newSession.restTime}
                onChange={(e) => setNewSession({ ...newSession, restTime: e.target.value })}
                step="1"
              />
            </div>
          </div>
          <Button onClick={handleAddSession} className="mt-4 w-full">
            <Plus className="w-4 h-4 mr-2" /> Añadir Sesión
          </Button>
        </CardContent>
      </Card> */}
      <Button onClick={handleSaveRoutine} className="w-full">
        <Save className="w-4 h-4 mr-2" /> Guardar Rutina
      </Button>
      <FooterPag />
    </div>
  )
}
