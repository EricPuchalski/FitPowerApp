"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Plus, Check, X, Edit2 } from "lucide-react";
import { FooterPag } from "../../components/Footer";
import { AdminHeader } from "../../components/AdminHeader";
import { useAuth } from "../../auth/hook/useAuth";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function ExerciseCrud() {
    const [exercises, setExercises] = useState([]);
    const [newExercise, setNewExercise] = useState({ name: "" });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState("");
    const token = localStorage.getItem("token");
    const { logout } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        fetchExercises();
    }, []);
    const fetchExercises = async () => {
        setLoading(true);
        try {
            const res = await fetch("http://localhost:8080/api/v1/exercises", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok)
                throw new Error();
            const data = await res.json();
            setExercises(data);
            setError(null);
        }
        catch {
            const errorMessage = "Error al cargar ejercicios.";
            setError(errorMessage);
            toast.error(errorMessage);
        }
        finally {
            setLoading(false);
        }
    };
    const createExercise = async () => {
        if (!newExercise.name.trim()) {
            toast.error("El nombre del ejercicio es obligatorio");
            return;
        }
        try {
            const res = await fetch("http://localhost:8080/api/v1/exercises", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newExercise),
            });
            if (!res.ok)
                throw new Error();
            setNewExercise({ name: "" });
            fetchExercises();
            toast.success("Ejercicio creado correctamente");
        }
        catch {
            toast.error("No se pudo crear el ejercicio");
        }
    };
    const startEdit = (exercise) => {
        setEditingId(exercise.id);
        setEditName(exercise.name);
    };
    const cancelEdit = () => {
        setEditingId(null);
        setEditName("");
    };
    const saveEdit = async (id) => {
        if (!editName.trim()) {
            toast.error("El nombre no puede estar vacío");
            return;
        }
        try {
            const res = await fetch(`http://localhost:8080/api/v1/exercises/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: editName }),
            });
            if (!res.ok)
                throw new Error();
            cancelEdit();
            fetchExercises();
            toast.success("Ejercicio actualizado correctamente");
        }
        catch {
            toast.error("No se pudo actualizar el ejercicio");
        }
    };
    const handleLogout = () => {
        logout();
        navigate("/");
    };
    return (_jsxs("div", { className: "flex flex-col min-h-screen bg-gray-100", children: [_jsx(AdminHeader, { onLogout: handleLogout }), _jsxs("main", { className: "flex-grow container mx-auto px-4 py-8", children: [_jsxs("div", { className: "bg-white rounded-lg shadow-md p-6 mb-8", children: [_jsx("h2", { className: "text-xl font-bold text-gray-800 mb-4", children: "Crear nuevo ejercicio" }), _jsxs("div", { className: "flex flex-col md:flex-row items-center gap-4", children: [_jsx("input", { type: "text", placeholder: "Nombre del ejercicio", value: newExercise.name, onChange: (e) => setNewExercise({ name: e.target.value }), className: "w-full md:w-1/2 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-lime-500" }), _jsxs("button", { onClick: createExercise, className: "bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-md flex items-center shadow", children: [_jsx(Plus, { className: "w-4 h-4 mr-2" }), "Crear"] })] })] }), _jsx("h2", { className: "text-2xl font-semibold text-gray-800 mb-6", children: "Listado de Ejercicios" }), loading ? (_jsx("p", { className: "text-center text-gray-600", children: "Cargando ejercicios..." })) : error ? (_jsx("p", { className: "text-center text-red-600", children: error })) : (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6", children: exercises.map((exercise) => (_jsx("div", { className: "bg-white p-6 rounded-lg border shadow hover:shadow-lg transition relative", children: editingId === exercise.id ? (_jsxs("div", { className: "space-y-4", children: [_jsx("input", { type: "text", value: editName, onChange: (e) => setEditName(e.target.value), className: "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500" }), _jsxs("div", { className: "flex justify-end space-x-2", children: [_jsxs("button", { onClick: () => saveEdit(exercise.id), className: "flex items-center px-3 py-1 rounded bg-green-600 text-white", children: [_jsx(Check, { className: "w-4 h-4 mr-1" }), " Guardar"] }), _jsxs("button", { onClick: cancelEdit, className: "flex items-center px-3 py-1 rounded bg-gray-300", children: [_jsx(X, { className: "w-4 h-4 mr-1" }), " Cancelar"] })] })] })) : (_jsxs(_Fragment, { children: [_jsx("h3", { className: "text-lg font-bold text-gray-900 mb-2", children: exercise.name }), _jsx("button", { onClick: () => startEdit(exercise), className: "absolute top-4 right-4 text-gray-500 hover:text-gray-700", children: _jsx(Edit2, { className: "w-5 h-5" }) })] })) }, exercise.id))) })), exercises.length === 0 && !loading && (_jsx("div", { className: "text-center mt-12 text-gray-600", children: "No hay ejercicios disponibles." }))] }), _jsx(FooterPag, {}), _jsx(ToastContainer, {})] }));
}
