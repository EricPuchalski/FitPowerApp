import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import authService from '../../auth/service/AuthService';
import { FooterPag } from '../../components/Footer';
import { AdminHeader } from '../../components/AdminHeader'; // o TrainerHeader si querés usar ese
export default function ResetPasswordPage() {
    const [username, setUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState(null);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await authService.resetPassword(username, newPassword);
            setMessage(`Contraseña de ${username} reseteada con éxito`);
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
    return (_jsxs("div", { className: "flex flex-col min-h-screen", children: [_jsx(AdminHeader, { onLogout: function () {
                    throw new Error('Function not implemented.');
                } }), " ", _jsxs("main", { className: "flex-grow container mx-auto p-4 max-w-md", children: [_jsx("h2", { className: "text-2xl mb-4", children: "Resetear Contrase\u00F1a de los Usuarios" }), message && _jsx("p", { className: "mb-4 text-red-600", children: message }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block", children: "Username del usuario" }), _jsx("input", { type: "text", value: username, onChange: e => setUsername(e.target.value), required: true, className: "w-full p-2 border rounded" })] }), _jsxs("div", { children: [_jsx("label", { className: "block", children: "Nueva Contrase\u00F1a para el usuario" }), _jsx("input", { type: "password", value: newPassword, onChange: e => setNewPassword(e.target.value), required: true, className: "w-full p-2 border rounded" })] }), _jsx("button", { type: "submit", className: "px-4 py-2 bg-red-600 text-white rounded", children: "Resetear" })] })] }), _jsx(FooterPag, {})] }));
}
