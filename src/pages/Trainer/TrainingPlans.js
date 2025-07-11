"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Calendar, Plus, Dumbbell, ArrowLeft, Clock, Target, User, Mail, Phone, Trophy, Activity, Weight, RotateCcw, CalendarDays, } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FooterPag } from "../../components/Footer";
import { TrainerHeader } from "../../components/TrainerHeader";
import { useAuth } from "../../auth/hook/useAuth";
export default function TrainingPlanDetail() {
    const { clientDni } = useParams();
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [noPlans, setNoPlans] = useState(false);
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [clientInfo, setClientInfo] = useState(null);
    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            setError(null);
            setNoPlans(false);
            const token = localStorage.getItem("token");
            try {
                // 1️⃣ Obtener información del cliente
                const clientRes = await fetch(`http://localhost:8080/api/v1/clients/${clientDni}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!clientRes.ok) {
                    throw new Error("Error al cargar la información del cliente");
                }
                const clientData = await clientRes.json();
                setClientInfo({
                    name: clientData.name,
                    email: clientData.email,
                    phone: clientData.phoneNumber,
                    goal: clientData.goal,
                });
                // 2️⃣ Obtener plan de entrenamiento activo
                const plansRes = await fetch(`http://localhost:8080/api/v1/training-plans/clients/${clientDni}/active`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (plansRes.status === 404) {
                    setNoPlans(true);
                }
                else if (!plansRes.ok) {
                    throw new Error(`Error al cargar el plan (${plansRes.status})`);
                }
                else {
                    const raw = await plansRes.json();
                    console.log("Plan de entrenamiento activo:", raw);
                    const trainingPlan = {
                        ...raw,
                        exercises: raw.exercises ?? raw.exerciseRoutines ?? [],
                    };
                    if (!trainingPlan.exercises.length && !trainingPlan.active) {
                        setNoPlans(true);
                    }
                    else {
                        setPlan(trainingPlan);
                    }
                }
            }
            catch (err) {
                const msg = err instanceof Error ? err.message : "Error desconocido";
                setError(msg);
                toast.error(msg);
            }
            finally {
                setLoading(false);
            }
        }
        if (clientDni)
            fetchData();
    }, [clientDni]);
    const handleLogout = () => {
        logout();
        navigate("/");
    };
    const traducirDia = (day) => {
        const dias = {
            MONDAY: "Lunes",
            TUESDAY: "Martes",
            WEDNESDAY: "Miércoles",
            THURSDAY: "Jueves",
            FRIDAY: "Viernes",
            SATURDAY: "Sábado",
            SUNDAY: "Domingo",
        };
        return dias[day.toUpperCase()] || day; // en caso de que venga ya traducido o no exista
    };
    // Agrupar ejercicios por día
    const exercisesByDay = plan?.exercises.reduce((acc, exercise) => {
        const day = traducirDia(exercise.day || "Sin día asignado");
        if (!acc[day]) {
            acc[day] = [];
        }
        acc[day].push(exercise);
        return acc;
    }, {}) || {};
    const daysOrder = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
    const sortedDays = Object.keys(exercisesByDay).sort((a, b) => {
        const indexA = daysOrder.indexOf(a);
        const indexB = daysOrder.indexOf(b);
        if (indexA === -1 && indexB === -1)
            return a.localeCompare(b);
        if (indexA === -1)
            return 1;
        if (indexB === -1)
            return -1;
        return indexA - indexB;
    });
    // 🌀 Skeleton de carga
    if (loading) {
        return (_jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsxs("div", { className: "animate-pulse", children: [_jsx("div", { className: "h-8 bg-gray-200 rounded w-1/3 mb-6" }), _jsx("div", { className: "space-y-4", children: [1, 2, 3].map((i) => (_jsx("div", { className: "h-32 bg-gray-200 rounded-lg" }, i))) })] }), _jsx(ToastContainer, {})] }));
    }
    // ⚠️ Error inesperado
    if (error && !noPlans) {
        return (_jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsx("div", { className: "bg-red-50 border border-red-200 rounded-md p-4", children: _jsx("p", { className: "text-red-800", children: error }) }), _jsx(ToastContainer, {})] }));
    }
    // 📭 Sin planes de entrenamiento
    if (noPlans) {
        return (_jsxs(_Fragment, { children: [_jsx(TrainerHeader, { onLogout: handleLogout }), _jsx("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsx(ToastContainer, {}), _jsxs(Link, { to: "/trainer/dashboard", className: "inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 mb-6 group", children: [_jsx(ArrowLeft, { className: "h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" }), _jsx("span", { className: "font-medium", children: "Volver al dashboard" })] }), _jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent", children: "Plan Activo del Cliente" }), _jsx("div", { className: "bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-6", children: _jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("div", { className: "w-12 h-12 bg-gradient-to-br from-blue-500 to-pink-500 rounded-full flex items-center justify-center", children: _jsx("span", { className: "text-white font-bold text-lg", children: clientInfo?.name?.charAt(0)?.toUpperCase() || "C" }) }), _jsxs("div", { children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900", children: clientInfo?.name }), _jsxs("p", { className: "text-gray-600", children: ["DNI: ", _jsx("span", { className: "font-medium", children: clientDni })] })] })] }) }) }), _jsxs("div", { className: "bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-400 rounded-lg p-6 mb-8 shadow-md", children: [_jsxs("div", { className: "flex items-center mb-3", children: [_jsx("div", { className: "w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center mr-3", children: _jsx("span", { className: "text-white font-bold text-sm", children: "\uD83C\uDFAF" }) }), _jsx("h3", { className: "text-lg font-bold text-amber-800", children: "Objetivo Principal del Cliente" })] }), _jsx("p", { className: "text-amber-900 text-lg font-medium leading-relaxed", children: clientInfo?.goal || "No se ha definido un objetivo específico" })] })] }), _jsxs("div", { className: "bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden", children: [_jsx("div", { className: "bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-200", children: _jsxs("h3", { className: "text-lg font-semibold text-gray-900 flex items-center", children: [_jsx(Dumbbell, { className: "h-5 w-5 mr-2 text-blue-600" }), "Estado del Plan de Entrenamiento"] }) }), _jsxs("div", { className: "text-center py-16 px-6", children: [_jsxs("div", { className: "relative mb-8", children: [_jsx("div", { className: "w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg", children: _jsx(Dumbbell, { className: "h-12 w-12 text-gray-500" }) }), _jsx("div", { className: "absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center", children: _jsx("span", { className: "text-white font-bold text-sm", children: "!" }) })] }), _jsx("h3", { className: "text-2xl font-bold text-gray-900 mb-4", children: "No se encontr\u00F3 un plan de entrenamiento activo" }), _jsx("p", { className: "text-gray-600 mb-8 max-w-md mx-auto text-lg", children: "Este cliente a\u00FAn no tiene un plan de entrenamiento activo asignado." }), _jsxs(Link, { to: `/trainer/client/${clientDni}/training-plans/new/edit`, className: "inline-flex items-center bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200", onClick: () => toast.info("Creando primer plan de entrenamiento"), children: [_jsx(Plus, { className: "h-5 w-5 mr-3" }), "Crear Plan de Entrenamiento"] })] })] })] }) }), _jsx(FooterPag, {})] }));
    }
    // ✅ Mostrar plan activo completo
    return (_jsxs(_Fragment, { children: [_jsx(TrainerHeader, { onLogout: handleLogout }), _jsx("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsx(ToastContainer, {}), _jsxs("div", { className: "flex justify-between items-center mb-8", children: [_jsxs(Link, { to: "/trainer/dashboard", className: "flex items-center text-blue-600 hover:underline", children: [_jsx(ArrowLeft, { className: "h-5 w-5 mr-1" }), "Volver al dashboard"] }), _jsxs("div", { className: "flex space-x-4", children: [_jsxs(Link, { to: `/trainer/client/${clientDni}/training-plans/new/edit`, className: "bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-md flex items-center", onClick: () => toast.info("Creando nuevo plan"), children: [_jsx(Plus, { className: "h-4 w-4 mr-2" }), "Crear nuevo plan"] }), _jsxs(Link, { to: `/trainer/client/${clientDni}/history`, onClick: () => toast.info(`Viendo progreso del cliente`), className: "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center", children: [_jsx(Activity, { className: "w-4 h-4 mr-2" }), "Ver Historial del cliente"] })] })] }), _jsx("div", { className: "mb-8", children: _jsx("h1", { className: "text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent", children: "Plan Activo del Cliente" }) }), _jsxs("div", { className: "bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("div", { className: "w-16 h-16 bg-gradient-to-br from-blue-500 to-pink-500 rounded-full flex items-center justify-center", children: _jsx("span", { className: "text-white font-bold text-xl", children: clientInfo?.name?.charAt(0)?.toUpperCase() || "C" }) }), _jsxs("div", { children: [_jsxs("h2", { className: "text-2xl font-semibold text-gray-900 flex items-center", children: [_jsx(User, { className: "h-5 w-5 mr-2 text-blue-600" }), clientInfo?.name] }), _jsxs("p", { className: "text-gray-600", children: ["DNI: ", clientDni] })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("p", { className: "flex items-center text-gray-700", children: [_jsx(Mail, { className: "h-4 w-4 mr-2 text-blue-600" }), clientInfo?.email] }), _jsxs("p", { className: "flex items-center text-gray-700", children: [_jsx(Phone, { className: "h-4 w-4 mr-2 text-blue-600" }), clientInfo?.phone] })] })] }), _jsxs("div", { className: "mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-400 rounded-lg", children: [_jsxs("div", { className: "flex items-center mb-2", children: [_jsx(Target, { className: "h-5 w-5 mr-2 text-amber-600" }), _jsx("h3", { className: "text-lg font-semibold text-amber-800", children: "Objetivo Principal" })] }), _jsx("p", { className: "text-amber-900 font-medium", children: clientInfo?.goal })] })] }), plan && (_jsxs("div", { className: "bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("h2", { className: "text-2xl font-bold text-gray-900 flex items-center", children: [_jsx(Trophy, { className: "h-6 w-6 mr-2 text-green-600" }), plan.name] }), _jsx("span", { className: "px-4 py-2 bg-green-100 text-green-800 rounded-full font-semibold", children: "Plan Activo" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-6", children: [_jsxs("div", { className: "flex items-center p-4 bg-blue-50 rounded-lg", children: [_jsx(Calendar, { className: "h-8 w-8 text-blue-600 mr-3" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Fecha de creaci\u00F3n" }), _jsx("p", { className: "font-semibold", children: new Date(plan.createdAt).toLocaleDateString("es-ES") })] })] }), _jsxs("div", { className: "flex items-center p-4 bg-pink-50 rounded-lg", children: [_jsx(Dumbbell, { className: "h-8 w-8 text-pink-600 mr-3" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Total ejercicios" }), _jsx("p", { className: "font-semibold", children: plan.exercises.length })] })] }), _jsxs("div", { className: "flex items-center p-4 bg-purple-50 rounded-lg", children: [_jsx(CalendarDays, { className: "h-8 w-8 text-purple-600 mr-3" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "D\u00EDas de entrenamiento" }), _jsx("p", { className: "font-semibold", children: Object.keys(exercisesByDay).length })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "p-4 bg-gray-50 rounded-lg", children: [_jsx("h4", { className: "font-semibold text-gray-900 mb-2", children: "Especializaci\u00F3n del Entrenador" }), _jsx("p", { className: "text-gray-700", children: plan.trainerSpecification })] }), _jsxs("div", { className: "p-4 bg-gray-50 rounded-lg", children: [_jsx("h4", { className: "font-semibold text-gray-900 mb-2", children: "Entrenador Asignado" }), _jsx("p", { className: "text-gray-700", children: plan.trainerName })] })] }), _jsxs("div", { className: "mt-6 grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsx(Link, { to: `/trainer/client/${clientDni}/training-plans/${plan.id}/edit`, onClick: () => toast.info(`Editando plan: ${plan.name}`), children: _jsx("button", { className: "w-full bg-blue-900 hover:bg-blue-800 text-white py-3 rounded-lg font-semibold transition-colors", children: "Editar Ejercicios" }) }), _jsx(Link, { to: `/trainer/client/${clientDni}/progress`, onClick: () => toast.info(`Viendo progreso del cliente`), children: _jsx("button", { className: "w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors", children: "Ver Progreso De Entrenamiento" }) }), _jsx(Link, { to: `/trainer/client/${clientDni}/training-plans/report`, onClick: () => toast.info(`Creando informe de progreso`), children: _jsx("button", { className: "w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition-colors", children: "Crear Informe" }) })] })] })), plan && (_jsxs("div", { className: "space-y-6", children: [_jsxs("h2", { className: "text-2xl font-bold text-gray-900 mb-6 flex items-center", children: [_jsx(Dumbbell, { className: "h-6 w-6 mr-2 text-blue-600" }), "Rutinas de Ejercicios"] }), sortedDays.map((day) => (_jsxs("div", { className: "bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden", children: [_jsx("div", { className: "bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4", children: _jsxs("h3", { className: "text-xl font-bold text-black flex items-center", children: [_jsx(CalendarDays, { className: "h-5 w-5 mr-2" }), day, _jsxs("span", { className: "ml-auto bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm", children: [exercisesByDay[day].length, " ejercicios"] })] }) }), _jsx("div", { className: "p-6", children: _jsx("div", { className: "grid gap-4", children: exercisesByDay[day].map((exercise, index) => (_jsxs("div", { className: "border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow", children: [_jsx("div", { className: "flex items-start justify-between mb-3", children: _jsxs("h4", { className: "text-lg font-semibold text-gray-900 flex items-center", children: [_jsx("span", { className: "w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3", children: index + 1 }), exercise.exerciseName] }) }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 text-sm", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(Activity, { className: "h-4 w-4 text-green-600 mr-2" }), _jsxs("div", { children: [_jsx("p", { className: "text-gray-600", children: "Series" }), _jsx("p", { className: "font-semibold", children: exercise.series })] })] }), _jsxs("div", { className: "flex items-center", children: [_jsx(RotateCcw, { className: "h-4 w-4 text-blue-600 mr-2" }), _jsxs("div", { children: [_jsx("p", { className: "text-gray-600", children: "Repeticiones" }), _jsx("p", { className: "font-semibold", children: exercise.repetitions })] })] }), _jsxs("div", { className: "flex items-center", children: [_jsx(Weight, { className: "h-4 w-4 text-purple-600 mr-2" }), _jsxs("div", { children: [_jsx("p", { className: "text-gray-600", children: "Peso" }), _jsx("p", { className: "font-semibold", children: exercise.weight ? `${exercise.weight} kg` : "Sin peso" })] })] }), _jsxs("div", { className: "flex items-center", children: [_jsx(Clock, { className: "h-4 w-4 text-orange-600 mr-2" }), _jsxs("div", { children: [_jsx("p", { className: "text-gray-600", children: "Descanso" }), _jsx("p", { className: "font-semibold", children: exercise.restTime })] })] })] })] }, exercise.id || index))) }) })] }, day)))] }))] }) }), _jsx(FooterPag, {})] }));
}
