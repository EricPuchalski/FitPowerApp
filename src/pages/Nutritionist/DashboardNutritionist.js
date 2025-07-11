// src/pages/Nutritionist/DashboardNutritionist.tsx
"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Users } from "lucide-react";
import { FooterPag } from "../../components/Footer";
import { NutritionistHeader } from "../../components/NutritionistHeader";
import { useAuth } from "../../auth/hook/useAuth";
export default function DashboardNutritionist() {
    const [currentUser, setCurrentUser] = useState(null);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [viewMode, setViewMode] = useState("ALL");
    const navigate = useNavigate();
    const { logout } = useAuth();
    useEffect(() => {
        const dni = localStorage.getItem("userDni");
        const token = localStorage.getItem("token");
        if (!dni || !token) {
            setError("No hay sesión activa.");
            setLoading(false);
            return;
        }
        loadNutritionistInfo(dni, token);
    }, []);
    const loadNutritionistInfo = async (dni, token) => {
        try {
            const res = await fetch(`http://localhost:8080/api/v1/nutritionists/${dni}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (!res.ok)
                throw new Error("No se pudo cargar el nutricionista");
            const data = await res.json();
            localStorage.setItem("nutritionistId", data.id.toString());
            localStorage.setItem("userRole", "ROLE_NUTRITIONIST");
            setCurrentUser({
                dni: data.dni,
                name: data.name,
                gymName: data.gymName,
                role: "ROLE_NUTRITIONIST",
            });
            // Carga inicial: todos los clientes
            await loadClientsByGym(data.gymName);
        }
        catch (err) {
            setError("Error al cargar información del nutricionista");
            setLoading(false);
        }
    };
    const loadClientsByGym = async (gymName) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:8080/api/v1/gyms/${encodeURIComponent(gymName)}/clients`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (!res.ok)
                throw new Error("Error al cargar los clientes del gimnasio");
            const data = await res.json();
            setClients(data);
        }
        catch (err) {
            setError("Error al obtener los clientes del gimnasio");
        }
        finally {
            setLoading(false);
        }
    };
    const loadMyClients = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            const nutritionistId = localStorage.getItem("nutritionistId");
            if (!nutritionistId)
                throw new Error("ID de nutricionista no encontrado");
            const res = await fetch(`http://localhost:8080/api/v1/nutritionists/${nutritionistId}/clients/active`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (!res.ok)
                throw new Error("Error al cargar mis clientes");
            const data = await res.json();
            setClients(data);
        }
        catch (err) {
            setError("Error al obtener mis clientes");
        }
        finally {
            setLoading(false);
        }
    };
    const handleViewChange = (mode) => {
        setViewMode(mode);
        if (mode === "ALL" && currentUser) {
            loadClientsByGym(currentUser.gymName);
        }
        else if (mode === "MINE") {
            loadMyClients();
        }
    };
    if (loading) {
        return (_jsx("div", { className: "flex flex-col min-h-screen bg-gray-100", children: _jsx("p", { className: "p-8 text-center", children: "Cargando datos\u2026" }) }));
    }
    const handleLogout = () => {
        logout();
        navigate("/"); // o "/login" si tenés una ruta específica
    };
    return (_jsxs("div", { className: "flex flex-col min-h-screen bg-gray-100", children: [_jsx(NutritionistHeader, { onLogout: handleLogout }), _jsxs("main", { className: "flex-grow container mx-auto px-4 py-8", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-3xl font-bold", children: `Bienvenido/a, ${currentUser?.name}` }), _jsx("p", { className: "text-gray-600", children: `Gimnasio: ${currentUser?.gymName}` })] }), _jsx("div", { className: "mt-4" }), _jsxs("div", { className: "mt-4 flex space-x-4 mb-6", children: [_jsx("button", { onClick: () => handleViewChange("ALL"), className: `px-4 py-2 rounded ${viewMode === "ALL" ? "bg-green-800 text-white" : "bg-gray-200 text-gray-700"}`, children: "Todos los clientes" }), _jsx("button", { onClick: () => handleViewChange("MINE"), className: `px-4 py-2 rounded ${viewMode === "MINE" ? "bg-green-800 text-white" : "bg-gray-200 text-gray-700"}`, children: "Mis clientes" })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-8", children: _jsxs("div", { className: "p-6 bg-green-50 rounded-lg border flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-700", children: "Total Clientes" }), _jsx("p", { className: "text-2xl font-bold", children: clients.length })] }), _jsx(Users, { className: "h-8 w-8 text-green-600" })] }) }), _jsxs("div", { className: "mb-4", children: [_jsx("h2", { className: "text-xl font-semibold", children: viewMode === "ALL" ? "Clientes del Gimnasio" : "Mis Clientes" }), _jsx("p", { className: "text-sm text-gray-600", children: "Gestiona sus planes nutricionales" })] }), error && (_jsx("div", { className: "mb-6 p-4 bg-red-50 text-red-800 border rounded", children: error })), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: clients.map((client) => (_jsxs("div", { className: "bg-white rounded-lg shadow-sm hover:shadow-lg transition p-6", children: [_jsxs("h3", { className: "font-semibold text-gray-900 text-lg", children: [client.name, " ", client.lastName] }), _jsxs("p", { className: "text-gray-600 text-sm mb-4", children: ["DNI: ", client.dni] }), _jsxs("div", { className: "space-y-2 mb-4 text-gray-700", children: [_jsxs("div", { children: ["Email: ", client.email] }), _jsxs("div", { children: ["Tel\u00E9fono: ", client.phoneNumber] }), _jsxs("div", { children: ["Desde: ", new Date(client.createdAt).toLocaleDateString("es-ES")] })] }), _jsx("div", { className: "flex flex-col space-y-2", children: _jsx(Link, { to: `/nutritionist/client/${client.dni}/nutrition-plans`, children: _jsx("button", { className: "w-full bg-green-800 text-white py-2 rounded", children: "Ver Cliente" }) }) })] }, client.id))) }), clients.length === 0 && !loading && (_jsxs("div", { className: "text-center py-12", children: [_jsx(Users, { className: "h-12 w-12 text-gray-400 mx-auto mb-4" }), _jsx("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "No hay clientes para mostrar" }), _jsx("p", { className: "text-gray-600", children: viewMode === "ALL"
                                    ? "Los clientes aparecerán aquí cuando estén registrados en tu gimnasio."
                                    : "No tienes clientes asignados en este momento." })] }))] }), _jsx(FooterPag, {})] }));
}
