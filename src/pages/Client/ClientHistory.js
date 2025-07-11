"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FooterPag } from "../../components/Footer";
import { FiTarget, FiCalendar, FiUser, FiActivity, FiHeart, FiClipboard, FiBook, FiChevronLeft, FiChevronRight, } from "react-icons/fi";
// Utility function to get today's date in YYYY-MM-DD format
// Función utilitaria para obtener la fecha local en formato YYYY-MM-DD
const getLocalISODate = (date) => {
    const d = new Date(date);
    // Ajustamos la fecha según la zona horaria local
    const offset = d.getTimezoneOffset() * 60000; // offset en milisegundos
    const localDate = new Date(d.getTime() - offset);
    return localDate.toISOString().split('T')[0];
};
// Función utilitaria para verificar coincidencia de fechas
const isDateMatch = (recordDate, selectedDate) => {
    const recordDateOnly = getLocalISODate(recordDate);
    return recordDateOnly === selectedDate;
};
// Función para obtener la fecha actual en formato YYYY-MM-DD (local)
const getTodayDate = () => {
    return getLocalISODate(new Date());
};
const DateNavigation = ({ selectedDate, onDateChange }) => {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const dateInputRef = useRef(null);
    const formatDisplayDate = (dateString) => {
        const date = new Date(dateString);
        const offset = date.getTimezoneOffset() * 60000;
        const adjustedDate = new Date(date.getTime() + offset);
        return adjustedDate.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };
    const handlePreviousDay = () => {
        const previousDate = new Date(selectedDate);
        previousDate.setDate(previousDate.getDate() - 1);
        onDateChange(previousDate.toISOString().split('T')[0]);
    };
    const handleNextDay = () => {
        const nextDate = new Date(selectedDate);
        nextDate.setDate(nextDate.getDate() + 1);
        const nextDateStr = nextDate.toISOString().split('T')[0];
        const todayStr = getTodayDate();
        if (nextDateStr <= todayStr) {
            onDateChange(nextDateStr);
        }
    };
    const isNextDisabled = () => {
        const nextDate = new Date(selectedDate);
        nextDate.setDate(nextDate.getDate() + 1);
        return nextDate.toISOString().split('T')[0] > getTodayDate();
    };
    const handleDateChange = (e) => {
        onDateChange(e.target.value);
        setShowDatePicker(false);
    };
    const toggleDatePicker = () => {
        setShowDatePicker(!showDatePicker);
    };
    return (_jsx("div", { className: "mb-4", children: _jsxs("div", { className: "flex items-center justify-between p-3 bg-gray-50 rounded-lg", children: [_jsxs("button", { onClick: handlePreviousDay, className: "flex items-center px-3 py-2 rounded-lg transition-colors bg-blue-500 text-white hover:bg-blue-600", children: [_jsx(FiChevronLeft, { className: "mr-1" }), "D\u00EDa Anterior"] }), _jsxs("div", { className: "relative", children: [_jsxs("button", { onClick: toggleDatePicker, className: "flex items-center px-3 py-2 rounded-lg transition-colors bg-gray-200 text-gray-700 hover:bg-gray-300", children: [_jsx(FiCalendar, { className: "mr-2" }), _jsx("span", { className: "text-sm font-medium", children: formatDisplayDate(selectedDate) })] }), showDatePicker && (_jsx("div", { className: "absolute mt-1 z-10 bg-white p-2 rounded-lg shadow-lg border border-gray-200", children: _jsx("input", { type: "date", ref: dateInputRef, value: selectedDate, onChange: handleDateChange, className: "block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500", max: getTodayDate() }) }))] }), _jsxs("button", { onClick: handleNextDay, disabled: isNextDisabled(), className: `flex items-center px-3 py-2 rounded-lg transition-colors ${isNextDisabled()
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600'}`, children: ["D\u00EDa Siguiente", _jsx(FiChevronRight, { className: "ml-1" })] })] }) }));
};
const TrainingPlanCard = ({ plan }) => {
    const groupByDay = (routines) => {
        return routines.reduce((acc, routine) => {
            const day = routine.day.toUpperCase();
            if (!acc[day])
                acc[day] = [];
            acc[day].push(routine);
            return acc;
        }, {});
    };
    const routinesByDay = groupByDay(plan.exerciseRoutines || []);
    const dayOrder = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
    const dayLabels = {
        MONDAY: "Lunes",
        TUESDAY: "Martes",
        WEDNESDAY: "Miércoles",
        THURSDAY: "Jueves",
        FRIDAY: "Viernes",
        SATURDAY: "Sábado",
        SUNDAY: "Domingo",
    };
    return (_jsxs("div", { className: "bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg", children: [_jsx("div", { className: "bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white", children: _jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-bold text-xl", children: plan.name }), _jsxs("p", { className: "text-blue-100 text-sm opacity-90", children: ["Creado el ", new Date(plan.createdAt).toLocaleDateString()] })] }), _jsx("span", { className: `px-3 py-1 text-xs rounded-full font-semibold ${plan.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`, children: plan.active ? "Activo" : "Inactivo" })] }) }), _jsx("div", { className: "p-4 border-b border-gray-100", children: _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("div", { className: "flex-shrink-0 bg-indigo-100 p-2 rounded-full", children: _jsx(FiUser, { className: "text-indigo-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "font-medium text-gray-900", children: plan.trainerName }), _jsx("p", { className: "text-sm text-gray-500", children: plan.trainerSpecification })] })] }) }), _jsx("div", { className: "p-4 bg-blue-50 border-b border-blue-100", children: _jsxs("div", { className: "flex items-start", children: [_jsx(FiTarget, { className: "flex-shrink-0 text-blue-500 mt-0.5 mr-2" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-semibold text-blue-800", children: "Objetivo del cliente:" }), _jsx("p", { className: "text-gray-700", children: plan.clientGoal })] })] }) }), plan.exerciseRoutines?.length > 0 && (_jsxs("div", { className: "p-4", children: [_jsxs("div", { className: "flex items-center mb-4 text-indigo-700", children: [_jsx(FiActivity, { className: "mr-2" }), _jsx("h5", { className: "font-semibold text-lg", children: "Rutinas de Ejercicios" }), _jsxs("span", { className: "ml-auto bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full", children: [plan.exerciseRoutines.length, " ejercicios"] })] }), _jsx("div", { className: "space-y-4", children: dayOrder.map((day) => (routinesByDay[day]?.length > 0 && (_jsxs("div", { className: "border border-gray-200 rounded-lg overflow-hidden", children: [_jsx("div", { className: "bg-gray-50 px-4 py-2 border-b border-gray-200", children: _jsxs("h6", { className: "font-medium text-gray-800 flex items-center", children: [_jsx(FiCalendar, { className: "mr-2 text-indigo-500" }), dayLabels[day] || day] }) }), _jsx("ul", { className: "divide-y divide-gray-200", children: routinesByDay[day].map((routine, index) => (_jsxs("li", { className: "p-3 hover:bg-gray-50 transition-colors", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("p", { className: "font-medium text-gray-900", children: routine.exerciseName }), _jsxs("div", { className: "flex space-x-3 text-xs text-gray-500", children: [_jsxs("span", { className: "bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full", children: [routine.series, " series"] }), _jsxs("span", { className: "bg-green-100 text-green-800 px-2 py-0.5 rounded-full", children: [routine.repetitions, " repes"] }), routine.weight && (_jsxs("span", { className: "bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full", children: [routine.weight, " kg"] }))] })] }), routine.restTime && (_jsxs("p", { className: "text-xs text-gray-500 mt-1", children: [_jsx("span", { className: "font-medium", children: "Descanso:" }), " ", routine.restTime] }))] }, index))) })] }, day)))) })] }))] }));
};
const TrainingRecordsContent = ({ trainingRecords, selectedDate, onDateChange }) => (_jsxs("div", { children: [_jsx(DateNavigation, { selectedDate: selectedDate, onDateChange: onDateChange }), trainingRecords.length > 0 ? (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200 text-sm", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase", children: "Hora" }), _jsx("th", { className: "px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase", children: "Ejercicio" }), _jsx("th", { className: "px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase", children: "Series" }), _jsx("th", { className: "px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase", children: "Reps" }), _jsx("th", { className: "px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase", children: "Peso" }), _jsx("th", { className: "px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase", children: "Descanso" }), _jsx("th", { className: "px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase", children: "Observaci\u00F3n" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: trainingRecords.map((record) => (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsx("td", { className: "px-3 py-2 text-gray-600", children: new Date(record.createdAt).toLocaleTimeString() }), _jsx("td", { className: "px-3 py-2 text-gray-900 font-medium", children: record.exerciseName || "-" }), _jsx("td", { className: "px-3 py-2 text-gray-600", children: record.series }), _jsx("td", { className: "px-3 py-2 text-gray-600", children: record.repetitions }), _jsxs("td", { className: "px-3 py-2 text-gray-600", children: [record.weight, " kg"] }), _jsx("td", { className: "px-3 py-2 text-gray-600", children: record.restTime || "-" }), _jsx("td", { className: "px-3 py-2 text-gray-600", children: record.observation || "-" })] }, record.id))) })] }) })) : (_jsxs("div", { className: "text-center py-8", children: [_jsx(FiCalendar, { className: "mx-auto text-4xl text-gray-400 mb-2" }), _jsx("p", { className: "text-gray-600", children: "No hay registros de entrenamiento para esta fecha" })] }))] }));
const PaginationControls = ({ currentIndex, totalItems, onPrevious, onNext, itemName }) => (_jsxs("div", { className: "flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg", children: [_jsxs("button", { onClick: onPrevious, disabled: currentIndex === 0, className: `flex items-center px-3 py-2 rounded-lg transition-colors ${currentIndex === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'}`, children: [_jsx(FiChevronLeft, { className: "mr-1" }), "Anterior"] }), _jsx("div", { className: "flex items-center space-x-2", children: _jsxs("span", { className: "text-sm text-gray-600", children: [itemName, " ", currentIndex + 1, " de ", totalItems] }) }), _jsxs("button", { onClick: onNext, disabled: currentIndex === totalItems - 1, className: `flex items-center px-3 py-2 rounded-lg transition-colors ${currentIndex === totalItems - 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'}`, children: ["Siguiente", _jsx(FiChevronRight, { className: "ml-1" })] })] }));
const TrainingPlansContent = ({ trainingPlans, currentPlan, setCurrentPlan }) => {
    if (trainingPlans.length === 0) {
        return _jsx("p", { className: "text-gray-600 text-center py-4", children: "No hay planes de entrenamiento" });
    }
    const handlePrevious = () => {
        if (currentPlan > 0) {
            setCurrentPlan(currentPlan - 1);
        }
    };
    const handleNext = () => {
        if (currentPlan < trainingPlans.length - 1) {
            setCurrentPlan(currentPlan + 1);
        }
    };
    return (_jsxs("div", { children: [_jsx(PaginationControls, { currentIndex: currentPlan, totalItems: trainingPlans.length, onPrevious: handlePrevious, onNext: handleNext, itemName: "Plan" }), _jsx(TrainingPlanCard, { plan: trainingPlans[currentPlan] })] }));
};
const NutritionPlanCard = ({ plan }) => (_jsxs("div", { className: "bg-white border rounded-lg p-4 shadow-sm", children: [_jsxs("div", { className: "flex justify-between items-start mb-3", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-bold text-lg text-gray-800", children: plan.name }), _jsxs("p", { className: "text-sm text-gray-600", children: ["Creado el: ", new Date(plan.createdAt).toLocaleDateString()] }), _jsxs("p", { className: "text-sm text-gray-600", children: ["Actualizado el: ", new Date(plan.updatedAt).toLocaleDateString()] })] }), _jsx("span", { className: `px-2 py-1 text-xs rounded-full ${plan.active ? "bg-green-200 text-green-800" : "bg-gray-200 text-gray-800"}`, children: plan.active ? "Activo" : "Inactivo" })] }), _jsxs("p", { className: "text-sm mb-4", children: [_jsx("span", { className: "font-semibold text-gray-700", children: "Nutricionista:" }), " ", plan.nutritionistName] }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3 mb-4", children: [_jsxs("div", { className: "bg-orange-50 p-3 rounded-lg text-center", children: [_jsx(FiTarget, { className: "mx-auto mb-1 text-orange-600" }), _jsx("p", { className: "text-xs text-orange-700", children: "Meta cal\u00F3rica" }), _jsx("p", { className: "font-bold text-orange-900", children: plan.caloricTarget }), _jsx("p", { className: "text-xs text-orange-700", children: "kcal" })] }), _jsxs("div", { className: "bg-orange-50 p-3 rounded-lg text-center", children: [_jsx("p", { className: "text-xs text-orange-700", children: "Carbohidratos" }), _jsx("p", { className: "font-bold text-orange-900", children: plan.dailyCarbs }), _jsx("p", { className: "text-xs text-orange-700", children: "gramos" })] }), _jsxs("div", { className: "bg-orange-50 p-3 rounded-lg text-center", children: [_jsx("p", { className: "text-xs text-orange-700", children: "Prote\u00EDnas" }), _jsx("p", { className: "font-bold text-orange-900", children: plan.dailyProteins }), _jsx("p", { className: "text-xs text-orange-700", children: "gramos" })] }), _jsxs("div", { className: "bg-orange-50 p-3 rounded-lg text-center", children: [_jsx("p", { className: "text-xs text-orange-700", children: "Grasas" }), _jsx("p", { className: "font-bold text-orange-900", children: plan.dailyFats }), _jsx("p", { className: "text-xs text-orange-700", children: "gramos" })] })] }), _jsxs("div", { className: "bg-gray-50 p-3 rounded-lg", children: [_jsx("p", { className: "text-sm font-semibold mb-2 text-gray-700", children: "Recomendaciones:" }), _jsx("p", { className: "text-sm text-gray-600", children: plan.recommendations })] })] }));
const NutritionPlansContent = ({ nutritionPlans, currentPlan, setCurrentPlan }) => {
    if (nutritionPlans.length === 0) {
        return _jsx("p", { className: "text-gray-600 text-center py-4", children: "No hay planes de nutrici\u00F3n" });
    }
    const handlePrevious = () => {
        if (currentPlan > 0) {
            setCurrentPlan(currentPlan - 1);
        }
    };
    const handleNext = () => {
        if (currentPlan < nutritionPlans.length - 1) {
            setCurrentPlan(currentPlan + 1);
        }
    };
    return (_jsxs("div", { children: [_jsx(PaginationControls, { currentIndex: currentPlan, totalItems: nutritionPlans.length, onPrevious: handlePrevious, onNext: handleNext, itemName: "Plan" }), _jsx(NutritionPlanCard, { plan: nutritionPlans[currentPlan] })] }));
};
const NutritionRecordsContent = ({ nutritionRecords, selectedDate, onDateChange }) => (_jsxs("div", { children: [_jsx(DateNavigation, { selectedDate: selectedDate, onDateChange: onDateChange }), nutritionRecords.length > 0 ? (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200 text-sm", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase", children: "Hora" }), _jsx("th", { className: "px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase", children: "Comida" }), _jsx("th", { className: "px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase", children: "Momento" }), _jsx("th", { className: "px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase", children: "Calor\u00EDas" }), _jsx("th", { className: "px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase", children: "Prote\u00EDnas" }), _jsx("th", { className: "px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase", children: "Carbohidratos" }), _jsx("th", { className: "px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase", children: "Grasas" }), _jsx("th", { className: "px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase", children: "Observaciones" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: nutritionRecords.map((record) => (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsx("td", { className: "px-3 py-2 text-gray-600", children: new Date(record.createdAt).toLocaleTimeString() }), _jsx("td", { className: "px-3 py-2 text-gray-900 font-medium", children: record.food }), _jsx("td", { className: "px-3 py-2 text-gray-600", children: _jsx("span", { className: "px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs", children: record.mealTime }) }), _jsxs("td", { className: "px-3 py-2 text-gray-600", children: [record.calories, " kcal"] }), _jsxs("td", { className: "px-3 py-2 text-gray-600", children: [record.proteins, "g"] }), _jsxs("td", { className: "px-3 py-2 text-gray-600", children: [record.carbohydrates, "g"] }), _jsxs("td", { className: "px-3 py-2 text-gray-600", children: [record.fats, "g"] }), _jsx("td", { className: "px-3 py-2 text-gray-600", children: record.observations || "-" })] }, record.id))) })] }) })) : (_jsxs("div", { className: "text-center py-8", children: [_jsx(FiHeart, { className: "mx-auto text-4xl text-gray-400 mb-2" }), _jsx("p", { className: "text-gray-600", children: "No hay registros de nutrici\u00F3n para esta fecha" }), _jsxs("p", { className: "text-sm text-gray-500 mt-1", children: ["Fecha seleccionada: ", new Date(selectedDate).toLocaleDateString()] })] }))] }));
const ClientHistory = () => {
    const { dni } = useParams();
    const [history, setHistory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('trainingPlans');
    const [currentTrainingPlan, setCurrentTrainingPlan] = useState(0);
    const [currentNutritionPlan, setCurrentNutritionPlan] = useState(0);
    const [trainingRecordsDate, setTrainingRecordsDate] = useState(getTodayDate());
    const [nutritionRecordsDate, setNutritionRecordsDate] = useState(getTodayDate());
    const navigate = useNavigate();
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`http://localhost:8080/api/v1/clients/${dni}/history`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
                const data = await response.json();
                setHistory(data);
            }
            catch (err) {
                setError(err instanceof Error ? err.message : "Ocurrió un error desconocido");
            }
            finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [dni]);
    if (loading) {
        return (_jsx("div", { className: "flex justify-center items-center h-64", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" }) }));
    }
    if (error) {
        return (_jsx("div", { className: "bg-red-100 border-l-4 border-red-500 p-4 mb-4", children: _jsxs("div", { className: "flex", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("svg", { className: "h-5 w-5 text-red-500", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z", clipRule: "evenodd" }) }) }), _jsx("div", { className: "ml-3", children: _jsx("p", { className: "text-sm text-red-700", children: error }) })] }) }));
    }
    if (!history) {
        return _jsx("div", { children: "No se encontr\u00F3 historial para este cliente" });
    }
    const filteredTrainingRecords = history.trainingRecords.filter(record => isDateMatch(record.createdAt, trainingRecordsDate));
    const filteredNutritionRecords = history.nutritionRecords.filter(record => isDateMatch(record.createdAt, nutritionRecordsDate));
    const tabs = [
        {
            id: 'trainingPlans',
            title: 'Planes de Entrenamiento',
            icon: _jsx(FiActivity, { className: "mr-2" }),
            count: history.trainingPlans.length,
            color: 'green'
        },
        {
            id: 'nutritionPlans',
            title: 'Planes de Nutrición',
            icon: _jsx(FiHeart, { className: "mr-2" }),
            count: history.nutritionPlans.length,
            color: 'orange'
        },
        {
            id: 'trainingRecords',
            title: 'Registros de Entrenamiento',
            icon: _jsx(FiBook, { className: "mr-2" }),
            count: filteredTrainingRecords.length,
            color: 'purple'
        },
        {
            id: 'nutritionRecords',
            title: 'Registros de Nutrición',
            icon: _jsx(FiCalendar, { className: "mr-2" }),
            count: filteredNutritionRecords.length,
            color: 'pink'
        }
    ];
    const getActiveContent = () => {
        switch (activeTab) {
            case 'trainingPlans':
                return (_jsx(TrainingPlansContent, { trainingPlans: history.trainingPlans, currentPlan: currentTrainingPlan, setCurrentPlan: setCurrentTrainingPlan }));
            case 'nutritionPlans':
                return (_jsx(NutritionPlansContent, { nutritionPlans: history.nutritionPlans, currentPlan: currentNutritionPlan, setCurrentPlan: setCurrentNutritionPlan }));
            case 'trainingRecords':
                return (_jsx(TrainingRecordsContent, { trainingRecords: filteredTrainingRecords, selectedDate: trainingRecordsDate, onDateChange: setTrainingRecordsDate }));
            case 'nutritionRecords':
                return (_jsx(NutritionRecordsContent, { nutritionRecords: filteredNutritionRecords, selectedDate: nutritionRecordsDate, onDateChange: setNutritionRecordsDate }));
            default:
                return null;
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 flex flex-col", children: [_jsx("header", { className: "bg-indigo-800 text-white shadow-md", children: _jsxs("div", { className: "container mx-auto px-4 py-4 flex justify-between items-center", children: [_jsx("h1", { className: "text-2xl font-bold", children: "FITPOWER" }), _jsx("button", { onClick: () => navigate(-1), className: "px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors", children: "Volver al inicio" })] }) }), _jsxs("main", { className: "flex-grow container mx-auto px-4 py-8", children: [_jsxs("div", { className: "bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg p-6 mb-8 text-white", children: [_jsxs("div", { className: "flex items-center mb-4", children: [_jsx(FiUser, { className: "text-3xl mr-3" }), _jsxs("div", { children: [_jsx("h2", { className: "text-3xl font-bold", children: history.clientName }), _jsx("p", { className: "text-blue-100", children: "Historial Completo del Cliente" })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-white/10 backdrop-blur-sm rounded-lg p-4", children: [_jsxs("div", { className: "flex items-center mb-2", children: [_jsx(FiClipboard, { className: "text-xl mr-2" }), _jsx("span", { className: "font-semibold", children: "DNI" })] }), _jsx("p", { className: "text-xl font-bold", children: history.clientDni })] }), _jsxs("div", { className: "bg-white/10 backdrop-blur-sm rounded-lg p-4", children: [_jsxs("div", { className: "flex items-center mb-2", children: [_jsx(FiTarget, { className: "text-xl mr-2" }), _jsx("span", { className: "font-semibold", children: "Objetivo" })] }), _jsx("p", { className: "text-xl font-bold", children: history.clientGoal })] })] })] }), _jsx("div", { className: "mb-6", children: _jsx("nav", { className: "flex flex-wrap gap-2", "aria-label": "Tabs", children: tabs.map((tab) => (_jsxs("button", { onClick: () => setActiveTab(tab.id), className: `flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tab.id
                                    ? `bg-${tab.color}-500 text-white shadow`
                                    : `text-${tab.color}-700 hover:text-${tab.color}-900 hover:bg-${tab.color}-100`}`, children: [tab.icon, tab.title, tab.count > 0 && (_jsx("span", { className: `ml-2 px-2 py-0.5 text-xs rounded-full ${activeTab === tab.id ? 'bg-white text-' + tab.color + '-600' : 'bg-' + tab.color + '-200 text-' + tab.color + '-800'}`, children: tab.count }))] }, tab.id))) }) }), _jsx("div", { className: "bg-white rounded-lg shadow-md p-6", children: getActiveContent() })] }), _jsx(FooterPag, {})] }));
};
export default ClientHistory;
