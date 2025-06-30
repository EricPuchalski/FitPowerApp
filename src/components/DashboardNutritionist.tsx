"use client"

import { useState, useEffect } from "react"
import { Users } from "lucide-react"

interface Nutritionist {
  id: number
  name: string
  dni: string
  email: string
  gymName: string
}

export default function DashboardNutritionist() {
  const [nutritionist, setNutritionist] = useState<Nutritionist | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const dni = localStorage.getItem("userDni")
    const token = localStorage.getItem("token")

    if (!dni || !token) {
      setError("No se pudo obtener la información de autenticación.")
      return
    }

    fetch(`http://localhost:8080/api/v1/nutritionists/dni/${dni}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error al obtener nutricionista")
        }
        return res.json()
      })
      .then((data) => {
        setNutritionist(data)
        localStorage.setItem("gymName", data.gymName)
      })
      .catch((err) => {
        console.error(err)
        setError("Error al obtener los datos del nutricionista.")
      })
  }, [])

  if (error) {
    return (
      <div className="p-6 text-red-600 font-semibold">
        {error}
      </div>
    )
  }

  if (!nutritionist) {
    return (
      <div className="p-6 text-gray-600">
        Cargando información del nutricionista...
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Bienvenido, {nutritionist.name}
      </h1>
      <p className="text-gray-700 mb-6">
        Gimnasio: {nutritionist.gymName}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-green-900 mb-2">Gestión Nutricional</h2>
          <ul className="space-y-2 text-green-800">
            <li>
              📋 <a href="#" className="hover:underline">Planes nutricionales</a>
            </li>
            <li>
              🧍 <a href="#" className="hover:underline">Clientes asignados</a>
            </li>
            <li>
              ✅ <a href="#" className="hover:underline">Historiales alimentarios</a>
            </li>
          </ul>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-yellow-900 mb-2">Datos Personales</h2>
          <p><strong>DNI:</strong> {nutritionist.dni}</p>
          <p><strong>Email:</strong> {nutritionist.email}</p>
        </div>
      </div>

      {/* Futuras funcionalidades */}
      <div className="mt-10 text-center text-sm text-gray-500">
        Módulos de clientes y planes nutricionales próximamente.
      </div>
    </div>
  )
}
