"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FooterPag } from "../../components/Footer";
import { ClientHeader } from "../../components/ClientHeader";
import { useAuth } from "../../auth/hook/useAuth";
import { Calendar, Download, Dumbbell, Clock, Hash, Weight, FileText, Activity } from "lucide-react";
const TrainingPlanPage = () => {
    const [trainingPlan, setTrainingPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const navigate = useNavigate();
    const { logout } = useAuth();
    const exercisesByDay = {
        MONDAY: [],
        TUESDAY: [],
        WEDNESDAY: [],
        THURSDAY: [],
        FRIDAY: [],
        SATURDAY: [],
        SUNDAY: [],
    };
    useEffect(() => {
        const fetchTrainingPlan = async () => {
            try {
                const clientDni = localStorage.getItem("userDni");
                const token = localStorage.getItem("token");
                if (!clientDni) {
                    throw new Error("No se encontró el DNI del cliente en el almacenamiento local");
                }
                const response = await fetch(`http://localhost:8080/api/v1/training-plans/clients/${clientDni}/active`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
                const data = await response.json();
                setTrainingPlan(data);
            }
            catch (err) {
                setError(err instanceof Error ? err.message : "Ocurrió un error desconocido");
            }
            finally {
                setLoading(false);
            }
        };
        fetchTrainingPlan();
    }, []);
    if (trainingPlan) {
        trainingPlan.exerciseRoutines?.forEach((exercise) => {
            if (exercisesByDay[exercise.day]) {
                exercisesByDay[exercise.day].push(exercise);
            }
        });
    }
    const dayNames = {
        MONDAY: "Lunes",
        TUESDAY: "Martes",
        WEDNESDAY: "Miércoles",
        THURSDAY: "Jueves",
        FRIDAY: "Viernes",
        SATURDAY: "Sábado",
        SUNDAY: "Domingo",
    };
    const dayIcons = {
        MONDAY: "💪",
        TUESDAY: "🔥",
        WEDNESDAY: "⚡",
        THURSDAY: "🎯",
        FRIDAY: "🚀",
        SATURDAY: "💯",
        SUNDAY: "🌟",
    };
    const handleLogout = () => {
        logout();
        navigate("/");
    };
    const generatePDF = async () => {
        if (!trainingPlan)
            return;
        setIsDownloading(true);
        try {
            // Crear el contenido HTML para el PDF
            const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>${trainingPlan.name}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 20px; 
              color: #333;
              line-height: 1.6;
            }
            .header { 
              text-align: center; 
              margin-bottom: 30px; 
              border-bottom: 2px solid #3b82f6;
              padding-bottom: 20px;
            }
            .plan-title { 
              font-size: 28px; 
              font-weight: bold; 
              color: #1f2937;
              margin-bottom: 10px;
            }
            .plan-info { 
              color: #6b7280; 
              font-size: 14px;
            }
            .day-section { 
              margin-bottom: 25px; 
              page-break-inside: avoid;
            }
            .day-title { 
              font-size: 20px; 
              font-weight: bold; 
              color: #3b82f6;
              margin-bottom: 15px;
              padding: 10px;
              background-color: #f3f4f6;
              border-left: 4px solid #3b82f6;
            }
            .exercise { 
              margin-bottom: 15px; 
              padding: 12px;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              background-color: #fafafa;
            }
            .exercise-name { 
              font-weight: bold; 
              font-size: 16px;
              color: #1f2937;
              margin-bottom: 8px;
            }
            .exercise-details { 
              display: grid; 
              grid-template-columns: repeat(4, 1fr); 
              gap: 10px;
              font-size: 14px;
            }
            .detail-item {
              background-color: white;
              padding: 6px 8px;
              border-radius: 4px;
              border: 1px solid #e5e7eb;
            }
            .detail-label {
              font-weight: bold;
              color: #374151;
            }
            .no-exercises {
              color: #9ca3af;
              font-style: italic;
              text-align: center;
              padding: 20px;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              font-size: 12px;
              color: #6b7280;
              border-top: 1px solid #e5e7eb;
              padding-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="plan-title">${trainingPlan.name}</div>
            <div class="plan-info">
              Cliente: ${trainingPlan.clientName}<br>
              Creado el: ${new Date(trainingPlan.createdAt).toLocaleDateString()}<br>
              Estado: ${trainingPlan.active ? "Activo" : "Inactivo"}
            </div>
          </div>
          
          ${Object.entries(exercisesByDay)
                .map(([day, exercises]) => `
            <div class="day-section">
              <div class="day-title">${dayNames[day]}</div>
              ${exercises.length > 0
                ? exercises
                    .map((exercise) => `
                  <div class="exercise">
                    <div class="exercise-name">${exercise.exerciseName}</div>
                    <div class="exercise-details">
                      <div class="detail-item">
                        <span class="detail-label">Series:</span> ${exercise.series}
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">Repeticiones:</span> ${exercise.repetitions}
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">Peso:</span> ${exercise.weight} kg
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">Descanso:</span> ${exercise.restTime}
                      </div>
                    </div>
                  </div>
                `)
                    .join("")
                : '<div class="no-exercises">No hay ejercicios programados para este día</div>'}
            </div>
          `)
                .join("")}
        </body>
        </html>
      `;
            // Crear un blob con el contenido HTML
            const blob = new Blob([htmlContent], { type: "text/html" });
            const url = URL.createObjectURL(blob);
            // Crear un enlace temporal para descargar
            const link = document.createElement("a");
            link.href = url;
            link.download = `plan-entrenamiento-${trainingPlan.name.replace(/\s+/g, "-").toLowerCase()}.html`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            // Limpiar la URL del objeto
            URL.revokeObjectURL(url);
        }
        catch (error) {
            console.error("Error al generar el PDF:", error);
            alert("Error al generar el archivo. Por favor, inténtalo nuevamente.");
        }
        finally {
            setIsDownloading(false);
        }
    };
    if (loading) {
        return (_jsxs("div", { className: "flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" }), _jsx(Dumbbell, { className: "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-blue-600" })] }), _jsx("p", { className: "mt-6 text-lg text-gray-700 font-medium", children: "Cargando tu plan de entrenamiento..." })] }));
    }
    if (!trainingPlan) {
        return (_jsx("div", { className: "flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 text-center", children: _jsxs("div", { className: "max-w-md", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-700 mb-4", children: "No tienes un plan de entrenamiento activo" }), _jsx("p", { className: "text-gray-600 mb-6", children: "Tu entrenador est\u00E1 en proceso de realizar tu plan a medida, por favor espera!" }), _jsx("button", { onClick: () => navigate('/client'), className: "px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors", children: "Volver al inicio" })] }) }));
    }
    if (!trainingPlan) {
        return (_jsx("div", { className: "flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 p-4", children: _jsxs("div", { className: "bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center", children: [_jsx("div", { className: "w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4", children: _jsx(Calendar, { className: "w-8 h-8 text-yellow-600" }) }), _jsx("h2", { className: "text-2xl font-bold text-gray-800 mb-4", children: "Plan en preparaci\u00F3n" }), _jsx("p", { className: "text-gray-600 leading-relaxed", children: "Tu entrenador est\u00E1 creando un plan personalizado especialmente para ti. \u00A1Pronto tendr\u00E1s tu rutina lista para comenzar!" })] }) }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col", children: [_jsx(ClientHeader, { fullName: trainingPlan.clientName, onLogout: handleLogout }), _jsx("nav", { className: "bg-white shadow-sm border-b", children: _jsxs("ul", { className: "container mx-auto px-4 flex", children: [_jsx("li", { className: "flex-1 text-center hover:bg-gray-50 transition-colors", children: _jsx("button", { onClick: () => navigate("/client"), className: "w-full py-4 font-medium text-gray-600 hover:text-gray-900 transition-colors", children: "Inicio" }) }), _jsx("li", { className: "flex-1 text-center border-b-4 border-blue-500 bg-blue-50", children: _jsx("button", { className: "w-full py-4 font-medium text-blue-600", children: "Plan de Entrenamiento" }) }), _jsx("li", { className: "flex-1 text-center hover:bg-gray-50 transition-colors", children: _jsx("button", { onClick: () => navigate("/client/nutrition-plan"), className: "w-full py-4 font-medium text-gray-600 hover:text-gray-900 transition-colors", children: "Plan de Nutrici\u00F3n" }) })] }) }), _jsxs("main", { className: "flex-grow container mx-auto px-4 py-8", children: [_jsx("div", { className: "bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100", children: _jsxs("div", { className: "flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsx("div", { className: "w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center", children: _jsx(Dumbbell, { className: "w-5 h-5 text-blue-600" }) }), _jsx("h2", { className: "text-2xl font-bold text-gray-800", children: trainingPlan.name })] }), _jsxs("div", { className: "flex items-center gap-4 text-sm text-gray-600", children: [_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Calendar, { className: "w-4 h-4" }), _jsxs("span", { children: ["Creado el ", new Date(trainingPlan.createdAt).toLocaleDateString()] })] }), _jsx("div", { className: `px-3 py-1 rounded-full text-xs font-medium ${trainingPlan.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`, children: trainingPlan.active ? "Activo" : "Inactivo" })] })] }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [_jsxs("button", { className: "flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg", onClick: () => navigate(`${trainingPlan.id}/records`), children: [_jsx(FileText, { className: "w-4 h-4" }), _jsx("span", { className: "font-medium", children: "Registrar entrenamiento" })] }), _jsxs("button", { className: `flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-blue-300 hover:text-blue-700 transition-all ${isDownloading ? "opacity-50 cursor-not-allowed" : "hover:shadow-md"}`, onClick: generatePDF, disabled: isDownloading, children: [_jsx(Download, { className: `w-4 h-4 ${isDownloading ? "animate-bounce" : ""}` }), _jsx("span", { className: "font-medium", children: isDownloading ? "Generando..." : "Descargar rutina" })] })] })] }) }), _jsxs("div", { className: "mb-8", children: [_jsxs("div", { className: "flex items-center gap-3 mb-6", children: [_jsx("div", { className: "w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center", children: _jsx(Calendar, { className: "w-4 h-4 text-white" }) }), _jsx("h3", { className: "text-xl font-bold text-gray-800", children: "Rutina Semanal" })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6", children: Object.entries(exercisesByDay).map(([day, exercises]) => (_jsxs("div", { className: "bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow", children: [_jsxs("div", { className: "bg-gradient-to-r from-blue-500 to-blue-600 p-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h4", { className: "font-bold text-white text-lg", children: dayNames[day] }), _jsx("span", { className: "text-2xl", children: dayIcons[day] })] }), _jsxs("p", { className: "text-blue-100 text-sm mt-1", children: [exercises.length, " ejercicio", exercises.length !== 1 ? "s" : ""] })] }), _jsx("div", { className: "p-4", children: exercises.length > 0 ? (_jsx("div", { className: "space-y-4", children: exercises.map((exercise, index) => (_jsxs("div", { className: "border border-gray-100 rounded-lg p-4 hover:border-blue-200 transition-colors", children: [_jsxs("h5", { className: "font-semibold text-gray-800 mb-3 flex items-center gap-2", children: [_jsx("div", { className: "w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600", children: index + 1 }), exercise.exerciseName] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { className: "flex items-center gap-2 text-sm", children: [_jsx(Hash, { className: "w-4 h-4 text-gray-400" }), _jsx("span", { className: "text-gray-600", children: "Series:" }), _jsx("span", { className: "font-medium text-gray-800", children: exercise.series })] }), _jsxs("div", { className: "flex items-center gap-2 text-sm", children: [_jsx(Activity, { className: "w-4 h-4 text-gray-400" }), _jsx("span", { className: "text-gray-600", children: "Reps:" }), _jsx("span", { className: "font-medium text-gray-800", children: exercise.repetitions })] }), _jsxs("div", { className: "flex items-center gap-2 text-sm", children: [_jsx(Weight, { className: "w-4 h-4 text-gray-400" }), _jsx("span", { className: "text-gray-600", children: "Peso:" }), _jsxs("span", { className: "font-medium text-gray-800", children: [exercise.weight, " kg"] })] }), _jsxs("div", { className: "flex items-center gap-2 text-sm", children: [_jsx(Clock, { className: "w-4 h-4 text-gray-400" }), _jsx("span", { className: "text-gray-600", children: "Descanso:" }), _jsx("span", { className: "font-medium text-gray-800", children: exercise.restTime })] })] })] }, exercise.routineId))) })) : (_jsxs("div", { className: "text-center py-8", children: [_jsx("div", { className: "w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3", children: _jsx(Calendar, { className: "w-6 h-6 text-gray-400" }) }), _jsx("p", { className: "text-gray-500 text-sm", children: "D\u00EDa de descanso" })] })) })] }, day))) })] })] }), _jsx(FooterPag, {})] }));
};
export default TrainingPlanPage;
