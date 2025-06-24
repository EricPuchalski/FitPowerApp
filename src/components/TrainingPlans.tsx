// src/components/TrainingPlans.tsx
"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { Calendar, Plus, Dumbbell, ArrowLeft, Users } from 'lucide-react'
import { TrainingPlan } from "../model/TrainingPlan"

export default function TrainingPlans() {
  const { clientDni } = useParams<{ clientDni: string }>()
  const [plans, setPlans] = useState<TrainingPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [clientInfo, setClientInfo] = useState<{ name: string, email: string, phone: string } | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token")
      
      try {
        // Obtener información del cliente
        const clientRes = await fetch(`http://localhost:8080/api/v1/clients/${clientDni}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (clientRes.ok) {
          const clientData = await clientRes.json()
          setClientInfo({
            name: clientData.name,
            email: clientData.email,
            phone: clientData.phoneNumber
          })
        }

        // Obtener planes de entrenamiento
        const plansRes = await fetch(`http://localhost:8080/api/v1/training-plans/clients/${clientDni}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!plansRes.ok) throw new Error("Error al cargar los planes")
        
        const plansData = await plansRes.json()
        setPlans(plansData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido")
      } finally {
        setLoading(false)
      }
    }

    if (clientDni) fetchData()
  }, [clientDni])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link 
          to="/trainer/dashboard" 
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Volver al dashboard
        </Link>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Planes de Entrenamiento
        </h1>
        <div className="flex items-center text-gray-600 mb-6">
          <Users className="h-5 w-5 mr-2" />
          <div>
            <p>Cliente: <span className="font-medium">{clientInfo?.name || 'No disponible'}</span></p>
            <p className="text-sm">DNI: {clientDni}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Total Planes</p>
              <p className="text-2xl font-bold text-gray-900">{plans.length}</p>
            </div>
            <Calendar className="h-8 w-8 text-cyan-600" />
          </div>
        </div>

        <div className="bg-pink-50 border border-pink-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Planes Activos</p>
              <p className="text-2xl font-bold text-gray-900">
                {plans.filter(plan => plan.active).length}
              </p>
            </div>
            <Dumbbell className="h-8 w-8 text-pink-600" />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Ejercicios Totales</p>
              <p className="text-2xl font-bold text-gray-900">
                {plans.reduce((acc, plan) => acc + plan.exercises.length, 0)}
              </p>
            </div>
            <Plus className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Listado de Planes</h2>
        <Link 
          to={`/trainer/client/${clientDni}/training-plans/new/edit`}
          className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Crear nuevo plan
        </Link>
      </div>

      {plans.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <Dumbbell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay planes registrados</h3>
          <p className="text-gray-600 mb-4">Este cliente no tiene planes de entrenamiento aún.</p>
          <Link 
            to={`/trainer/client/${clientDni}/training-plans/new/edit`}
            className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-md inline-flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Crear primer plan
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200">
              <div className={`p-4 ${plan.active ? 'bg-green-50' : 'bg-gray-50'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                    <p className="text-sm text-gray-600 flex items-center mt-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(plan.createdAt).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${plan.active ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-800'}`}>
                    {plan.active ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <div className="space-y-2 mb-4">
                  <p className="text-sm">
                    <span className="font-medium text-gray-700">Objetivo:</span> {plan.clientGoal}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium text-gray-700">Especialización:</span> {plan.trainerSpecification}
                  </p>
                </div>

                <div className="border-t pt-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Rutinas: <span className="font-normal">{plan.exercises.length} ejercicios</span>
                  </p>
                  {plan.exercises.length > 0 ? (
                    <div className="space-y-2">
                      {plan.exercises.slice(0, 2).map((exercise) => (
                        <div key={exercise.routineId} className="text-sm text-gray-600">
                          • {exercise.exerciseName} ({exercise.series}x{exercise.repetitions})
                        </div>
                      ))}
                      {plan.exercises.length > 2 && (
                        <div className="text-sm text-gray-500">+{plan.exercises.length - 2} más...</div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No hay ejercicios asignados</p>
                  )}
                </div>

                <div className="mt-4 flex flex-col space-y-2">
                + <Link to={`/trainer/client/${clientDni}/training-plans/${plan.id}/edit`}>
                <button className="w-full bg-blue-900 hover:bg-blue-800 text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center">
                      <Dumbbell className="h-4 w-4 mr-2" />
                      Editar ejercicios
                    </button>
                  </Link>

                  <Link to={`/trainer/client/${clientDni}/progress`}>
                    <button className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 px-4 rounded-md transition-colors flex items-center justify-center">
                      Ver progreso
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}