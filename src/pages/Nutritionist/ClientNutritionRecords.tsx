// src/pages/Nutritionist/ClientNutritionRecords.tsx
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MealTime } from '../../model/MealTime'
import { FooterPag } from '../../components/Footer'
import { NutritionistHeader } from '../../components/NutritionistHeader'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { NutritionRecordResponseDto } from '../../model/NutritionRecordResponseDto'

export function ClientNutritionRecords() 
    {
  const { dni, planId } = useParams<{ dni: string; planId: string }>()
  const [records, setRecords] = useState<NutritionRecordResponseDto[]>([])
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (!dni || !planId) return
    const token = localStorage.getItem('token')
    fetch(`http://localhost:8080/api/v1/clients/${dni}/nutrition-plans/${planId}/nutrition-records`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => {
        if (!r.ok) throw new Error(r.statusText)
        return r.json()
      })
      .then((data: NutritionRecordResponseDto[]) => setRecords(data))
      .catch(e => toast.error(`Error: ${e.message}`))
      .finally(() => setLoading(false))
  }, [dni, planId])

  const filtered = records.filter(r =>
    new Date(r.createdAt).toISOString().split('T')[0] === selectedDate
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Cargando registros…</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NutritionistHeader onLogout={() => navigate('/')} />
      <main className="flex-grow container mx-auto p-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-4 py-2 bg-gray-200 rounded"
        >
          ← Volver
        </button>
        <h2 className="text-2xl font-bold mb-4">
          Registros de {dni} — Plan {planId}
        </h2>

        <div className="mb-6">
          <label className="mr-2">Fecha:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="border px-2 py-1 rounded"
          />
        </div>

        {filtered.length > 0 ? (
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1">Hora</th>
                <th className="border px-2 py-1">Comida</th>
                <th className="border px-2 py-1">Calorías</th>
                <th className="border px-2 py-1">Proteínas</th>
                <th className="border px-2 py-1">Carbs</th>
                <th className="border px-2 py-1">Grasas</th>
                <th className="border px-2 py-1">Obs.</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id}>
                  <td className="border px-2 py-1">
                    {new Date(r.createdAt).toLocaleTimeString()}
                  </td>
                  <td className="border px-2 py-1">{r.food}</td>
                  <td className="border px-2 py-1">{r.calories}</td>
                  <td className="border px-2 py-1">{r.proteins}</td>
                  <td className="border px-2 py-1">{r.carbohydrates}</td>
                  <td className="border px-2 py-1">{r.fats}</td>
                  <td className="border px-2 py-1">{r.observations}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No hay registros para {selectedDate}.</p>
        )}
      </main>
      <FooterPag />
      <ToastContainer position="top-right" />
    </div>
  )
}
