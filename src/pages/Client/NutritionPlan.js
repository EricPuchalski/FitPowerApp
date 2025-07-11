import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FooterPag } from '../../components/Footer';
import { FiArrowRight, FiTarget, FiCalendar, FiUser } from 'react-icons/fi';
import { useAuth } from '../../auth/hook/useAuth';
import { ClientHeader } from '../../components/ClientHeader';
const NutritionPlanPage = () => {
    const [nutritionPlan, setNutritionPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { dni } = useParams();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const clientDni = dni || localStorage.getItem('userDni');
                if (!clientDni)
                    throw new Error('No se encontró el DNI del cliente');
                const response = await fetch(`http://localhost:8080/api/v1/clients/${clientDni}/nutrition-plans/active`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok)
                    throw new Error('Error al obtener el plan de nutrición');
                const data = await response.json();
                setNutritionPlan(Array.isArray(data) ? data[0] : data);
            }
            catch (err) {
                console.error(err);
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [dni]);
    const handleLogout = () => {
        logout();
        navigate("/");
    };
    const handleNavigateToRecords = () => {
        if (nutritionPlan)
            navigate(`/client/nutrition-plans/${nutritionPlan.id}/records`);
    };
    if (loading)
        return (_jsxs("div", { className: "flex flex-col items-center justify-center min-h-screen bg-gray-50", children: [_jsx("div", { className: "w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" }), _jsx("p", { className: "mt-4 text-lg text-gray-600", children: "Cargando tu plan de nutrici\u00F3n..." })] }));
    if (!nutritionPlan)
        return (_jsx("div", { className: "flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 text-center", children: _jsxs("div", { className: "max-w-md", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-700 mb-4", children: "No tienes un plan activo" }), _jsx("p", { className: "text-gray-600 mb-6", children: "Tu nutricionista est\u00E1 en proceso de realizar tu plan a medida, por favor espera!" }), _jsx("button", { onClick: () => navigate('/client'), className: "px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors", children: "Volver al inicio" })] }) }));
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 flex flex-col", children: [_jsx(ClientHeader, { fullName: nutritionPlan.clientName, onLogout: handleLogout }), _jsx("nav", { className: "bg-white shadow-sm", children: _jsxs("ul", { className: "container mx-auto px-4 flex", children: [_jsx("li", { className: "flex-1 text-center hover:bg-gray-50 transition-colors", children: _jsx("button", { onClick: () => navigate("/client"), className: "w-full py-4 font-medium text-gray-600 hover:text-gray-900", children: "Inicio" }) }), _jsx("li", { className: "flex-1 text-center hover:bg-gray-50 transition-colors", children: _jsx("button", { onClick: () => navigate("/client/training-plan"), className: "w-full py-4 font-medium text-gray-600 hover:text-gray-900", children: "Plan de Entrenamiento" }) }), _jsx("li", { className: "flex-1 text-center border-b-4 border-red-500", children: _jsx("button", { className: "w-full py-4 font-medium text-red-500", children: "Plan de Nutrici\u00F3n" }) })] }) }), _jsxs("main", { className: "flex-grow container mx-auto px-4 py-8", children: [_jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-800 mb-1", children: nutritionPlan.name }), _jsxs("div", { className: "flex items-center text-gray-500", children: [_jsx(FiCalendar, { className: "mr-2", size: 14 }), _jsxs("span", { className: "text-sm", children: ["Creado el ", new Date(nutritionPlan.createdAt).toLocaleDateString()] })] }), _jsxs("div", { className: "flex items-center text-green-500", children: [_jsx(FiCalendar, { className: "mr-2", size: 14 }), _jsxs("span", { className: "text-sm", children: ["Actualizado el ", new Date(nutritionPlan.updatedAt).toLocaleDateString()] })] })] }), _jsxs("button", { onClick: handleNavigateToRecords, className: "flex items-center px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors shadow-sm", children: [_jsx("span", { children: "Registrar Comida" }), _jsx(FiArrowRight, { className: "ml-2" })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs("div", { className: "bg-white rounded-lg shadow-sm p-6 border border-gray-100", children: [_jsxs("div", { className: "flex items-center mb-4", children: [_jsx("div", { className: "p-2 bg-indigo-100 rounded-lg text-indigo-600 mr-3", children: _jsx(FiTarget, { size: 20 }) }), _jsx("h3", { className: "text-lg font-semibold text-gray-800", children: "Metas Diarias" })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex justify-between items-center py-2 px-3 bg-indigo-50 rounded-md", children: [_jsx("span", { className: "text-gray-700", children: "Calor\u00EDas" }), _jsxs("span", { className: "font-semibold text-indigo-600", children: [nutritionPlan.caloricTarget, " kcal"] })] }), _jsxs("div", { className: "flex justify-between items-center py-2 px-3 bg-indigo-50 rounded-md", children: [_jsx("span", { className: "text-gray-700", children: "Carbohidratos" }), _jsxs("span", { className: "font-semibold text-indigo-600", children: [nutritionPlan.dailyCarbs, "g"] })] }), _jsxs("div", { className: "flex justify-between items-center py-2 px-3 bg-indigo-50 rounded-md", children: [_jsx("span", { className: "text-gray-700", children: "Prote\u00EDnas" }), _jsxs("span", { className: "font-semibold text-indigo-600", children: [nutritionPlan.dailyProteins, "g"] })] }), _jsxs("div", { className: "flex justify-between items-center py-2 px-3 bg-indigo-50 rounded-md", children: [_jsx("span", { className: "text-gray-700", children: "Grasas" }), _jsxs("span", { className: "font-semibold text-indigo-600", children: [nutritionPlan.dailyFats, "g"] })] })] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-sm p-6 border border-gray-100 lg:col-span-2", children: [_jsxs("div", { className: "mb-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-800 mb-3", children: "Recomendaciones" }), _jsx("div", { className: "bg-green-50 p-4 rounded-md", children: _jsx("p", { className: "text-gray-700 whitespace-pre-line", children: nutritionPlan.recommendations }) })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-800 mb-3", children: "Nutricionista" }), _jsxs("div", { className: "flex items-center bg-gray-50 p-3 rounded-md", children: [_jsx("div", { className: "w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mr-3", children: _jsx(FiUser, { size: 16 }) }), _jsx("div", { children: _jsx("p", { className: "font-medium text-gray-800", children: nutritionPlan.nutritionistName }) })] })] })] })] })] }), _jsx(FooterPag, {})] }));
};
export default NutritionPlanPage;
