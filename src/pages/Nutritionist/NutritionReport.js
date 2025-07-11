"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Download, FileText, TrendingUp, Target, Activity, Clock, AlertCircle, Info, CheckCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FooterPag } from "../../components/Footer";
const NutritionReportGenerator = () => {
    const { clientDni } = useParams();
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [report, setReport] = useState(null);
    const [activePlan, setActivePlan] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingPlan, setLoadingPlan] = useState(false);
    const [error, setError] = useState("");
    const [planError, setPlanError] = useState("");
    const navigate = useNavigate();
    const today = new Date().toISOString().split('T')[0];
    const fetchActivePlan = async (dni) => {
        if (!dni)
            return;
        setLoadingPlan(true);
        setPlanError("");
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Token de autenticación no encontrado");
            }
            const response = await fetch(`http://localhost:8080/api/v1/clients/${dni}/nutrition-plans/active`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error("No se encontró un plan nutricional activo para este cliente");
                }
                throw new Error("Error al obtener el plan nutricional activo");
            }
            const planData = await response.json();
            setActivePlan(planData);
        }
        catch (err) {
            setPlanError(err instanceof Error ? err.message : "Error desconocido");
        }
        finally {
            setLoadingPlan(false);
        }
    };
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
            setError(`La fecha de inicio del informe no puede ser anterior a la creación del plan (${new Date(activePlan.createdAt).toLocaleDateString()})`);
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
            const response = await fetch(`http://localhost:8080/api/v1/clients/${clientDni}/reports/nutrition-plan?startDate=${startDate}&endDate=${endDate}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error("Error al obtener el informe");
            }
            const data = await response.json();
            setReport(data);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "Error desconocido");
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (clientDni) {
            fetchActivePlan(clientDni);
        }
    }, [clientDni]);
    const generatePDF = () => {
        if (!report || !activePlan)
            return;
        const doc = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4"
        });
        // Colors for the PDF
        const colors = {
            primary: "#3B82F6",
            success: "#10B981",
            warning: "#F59E0B",
            danger: "#EF4444",
            dark: "#1F2937",
            light: "#F3F4F6"
        };
        // Header with logo and title
        doc.setFillColor(colors.primary);
        doc.rect(0, 0, doc.internal.pageSize.getWidth(), 30, "F");
        doc.setTextColor("#FFFFFF");
        doc.setFontSize(20);
        doc.text("Informe Nutricional FitPower", 105, 20, { align: "center" });
        // Client information section
        doc.setTextColor(colors.dark);
        doc.setFontSize(14);
        doc.text("Información del Cliente", 20, 40);
        doc.setFontSize(12);
        doc.setTextColor(colors.dark);
        doc.text(`Nombre: ${report.clientName}`, 20, 50);
        doc.text(`DNI: ${clientDni}`, 20, 56);
        doc.text(`Objetivo: ${activePlan.clientGoal || "No especificado"}`, 20, 62);
        doc.text(`Período: ${report.reportStartDate} - ${report.reportEndDate}`, 20, 68);
        doc.text(`Generado el: ${new Date(report.generatedAt).toLocaleDateString()}`, 20, 74);
        // Nutrition plan information
        doc.setFontSize(14);
        doc.text("Plan Nutricional", 20, 86);
        const planData = [
            ["Nombre del plan", activePlan.name],
            ["Nutricionista", activePlan.nutritionistName],
            ["Fecha creación", new Date(activePlan.createdAt).toLocaleDateString()],
            ["Última actualización", new Date(activePlan.updatedAt).toLocaleDateString()]
        ];
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
        });
        // Nutrition targets
        doc.setFontSize(14);
        doc.text("Objetivos Nutricionales", 20, doc.lastAutoTable.finalY + 15);
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
        ];
        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 20,
            head: [targetsData[0]],
            body: targetsData.slice(1),
            headStyles: {
                fillColor: colors.primary,
                textColor: "#FFFFFF",
                fontStyle: "bold"
            },
            didDrawCell: (data) => {
                if (data.section === "body" && data.column.index === 3) {
                    const value = parseFloat(data.cell.raw.toString().replace('%', ''));
                    if (value >= 90) {
                        doc.setTextColor(colors.success);
                    }
                    else if (value >= 70) {
                        doc.setTextColor(colors.warning);
                    }
                    else {
                        doc.setTextColor(colors.danger);
                    }
                    doc.text(data.cell.raw, data.cell.x + data.cell.width - 3, data.cell.y + 10, { align: "right" });
                    doc.setTextColor(colors.dark);
                }
            },
            margin: { left: 20, right: 20 }
        });
        // Compliance statistics
        doc.setFontSize(14);
        doc.text("Estadísticas de Cumplimiento", 20, doc.lastAutoTable.finalY + 15);
        const complianceData = [
            ["Días perfectos (Calorías y macros al 80/120%)", report.analysis.compliance.perfectDays],
            ["Días calorías en rango 80/120%", report.analysis.compliance.onlyCaloriesInRange],
            ["Días macros en rango 80/120%", report.analysis.compliance.onlyMacrosInRange]
        ];
        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 20,
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
        });
        // Consistency analysis
        doc.setFontSize(14);
        doc.text("Análisis de Consistencia", 20, doc.lastAutoTable.finalY + 15);
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
        ];
        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 20,
            head: [consistencyData[0]],
            body: consistencyData.slice(1),
            headStyles: {
                fillColor: colors.primary,
                textColor: "#FFFFFF",
                fontStyle: "bold"
            },
            margin: { left: 20, right: 20 }
        });
        // Meal time averages
        doc.setFontSize(14);
        doc.text("Promedios por Comida", 20, doc.lastAutoTable.finalY + 15);
        const mealData = Object.entries(report.analysis.mealTimeAverages).map(([meal, data]) => [
            mealTimeLabels[meal],
            `${data.calories.toFixed(1)} kcal`,
            `${data.proteins.toFixed(1)} g`,
            `${data.carbohydrates.toFixed(1)} g`,
            `${data.fats.toFixed(1)} g`
        ]);
        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 20,
            head: [["Comida", "Calorías", "Proteínas", "Carbohidratos", "Grasas"]],
            body: mealData,
            headStyles: {
                fillColor: colors.primary,
                textColor: "#FFFFFF",
                fontStyle: "bold"
            },
            margin: { left: 20, right: 20 }
        });
        // Daily Consumption Tables
        doc.setFontSize(14);
        doc.text("Consumo Diario Detallado", 20, doc.lastAutoTable.finalY + 15);
        // Prepare daily data for tables
        const dailyCaloriesData = report.dailyData.map(day => [
            new Date(day.date).toLocaleDateString(),
            `${day.consumed.calories.toFixed(1)} kcal`,
            `${day.percentages.calories.toFixed(1)}%`
        ]);
        const dailyProteinsData = report.dailyData.map(day => [
            new Date(day.date).toLocaleDateString(),
            `${day.consumed.proteins.toFixed(1)} g`,
            `${day.percentages.proteins.toFixed(1)}%`
        ]);
        const dailyCarbsData = report.dailyData.map(day => [
            new Date(day.date).toLocaleDateString(),
            `${day.consumed.carbohydrates.toFixed(1)} g`,
            `${day.percentages.carbohydrates.toFixed(1)}%`
        ]);
        const dailyFatsData = report.dailyData.map(day => [
            new Date(day.date).toLocaleDateString(),
            `${day.consumed.fats.toFixed(1)} g`,
            `${day.percentages.fats.toFixed(1)}%`
        ]);
        // Calories table
        doc.setFontSize(12);
        doc.text("Consumo Diario de Calorías", 20, doc.lastAutoTable.finalY + 25);
        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 30,
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
        });
        // Proteins table
        doc.setFontSize(12);
        doc.text("Consumo Diario de Proteínas", 20, doc.lastAutoTable.finalY + 15);
        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 20,
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
        });
        // Add new page if needed
        if (doc.lastAutoTable.finalY > 250) {
            doc.addPage();
        }
        // Carbs table
        doc.setFontSize(12);
        doc.text("Consumo Diario de Carbohidratos", 20, doc.lastAutoTable.finalY + 15);
        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 20,
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
        });
        // Fats table
        doc.setFontSize(12);
        doc.text("Consumo Diario de Grasas", 20, doc.lastAutoTable.finalY + 15);
        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 20,
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
        });
        // Recommendations
        if (activePlan.recommendations) {
            doc.setFontSize(14);
            doc.text("Recomendaciones del Plan", 20, doc.lastAutoTable.finalY + 15);
            doc.setFontSize(11);
            doc.setTextColor(colors.dark);
            const splitText = doc.splitTextToSize(activePlan.recommendations, 170);
            doc.text(splitText, 20, doc.lastAutoTable.finalY + 20);
        }
        // Trainer comments
        if (report.comments.trainerComment) {
            doc.setFontSize(14);
            doc.text("Comentarios del Nutricionista", 20, doc.lastAutoTable.finalY + 15);
            doc.setFontSize(11);
            doc.setTextColor(colors.dark);
            const splitText = doc.splitTextToSize(report.comments.trainerComment, 170);
            doc.text(splitText, 20, doc.lastAutoTable.finalY + 20);
        }
        // Next steps
        if (report.comments.nextSteps) {
            doc.setFontSize(14);
            doc.text("Próximos Pasos", 20, doc.lastAutoTable.finalY + 15);
            doc.setFontSize(11);
            doc.setTextColor(colors.dark);
            const splitText = doc.splitTextToSize(report.comments.nextSteps, 170);
            doc.text(splitText, 20, doc.lastAutoTable.finalY + 20);
        }
        // Footer
        doc.setFontSize(10);
        doc.setTextColor(colors.dark);
        doc.text("© FitPower - Informe generado automáticamente", 105, 285, { align: "center" });
        // Save the PDF
        doc.save(`Informe_Nutricional_${report.clientName}_${report.reportStartDate}.pdf`);
    };
    const getComplianceColor = (percentage) => {
        if (percentage >= 90)
            return "text-green-600";
        if (percentage >= 70)
            return "text-yellow-600";
        return "text-red-600";
    };
    const getComplianceBarColor = (percentage) => {
        if (percentage >= 90)
            return "bg-green-500";
        if (percentage >= 70)
            return "bg-yellow-500";
        return "bg-red-500";
    };
    const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"];
    const mealTimeLabels = {
        breakfast: "Desayuno",
        lunch: "Almuerzo",
        dinner: "Cena",
        snack: "Merienda",
    };
    const macroLabels = {
        calories: "Calorías",
        proteins: "Proteínas",
        carbohydrates: "Carbohidratos",
        fats: "Grasas",
    };
    return (_jsxs(_Fragment, { children: [_jsx("header", { className: "bg-indigo-800 text-white shadow-md", children: _jsxs("div", { className: "container mx-auto px-4 py-4 flex justify-between items-center", children: [_jsx("h1", { className: "text-2xl font-bold", children: "FITPOWER" }), _jsx("div", { className: "flex items-center space-x-3", children: _jsx("button", { onClick: () => navigate(-1), className: "px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors", children: "Volver al Inicio" }) })] }) }), _jsx("div", { className: "min-h-screen bg-gray-50 p-6", children: _jsxs("div", { className: "max-w-7xl mx-auto", children: [_jsxs("div", { className: "bg-white rounded-lg shadow-sm p-6 mb-6", children: [_jsxs("div", { className: "flex items-center gap-3 mb-6", children: [_jsx(FileText, { className: "w-8 h-8 text-blue-600" }), _jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Generador de Informes Nutricionales" })] }), clientDni && (_jsxs("div", { className: "mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx(Info, { className: "w-5 h-5 text-blue-600" }), _jsxs("h3", { className: "font-semibold text-blue-800", children: ["Cliente: DNI ", clientDni] })] }), loadingPlan && (_jsxs("div", { className: "flex items-center gap-2 text-blue-600", children: [_jsx("div", { className: "animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" }), _jsx("span", { children: "Cargando plan nutricional..." })] })), planError && (_jsxs("div", { className: "flex items-center gap-2 text-red-600", children: [_jsx(AlertCircle, { className: "w-5 h-5" }), _jsx("span", { children: planError })] })), activePlan && (_jsxs("div", { className: "mt-3", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx(CheckCircle, { className: "w-5 h-5 text-green-600" }), _jsx("span", { className: "font-medium text-green-800", children: "Plan Nutricional Activo Encontrado" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 text-sm", children: [_jsxs("div", { children: [_jsxs("p", { children: [_jsx("strong", { children: "Nombre:" }), " ", activePlan.name] }), _jsxs("p", { children: [_jsx("strong", { children: "Cliente:" }), " ", activePlan.clientName] }), _jsxs("p", { children: [_jsx("strong", { children: "Nutricionista:" }), " ", activePlan.nutritionistName] })] }), _jsxs("div", { children: [_jsxs("p", { children: [_jsx("strong", { children: "Creado:" }), " ", new Date(activePlan.createdAt).toLocaleDateString()] }), _jsxs("p", { children: [_jsx("strong", { children: "Actualizado:" }), " ", new Date(activePlan.updatedAt).toLocaleDateString()] }), _jsxs("p", { children: [_jsx("strong", { children: "Objetivo:" }), " ", activePlan.clientGoal || "No especificado"] })] })] }), _jsx("div", { className: "mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded", children: _jsxs("p", { className: "text-sm text-yellow-800", children: [_jsx("strong", { children: "Nota:" }), " Las fecha de inicio debe ser posterior al", " ", new Date(activePlan.createdAt).toLocaleDateString(), " (fecha de creaci\u00F3n del plan). Y la fecha de fin debe ser como m\u00E1ximo (hoy)."] }) })] }))] })), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 items-end", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Fecha de Inicio" }), _jsx("input", { type: "date", value: startDate, onChange: (e) => setStartDate(e.target.value), min: activePlan ? activePlan.createdAt.split("T")[0] : undefined, className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Fecha de Fin" }), _jsx("input", { type: "date", value: endDate, onChange: (e) => setEndDate(e.target.value), min: startDate || (activePlan ? activePlan.createdAt.split("T")[0] : undefined), max: today, className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), _jsx("button", { onClick: fetchReport, disabled: loading || !activePlan, className: "bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors", children: loading ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "animate-spin rounded-full h-4 w-4 border-b-2 border-white" }), "Generando..."] })) : (_jsxs(_Fragment, { children: [_jsx(TrendingUp, { className: "w-4 h-4" }), "Generar Informe"] })) })] }), error && (_jsxs("div", { className: "mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md flex items-center gap-2", children: [_jsx(AlertCircle, { className: "w-5 h-5" }), error] }))] }), report && activePlan && (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "bg-white rounded-lg shadow-sm p-6", children: _jsxs("div", { className: "flex justify-between items-start mb-4", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: report.clientName }), _jsxs("p", { className: "text-gray-600", children: ["DNI: ", clientDni] }), _jsxs("p", { className: "text-gray-600", children: ["Per\u00EDodo: ", report.reportStartDate, " - ", report.reportEndDate] }), _jsxs("div", { className: "mt-2 p-3 bg-blue-50 rounded-lg", children: [_jsxs("p", { className: "text-sm font-medium text-blue-800", children: ["Plan Nutricional: ", activePlan.name] }), _jsxs("p", { className: "text-sm text-blue-600", children: ["Nutricionista: ", activePlan.nutritionistName] }), _jsxs("p", { className: "text-sm text-blue-600", children: ["Objetivo: ", activePlan.clientGoal || "No especificado"] })] })] }), _jsxs("button", { onClick: generatePDF, className: "bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center gap-2 transition-colors", children: [_jsx(Download, { className: "w-4 h-4" }), "Descargar PDF"] })] }) }), _jsxs("div", { className: "bg-white rounded-lg shadow-sm p-6", children: [_jsxs("h3", { className: "text-xl font-semibold mb-4 flex items-center gap-2", children: [_jsx(Target, { className: "w-5 h-5 text-blue-600" }), "Objetivos del Plan vs Consumo Real"] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [
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
                                                const percentage = (item.actual / item.target) * 100;
                                                return (_jsxs("div", { className: "border rounded-lg p-4", children: [_jsx("h4", { className: "font-medium text-gray-700", children: item.label }), _jsxs("div", { className: "mt-2", children: [_jsxs("div", { className: "flex justify-between text-sm text-gray-600", children: [_jsxs("span", { children: ["Objetivo: ", item.target.toFixed(0), " ", item.unit] }), _jsxs("span", { children: ["Real: ", item.actual.toFixed(1), " ", item.unit] })] }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-2 mt-1", children: _jsx("div", { className: `h-2 rounded-full ${getComplianceBarColor(percentage)}`, style: { width: `${Math.min(percentage, 100)}%` } }) }), _jsxs("p", { className: `text-sm font-medium mt-1 ${getComplianceColor(percentage)}`, children: [percentage.toFixed(1), "%"] })] })] }, index));
                                            }) })] }), activePlan.recommendations && (_jsxs("div", { className: "bg-white rounded-lg shadow-sm p-6", children: [_jsx("h3", { className: "text-xl font-semibold mb-4", children: "Recomendaciones del Plan Nutricional" }), _jsx("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-4", children: _jsx("p", { className: "text-blue-800", children: activePlan.recommendations }) })] })), _jsxs("div", { className: "bg-white rounded-lg shadow-sm p-6", children: [_jsxs("h3", { className: "text-xl font-semibold mb-4 flex items-center gap-2", children: [_jsx(Activity, { className: "w-5 h-5 text-green-600" }), "Estad\u00EDsticas de Cumplimiento (80/120%) del plan."] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { className: "bg-green-50 border border-green-200 rounded-lg p-4", children: [_jsx("h4", { className: "font-medium text-green-800", children: "D\u00EDas Perfectos (Calor\u00EDas y macros)" }), _jsx("p", { className: "text-2xl font-bold text-green-600", children: report.analysis.compliance.perfectDays })] }), _jsxs("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-4", children: [_jsx("h4", { className: "font-medium text-blue-800", children: "Solo Calor\u00EDas en Rango" }), _jsx("p", { className: "text-2xl font-bold text-blue-600", children: report.analysis.compliance.onlyCaloriesInRange })] }), _jsxs("div", { className: "bg-yellow-50 border border-yellow-200 rounded-lg p-4", children: [_jsx("h4", { className: "font-medium text-yellow-800", children: "Solo Macros en Rango" }), _jsx("p", { className: "text-2xl font-bold text-yellow-600", children: report.analysis.compliance.onlyMacrosInRange })] })] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-sm p-6", children: [_jsx("h3", { className: "text-xl font-semibold mb-4", children: "Consistencia de Macronutrientes" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "bg-green-50 border border-green-200 rounded-lg p-4", children: [_jsx("h4", { className: "font-medium text-green-800", children: "M\u00E1s Consistente" }), _jsx("p", { className: "text-lg font-semibold text-green-600", children: macroLabels[report.analysis.mostConsistentMacro.macroName] }), _jsxs("p", { className: "text-sm text-green-700", children: ["Desviaci\u00F3n promedio: ", report.analysis.mostConsistentMacro.averageDeviation.toFixed(2), "%"] })] }), _jsxs("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4", children: [_jsx("h4", { className: "font-medium text-red-800", children: "Menos Consistente" }), _jsx("p", { className: "text-lg font-semibold text-red-600", children: macroLabels[report.analysis.leastConsistentMacro.macroName] }), _jsxs("p", { className: "text-sm text-red-700", children: ["Desviaci\u00F3n promedio: ", report.analysis.leastConsistentMacro.averageDeviation.toFixed(2), "%"] })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-white rounded-lg shadow-sm p-6", children: [_jsxs("h3", { className: "text-xl font-semibold mb-4 flex items-center gap-2", children: [_jsx(Clock, { className: "w-5 h-5 text-purple-600" }), "Promedios por Comida"] }), _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(BarChart, { data: Object.entries(report.analysis.mealTimeAverages).map(([meal, data]) => ({
                                                            meal: mealTimeLabels[meal],
                                                            calories: data.calories,
                                                            proteins: data.proteins,
                                                            carbs: data.carbohydrates,
                                                            fats: data.fats,
                                                        })), children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "meal" }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Bar, { dataKey: "calories", fill: "#3B82F6", name: "Calor\u00EDas" }), _jsx(Bar, { dataKey: "proteins", fill: "#10B981", name: "Prote\u00EDnas" }), _jsx(Bar, { dataKey: "carbs", fill: "#F59E0B", name: "Carbohidratos" }), _jsx(Bar, { dataKey: "fats", fill: "#EF4444", name: "Grasas" })] }) })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-sm p-6", children: [_jsxs("p", { className: "text-center mb-2", children: ["Objetivo del plan: ", activePlan.caloricTarget, " calor\u00EDas"] }), _jsx("h3", { className: "text-xl font-semibold mb-4", children: "Consumo Diario de Calor\u00EDas" }), _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(LineChart, { data: report.dailyData.map((day) => ({
                                                            date: new Date(day.date).toLocaleDateString(),
                                                            calories: day.consumed.calories,
                                                            target: activePlan.caloricTarget,
                                                        })), children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "date" }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Line, { type: "monotone", dataKey: "calories", stroke: "#3B82F6", strokeWidth: 2, name: "Consumo" }), _jsx(Line, { type: "monotone", dataKey: "target", stroke: "#EF4444", strokeDasharray: "5 5", name: "Objetivo" })] }) })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-white rounded-lg shadow-sm p-6", children: [_jsxs("p", { className: "text-center mb-2", children: ["Objetivo del plan: ", activePlan.dailyProteins, " g de prote\u00EDnas"] }), _jsx("h3", { className: "text-xl font-semibold mb-4", children: "Consumo Diario de Prote\u00EDnas" }), _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(LineChart, { data: report.dailyData.map((day) => ({
                                                            date: new Date(day.date).toLocaleDateString(),
                                                            proteins: day.consumed.proteins,
                                                            target: activePlan.dailyProteins,
                                                        })), children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "date" }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Line, { type: "monotone", dataKey: "proteins", stroke: "#10B981", strokeWidth: 2, name: "Consumo" }), _jsx(Line, { type: "monotone", dataKey: "target", stroke: "#EF4444", strokeDasharray: "5 5", name: "Objetivo" })] }) })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-sm p-6", children: [_jsxs("p", { className: "text-center mb-2", children: ["Objetivo del plan: ", activePlan.dailyCarbs, " g de carbohidratos"] }), _jsx("h3", { className: "text-xl font-semibold mb-4", children: "Consumo Diario de Carbohidratos" }), _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(LineChart, { data: report.dailyData.map((day) => ({
                                                            date: new Date(day.date).toLocaleDateString(),
                                                            carbs: day.consumed.carbohydrates,
                                                            target: activePlan.dailyCarbs,
                                                        })), children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "date" }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Line, { type: "monotone", dataKey: "carbs", stroke: "#F59E0B", strokeWidth: 2, name: "Consumo" }), _jsx(Line, { type: "monotone", dataKey: "target", stroke: "#EF4444", strokeDasharray: "5 5", name: "Objetivo" })] }) })] })] }), _jsx("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: _jsxs("div", { className: "bg-white rounded-lg shadow-sm p-6", children: [_jsxs("p", { className: "text-center mb-2", children: ["Objetivo del plan: ", activePlan.dailyFats, " g de grasas"] }), _jsx("h3", { className: "text-xl font-semibold mb-4", children: "Consumo Diario de Grasas" }), _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(LineChart, { data: report.dailyData.map((day) => ({
                                                        date: new Date(day.date).toLocaleDateString(),
                                                        fats: day.consumed.fats,
                                                        target: activePlan.dailyFats,
                                                    })), children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "date" }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Line, { type: "monotone", dataKey: "fats", stroke: "#EF4444", strokeWidth: 2, name: "Consumo" }), _jsx(Line, { type: "monotone", dataKey: "target", stroke: "#3B82F6", strokeDasharray: "5 5", name: "Objetivo" })] }) })] }) }), _jsxs("div", { className: "bg-white rounded-lg shadow-sm p-6", children: [_jsx("h3", { className: "text-xl font-semibold mb-4", children: "Consumo Diario Detallado" }), _jsxs("div", { className: "mb-8", children: [_jsx("h4", { className: "text-lg font-medium mb-2 text-blue-600", children: "Calor\u00EDas" }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Fecha" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Consumo" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "% del objetivo" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: report.dailyData.map((day, index) => (_jsxs("tr", { children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: new Date(day.date).toLocaleDateString() }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: [day.consumed.calories.toFixed(1), " kcal"] }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: [day.percentages.calories.toFixed(1), "%"] })] }, index))) })] }) })] }), _jsxs("div", { className: "mb-8", children: [_jsx("h4", { className: "text-lg font-medium mb-2 text-green-600", children: "Prote\u00EDnas" }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Fecha" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Consumo" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "% del objetivo" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: report.dailyData.map((day, index) => (_jsxs("tr", { children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: new Date(day.date).toLocaleDateString() }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: [day.consumed.proteins.toFixed(1), " g"] }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: [day.percentages.proteins.toFixed(1), "%"] })] }, index))) })] }) })] }), _jsxs("div", { className: "mb-8", children: [_jsx("h4", { className: "text-lg font-medium mb-2 text-yellow-600", children: "Carbohidratos" }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Fecha" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Consumo" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "% del objetivo" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: report.dailyData.map((day, index) => (_jsxs("tr", { children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: new Date(day.date).toLocaleDateString() }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: [day.consumed.carbohydrates.toFixed(1), " g"] }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: [day.percentages.carbohydrates.toFixed(1), "%"] })] }, index))) })] }) })] }), _jsxs("div", { className: "mb-8", children: [_jsx("h4", { className: "text-lg font-medium mb-2 text-red-600", children: "Grasas" }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Fecha" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Consumo" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "% del objetivo" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: report.dailyData.map((day, index) => (_jsxs("tr", { children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: new Date(day.date).toLocaleDateString() }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: [day.consumed.fats.toFixed(1), " g"] }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: [day.percentages.fats.toFixed(1), "%"] })] }, index))) })] }) })] })] }), (report.comments.trainerComment || report.comments.nextSteps) && (_jsxs("div", { className: "bg-white rounded-lg shadow-sm p-6", children: [_jsx("h3", { className: "text-xl font-semibold mb-4", children: "Comentarios y Recomendaciones" }), report.comments.trainerComment && (_jsxs("div", { className: "mb-4", children: [_jsx("h4", { className: "font-medium text-gray-700 mb-2", children: "Comentarios del Nutricionista:" }), _jsx("p", { className: "text-gray-600 bg-gray-50 p-3 rounded-md", children: report.comments.trainerComment })] })), report.comments.nextSteps && (_jsxs("div", { children: [_jsx("h4", { className: "font-medium text-gray-700 mb-2", children: "Pr\u00F3ximos Pasos:" }), _jsx("p", { className: "text-gray-600 bg-blue-50 p-3 rounded-md", children: report.comments.nextSteps })] }))] }))] }))] }) }), _jsx(FooterPag, {})] }));
};
export default NutritionReportGenerator;
