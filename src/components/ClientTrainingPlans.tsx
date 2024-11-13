'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordion"
import { Badge } from "../../components/ui/badge"
import { CalendarDays, Dumbbell } from "lucide-react"
import NavBarTrainer from './NavBarTrainer'
import { FooterPag } from './Footer'

export default function TrainingPlansList() {
  const { clientDni } = useParams<{ clientDni: string }>()
  const [trainingPlans, setTrainingPlans] = useState<TrainingPlan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTrainingPlans = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`http://localhost:8080/api/training-plans/client/${clientDni}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (!response.ok) {
          throw new Error('Failed to fetch training plans')
        }
        const data = await response.json()
        console.log('Data received:', data) // Añadir console.log para verificar los datos recibidos
        setTrainingPlans(data)
      } catch (err) {
        console.error('Error fetching training plans:', err) // Añadir console.log para verificar el error
        setError('Error fetching training plans. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTrainingPlans()
  }, [clientDni])

  if (isLoading) return <div className="text-center">Loading training plans...</div>
  if (error) return <div className="text-center text-red-500">{error}</div>

  console.log('Training plans:', trainingPlans) // Añadir console.log para verificar los datos procesados

  // Ordenar los planes de entrenamiento para que el activo esté primero
  const sortedTrainingPlans = [...trainingPlans].sort((a, b) => (a.active === b.active ? 0 : a.active ? -1 : 1))

  return (
    <div className="flex flex-col min-h-screen">
      <NavBarTrainer />
      <main className="flex-grow p-4">
        <h1 className="text-3xl font-bold text-center mb-4">Training Plans</h1>
        {sortedTrainingPlans.length > 0 ? (
          sortedTrainingPlans.map((plan) => (
            <Card key={plan.id} className={`border ${plan.active ? "border-green-500" : "border-gray-300"}`}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-xl font-semibold">{plan.name}</span>
                  {plan.active ? (
                    <Badge variant="outline" className="bg-green-500 text-white">Active</Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-500 text-white">Desactivado</Badge>
                  )}
                </CardTitle>
                <CardDescription className="text-gray-600">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {plan.routines.map((routine) => (
                    <AccordionItem key={routine.id} value={`routine-${routine.id}`}>
                      <AccordionTrigger>
                        <div className="flex items-center justify-between w-full">
                          <span className="text-lg font-medium">{routine.name}</span>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <CalendarDays className="w-4 h-4" />
                            <span>{new Date(routine.creationDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          {routine.sessions.map((session) => (
                            <div key={session.id} className="flex items-center justify-between bg-gray-100 p-3 rounded">
                              <div className="flex items-center space-x-2">
                                <Dumbbell className="w-4 h-4" />
                                <span className="text-base font-medium">{session.exerciseName}</span>
                              </div>
                              <div className="text-sm text-gray-600">
                                {session.sets} sets - {session.reps} reps
                              </div>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center text-gray-600">No training plans available.</div>
        )}
      </main>
      <FooterPag />
    </div>
  )
}
