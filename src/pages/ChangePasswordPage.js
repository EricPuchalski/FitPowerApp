import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../auth/service/AuthService';
import { FooterPag } from '../components/Footer';
export default function ChangePasswordPage() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await authService.changePassword(currentPassword, newPassword);
            setMessage('Contraseña actualizada con éxito');
            setTimeout(() => navigate('/'), 2000);
        }
        catch (err) {
            if (err.response?.data) {
                const data = err.response.data;
                if (typeof data === 'object' && !Array.isArray(data)) {
                    const validationMessages = Object.values(data).join(', ');
                    setMessage(validationMessages);
                }
                else if (typeof data === 'string') {
                    setMessage(data);
                }
                else if (data.message) {
                    setMessage(data.message);
                }
                else {
                    setMessage("Error desconocido");
                }
            }
            else {
                setMessage("Error desconocido");
            }
        }
    };
    return (_jsxs("div", { className: "flex flex-col min-h-screen", children: [_jsx("header", { className: "bg-indigo-800 text-white shadow-md", children: _jsxs("div", { className: "container mx-auto px-4 py-4 flex justify-between items-center", children: [_jsx("h1", { className: "text-2xl font-bold", children: "FITPOWER" }), _jsx("button", { onClick: () => navigate(-1), className: "px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors", children: "Volver al Inicio" })] }) }), _jsxs("main", { className: "flex-grow container mx-auto p-4 max-w-md", children: [_jsx("h2", { className: "text-2xl mb-4", children: "Cambiar Contrase\u00F1a" }), message && _jsx("p", { className: "mb-4 text-red-600", children: message }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block", children: "Contrase\u00F1a Actual" }), _jsx("input", { type: "password", value: currentPassword, onChange: e => setCurrentPassword(e.target.value), required: true, className: "w-full p-2 border rounded" })] }), _jsxs("div", { children: [_jsx("label", { className: "block", children: "Nueva Contrase\u00F1a" }), _jsx("input", { type: "password", value: newPassword, onChange: e => setNewPassword(e.target.value), required: true, className: "w-full p-2 border rounded" })] }), _jsx("button", { type: "submit", className: "px-4 py-2 bg-blue-800 text-white rounded", children: "Guardar" })] })] }), _jsx(FooterPag, {})] }));
}
