// src/components/TrainingPlanEdit.tsx
"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Save, Edit2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../auth/hook/useAuth";
import { FooterPag } from "../../components/Footer";
import { TrainerHeader } from "../../components/TrainerHeader";
const DAYS_OF_WEEK = [
    { value: "MONDAY", label: "Lunes" },
    { value: "TUESDAY", label: "Martes" },
    { value: "WEDNESDAY", label: "Miércoles" },
    { value: "THURSDAY", label: "Jueves" },
    { value: "FRIDAY", label: "Viernes" },
    { value: "SATURDAY", label: "Sábado" },
    { value: "SUNDAY", label: "Domingo" },
];
export default function TrainingPlanEdit() {
    const { clientDni, planId } = useParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [allExercises, setAllExercises] = useState([]);
    const [plan, setPlan] = useState({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        clientDni: clientDni || "",
        exercises: [],
    });
    const [authError, setAuthError] = useState(null);
    // Estados para el formulario de ejercicio
    const [exerciseForm, setExerciseForm] = useState({
        exerciseId: 0,
        exerciseName: "",
        series: 3,
        repetitions: 10,
        weight: 0,
        dayOfWeek: "MONDAY",
        restTime: "01:00", // Formato MM:SS
    });
    const [isEditingExercise, setIsEditingExercise] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const navigate = useNavigate();
    const { logout } = useAuth();
    const isNewPlan = planId === "new";
    // Limpiar formulario de ejercicio
    const clearExerciseForm = () => {
        setExerciseForm({
            exerciseId: 0,
            exerciseName: "",
            series: 3,
            repetitions: 10,
            weight: 0,
            dayOfWeek: "MONDAY",
            restTime: "01:00", // Formato MM:SS
        });
        setIsEditingExercise(false);
        setEditingIndex(null);
    };
    useEffect(() => {
        const token = localStorage.getItem("token");
        const fetchExercises = async () => {
            try {
                const res = await fetch("http://localhost:8080/api/v1/exercises", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                const data = await res.json();
                setAllExercises(data);
                toast.success("Ejercicios cargados correctamente");
                if (isNewPlan) {
                    setPlan({
                        name: "",
                        description: "",
                        startDate: new Date().toISOString().split("T")[0],
                        endDate: "",
                        clientDni: clientDni || "",
                        exercises: [],
                    });
                    setLoading(false);
                }
                else {
                    await fetchTrainingPlan(data);
                }
            }
            catch (error) {
                console.error("Error al cargar ejercicios:", error);
                toast.error("Error al cargar ejercicios. Por favor intenta nuevamente.");
                setAuthError("Error al cargar ejercicios. Por favor intenta nuevamente.");
            }
        };
        fetchExercises();
    }, [planId, isNewPlan, clientDni]);
    const handleLogout = () => {
        logout();
        navigate("/"); // o "/login" si tenés una ruta específica
    };
    const fetchTrainingPlan = async (exerciseCatalog) => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("No se encontró token de autenticación");
                setAuthError("No se encontró token de autenticación. Por favor inicie sesión nuevamente.");
                return;
            }
            const [planResponse, exercisesResponse] = await Promise.all([
                fetch(`http://localhost:8080/api/v1/training-plans/${planId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }),
                fetch(`http://localhost:8080/api/v1/training-plans/${planId}/exercises`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }),
            ]);
            if (!planResponse.ok) {
                if (planResponse.status === 401 || planResponse.status === 403) {
                    toast.error("No tienes permisos para acceder a este plan");
                    setAuthError("No tienes permisos para acceder a este plan. Por favor verifica tus credenciales.");
                }
                throw new Error(`Error al obtener el plan: ${planResponse.statusText}`);
            }
            const planData = await planResponse.json();
            let exercises = [];
            if (exercisesResponse.ok) {
                const exercisesData = await exercisesResponse.json();
                exercises = exercisesData.map((ex) => {
                    const match = exerciseCatalog.find((e) => e.id === ex.exerciseId || e.id === ex.exercise?.id);
                    return {
                        id: ex.id,
                        exerciseId: ex.exerciseId || ex.exercise?.id || 0,
                        exerciseName: match?.name || "Sin nombre",
                        series: ex.series,
                        repetitions: ex.repetitions,
                        weight: ex.weight,
                        restTime: ex.restTime,
                        dayOfWeek: ex.day,
                    };
                });
            }
            setPlan({
                id: planData.id,
                name: planData.name,
                description: planData.description,
                startDate: planData.startDate,
                endDate: planData.endDate,
                clientDni: clientDni || "",
                exercises: exercises,
            });
            toast.success("Plan de entrenamiento cargado correctamente");
        }
        catch (error) {
            console.error("Error fetching training plan:", error);
            toast.error("Error al cargar el plan de entrenamiento");
            setAuthError("Ocurrió un error al cargar el plan. Por favor intenta nuevamente.");
        }
        finally {
            setLoading(false);
        }
    };
    // Actualizar campo del formulario de ejercicio
    const updateExerciseForm = (field, value) => {
        setExerciseForm((prev) => {
            if (field === "exerciseId") {
                const selectedExercise = allExercises.find((ex) => ex.id === Number(value));
                return {
                    ...prev,
                    exerciseId: Number(value),
                    exerciseName: selectedExercise?.name || "",
                };
            }
            return { ...prev, [field]: value };
        });
    };
    // Validar ejercicio
    const validateExercise = (exercise) => {
        if (exercise.exerciseId <= 0) {
            toast.error("Por favor selecciona un ejercicio válido");
            return false;
        }
        if (exercise.series <= 0) {
            toast.error("El número de series debe ser mayor a 0");
            return false;
        }
        if (exercise.repetitions <= 0) {
            toast.error("El número de repeticiones debe ser mayor a 0");
            return false;
        }
        if (!/^\d{2}:\d{2}$/.test(exercise.restTime)) {
            toast.error("El formato del tiempo de descanso debe ser MM:SS");
            return false;
        }
        return true;
    };
    // Agregar o actualizar ejercicio
    // Agregar o actualizar ejercicio
    const addOrUpdateExercise = async () => {
        if (!validateExercise(exerciseForm)) {
            return;
        }
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("No se encontró token de autenticación");
                return;
            }
            if (isEditingExercise && editingIndex !== null) {
                // Actualizar ejercicio existente
                if (exerciseForm.id) {
                    // Llamada API para actualizar ejercicio existente - ENDPOINT CORREGIDO
                    const response = await fetch(`http://localhost:8080/api/v1/training-plans/exercises/${exerciseForm.id}`, {
                        method: "PUT",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            exerciseId: exerciseForm.exerciseId,
                            series: exerciseForm.series,
                            repetitions: exerciseForm.repetitions,
                            weight: exerciseForm.weight,
                            day: exerciseForm.dayOfWeek,
                            restTime: exerciseForm.restTime,
                        }),
                    });
                    if (!response.ok) {
                        throw new Error(`Error al actualizar ejercicio: ${response.statusText}`);
                    }
                    // Opcional: Actualizar con los datos devueltos por el servidor
                    const updatedExercise = await response.json();
                    setPlan((prev) => ({
                        ...prev,
                        exercises: prev.exercises.map((exercise, index) => index === editingIndex
                            ? { ...exercise, ...updatedExercise }
                            : exercise),
                    }));
                }
                else {
                    // Si no tiene ID pero estamos editando, es un caso especial (no debería ocurrir)
                    setPlan((prev) => ({
                        ...prev,
                        exercises: prev.exercises.map((exercise, index) => index === editingIndex ? { ...exerciseForm } : exercise),
                    }));
                }
                toast.success("Ejercicio actualizado correctamente");
            }
            else {
                // Agregar nuevo ejercicio
                let newExercise = { ...exerciseForm };
                // Solo hacemos la llamada API si el plan ya existe (no es nuevo)
                if (planId !== "new") {
                    const response = await fetch(`http://localhost:8080/api/v1/training-plans/${planId}/exercises`, {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            exerciseId: exerciseForm.exerciseId,
                            series: exerciseForm.series,
                            repetitions: exerciseForm.repetitions,
                            weight: exerciseForm.weight,
                            day: exerciseForm.dayOfWeek,
                            restTime: exerciseForm.restTime,
                        }),
                    });
                    if (!response.ok) {
                        throw new Error(`Error al agregar ejercicio: ${response.statusText}`);
                    }
                    const createdExercise = await response.json();
                    newExercise = { ...newExercise, id: createdExercise.id };
                }
                // Actualizar estado local
                setPlan((prev) => ({
                    ...prev,
                    exercises: [...prev.exercises, newExercise],
                }));
                toast.success("Ejercicio agregado correctamente");
            }
            clearExerciseForm();
        }
        catch (error) {
            console.error("Error al guardar ejercicio:", error);
            toast.error("Error al guardar el ejercicio. Por favor intenta nuevamente.");
        }
    };
    // Editar ejercicio
    const editExercise = (index) => {
        const exercise = plan.exercises[index];
        setExerciseForm({ ...exercise });
        setIsEditingExercise(true);
        setEditingIndex(index);
    };
    // Eliminar ejercicio
    const removeExercise = async (exerciseIndex) => {
        const exercise = plan.exercises[exerciseIndex];
        const exerciseName = exercise.exerciseName || "este ejercicio";
        const confirmed = window.confirm(`¿Seguro que deseas eliminar "${exerciseName}"?`);
        if (!confirmed)
            return;
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("No se encontró token de autenticación");
                return;
            }
            // Solo hacer la llamada API si el ejercicio tiene un ID (ya existe en backend)
            if (exercise.id) {
                const response = await fetch(`http://localhost:8080/api/v1/training-plans/${planId}/exercises/${exercise.id}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                if (!response.ok) {
                    throw new Error(`Error al eliminar ejercicio: ${response.statusText}`);
                }
            }
            // Actualizar el estado local independientemente de si existe en backend
            setPlan((prev) => ({
                ...prev,
                exercises: prev.exercises.filter((_, index) => index !== exerciseIndex),
            }));
            // Si estamos editando este ejercicio, limpiar el formulario
            if (isEditingExercise && editingIndex === exerciseIndex) {
                clearExerciseForm();
            }
            toast.success("Ejercicio eliminado correctamente");
        }
        catch (error) {
            console.error("Error al eliminar ejercicio:", error);
            toast.error("Error al eliminar el ejercicio. Por favor intenta nuevamente.");
        }
    };
    const savePlan = async () => {
        setSaving(true);
        setAuthError(null);
        // Validar plan básico
        if (!plan.name) {
            toast.error("Por favor completa el nombre del plan");
            setSaving(false);
            return;
        }
        // Validar que haya al menos un ejercicio
        if (plan.exercises.length === 0) {
            toast.error("Debes agregar al menos un ejercicio al plan");
            setSaving(false);
            return;
        }
        // Validar cada ejercicio
        for (const ex of plan.exercises) {
            if (!validateExercise(ex)) {
                setSaving(false);
                return;
            }
        }
        const token = localStorage.getItem("token");
        const trainerIdStr = localStorage.getItem("trainerId");
        if (!token) {
            toast.error("No se encontró token de autenticación");
            setAuthError("No se encontró token de autenticación. Por favor inicie sesión nuevamente.");
            setSaving(false);
            return;
        }
        if (!trainerIdStr) {
            toast.error("No se encontró el ID del entrenador");
            setSaving(false);
            return;
        }
        const trainerId = Number(trainerIdStr);
        if (isNaN(trainerId)) {
            toast.error("El ID del entrenador no es válido");
            setSaving(false);
            return;
        }
        const clientIdNum = Number(clientDni);
        if (isNaN(clientIdNum)) {
            toast.error("El DNI del cliente no es válido");
            setSaving(false);
            return;
        }
        try {
            toast.info("Guardando plan de entrenamiento...");
            const clientCheckRes = await fetch(`http://localhost:8080/api/v1/clients/${clientDni}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (!clientCheckRes.ok) {
                if (clientCheckRes.status === 401 || clientCheckRes.status === 403) {
                    toast.error("No tienes permisos para acceder a este cliente");
                    setAuthError("No tienes permisos para acceder a este cliente. Por favor verifica tus credenciales.");
                    return;
                }
                const errorText = await clientCheckRes.text();
                console.error("Cliente no encontrado - Error completo:", errorText);
                toast.error("El cliente no existe o no tienes permisos para acceder");
                return;
            }
            const clientData = await clientCheckRes.json();
            let planIdToUse = plan.id;
            // Crear o actualizar el plan principal
            if (isNewPlan) {
                const planPayload = {
                    name: plan.name.trim(),
                    trainerId: trainerId,
                    clientId: clientData.id,
                };
                const createRes = await fetch("http://localhost:8080/api/v1/training-plans", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(planPayload),
                });
                if (!createRes.ok) {
                    throw new Error("No se creó el plan.");
                }
                const createdPlan = await createRes.json();
                planIdToUse = createdPlan.id;
                toast.success("Plan de entrenamiento creado exitosamente");
            }
            // Agregar/actualizar ejercicios
            for (const ex of plan.exercises) {
                const exPayload = {
                    exerciseId: ex.exerciseId,
                    series: ex.series,
                    repetitions: ex.repetitions,
                    weight: ex.weight,
                    day: ex.dayOfWeek,
                    restTime: ex.restTime,
                };
                const endpoint = ex.id
                    ? `http://localhost:8080/api/v1/training-plans/exercises/${ex.id}`
                    : `http://localhost:8080/api/v1/training-plans/${planIdToUse}/exercises`;
                const method = ex.id ? "PUT" : "POST";
                await fetch(endpoint, {
                    method,
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(exPayload),
                });
            }
            toast.success("Plan de entrenamiento guardado correctamente");
            navigate(`/trainer/client/${clientDni}/training-plans/${planIdToUse}/edit`);
        }
        catch (err) {
            console.error("Error completo:", err);
            toast.error("Error al guardar el plan. Por favor intenta nuevamente.");
            setAuthError("Error al guardar el plan. Por favor verifica tus permisos e intenta nuevamente.");
        }
        finally {
            setSaving(false);
        }
    };
    if (loading) {
        return (_jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsxs("div", { className: "animate-pulse", children: [_jsx("div", { className: "h-8 bg-gray-200 rounded w-1/3 mb-8" }), _jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "h-32 bg-gray-200 rounded-lg" }), _jsx("div", { className: "h-48 bg-gray-200 rounded-lg" })] })] }), _jsx(ToastContainer, { position: "top-right", autoClose: 3000, hideProgressBar: false, newestOnTop: false, closeOnClick: true, rtl: false, pauseOnFocusLoss: true, draggable: true, pauseOnHover: true, theme: "light" })] }));
    }
    if (authError) {
        return (_jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsx("div", { className: "bg-red-50 border-l-4 border-red-400 p-4 mb-8", children: _jsxs("div", { className: "flex", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("svg", { className: "h-5 w-5 text-red-400", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z", clipRule: "evenodd" }) }) }), _jsxs("div", { className: "ml-3", children: [_jsx("p", { className: "text-sm text-red-700", children: authError }), _jsx("div", { className: "mt-4", children: _jsxs(Link, { to: "/login", className: "text-sm font-medium text-red-700 hover:text-red-600", children: ["Volver a iniciar sesi\u00F3n ", _jsx("span", { "aria-hidden": "true", children: "\u2192" })] }) })] })] }) }), _jsx(ToastContainer, { position: "top-right", autoClose: 3000, hideProgressBar: false, newestOnTop: false, closeOnClick: true, rtl: false, pauseOnFocusLoss: true, draggable: true, pauseOnHover: true, theme: "light" })] }));
    }
    return (_jsxs(_Fragment, { children: [_jsx(TrainerHeader, { onLogout: handleLogout }), _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsxs("div", { className: "flex items-center justify-between mb-8", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsx(Link, { to: `/trainer/client/${clientDni}/training-plans`, children: _jsxs("button", { className: "flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50", children: [_jsx(ArrowLeft, { className: "h-4 w-4" }), _jsx("span", { children: "Volver" })] }) }), _jsx("h1", { className: "text-3xl font-bold text-gray-900", children: isNewPlan
                                            ? "Crear Plan de Entrenamiento"
                                            : "Editar Plan de Entrenamiento" })] }), _jsxs("button", { onClick: savePlan, disabled: saving, className: "bg-pink-400 hover:bg-pink-500 text-white px-4 py-2 rounded-md flex items-center space-x-2 disabled:opacity-50", children: [_jsx(Save, { className: "h-4 w-4" }), _jsx("span", { children: saving ? "Guardando..." : "Guardar Plan" })] })] }), authError && (_jsx("div", { className: "bg-red-50 border-l-4 border-red-400 p-4 mb-8", children: _jsxs("div", { className: "flex", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("svg", { className: "h-5 w-5 text-red-400", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z", clipRule: "evenodd" }) }) }), _jsx("div", { className: "ml-3", children: _jsx("p", { className: "text-sm text-red-700", children: authError }) })] }) })), _jsxs("div", { className: "bg-white border border-gray-200 rounded-lg shadow-sm mb-8", children: [_jsx("div", { className: "bg-cyan-50 rounded-t-lg p-4", children: _jsx("h2", { className: "text-lg font-semibold text-gray-900", children: "Detalles del Plan" }) }), _jsx("div", { className: "p-6", children: _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: _jsxs("div", { children: [_jsx("label", { htmlFor: "name", className: "block text-sm font-medium text-gray-700 mb-1", children: "Nombre del Plan *" }), _jsx("input", { id: "name", type: "text", value: plan.name, onChange: (e) => setPlan((prev) => ({ ...prev, name: e.target.value })), placeholder: "Ej: Plan de Fuerza - Principiante", className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" })] }) }) })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8", children: [_jsxs("div", { className: "bg-white border border-gray-200 rounded-lg shadow-sm", children: [_jsx("div", { className: "bg-green-50 rounded-t-lg p-4", children: _jsx("h2", { className: "text-lg font-semibold text-gray-900", children: isEditingExercise ? "Editar Ejercicio" : "Agregar Ejercicio" }) }), _jsxs("div", { className: "p-6 space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Ejercicio *" }), _jsxs("select", { value: exerciseForm.exerciseId || "", onChange: (e) => updateExerciseForm("exerciseId", Number(e.target.value)), className: "border px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500", required: true, children: [_jsx("option", { value: "", disabled: true, children: "\u2014 Selecciona ejercicio \u2014" }), allExercises.map((ex) => (_jsx("option", { value: ex.id, children: ex.name }, ex.id)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "D\u00EDa de la semana *" }), _jsx("select", { value: exerciseForm.dayOfWeek, onChange: (e) => updateExerciseForm("dayOfWeek", e.target.value), className: "border px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500", required: true, children: DAYS_OF_WEEK.map((day) => (_jsx("option", { value: day.value, children: day.label }, day.value))) })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Series *" }), _jsx("input", { type: "number", value: exerciseForm.series, onChange: (e) => updateExerciseForm("series", Number(e.target.value)), className: "border px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500", placeholder: "Ej: 3", min: 1, required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Repeticiones *" }), _jsx("input", { type: "number", value: exerciseForm.repetitions, onChange: (e) => updateExerciseForm("repetitions", Number(e.target.value)), className: "border px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500", placeholder: "Ej: 10", min: 1, required: true })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Peso (kg)" }), _jsx("input", { type: "number", value: exerciseForm.weight, onChange: (e) => updateExerciseForm("weight", Number(e.target.value)), className: "border px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500", placeholder: "Ej: 0", min: 0 })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Descanso (MM:SS) *" }), _jsx("input", { type: "text", value: exerciseForm.restTime, onChange: (e) => updateExerciseForm("restTime", e.target.value), className: "border px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500", placeholder: "Ej: 01:00", pattern: "^\\d{2}:\\d{2}$", required: true }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Formato: MM:SS (ej: 01:30 para 1 minuto 30 segundos)" })] })] }), _jsxs("div", { className: "flex space-x-3 pt-4", children: [_jsxs("button", { onClick: addOrUpdateExercise, className: "bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 flex-1", children: [_jsx(Plus, { className: "w-4 h-4" }), _jsx("span", { children: isEditingExercise ? "Actualizar" : "Agregar" })] }), isEditingExercise && (_jsx("button", { onClick: clearExerciseForm, className: "bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md", children: "Cancelar" }))] })] })] }), _jsxs("div", { className: "bg-white border border-gray-200 rounded-lg shadow-sm", children: [_jsx("div", { className: "bg-blue-50 rounded-t-lg p-4", children: _jsxs("h2", { className: "text-lg font-semibold text-gray-900", children: ["Ejercicios del Plan (", plan.exercises.length, ")"] }) }), _jsx("div", { className: "p-6", children: plan.exercises.length === 0 ? (_jsxs("div", { className: "text-center py-8 text-gray-500", children: [_jsx("p", { children: "No hay ejercicios agregados a\u00FAn." }), _jsx("p", { className: "text-sm", children: "Usa el formulario de la izquierda para agregar ejercicios." })] })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Ejercicio" }), _jsx("th", { className: "px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "D\u00EDa" }), _jsx("th", { className: "px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Series" }), _jsx("th", { className: "px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Reps" }), _jsx("th", { className: "px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Peso" }), _jsx("th", { className: "px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Descanso" }), _jsx("th", { className: "px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Acciones" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: plan.exercises.map((exercise, index) => {
                                                            const dayLabel = DAYS_OF_WEEK.find((d) => d.value === exercise.dayOfWeek)
                                                                ?.label || exercise.dayOfWeek;
                                                            return (_jsxs("tr", { className: `${index === editingIndex && isEditingExercise
                                                                    ? "bg-yellow-50"
                                                                    : ""} hover:bg-gray-50`, children: [_jsx("td", { className: "px-3 py-4 whitespace-nowrap text-sm text-gray-900", children: _jsx("div", { className: "font-medium", children: exercise.exerciseName }) }), _jsx("td", { className: "px-3 py-4 whitespace-nowrap text-sm text-gray-500", children: dayLabel }), _jsx("td", { className: "px-3 py-4 whitespace-nowrap text-sm text-gray-500", children: exercise.series }), _jsx("td", { className: "px-3 py-4 whitespace-nowrap text-sm text-gray-500", children: exercise.repetitions }), _jsx("td", { className: "px-3 py-4 whitespace-nowrap text-sm text-gray-500", children: exercise.weight > 0
                                                                            ? `${exercise.weight} kg`
                                                                            : "-" }), _jsx("td", { className: "px-3 py-4 whitespace-nowrap text-sm text-gray-500", children: exercise.restTime }), _jsxs("td", { className: "px-3 py-4 whitespace-nowrap text-sm font-medium space-x-2", children: [_jsx("button", { onClick: () => editExercise(index), className: "text-blue-600 hover:text-blue-800 inline-flex items-center", title: "Editar ejercicio", children: _jsx(Edit2, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => removeExercise(index), className: "text-red-600 hover:text-red-800 inline-flex items-center", title: "Eliminar ejercicio", children: _jsx(Trash2, { className: "w-4 h-4" }) })] })] }, index));
                                                        }) })] }) })) })] })] }), _jsx(ToastContainer, { position: "top-right", autoClose: 3000, hideProgressBar: false, newestOnTop: false, closeOnClick: true, rtl: false, pauseOnFocusLoss: true, draggable: true, pauseOnHover: true, theme: "light" })] }), _jsx(FooterPag, {})] }));
}
