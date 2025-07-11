//src/pages/Admin/DashboardAdmin.tsx
"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { useState } from "react";
import { Dumbbell, Users, Apple, ChevronRight, Settings, } from "lucide-react";
import { FooterPag } from "../../components/Footer";
import { FaUsers, FaClipboardList, FaAppleAlt } from "react-icons/fa";
import { useAuth } from "../../auth/hook/useAuth";
import { useNavigate } from "react-router-dom";
import { AdminHeader } from "../../components/AdminHeader";
export default function DashboardAdmin() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [datos, setDatos] = useState([]);
    const token = localStorage.getItem("token");
    const [totalClients, setTotalClients] = useState(0);
    const [totalNutritionists, setTotalNutritionists] = useState(0);
    const [totalTrainers, setTotalTrainers] = useState(0);
    const { logout } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        fetch("http://localhost:8080/api/clients", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => setDatos(data));
        fetch("http://localhost:8080/totalClients")
            .then((response) => response.json())
            .then((data) => setTotalClients(data));
        fetch("http://localhost:8080/totalNutritionists")
            .then((response) => response.json())
            .then((data) => setTotalNutritionists(data));
        fetch("http://localhost:8080/totalTrainers")
            .then((response) => response.json())
            .then((data) => setTotalTrainers(data));
    }, []);
    const handleLogout = () => {
        logout();
        navigate("/");
    };
    return (_jsxs("div", { className: "flex flex-col min-h-screen bg-gray-100", children: [_jsx(AdminHeader, { onLogout: handleLogout }), _jsxs("main", { className: "flex-grow container mx-auto px-4 py-8", children: [_jsxs("div", { className: "relative rounded-lg overflow-hidden shadow-2xl", children: [_jsx("img", { width: 1200, height: 350, className: "w-full h-[400px] object-cover", src: "../../public/dashboard.png", alt: "das" }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-blue-900/80 to-indigo-900/80 flex items-center justify-center", children: _jsxs("p", { className: "text-white text-5xl font-bold text-center px-4 drop-shadow-lg", children: ["Transforma tu cuerpo,", _jsx("br", {}), "transforma tu vida"] }) })] }), _jsxs("div", { className: "mt-12 grid md:grid-cols-4 gap-8", children: [_jsxs("div", { className: "bg-white p-6 rounded-lg shadow-md border-t-4 border-gray-600 hover:shadow-xl transition duration-300", children: [_jsx(Settings, { className: "w-12 h-12 text-gray-600 mb-4" }), _jsx("h2", { className: "text-xl font-semibold mb-2", children: "Seguridad" }), _jsx("p", { className: "text-gray-600 mb-4", children: "Resetear contrase\u00F1as de usuarios" }), _jsxs("a", { href: "/admin/reset-password", className: "inline-flex items-center text-gray-600 hover:text-gray-800", children: ["Ir a seguridad ", _jsx(ChevronRight, { size: 20 })] })] }), _jsxs("div", { className: "bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-800 hover:shadow-xl transition duration-300", children: [_jsx(Dumbbell, { className: "w-12 h-12 text-blue-800 mb-4" }), _jsx("h2", { className: "text-xl font-semibold mb-2", children: "Programas de Entrenamiento" }), _jsx("p", { className: "text-gray-600", children: "Dise\u00F1a y gestiona programas personalizados para tus clientes." })] }), _jsxs("div", { className: "bg-white p-6 rounded-lg shadow-md border-t-4 border-indigo-600 hover:shadow-xl transition duration-300", children: [_jsx(Apple, { className: "w-12 h-12 text-indigo-600 mb-4" }), _jsx("h2", { className: "text-xl font-semibold mb-2", children: "Planes Nutricionales" }), _jsx("p", { className: "text-gray-600", children: "Crea planes de alimentaci\u00F3n adaptados a las necesidades de cada cliente." })] }), _jsxs("div", { className: "bg-white p-6 rounded-lg shadow-md border-t-4 border-pink-600 hover:shadow-xl transition duration-300", children: [_jsx(Users, { className: "w-12 h-12 text-pink-600 mb-4" }), _jsx("h2", { className: "text-xl font-semibold mb-2", children: "Gesti\u00F3n de Miembros" }), _jsx("p", { className: "text-gray-600", children: "Administra f\u00E1cilmente la informaci\u00F3n y progreso de tus clientes." })] }), _jsxs("div", { className: "bg-white p-6 rounded-lg shadow-md border-t-4 border-green-600 hover:shadow-xl transition duration-300", children: [_jsx(Settings, { className: "w-12 h-12 text-green-600 mb-4" }), _jsx("h2", { className: "text-xl font-semibold mb-2", children: "Ejercicios" }), _jsx("p", { className: "text-gray-600", children: "Administra y crea ejercicios disponibles para los entrenadores." }), _jsxs("a", { href: "/exercises", className: "mt-4 inline-flex items-center text-green-600 hover:text-green-800", children: ["Ir a ejercicios ", _jsx(ChevronRight, { size: 20 })] })] })] }), _jsxs("div", { className: "mt-12 bg-white rounded-lg shadow-md p-6", children: [_jsx("h2", { className: "text-2xl font-semibold mb-4", children: "Resumen" }), _jsxs("div", { className: "grid md:grid-cols-3 gap-6", children: [_jsxs("div", { className: "flex items-center space-x-4 p-4 bg-blue-100 rounded-lg", children: [_jsx(FaUsers, { className: "w-10 h-10 text-blue-600" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-blue-600", children: "Total de Clientes" }), _jsx("p", { className: "text-2xl font-bold text-blue-800", children: totalClients })] })] }), _jsxs("div", { className: "flex items-center space-x-4 p-4 bg-indigo-100 rounded-lg", children: [_jsx(FaClipboardList, { className: "w-10 h-10 text-indigo-600" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-indigo-600", children: "Total de Entrenadores" }), _jsx("p", { className: "text-2xl font-bold text-indigo-800", children: totalTrainers })] })] }), _jsxs("div", { className: "flex items-center space-x-4 p-4 bg-pink-100 rounded-lg", children: [_jsx(FaAppleAlt, { className: "w-10 h-10 text-pink-600" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-pink-600", children: "Total de Nutricionistas" }), _jsx("p", { className: "text-2xl font-bold text-pink-800", children: totalNutritionists })] })] })] })] })] }), _jsx(FooterPag, {})] }));
}
