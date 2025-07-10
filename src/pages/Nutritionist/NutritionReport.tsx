"use client"

import type React from "react"
import { useParams, useNavigate } from "react-router-dom" 
import { useState, useEffect } from "react"
import { Download, FileText, TrendingUp, Target, Activity, Clock, AlertCircle, Info, CheckCircle } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { FooterPag } from "../../components/Footer"

// Modelo del plan nutricional
export interface NutritionPlanResponseDto {
  id: number
  name: string
  createdAt: string
  updatedAt: string
  caloricTarget: number
  dailyCarbs: number
  dailyProteins: number
  dailyFats: number
  recommendations: string
  active: boolean
  nutritionistId: number
  nutritionistName: string
  clientDni: string
  clientName: string
  clientGoal: string
}

// Interfaces del modelo de informe
interface NutritionReport {
  clientId: number
  clientName: string
  nutritionPlanId: number
  planStartDate: string
  reportStartDate: string
  reportEndDate: string
  generatedAt: string
  targetCalories: number
  targetProteins: number
  targetCarbohydrates: number
  targetFats: number
  analysis: {
    mostConsistentMacro: MacroConsistency
    leastConsistentMacro: MacroConsistency
    compliance: ComplianceData
    mealTimeAverages: Record<MealTime, NutrientData>
    periodAverages: NutrientData
  }
  dailyData: DailyReport[]
  comments: {
    trainerComment: string | null
    nextSteps: string | null
  }
}

type MealTime = "breakfast" | "lunch" | "dinner" | "snack"

interface MacroConsistency {
  macroName: "calories" | "proteins" | "carbohydrates" | "fats"
  averageDeviation: number
  daysInRange: number
}

interface ComplianceData {
  perfectDays: number
  onlyCaloriesInRange: number
  onlyMacrosInRange: number
}

interface NutrientData {
  calories: number
  proteins: number
  carbohydrates: number
  fats: number
}

interface DailyReport {
  date: string
  consumed: NutrientData
  percentages: {
    calories: number
    proteins: number
    carbohydrates: number
    fats: number
  }
}

const NutritionReportGenerator: React.FC = () => {
  const { clientDni } = useParams<{ clientDni: string }>()
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const [report, setReport] = useState<NutritionReport | null>(null)
  const [activePlan, setActivePlan] = useState<NutritionPlanResponseDto | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingPlan, setLoadingPlan] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const [planError, setPlanError] = useState<string>("")
  const navigate = useNavigate()
const today = new Date().toISOString().split('T')[0];
  const fetchActivePlan = async (dni: string) => {
    if (!dni) return

    setLoadingPlan(true)
    setPlanError("")

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Token de autenticación no encontrado")
      }

      const response = await fetch(`http://localhost:8080/api/v1/clients/${dni}/nutrition-plans/active`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("No se encontró un plan nutricional activo para este cliente")
        }
        throw new Error("Error al obtener el plan nutricional activo")
      }

      const planData: NutritionPlanResponseDto = await response.json()
      setActivePlan(planData)
    } catch (err) {
      setPlanError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoadingPlan(false)
    }
  }

const fetchReport = async () => {
  if (!clientDni || !startDate || !endDate) {
    setError("Por favor complete todos los campos");
    return;
  }

  if (!activePlan) {
    setError("No hay un plan nutricional activo. No se puede generar el informe.");
    return;
  }

  // Validar que las fechas sean posteriores a la creación del plan
  const planCreatedDate = new Date(activePlan.createdAt);
  const reportStartDate = new Date(startDate);
  const reportEndDate = new Date(endDate);
  const currentDate = new Date(today);

  if (reportStartDate < planCreatedDate) {
    setError(
      `La fecha de inicio del informe no puede ser anterior a la creación del plan (${new Date(
        activePlan.createdAt
      ).toLocaleDateString()})`
    );
    return;
  }

  if (reportEndDate > currentDate) {
    setError("La fecha de fin no puede ser posterior al día actual.");
    return;
  }

  setLoading(true);
  setError("");

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token de autenticación no encontrado");
    }

    const response = await fetch(
      `http://localhost:8080/api/v1/clients/${clientDni}/reports/nutrition-plan?startDate=${startDate}&endDate=${endDate}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error al obtener el informe");
    }

    const data: NutritionReport = await response.json();
    setReport(data);
  } catch (err) {
    setError(err instanceof Error ? err.message : "Error desconocido");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if (clientDni) {
      fetchActivePlan(clientDni)
    }
  }, [clientDni])

  const generatePDF = () => {
    if (!report || !activePlan) return

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    })

    // Colors for the PDF
    const colors = {
      primary: "#3B82F6",
      success: "#10B981",
      warning: "#F59E0B",
      danger: "#EF4444",
      dark: "#1F2937",
      light: "#F3F4F6"
    }

    // Header with logo and title
    doc.setFillColor(colors.primary)
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), 30, "F")
    doc.setTextColor("#FFFFFF")
    doc.setFontSize(20)
    doc.text("Informe Nutricional FitPower", 105, 20, { align: "center" })

    // Client information section
    doc.setTextColor(colors.dark)
    doc.setFontSize(14)
    doc.text("Información del Cliente", 20, 40)
    
    doc.setFontSize(12)
    doc.setTextColor(colors.dark)
    doc.text(`Nombre: ${report.clientName}`, 20, 50)
    doc.text(`DNI: ${clientDni}`, 20, 56)
    doc.text(`Objetivo: ${activePlan.clientGoal || "No especificado"}`, 20, 62)
    doc.text(`Período: ${report.reportStartDate} - ${report.reportEndDate}`, 20, 68)
    doc.text(`Generado el: ${new Date(report.generatedAt).toLocaleDateString()}`, 20, 74)

    // Nutrition plan information
    doc.setFontSize(14)
    doc.text("Plan Nutricional", 20, 86)
    
    const planData = [
      ["Nombre del plan", activePlan.name],
      ["Nutricionista", activePlan.nutritionistName],
      ["Fecha creación", new Date(activePlan.createdAt).toLocaleDateString()],
      ["Última actualización", new Date(activePlan.updatedAt).toLocaleDateString()]
    ]

    autoTable(doc, {
      startY: 90,
      head: [["Detalle", "Información"]],
      body: planData,
      headStyles: {
        fillColor: colors.primary,
        textColor: "#FFFFFF",
        fontStyle: "bold"
      },
      alternateRowStyles: {
        fillColor: colors.light
      },
      margin: { left: 20, right: 20 }
    })

    // Nutrition targets
    doc.setFontSize(14)
    doc.text("Objetivos Nutricionales", 20, (doc as any).lastAutoTable.finalY + 15)

    const targetsData = [
      ["Nutriente", "Objetivo", "Consumo Promedio", "Cumplimiento"],
      [
        "Calorías", 
        `${activePlan.caloricTarget} kcal`, 
        `${report.analysis.periodAverages.calories.toFixed(1)} kcal`,
        `${((report.analysis.periodAverages.calories / activePlan.caloricTarget) * 100).toFixed(1)}%`
      ],
      [
        "Proteínas", 
        `${activePlan.dailyProteins} g`, 
        `${report.analysis.periodAverages.proteins.toFixed(1)} g`,
        `${((report.analysis.periodAverages.proteins / activePlan.dailyProteins) * 100).toFixed(1)}%`
      ],
      [
        "Carbohidratos", 
        `${activePlan.dailyCarbs} g`, 
        `${report.analysis.periodAverages.carbohydrates.toFixed(1)} g`,
        `${((report.analysis.periodAverages.carbohydrates / activePlan.dailyCarbs) * 100).toFixed(1)}%`
      ],
      [
        "Grasas", 
        `${activePlan.dailyFats} g`, 
        `${report.analysis.periodAverages.fats.toFixed(1)} g`,
        `${((report.analysis.periodAverages.fats / activePlan.dailyFats) * 100).toFixed(1)}%`
      ]
    ]

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 20,
      head: [targetsData[0]],
      body: targetsData.slice(1),
      headStyles: {
        fillColor: colors.primary,
        textColor: "#FFFFFF",
        fontStyle: "bold"
      },
      didDrawCell: (data) => {
        if (data.section === "body" && data.column.index === 3) {
          const value = parseFloat(data.cell.raw.toString().replace('%', ''))
          if (value >= 90) {
            doc.setTextColor(colors.success)
          } else if (value >= 70) {
            doc.setTextColor(colors.warning)
          } else {
            doc.setTextColor(colors.danger)
          }
          doc.text(data.cell.raw, data.cell.x + data.cell.width - 3, data.cell.y + 10, { align: "right" })
          doc.setTextColor(colors.dark)
        }
      },
      margin: { left: 20, right: 20 }
    })

    // Compliance statistics
    doc.setFontSize(14)
    doc.text("Estadísticas de Cumplimiento", 20, (doc as any).lastAutoTable.finalY + 15)

    const complianceData = [
      ["Días perfectos", report.analysis.compliance.perfectDays],
      ["Solo calorías en rango", report.analysis.compliance.onlyCaloriesInRange],
      ["Solo macros en rango", report.analysis.compliance.onlyMacrosInRange]
    ]

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 20,
      head: [["Métrica", "Valor"]],
      body: complianceData,
      headStyles: {
        fillColor: colors.primary,
        textColor: "#FFFFFF",
        fontStyle: "bold"
      },
      columnStyles: {
        1: { cellWidth: 40, halign: 'center' }
      },
      margin: { left: 20, right: 20 }
    })

    // Consistency analysis
    doc.setFontSize(14)
    doc.text("Análisis de Consistencia", 20, (doc as any).lastAutoTable.finalY + 15)

    const consistencyData = [
      ["Macronutriente", "Estado", "Desviación"],
      [
        macroLabels[report.analysis.mostConsistentMacro.macroName],
        "Más consistente",
        `${report.analysis.mostConsistentMacro.averageDeviation.toFixed(1)}%`,
        // report.analysis.mostConsistentMacro.daysInRange
      ],
      [
        macroLabels[report.analysis.leastConsistentMacro.macroName],
        "Menos consistente",
        `${report.analysis.leastConsistentMacro.averageDeviation.toFixed(1)}%`,
        // report.analysis.leastConsistentMacro.daysInRange
      ]
    ]

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 20,
      head: [consistencyData[0]],
      body: consistencyData.slice(1),
      headStyles: {
        fillColor: colors.primary,
        textColor: "#FFFFFF",
        fontStyle: "bold"
      },
      margin: { left: 20, right: 20 }
    })

    // Meal time averages
    doc.setFontSize(14)
    doc.text("Promedios por Comida", 20, (doc as any).lastAutoTable.finalY + 15)

    const mealData = Object.entries(report.analysis.mealTimeAverages).map(([meal, data]) => [
      mealTimeLabels[meal as MealTime],
      `${data.calories.toFixed(1)} kcal`,
      `${data.proteins.toFixed(1)} g`,
      `${data.carbohydrates.toFixed(1)} g`,
      `${data.fats.toFixed(1)} g`
    ])

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 20,
      head: [["Comida", "Calorías", "Proteínas", "Carbohidratos", "Grasas"]],
      body: mealData,
      headStyles: {
        fillColor: colors.primary,
        textColor: "#FFFFFF",
        fontStyle: "bold"
      },
      margin: { left: 20, right: 20 }
    })

    // Daily Consumption Tables
    doc.setFontSize(14)
    doc.text("Consumo Diario Detallado", 20, (doc as any).lastAutoTable.finalY + 15)

    // Prepare daily data for tables
    const dailyCaloriesData = report.dailyData.map(day => [
      new Date(day.date).toLocaleDateString(),
      `${day.consumed.calories.toFixed(1)} kcal`,
      `${day.percentages.calories.toFixed(1)}%`
    ])

    const dailyProteinsData = report.dailyData.map(day => [
      new Date(day.date).toLocaleDateString(),
      `${day.consumed.proteins.toFixed(1)} g`,
      `${day.percentages.proteins.toFixed(1)}%`
    ])

    const dailyCarbsData = report.dailyData.map(day => [
      new Date(day.date).toLocaleDateString(),
      `${day.consumed.carbohydrates.toFixed(1)} g`,
      `${day.percentages.carbohydrates.toFixed(1)}%`
    ])

    const dailyFatsData = report.dailyData.map(day => [
      new Date(day.date).toLocaleDateString(),
      `${day.consumed.fats.toFixed(1)} g`,
      `${day.percentages.fats.toFixed(1)}%`
    ])

    // Calories table
    doc.setFontSize(12)
    doc.text("Consumo Diario de Calorías", 20, (doc as any).lastAutoTable.finalY + 25)
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 30,
      head: [["Fecha", "Consumo", "% del objetivo"]],
      body: dailyCaloriesData,
      headStyles: {
        fillColor: colors.primary,
        textColor: "#FFFFFF",
        fontStyle: "bold"
      },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 40, halign: 'right' },
        2: { cellWidth: 40, halign: 'right' }
      },
      margin: { left: 20, right: 20 },
      styles: {
        fontSize: 9
      }
    })

    // Proteins table
    doc.setFontSize(12)
    doc.text("Consumo Diario de Proteínas", 20, (doc as any).lastAutoTable.finalY + 15)
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 20,
      head: [["Fecha", "Consumo", "% del objetivo"]],
      body: dailyProteinsData,
      headStyles: {
        fillColor: colors.primary,
        textColor: "#FFFFFF",
        fontStyle: "bold"
      },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 40, halign: 'right' },
        2: { cellWidth: 40, halign: 'right' }
      },
      margin: { left: 20, right: 20 },
      styles: {
        fontSize: 9
      }
    })

    // Add new page if needed
    if ((doc as any).lastAutoTable.finalY > 250) {
      doc.addPage()
    }

    // Carbs table
    doc.setFontSize(12)
    doc.text("Consumo Diario de Carbohidratos", 20, (doc as any).lastAutoTable.finalY + 15)
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 20,
      head: [["Fecha", "Consumo", "% del objetivo"]],
      body: dailyCarbsData,
      headStyles: {
        fillColor: colors.primary,
        textColor: "#FFFFFF",
        fontStyle: "bold"
      },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 40, halign: 'right' },
        2: { cellWidth: 40, halign: 'right' }
      },
      margin: { left: 20, right: 20 },
      styles: {
        fontSize: 9
      }
    })

    // Fats table
    doc.setFontSize(12)
    doc.text("Consumo Diario de Grasas", 20, (doc as any).lastAutoTable.finalY + 15)
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 20,
      head: [["Fecha", "Consumo", "% del objetivo"]],
      body: dailyFatsData,
      headStyles: {
        fillColor: colors.primary,
        textColor: "#FFFFFF",
        fontStyle: "bold"
      },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 40, halign: 'right' },
        2: { cellWidth: 40, halign: 'right' }
      },
      margin: { left: 20, right: 20 },
      styles: {
        fontSize: 9
      }
    })

    // Recommendations
    if (activePlan.recommendations) {
      doc.setFontSize(14)
      doc.text("Recomendaciones del Plan", 20, (doc as any).lastAutoTable.finalY + 15)
      doc.setFontSize(11)
      doc.setTextColor(colors.dark)
      const splitText = doc.splitTextToSize(activePlan.recommendations, 170)
      doc.text(splitText, 20, (doc as any).lastAutoTable.finalY + 20)
    }

    // Trainer comments
    if (report.comments.trainerComment) {
      doc.setFontSize(14)
      doc.text("Comentarios del Nutricionista", 20, (doc as any).lastAutoTable.finalY + 15)
      doc.setFontSize(11)
      doc.setTextColor(colors.dark)
      const splitText = doc.splitTextToSize(report.comments.trainerComment, 170)
      doc.text(splitText, 20, (doc as any).lastAutoTable.finalY + 20)
    }

    // Next steps
    if (report.comments.nextSteps) {
      doc.setFontSize(14)
      doc.text("Próximos Pasos", 20, (doc as any).lastAutoTable.finalY + 15)
      doc.setFontSize(11)
      doc.setTextColor(colors.dark)
      const splitText = doc.splitTextToSize(report.comments.nextSteps, 170)
      doc.text(splitText, 20, (doc as any).lastAutoTable.finalY + 20)
    }

    // Footer
    doc.setFontSize(10)
    doc.setTextColor(colors.dark)
    doc.text("© FitPower - Informe generado automáticamente", 105, 285, { align: "center" })

    // Save the PDF
    doc.save(`Informe_Nutricional_${report.clientName}_${report.reportStartDate}.pdf`)
  }

  const getComplianceColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600"
    if (percentage >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getComplianceBarColor = (percentage: number) => {
    if (percentage >= 90) return "bg-green-500"
    if (percentage >= 70) return "bg-yellow-500"
    return "bg-red-500"
  }

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"]

  const mealTimeLabels = {
    breakfast: "Desayuno",
    lunch: "Almuerzo",
    dinner: "Cena",
    snack: "Merienda",
  }

  const macroLabels = {
    calories: "Calorías",
    proteins: "Proteínas",
    carbohydrates: "Carbohidratos",
    fats: "Grasas",
  }

  return (
    <>
      <header className="bg-indigo-800 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">FITPOWER</h1>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      </header>
      
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Generador de Informes Nutricionales</h1>
            </div>

            {/* Información del cliente y plan activo */}
            {clientDni && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-800">Cliente: DNI {clientDni}</h3>
                </div>

                {loadingPlan && (
                  <div className="flex items-center gap-2 text-blue-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span>Cargando plan nutricional...</span>
                  </div>
                )}

                {planError && (
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="w-5 h-5" />
                    <span>{planError}</span>
                  </div>
                )}

                {activePlan && (
                  <div className="mt-3">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-800">Plan Nutricional Activo Encontrado</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p>
                          <strong>Nombre:</strong> {activePlan.name}
                        </p>
                        <p>
                          <strong>Cliente:</strong> {activePlan.clientName}
                        </p>
                        <p>
                          <strong>Nutricionista:</strong> {activePlan.nutritionistName}
                        </p>
                      </div>
                      <div>
                        <p>
                          <strong>Creado:</strong> {new Date(activePlan.createdAt).toLocaleDateString()}
                        </p>
                        <p>
                          <strong>Actualizado:</strong> {new Date(activePlan.updatedAt).toLocaleDateString()}
                        </p>
                        <p>
                          <strong>Objetivo:</strong> {activePlan.clientGoal || "No especificado"}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                      <p className="text-sm text-yellow-800">
                        <strong>Nota:</strong> Las fecha de inicio debe ser posterior al{" "}
                        {new Date(activePlan.createdAt).toLocaleDateString()} (fecha de creación del plan). Y la fecha de fin debe ser como máximo (hoy).
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Inicio</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          min={activePlan ? activePlan.createdAt.split("T")[0] : undefined}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Fin</label>
  <input
    type="date"
    value={endDate}
    onChange={(e) => setEndDate(e.target.value)}
    min={startDate || (activePlan ? activePlan.createdAt.split("T")[0] : undefined)}
    max={today} // Validación para que no se pueda seleccionar una fecha posterior a hoy
    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
</div>

              <button
                onClick={fetchReport}
                disabled={loading || !activePlan}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Generando...
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4" />
                    Generar Informe
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}
          </div>

          {report && activePlan && (
            <div className="space-y-6">
              {/* Header del informe con información del plan */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{report.clientName}</h2>
                    <p className="text-gray-600">DNI: {clientDni}</p>
                    <p className="text-gray-600">
                      Período: {report.reportStartDate} - {report.reportEndDate}
                    </p>
                    <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-800">Plan Nutricional: {activePlan.name}</p>
                      <p className="text-sm text-blue-600">Nutricionista: {activePlan.nutritionistName}</p>
                      <p className="text-sm text-blue-600">Objetivo: {activePlan.clientGoal || "No especificado"}</p>
                    </div>
                  </div>
                  <button
                    onClick={generatePDF}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center gap-2 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Descargar PDF
                  </button>
                </div>
              </div>

              {/* Objetivos del plan vs consumo real */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  Objetivos del Plan vs Consumo Real
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    {
                      label: "Calorías",
                      target: activePlan.caloricTarget,
                      actual: report.analysis.periodAverages.calories,
                      unit: "kcal",
                    },
                    {
                      label: "Proteínas",
                      target: activePlan.dailyProteins,
                      actual: report.analysis.periodAverages.proteins,
                      unit: "g",
                    },
                    {
                      label: "Carbohidratos",
                      target: activePlan.dailyCarbs,
                      actual: report.analysis.periodAverages.carbohydrates,
                      unit: "g",
                    },
                    {
                      label: "Grasas",
                      target: activePlan.dailyFats,
                      actual: report.analysis.periodAverages.fats,
                      unit: "g",
                    },
                  ].map((item, index) => {
                    const percentage = (item.actual / item.target) * 100
                    return (
                      <div key={index} className="border rounded-lg p-4">
                        <h4 className="font-medium text-gray-700">{item.label}</h4>
                        <div className="mt-2">
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>
                              Objetivo: {item.target.toFixed(0)} {item.unit}
                            </span>
                            <span>
                              Real: {item.actual.toFixed(1)} {item.unit}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div
                              className={`h-2 rounded-full ${getComplianceBarColor(percentage)}`}
                              style={{ width: `${Math.min(percentage, 100)}%` }}
                            />
                          </div>
                          <p className={`text-sm font-medium mt-1 ${getComplianceColor(percentage)}`}>
                            {percentage.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Recomendaciones del plan */}
              {activePlan.recommendations && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-xl font-semibold mb-4">Recomendaciones del Plan Nutricional</h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800">{activePlan.recommendations}</p>
                  </div>
                </div>
              )}

              {/* Estadísticas de cumplimiento */}
              {/* <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-600" />
                  Estadísticas de Cumplimiento
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-medium text-green-800">Días Perfectos</h4>
                    <p className="text-2xl font-bold text-green-600">{report.analysis.compliance.perfectDays}</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800">Solo Calorías en Rango</h4>
                    <p className="text-2xl font-bold text-blue-600">{report.analysis.compliance.onlyCaloriesInRange}</p>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-medium text-yellow-800">Solo Macros en Rango</h4>
                    <p className="text-2xl font-bold text-yellow-600">{report.analysis.compliance.onlyMacrosInRange}</p>
                  </div>
                </div>
              </div> */}

              {/* Consistencia de Macronutrientes */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-semibold mb-4">Consistencia de Macronutrientes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-medium text-green-800">Más Consistente</h4>
                    <p className="text-lg font-semibold text-green-600">
                      {macroLabels[report.analysis.mostConsistentMacro.macroName]}
                    </p>
                    <p className="text-sm text-green-700">
                      Desviación promedio: {report.analysis.mostConsistentMacro.averageDeviation.toFixed(2)}%
                    </p>
                    {/* <p className="text-sm text-green-700">
                      Días en rango: {report.analysis.mostConsistentMacro.daysInRange}
                    </p> */}
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-medium text-red-800">Menos Consistente</h4>
                    <p className="text-lg font-semibold text-red-600">
                      {macroLabels[report.analysis.leastConsistentMacro.macroName]}
                    </p>
                    <p className="text-sm text-red-700">
                      Desviación promedio: {report.analysis.leastConsistentMacro.averageDeviation.toFixed(2)}%
                    </p>
                    {/* <p className="text-sm text-red-700">
                      Días en rango: {report.analysis.leastConsistentMacro.daysInRange}
                    </p> */}
                  </div>
                </div>
              </div>

              {/* Promedios por Comida y Gráficos */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-purple-600" />
                    Promedios por Comida
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={Object.entries(report.analysis.mealTimeAverages).map(([meal, data]) => ({
                        meal: mealTimeLabels[meal as MealTime],
                        calories: data.calories,
                        proteins: data.proteins,
                        carbs: data.carbohydrates,
                        fats: data.fats,
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="meal" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="calories" fill="#3B82F6" name="Calorías" />
                      <Bar dataKey="proteins" fill="#10B981" name="Proteínas" />
                      <Bar dataKey="carbs" fill="#F59E0B" name="Carbohidratos" />
                      <Bar dataKey="fats" fill="#EF4444" name="Grasas" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <p className="text-center mb-2">Objetivo del plan: {activePlan.caloricTarget} calorías</p>
                  <h3 className="text-xl font-semibold mb-4">Consumo Diario de Calorías</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={report.dailyData.map((day) => ({
                        date: new Date(day.date).toLocaleDateString(),
                        calories: day.consumed.calories,
                        target: activePlan.caloricTarget,
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="calories" stroke="#3B82F6" strokeWidth={2} name="Consumo" />
                      <Line type="monotone" dataKey="target" stroke="#EF4444" strokeDasharray="5 5" name="Objetivo" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Gráficos de Proteínas y Carbohidratos */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <p className="text-center mb-2">Objetivo del plan: {activePlan.dailyProteins} g de proteínas</p>
                  <h3 className="text-xl font-semibold mb-4">Consumo Diario de Proteínas</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={report.dailyData.map((day) => ({
                        date: new Date(day.date).toLocaleDateString(),
                        proteins: day.consumed.proteins,
                        target: activePlan.dailyProteins,
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="proteins" stroke="#10B981" strokeWidth={2} name="Consumo" />
                      <Line type="monotone" dataKey="target" stroke="#EF4444" strokeDasharray="5 5" name="Objetivo" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <p className="text-center mb-2">Objetivo del plan: {activePlan.dailyCarbs} g de carbohidratos</p>
                  <h3 className="text-xl font-semibold mb-4">Consumo Diario de Carbohidratos</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={report.dailyData.map((day) => ({
                        date: new Date(day.date).toLocaleDateString(),
                        carbs: day.consumed.carbohydrates,
                        target: activePlan.dailyCarbs,
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="carbs" stroke="#F59E0B" strokeWidth={2} name="Consumo" />
                      <Line type="monotone" dataKey="target" stroke="#EF4444" strokeDasharray="5 5" name="Objetivo" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Gráfico de Grasas */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <p className="text-center mb-2">Objetivo del plan: {activePlan.dailyFats} g de grasas</p>
                  <h3 className="text-xl font-semibold mb-4">Consumo Diario de Grasas</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={report.dailyData.map((day) => ({
                        date: new Date(day.date).toLocaleDateString(),
                        fats: day.consumed.fats,
                        target: activePlan.dailyFats,
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="fats" stroke="#EF4444" strokeWidth={2} name="Consumo" />
                      <Line type="monotone" dataKey="target" stroke="#3B82F6" strokeDasharray="5 5" name="Objetivo" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Consumo Diario Detallado */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-semibold mb-4">Consumo Diario Detallado</h3>
                
                {/* Tabla de Calorías */}
                <div className="mb-8">
                  <h4 className="text-lg font-medium mb-2 text-blue-600">Calorías</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Consumo</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% del objetivo</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {report.dailyData.map((day, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(day.date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {day.consumed.calories.toFixed(1)} kcal
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {day.percentages.calories.toFixed(1)}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Tabla de Proteínas */}
                <div className="mb-8">
                  <h4 className="text-lg font-medium mb-2 text-green-600">Proteínas</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Consumo</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% del objetivo</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {report.dailyData.map((day, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(day.date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {day.consumed.proteins.toFixed(1)} g
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {day.percentages.proteins.toFixed(1)}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Tabla de Carbohidratos */}
                <div className="mb-8">
                  <h4 className="text-lg font-medium mb-2 text-yellow-600">Carbohidratos</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Consumo</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% del objetivo</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {report.dailyData.map((day, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(day.date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {day.consumed.carbohydrates.toFixed(1)} g
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {day.percentages.carbohydrates.toFixed(1)}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Tabla de Grasas */}
                <div className="mb-8">
                  <h4 className="text-lg font-medium mb-2 text-red-600">Grasas</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Consumo</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% del objetivo</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {report.dailyData.map((day, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(day.date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {day.consumed.fats.toFixed(1)} g
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {day.percentages.fats.toFixed(1)}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Comentarios y Recomendaciones */}
              {(report.comments.trainerComment || report.comments.nextSteps) && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-xl font-semibold mb-4">Comentarios y Recomendaciones</h3>
                  {report.comments.trainerComment && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-700 mb-2">Comentarios del Nutricionista:</h4>
                      <p className="text-gray-600 bg-gray-50 p-3 rounded-md">{report.comments.trainerComment}</p>
                    </div>
                  )}
                  {report.comments.nextSteps && (
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Próximos Pasos:</h4>
                      <p className="text-gray-600 bg-blue-50 p-3 rounded-md">{report.comments.nextSteps}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <FooterPag></FooterPag>
    </>
  )
}

export default NutritionReportGenerator