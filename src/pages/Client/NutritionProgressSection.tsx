// src/pages/Client/NutritionProgressSection.tsx
"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Flame, AlertTriangle, Calendar } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { FooterPag } from "../../components/Footer"

interface NutritionProgressEvaluationDTO {
  adherence: number
  alerts: string[]
}

interface NutritionProgressReportDTO {
  consistency: number
}

interface NutritionProgressSectionProps {
  dni: string
}

export const NutritionProgressSection: React.FC<NutritionProgressSectionProps> = ({ dni }) => {
  const [evaluation, setEvaluation] = useState<NutritionProgressEvaluationDTO | null>(null)
  const [report, setReport] = useState<NutritionProgressReportDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchNutritionProgress = async () => {
      try {
        const token = localStorage.getItem("token")
        const today = new Date()
        const year = today.getFullYear()
        const month = today.getMonth() + 1

        const [evalRes, reportRes] = await Promise.all([
          fetch(`http://localhost:8080/api/v1/clients/${dni}/nutrition-progress/evaluation`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`http://localhost:8080/api/v1/clients/${dni}/nutrition-progress/report/${year}/${month}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])

        if (!evalRes.ok || !reportRes.ok) throw new Error("Error al cargar progreso nutricional")

        const evalJson = await evalRes.json()
        const reportJson = await reportRes.json()

        console.log("📦 Datos de evaluación:", evalJson)
        console.log("📦 Datos del reporte:", reportJson)

        setEvaluation({
          adherence: evalJson.adherencePercentage,
          alerts: evalJson.alerts,
        })

        setReport({
          consistency: reportJson.consistencyScore,
        })
      } catch (err) {
        console.error("Error nutricional:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchNutritionProgress()
  }, [dni])

  if (loading || !evaluation || !report) return null

  return (
    <>
      {/* Header FIJO en la parte superior */}
      <header className="fixed top-0 left-0 right-0 w-full bg-indigo-800 text-white shadow-lg z-50">
        <div className="max-w-6xl mx-auto px-4 py-2 flex justify-between items-center">
          <h1 className="text-xl font-bold">FITPOWER</h1>
          <button
            onClick={() => navigate(-1)}
            className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors text-sm"
          >
            Volver al Inicio
          </button>
        </div>
      </header>

      {/* Contenido principal con padding para evitar superposición */}
      <main className="pt-16 pb-12 min-h-screen bg-white">
        <div className="max-w-6xl mx-auto p-4">
          <div className="space-y-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-lg">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Progreso Nutricional
                </h3>
              </div>
              <p className="text-gray-600">Adherencia y consistencia con el plan nutricional</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Panel 1: Adherencia */}
              <div className="bg-orange-50 p-5 rounded-2xl border border-orange-200 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <Flame className="w-5 h-5 text-orange-600" />
                  <span className="text-sm font-semibold text-orange-700">Adherencia semanal</span>
                </div>
                <div className="text-2xl font-bold text-orange-800">
                  {typeof evaluation.adherence === "number" ? `${evaluation.adherence.toFixed(1)}%` : "N/A"}
                </div>
                <p className="text-sm text-gray-700 mt-2">
                  Porcentaje de días (últimos 7) donde cumpliste el plan: proteínas, calorías y carbohidratos según
                  objetivo.
                </p>
              </div>

              {/* Panel 2: Consistencia */}
              <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-5 h-5 text-amber-600" />
                  <span className="text-sm font-semibold text-amber-700">Consistencia mensual</span>
                </div>
                <div className="text-2xl font-bold text-amber-800">
                  {typeof report.consistency === "number" ? `${report.consistency.toFixed(1)}%` : "N/A"}
                </div>
                <p className="text-sm text-gray-700 mt-2">
                  Evalúa qué tan regular fuiste mes a mes con tus nutrientes. Más consistencia = más estabilidad.
                </p>
              </div>

              {/* Panel 3: Alertas */}
              <div className="bg-red-50 p-5 rounded-2xl border border-red-200 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <span className="text-sm font-semibold text-red-700">Alertas</span>
                </div>
                <ul className="list-disc list-inside text-sm text-red-800">
                  {evaluation.alerts.length === 0 ? (
                    <li>Sin alertas recientes</li>
                  ) : (
                    evaluation.alerts.map((alert, i) => <li key={i}>{alert}</li>)
                  )}
                </ul>
                <p className="text-sm text-gray-700 mt-2">
                  Muestra advertencias cuando tu alimentación se desvía mucho del plan: proteínas muy bajas, calorías
                  insuficientes o exceso seguido de carbohidratos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      


    </>
  )
}
