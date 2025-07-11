// src/components/DashboardTrainer.tsx
"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Users, Plus } from 'lucide-react';
import { FooterPag } from '../../components/Footer';
import { TrainerHeader } from "../../components/TrainerHeader";
import { useAuth } from "../../auth/hook/useAuth";
export default function DashboardTrainer({ user }) {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(user || null);
    const [activePlansCount, setActivePlansCount] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showAll, setShowAll] = useState(false);
    const navigate = useNavigate();
    const { logout } = useAuth();
    // Carga inicial del entrenador y luego de los clientes/plans
    useEffect(() => {
        if (!currentUser) {
            const token = localStorage.getItem("token");
            const userDni = localStorage.getItem("userDni");
            if (token && userDni) {
                fetchTrainerInfo(userDni);
            }
        }
        else {
            loadData();
        }
    }, [currentUser, showAll]);
    // Helper que lanza la función correcta de fetch
    const loadData = () => {
        setLoading(true);
        setError(null);
        const loader = showAll ? fetchAllClients : fetchMyClients;
        loader()
            .then(() => fetchTrainingPlans())
            .catch(() => {
            setError("Error al cargar los clientes");
        })
            .finally(() => {
            setLoading(false);
        });
    };
    // Obtiene datos del entrenador y guarda trainerId en localStorage
    const fetchTrainerInfo = async (dni) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:8080/api/v1/trainers/${dni}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!res.ok)
                throw new Error();
            const data = await res.json();
            localStorage.setItem("trainerId", data.id.toString());
            localStorage.setItem("userRole", "ROLE_TRAINER");
            setCurrentUser({
                dni: data.dni,
                name: data.name,
                gymName: data.gymName,
                role: "ROLE_TRAINER"
            });
        }
        catch {
            setError("Error al cargar información del entrenador");
            setLoading(false);
        }
    };
    // Fetch solo “Mis Clientes”
    const fetchMyClients = async () => {
        const trainerId = localStorage.getItem("trainerId");
        const token = localStorage.getItem("token");
        if (!trainerId || !token)
            throw new Error();
        const res = await fetch(`http://localhost:8080/api/v1/trainers/${trainerId}/clients/active`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!res.ok) {
            // Si 404 o vacío, devolvemos array vacío
            if (res.status === 404) {
                setClients([]);
                return;
            }
            throw new Error();
        }
        const data = await res.json();
        setClients(data);
    };
    // Fetch “Todos los Clientes del Gimnasio”
    const fetchAllClients = async () => {
        const token = localStorage.getItem("token");
        const gymName = currentUser?.gymName;
        if (!gymName || !token)
            throw new Error();
        const res = await fetch(`http://localhost:8080/api/v1/gyms/${encodeURIComponent(gymName)}/clients`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!res.ok)
            throw new Error();
        const data = await res.json();
        setClients(data);
    };
    // Fetch contador de planes activos
    const fetchTrainingPlans = async () => {
        const trainerId = localStorage.getItem("trainerId");
        const token = localStorage.getItem("token");
        if (!trainerId || !token)
            return;
        try {
            const res = await fetch(`http://localhost:8080/api/v1/training-plans/trainer/${trainerId}`, { headers: { Authorization: `Bearer ${token}` } });
            if (!res.ok)
                throw new Error();
            const data = await res.json();
            const activos = data.filter(plan => plan.active);
            setActivePlansCount(activos.length);
        }
        catch {
            setActivePlansCount(0);
        }
    };
    const handleLogout = () => {
        logout();
        navigate("/"); // o "/login" si tenés una ruta específica
    };
    // Loading skeleton
    if (loading) {
        return (_jsx("div", { className: "flex flex-col min-h-screen bg-gray-100", children: _jsx("p", { className: "p-8 text-center", children: "Cargando datos\u2026" }) }));
    }
    return (_jsxs("div", { className: "flex flex-col min-h-screen bg-gray-100", children: [_jsx(TrainerHeader, { onLogout: handleLogout }), _jsxs("main", { className: "flex-grow container mx-auto px-4 py-8", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-3xl font-bold", children: `Bienvenido, ${currentUser?.name}` }), _jsx("div", { className: "mt-4" }), _jsx("p", { className: "text-gray-600 mt-4", children: `Gimnasio: ${currentUser?.gymName}` })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-8", children: _jsxs("div", { className: "p-6 bg-cyan-50 rounded-lg border flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-700", children: "Total Clientes" }), _jsx("p", { className: "text-2xl font-bold", children: clients.length })] }), _jsx(Users, { className: "h-8 w-8 text-cyan-600" })] }) }), _jsxs("div", { className: "flex space-x-4 mb-6", children: [_jsx("button", { onClick: () => setShowAll(false), className: `px-4 py-2 rounded ${!showAll ? 'bg-blue-900 text-white' : 'bg-gray-200'}`, children: "Mis Clientes" }), _jsx("button", { onClick: () => setShowAll(true), className: `px-4 py-2 rounded ${showAll ? 'bg-blue-900 text-white' : 'bg-gray-200'}`, children: "Todos los Clientes" })] }), _jsxs("div", { className: "mb-4", children: [_jsx("h2", { className: "text-xl font-semibold", children: showAll ? 'Todos los Clientes del Gimnasio' : 'Mis Clientes Activos' }), !showAll && (_jsx("p", { className: "text-sm text-gray-600", children: "Clientes con planes de entrenamiento activos contigo" }))] }), error && (_jsx("div", { className: "mb-6 p-4 bg-red-50 text-red-800 border rounded", children: error })), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: clients.map(client => (_jsxs("div", { className: "bg-white rounded-lg shadow-sm hover:shadow-lg transition p-6", children: [_jsxs("h3", { className: "font-semibold text-gray-900 text-lg", children: [client.name, " ", client.lastName] }), _jsxs("p", { className: "text-gray-600 text-sm mb-4", children: ["DNI: ", client.dni] }), _jsxs("div", { className: "space-y-2 mb-4 text-gray-700", children: [_jsxs("div", { children: ["Email: ", client.email] }), _jsxs("div", { children: ["Tel\u00E9fono: ", client.phoneNumber] }), _jsxs("div", { children: ["Desde: ", new Date(client.createdAt).toLocaleDateString("es-ES")] })] }), _jsxs("div", { className: "flex flex-col space-y-2", children: [_jsx(Link, { to: `/trainer/client/${client.dni}/training-plans`, children: _jsx("button", { className: "w-full bg-blue-900 text-white py-2 rounded", children: "Ver Cliente" }) }), !showAll && localStorage.getItem("userRole") === "ROLE_TRAINER" && (_jsx(Link, { to: `/trainer/client/${client.dni}/training-plans/new/edit`, children: _jsxs("button", { className: "w-full bg-pink-400 text-white py-2 rounded flex items-center justify-center", children: [_jsx(Plus, { className: "h-4 w-4 mr-2" }), " Crear Plan"] }) }))] })] }, client.id))) }), clients.length === 0 && !loading && (_jsxs("div", { className: "text-center py-12", children: [_jsx(Users, { className: "h-12 w-12 text-gray-400 mx-auto mb-4" }), _jsx("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: showAll ? 'No hay clientes en el gimnasio' : 'No tienes clientes activos' }), _jsx("p", { className: "text-gray-600", children: showAll
                                    ? 'Los clientes aparecerán aquí cuando se registren en el gimnasio.'
                                    : 'Los clientes aparecerán aquí cuando tengan planes activos contigo.' })] }))] }), _jsx(FooterPag, {})] }));
}
