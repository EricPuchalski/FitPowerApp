import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/components/TrainerHeader.tsx
import { Dumbbell, Home, Users, Menu, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
export const TrainerHeader = ({ onLogout }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };
    const handleChangePassword = () => {
        navigate("/change-password");
    };
    return (_jsxs(_Fragment, { children: [_jsx("header", { className: "bg-gradient-to-r from-blue-900 to-indigo-900 text-white shadow-lg", children: _jsxs("div", { className: "container mx-auto px-4 py-4 flex justify-between items-center", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Dumbbell, { className: "w-8 h-8" }), _jsx("h1", { className: "text-2xl font-bold", children: "FitPower Trainer" })] }), _jsxs("div", { className: "flex items-center space-x-6", children: [_jsx("nav", { className: "hidden md:flex space-x-6", children: _jsxs("a", { href: "/trainer/dashboard", className: "hover:text-blue-200 flex items-center space-x-1", children: [_jsx(Home, { size: 18 }), _jsx("span", { children: "Inicio" })] }) }), _jsxs("div", { className: "relative hidden md:block", children: [_jsx("button", { onClick: toggleDropdown, className: "flex items-center justify-center bg-blue-800 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm", children: isDropdownOpen ? "▲" : "▼" }), isDropdownOpen && (_jsxs("div", { className: "absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20", children: [_jsx("button", { onClick: handleChangePassword, className: "block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200", children: "Cambiar contrase\u00F1a" }), _jsx("button", { onClick: onLogout, className: "block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-300", children: "Cerrar sesi\u00F3n" })] }))] }), _jsx("button", { className: "md:hidden bg-blue-800 p-2 rounded", onClick: toggleMenu, children: isMenuOpen ? _jsx(X, { size: 24 }) : _jsx(Menu, { size: 24 }) })] })] }) }), isMenuOpen && (_jsx("div", { className: "md:hidden bg-indigo-800 text-white", children: _jsxs("nav", { className: "p-4 flex flex-col space-y-2", children: [_jsxs("a", { href: "/trainer", className: "hover:bg-indigo-700 p-2 rounded flex items-center space-x-2", children: [_jsx(Home, { size: 18 }), _jsx("span", { children: "Inicio" })] }), _jsxs("a", { href: "/trainer/clients", className: "hover:bg-indigo-700 p-2 rounded flex items-center space-x-2", children: [_jsx(Users, { size: 18 }), _jsx("span", { children: "Clientes" })] }), _jsxs("a", { href: "/exercises", className: "hover:bg-indigo-700 p-2 rounded flex items-center space-x-2", children: [_jsx(Dumbbell, { size: 18 }), _jsx("span", { children: "Ejercicios" })] }), _jsx("button", { onClick: handleChangePassword, className: "hover:bg-gray-600 p-2 rounded flex items-center space-x-2 text-left w-full", children: _jsx("span", { children: "Cambiar contrase\u00F1a" }) }), _jsx("button", { onClick: onLogout, className: "hover:bg-red-600 p-2 rounded flex items-center space-x-2 text-left w-full", children: _jsx("span", { children: "Cerrar sesi\u00F3n" }) })] }) }))] }));
};
