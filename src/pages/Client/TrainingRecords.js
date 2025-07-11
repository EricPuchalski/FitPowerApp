"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FooterPag } from "../../components/Footer";
import { Calendar, Plus, Edit3, Trash2, Dumbbell, Clock, Hash, Weight, FileText, ArrowLeft, Activity, Target, Timer, MessageSquare, Save, X, AlertTriangle, } from "lucide-react";
const TrainingRecordsPage = () => {
    const { trainingPlanId } = useParams();
    const [records, setRecords] = useState([]);
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
    const token = localStorage.getItem("token");
    const [formData, setFormData] = useState({
        observation: "",
        series: 3,
        repetitions: 10,
        weight: 0,
        restTime: "01:30",
        exerciseId: 0,
    });
    const navigate = useNavigate();
    const clientDni = localStorage.getItem("userDni") || "";
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const exercisesResponse = await fetch(`http://localhost:8080/api/v1/exercises`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!exercisesResponse.ok)
                    throw new Error("Error al cargar ejercicios");
                const exercisesData = await exercisesResponse.json();
                setExercises(exercisesData);
                const recordsResponse = await fetch(`http://localhost:8080/api/v1/clients/${clientDni}/training-plans/${trainingPlanId}/records`, { headers: { Authorization: `Bearer ${token}` } });
                if (!recordsResponse.ok)
                    throw new Error("Error al cargar registros");
                const recordsData = await recordsResponse.json();
                const recordsWithExerciseNames = recordsData.map((record) => {
                    const exercise = exercisesData.find((ex) => ex.id === record.exerciseId);
                    return {
                        ...record,
                        exerciseName: exercise ? exercise.name : "Ejercicio desconocido",
                    };
                });
                setRecords(recordsWithExerciseNames);
            }
            catch (err) {
                setError(err instanceof Error ? err.message : "Ocurrió un error desconocido");
                toast.error(err instanceof Error ? err.message : "Ocurrió un error desconocido");
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [trainingPlanId, clientDni]);
    useEffect(() => {
        const filtered = records.filter((record) => {
            const recordDate = new Date(record.createdAt).toISOString().split("T")[0];
            return recordDate === selectedDate;
        });
        setFilteredRecords(filtered);
    }, [records, selectedDate]);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "series" || name === "repetitions" || name === "weight" || name === "exerciseId"
                ? Number(value)
                : value,
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const url = editingRecord
                ? `http://localhost:8080/api/v1/clients/${clientDni}/training-plans/${trainingPlanId}/records/${editingRecord.id}`
                : `http://localhost:8080/api/v1/clients/${clientDni}/training-plans/${trainingPlanId}/records`;
            const method = editingRecord ? "PUT" : "POST";
            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    observation: formData.observation,
                    series: formData.series,
                    repetitions: formData.repetitions,
                    weight: formData.weight,
                    restTime: formData.restTime,
                    exerciseId: formData.exerciseId,
                }),
            });
            if (!response.ok)
                throw new Error("Error al guardar el registro");
            const savedRecord = await response.json();
            if (editingRecord) {
                setRecords((prev) => prev.map((r) => r.id === savedRecord.id
                    ? {
                        ...savedRecord,
                        exerciseName: exercises.find((ex) => ex.id === savedRecord.exerciseId)?.name || "Ejercicio desconocido",
                    }
                    : r));
                toast.success("Registro actualizado correctamente");
            }
            else {
                setRecords((prev) => [
                    {
                        ...savedRecord,
                        exerciseName: exercises.find((ex) => ex.id === savedRecord.exerciseId)?.name || "Ejercicio desconocido",
                    },
                    ...prev,
                ]);
                toast.success("Registro creado correctamente");
            }
            resetForm();
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Ocurrió un error al guardar";
            toast.error(errorMessage);
        }
    };
    const confirmDelete = (recordId) => {
        toast.warning(_jsxs("div", { children: [_jsx("p", { children: "¿Estás seguro de que deseas eliminar este registro?" }), _jsxs("div", { className: "flex justify-end mt-4", children: [_jsx("button", { onClick: () => {
                                handleDelete(recordId);
                                toast.dismiss();
                            }, className: "px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors mr-2", children: "S\u00ED" }), _jsx("button", { onClick: () => toast.dismiss(), className: "px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors", children: "No" })] })] }), {
            position: "top-center",
            autoClose: false,
            closeOnClick: false,
            draggable: false,
        });
    };
    const handleDelete = async (recordId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:8080/api/v1/clients/${clientDni}/training-plans/${trainingPlanId}/records/${recordId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok)
                throw new Error("Error al eliminar el registro");
            setRecords((prev) => prev.filter((r) => r.id !== recordId));
            toast.success("Registro eliminado correctamente");
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Ocurrió un error al eliminar";
            toast.error(errorMessage);
        }
    };
    const handleEdit = (record) => {
        setEditingRecord(record);
        setFormData({
            observation: record.observation || "",
            series: record.series,
            repetitions: record.repetitions,
            weight: record.weight,
            restTime: record.restTime,
            exerciseId: record.exerciseId,
        });
        setShowForm(true);
        toast.info("Editando registro existente");
    };
    const resetForm = () => {
        setFormData({
            observation: "",
            series: 3,
            repetitions: 10,
            weight: 0,
            restTime: "01:30",
            exerciseId: exercises.length > 0 ? exercises[0].id : 0,
        });
        setEditingRecord(null);
        setShowForm(false);
    };
    const formatRestTime = (timeString) => {
        const [minutes, seconds] = timeString.split(":");
        return `${minutes}' ${seconds}''`;
    };
    if (loading) {
        return (_jsxs("div", { className: "flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" }), _jsx(Activity, { className: "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-blue-600" })] }), _jsx("p", { className: "mt-6 text-lg text-gray-700 font-medium", children: "Cargando registros de entrenamiento..." }), _jsx(ToastContainer, {})] }));
    }
    if (error) {
        return (_jsxs("div", { className: "flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-pink-100 p-4", children: [_jsxs("div", { className: "bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center", children: [_jsx("div", { className: "w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4", children: _jsx(AlertTriangle, { className: "w-8 h-8 text-red-600" }) }), _jsx("h2", { className: "text-2xl font-bold text-red-600 mb-4", children: "\u00A1Oops! Algo sali\u00F3 mal" }), _jsx("p", { className: "text-gray-700 mb-6", children: error }), _jsx("button", { onClick: () => window.location.reload(), className: "px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium", children: "Intentar nuevamente" })] }), _jsx(ToastContainer, {})] }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col", children: [_jsx(ToastContainer, { position: "top-right", autoClose: 5000, hideProgressBar: false, newestOnTop: false, closeOnClick: true, rtl: false, pauseOnFocusLoss: true, draggable: true, pauseOnHover: true }), _jsx("header", { className: "bg-gradient-to-r from-indigo-800 to-indigo-900 text-white shadow-lg", children: _jsxs("div", { className: "container mx-auto px-4 py-4 flex justify-between items-center", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center", children: _jsx(Dumbbell, { className: "w-6 h-6" }) }), _jsx("h1", { className: "text-2xl font-bold", children: "FITPOWER" })] }), _jsxs("button", { onClick: () => navigate(-1), className: "flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors", children: [_jsx(ArrowLeft, { className: "w-4 h-4" }), "Volver al Plan"] })] }) }), _jsx("nav", { className: "bg-white shadow-sm border-b", children: _jsxs("ul", { className: "container mx-auto px-4 flex", children: [_jsx("li", { className: "flex-1 text-center hover:bg-gray-50 transition-colors", children: _jsx("button", { onClick: () => navigate("/client"), className: "w-full py-4 font-medium text-gray-600 hover:text-gray-900", children: "Inicio" }) }), _jsx("li", { className: "flex-1 text-center border-b-4 border-blue-500 bg-blue-50", children: _jsx("button", { className: "w-full py-4 font-medium text-blue-600", children: "Plan de Entrenamiento" }) }), _jsx("li", { className: "flex-1 text-center hover:bg-gray-50 transition-colors", children: _jsx("button", { onClick: () => navigate("/client/nutrition-plan"), className: "w-full py-4 font-medium text-gray-600 hover:text-gray-900", children: "Plan de Nutrici\u00F3n" }) })] }) }), _jsxs("main", { className: "flex-grow container mx-auto px-4 py-8", children: [_jsx("div", { className: "bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100", children: _jsxs("div", { className: "flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx("div", { className: "w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center", children: _jsx(FileText, { className: "w-5 h-5 text-blue-600" }) }), _jsx("h2", { className: "text-2xl font-bold text-gray-800", children: "Registros de Entrenamiento" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Calendar, { className: "w-4 h-4 text-gray-500" }), _jsx("label", { className: "text-sm font-medium text-gray-700", children: "Fecha:" }), _jsx("input", { type: "date", value: selectedDate, onChange: (e) => setSelectedDate(e.target.value), className: "px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" })] })] }), _jsxs("button", { onClick: () => {
                                        setEditingRecord(null);
                                        setFormData({
                                            observation: "",
                                            series: 3,
                                            repetitions: 10,
                                            weight: 0,
                                            restTime: "01:30",
                                            exerciseId: exercises.length > 0 ? exercises[0].id : 0,
                                        });
                                        setShowForm(true);
                                    }, className: "flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg", children: [_jsx(Plus, { className: "w-4 h-4" }), "Nuevo Registro"] })] }) }), filteredRecords.length > 0 ? (_jsx("div", { className: "grid gap-4", children: filteredRecords.map((record) => (_jsx("div", { className: "bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow", children: _jsxs("div", { className: "flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-3 mb-3", children: [_jsx("div", { className: "w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center", children: _jsx(Dumbbell, { className: "w-4 h-4 text-blue-600" }) }), _jsx("h3", { className: "text-lg font-semibold text-gray-800", children: record.exerciseName }), _jsx("span", { className: "text-sm text-gray-500", children: new Date(record.createdAt).toLocaleDateString() })] }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-4", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Hash, { className: "w-4 h-4 text-gray-400" }), _jsx("span", { className: "text-sm text-gray-600", children: "Series:" }), _jsx("span", { className: "font-medium text-gray-800", children: record.series })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Target, { className: "w-4 h-4 text-gray-400" }), _jsx("span", { className: "text-sm text-gray-600", children: "Reps:" }), _jsx("span", { className: "font-medium text-gray-800", children: record.repetitions })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Weight, { className: "w-4 h-4 text-gray-400" }), _jsx("span", { className: "text-sm text-gray-600", children: "Peso:" }), _jsxs("span", { className: "font-medium text-gray-800", children: [record.weight, " kg"] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Timer, { className: "w-4 h-4 text-gray-400" }), _jsx("span", { className: "text-sm text-gray-600", children: "Descanso:" }), _jsx("span", { className: "font-medium text-gray-800", children: formatRestTime(record.restTime) })] })] }), record.observation && (_jsxs("div", { className: "flex items-start gap-2 p-3 bg-gray-50 rounded-lg", children: [_jsx(MessageSquare, { className: "w-4 h-4 text-gray-400 mt-0.5" }), _jsxs("div", { children: [_jsx("span", { className: "text-sm text-gray-600", children: "Observaci\u00F3n:" }), _jsx("p", { className: "text-sm text-gray-800 mt-1", children: record.observation })] })] }))] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs("button", { onClick: () => handleEdit(record), className: "flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors", children: [_jsx(Edit3, { className: "w-4 h-4" }), _jsx("span", { className: "hidden sm:inline", children: "Editar" })] }), _jsxs("button", { onClick: () => confirmDelete(record.id), className: "flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors", children: [_jsx(Trash2, { className: "w-4 h-4" }), _jsx("span", { className: "hidden sm:inline", children: "Eliminar" })] })] })] }) }, record.id))) })) : (_jsxs("div", { className: "bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center", children: [_jsx("div", { className: "w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4", children: _jsx(Calendar, { className: "w-8 h-8 text-gray-400" }) }), _jsx("h3", { className: "text-lg font-medium text-gray-800 mb-2", children: "No hay registros para esta fecha" }), _jsx("p", { className: "text-gray-500 mb-6", children: "Comienza registrando tu primer entrenamiento del d\u00EDa" }), _jsxs("button", { onClick: () => {
                                    setEditingRecord(null);
                                    setFormData({
                                        observation: "",
                                        series: 3,
                                        repetitions: 10,
                                        weight: 0,
                                        restTime: "01:30",
                                        exerciseId: exercises.length > 0 ? exercises[0].id : 0,
                                    });
                                    setShowForm(true);
                                }, className: "flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg mx-auto", children: [_jsx(Plus, { className: "w-4 h-4" }), "Crear Primer Registro"] })] })), showForm && (_jsx("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-50", children: _jsxs("div", { className: "bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto", children: [_jsx("div", { className: "p-6 border-b border-gray-200", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center", children: editingRecord ? (_jsx(Edit3, { className: "w-5 h-5 text-blue-600" })) : (_jsx(Plus, { className: "w-5 h-5 text-blue-600" })) }), _jsx("h3", { className: "text-xl font-semibold text-gray-800", children: editingRecord ? "Editar Registro" : "Nuevo Registro de Entrenamiento" })] }), _jsx("button", { onClick: resetForm, className: "p-2 hover:bg-gray-100 rounded-lg transition-colors", children: _jsx(X, { className: "w-5 h-5 text-gray-500" }) })] }) }), _jsxs("form", { onSubmit: handleSubmit, className: "p-6", children: [_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsxs("label", { className: "flex items-center gap-2 text-sm font-medium text-gray-700 mb-2", children: [_jsx(Dumbbell, { className: "w-4 h-4" }), "Ejercicio *"] }), _jsxs("select", { name: "exerciseId", value: formData.exerciseId, onChange: handleInputChange, className: "w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors", required: true, children: [_jsx("option", { value: "", children: "Selecciona un ejercicio" }), exercises.map((exercise) => (_jsx("option", { value: exercise.id, children: exercise.name }, exercise.id)))] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsxs("label", { className: "flex items-center gap-2 text-sm font-medium text-gray-700 mb-2", children: [_jsx(Hash, { className: "w-4 h-4" }), "Series *"] }), _jsx("input", { type: "number", name: "series", min: "1", value: formData.series, onChange: handleInputChange, className: "w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors", required: true })] }), _jsxs("div", { children: [_jsxs("label", { className: "flex items-center gap-2 text-sm font-medium text-gray-700 mb-2", children: [_jsx(Target, { className: "w-4 h-4" }), "Repeticiones *"] }), _jsx("input", { type: "number", name: "repetitions", min: "1", value: formData.repetitions, onChange: handleInputChange, className: "w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors", required: true })] }), _jsxs("div", { children: [_jsxs("label", { className: "flex items-center gap-2 text-sm font-medium text-gray-700 mb-2", children: [_jsx(Weight, { className: "w-4 h-4" }), "Peso (kg) *"] }), _jsx("input", { type: "number", name: "weight", step: "0.1", min: "0", value: formData.weight, onChange: handleInputChange, className: "w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors", required: true })] })] }), _jsxs("div", { children: [_jsxs("label", { className: "flex items-center gap-2 text-sm font-medium text-gray-700 mb-2", children: [_jsx(Timer, { className: "w-4 h-4" }), "Tiempo de Descanso *"] }), _jsx("input", { type: "text", name: "restTime", value: formData.restTime, onChange: handleInputChange, placeholder: "01:30", className: "w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors", required: true, pattern: "\\d{2}:\\d{2}", title: "Formato mm:ss" }), _jsxs("p", { className: "text-xs text-gray-500 mt-2 flex items-center gap-1", children: [_jsx(Clock, { className: "w-3 h-3" }), "Ejemplo: 01:30 para 1 minuto y 30 segundos"] })] }), _jsxs("div", { children: [_jsxs("label", { className: "flex items-center gap-2 text-sm font-medium text-gray-700 mb-2", children: [_jsx(MessageSquare, { className: "w-4 h-4" }), "Observaciones"] }), _jsx("textarea", { name: "observation", value: formData.observation, onChange: handleInputChange, rows: 4, className: "w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none", placeholder: "Agrega cualquier observaci\u00F3n sobre este ejercicio..." })] })] }), _jsxs("div", { className: "flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200", children: [_jsxs("button", { type: "button", onClick: resetForm, className: "flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors", children: [_jsx(X, { className: "w-4 h-4" }), "Cancelar"] }), _jsxs("button", { type: "submit", className: "flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg", children: [_jsx(Save, { className: "w-4 h-4" }), editingRecord ? "Actualizar" : "Guardar"] })] })] })] }) }))] }), _jsx(FooterPag, {})] }));
};
export default TrainingRecordsPage;
