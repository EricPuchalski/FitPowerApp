import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/ClientHeader.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
export const ClientHeader = ({ fullName, onLogout }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    const getInitials = (name) => {
        if (!name || typeof name !== 'string')
            return "";
        const names = name.trim().split(" ");
        if (names.length === 0)
            return "";
        const firstNameInitial = names[0][0] || "";
        const lastNameInitial = names.length > 1 ? names[names.length - 1][0] : "";
        return `${firstNameInitial}${lastNameInitial}`.toUpperCase();
    };
    const handleChangePassword = () => {
        navigate("/change-password");
    };
    return (_jsx("header", { className: "bg-indigo-800 text-white shadow-md", children: _jsxs("div", { className: "container mx-auto px-4 py-4 flex justify-between items-center", children: [_jsx("h1", { className: "text-2xl font-bold", children: "FITPOWER" }), _jsxs("div", { className: "flex items-center space-x-4 relative", children: [_jsx("span", { className: "font-medium", children: fullName || "Usuario" }), _jsx("div", { className: "w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center font-bold", children: getInitials(fullName) }), _jsx("button", { onClick: toggleMenu, className: "flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-sm", children: isMenuOpen ? "▲" : "▼" }), isMenuOpen && (_jsxs("div", { className: "absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20", children: [_jsx("button", { onClick: handleChangePassword, className: "block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200", children: "Cambiar contrase\u00F1a" }), _jsx("button", { onClick: onLogout, className: "block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-300", children: "Cerrar sesi\u00F3n" })] }))] })] }) }));
};
