import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
//src/pages/Client/DashboardClient.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FooterPag } from "../../components/Footer";
import { useAuth } from "../../auth/hook/useAuth";
import { ClientHeader } from "../../components/ClientHeader";
const ClientDashboard = () => {
    const [client, setClient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { logout } = useAuth();
    const handleLogout = () => {
        logout();
        navigate("/"); // o "/login" si tenés una ruta específica
    };
    //planes
    const [activeNutritionPlanId, setActiveNutritionPlanId] = useState(null);
    const [activeTrainingPlanId, setActiveTrainingPlanId] = useState(null);
    const [fetchingPlans, setFetchingPlans] = useState(false);
    // editar
    const [isEditingGoal, setIsEditingGoal] = useState(false);
    const [editedGoal, setEditedGoal] = useState(client?.goal);
    const [isSaving, setIsSaving] = useState(false);
    useEffect(() => {
        const fetchClientData = async () => {
            try {
                const clientDni = localStorage.getItem("userDni");
                if (!clientDni) {
                    throw new Error("No se encontró el DNI del cliente en el almacenamiento local");
                }
                const token = localStorage.getItem("token");
                const response = await fetch(`http://localhost:8080/api/v1/clients/${clientDni}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
                const data = await response.json();
                setClient(data);
                console.log(data);
            }
            catch (err) {
                setError(err instanceof Error ? err.message : "Ocurrió un error desconocido");
            }
            finally {
                setLoading(false);
            }
        };
        fetchClientData();
    }, []);
    useEffect(() => {
        const fetchActivePlans = async () => {
            try {
                if (!client)
                    return;
                setFetchingPlans(true);
                const token = localStorage.getItem("token");
                const clientDni = client.dni;
                // Obtener plan de nutrición activo
                const nutritionResponse = await fetch(`http://localhost:8080/api/v1/clients/${clientDni}/nutrition-plans/active`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                if (nutritionResponse.ok) {
                    const nutritionData = await nutritionResponse.json();
                    setActiveNutritionPlanId(nutritionData.id);
                }
                // Obtener plan de entrenamiento activo
                const trainingResponse = await fetch(`http://localhost:8080/api/v1/training-plans/clients/${clientDni}/active`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                if (trainingResponse.ok) {
                    const trainingData = await trainingResponse.json();
                    if (trainingData && trainingData.id) {
                        setActiveTrainingPlanId(trainingData.id);
                    }
                }
            }
            catch (err) {
                console.error("Error al obtener planes activos:", err);
            }
            finally {
                setFetchingPlans(false);
            }
        };
        fetchActivePlans();
    }, [client]);
    // Funciones para manejar la navegación
    const handleNavigateToNutritionRecords = () => {
        if (activeNutritionPlanId) {
            navigate(`/client/nutrition-plans/${activeNutritionPlanId}/records`);
        }
        else {
            // Puedes mostrar un toast o mensaje indicando que no hay plan activo
            alert("No tienes un plan de nutrición activo. Contacta a tu nutricionista.");
        }
    };
    const handleNavigateToTrainingRecords = () => {
        if (activeTrainingPlanId) {
            navigate(`/client/training-plan/${activeTrainingPlanId}/records`);
        }
        else {
            // Puedes mostrar un toast o mensaje indicando que no hay plan activo
            alert("No tienes un plan de entrenamiento activo. Contacta a tu entrenador.");
        }
    };
    const handleUpdateGoal = async () => {
        try {
            setIsSaving(true);
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:8080/api/v1/clients/${client?.id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    goal: editedGoal,
                }),
            });
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            const updatedClient = await response.json();
            setClient(updatedClient);
            setIsEditingGoal(false);
        }
        catch (err) {
            console.error("Error al actualizar el objetivo:", err);
            // Puedes agregar un toast o mensaje de error aquí
        }
        finally {
            setIsSaving(false);
        }
    };
    if (loading) {
        return (_jsxs("div", { className: "flex flex-col items-center justify-center min-h-screen bg-gray-50", children: [_jsx("div", { className: "w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" }), _jsx("p", { className: "mt-4 text-lg text-gray-600", children: "Cargando tu informaci\u00F3n..." })] }));
    }
    if (error) {
        return (_jsxs("div", { className: "flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4", children: [_jsx("h2", { className: "text-2xl font-bold text-red-500 mb-4", children: "Error" }), _jsx("p", { className: "text-gray-700 mb-6", children: error }), _jsx("button", { onClick: () => window.location.reload(), className: "px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors", children: "Intentar nuevamente" })] }));
    }
    if (!client) {
        return (_jsxs("div", { className: "flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-700 mb-4", children: "No se encontraron datos del cliente" }), _jsx("p", { className: "text-gray-600", children: "Por favor, contacta al soporte t\u00E9cnico." })] }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 flex flex-col", children: [_jsx(ClientHeader, { fullName: client.name + " " + client.lastName, onLogout: handleLogout }), _jsx("nav", { className: "bg-white shadow-sm", children: _jsxs("ul", { className: "container mx-auto px-4 flex", children: [_jsx("li", { className: "flex-1 text-center border-b-4 border-red-500", children: _jsx("button", { className: "w-full py-4 font-medium text-red-500", onClick: () => navigate("/client"), children: "Inicio" }) }), _jsx("li", { className: "flex-1 text-center hover:bg-gray-50 transition-colors", children: _jsx("button", { onClick: () => navigate("/client/training-plan"), className: "w-full py-4 font-medium text-gray-600 hover:text-gray-900", children: "Plan de Entrenamiento" }) }), _jsx("li", { className: "flex-1 text-center hover:bg-gray-50 transition-colors", children: _jsx("button", { onClick: () => navigate("/client/nutrition-plan"), className: "w-full py-4 font-medium text-gray-600 hover:text-gray-900", children: "Plan de Nutrici\u00F3n" }) })] }) }), _jsxs("main", { className: "flex-grow container mx-auto px-4 py-8", children: [_jsxs("section", { className: "text-center mb-8", children: [_jsxs("h2", { className: "text-3xl font-bold text-gray-800 mb-2", children: ["Bienvenido, ", client.name] }), _jsx("div", { className: "flex items-center justify-center", children: isEditingGoal ? (_jsxs("div", { className: "flex items-center", children: [_jsx("input", { type: "text", value: editedGoal, onChange: (e) => setEditedGoal(e.target.value), className: "text-xl text-gray-600 border-b border-indigo-600 px-2 py-1 mr-2 focus:outline-none" }), _jsx("button", { onClick: handleUpdateGoal, disabled: isSaving, className: "px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400", children: isSaving ? "Guardando..." : "Guardar" }), _jsx("button", { onClick: () => {
                                                setIsEditingGoal(false);
                                                setEditedGoal(client.goal);
                                            }, className: "px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 ml-2", children: "Cancelar" })] })) : (_jsxs("div", { className: "flex items-center", children: [_jsxs("p", { className: "text-xl text-gray-600 mr-2", children: ["Tu objetivo:", " ", _jsx("strong", { className: "text-indigo-600", children: client.goal })] }), _jsx("button", { onClick: () => setIsEditingGoal(true), className: "text-gray-500 hover:text-indigo-600 focus:outline-none", children: _jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" }) }) })] })) }), _jsx("p", { className: "text-gray-500", children: "Estamos aqu\u00ED para ayudarte a alcanzar tus metas de fitness." })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8", children: [_jsxs("section", { className: "bg-white rounded-lg shadow-sm p-6", children: [_jsx("h3", { className: "text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100", children: "Informaci\u00F3n Personal" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm text-gray-500 mb-1", children: "Nombre completo" }), _jsxs("p", { className: "font-medium", children: [client.name, " ", client.lastName] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm text-gray-500 mb-1", children: "DNI" }), _jsx("p", { className: "font-medium", children: client.dni })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm text-gray-500 mb-1", children: "Tel\u00E9fono" }), _jsx("p", { className: "font-medium", children: client.phoneNumber })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm text-gray-500 mb-1", children: "Email" }), _jsx("p", { className: "font-medium", children: client.email })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm text-gray-500 mb-1", children: "Direcci\u00F3n" }), _jsx("p", { className: "font-medium", children: client.address })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm text-gray-500 mb-1", children: "Gimnasio" }), _jsx("p", { className: "font-medium", children: client.gymName })] })] })] }), _jsxs("section", { className: "bg-white rounded-lg shadow-sm p-6", children: [_jsx("h3", { className: "text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100", children: "Acciones R\u00E1pidas" }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("button", { className: "flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-md transition-all", onClick: handleNavigateToTrainingRecords, disabled: fetchingPlans || !activeTrainingPlanId, children: [_jsx("div", { className: "text-3xl mb-2", children: "\uD83D\uDCDD" }), _jsx("span", { className: "text-sm font-medium text-center", children: fetchingPlans ? "Cargando..." : "Registrar entrenamiento" }), !activeTrainingPlanId && !fetchingPlans && (_jsx("span", { className: "text-xs text-red-500 mt-1", children: "Sin plan activo" }))] }), _jsxs("button", { className: "flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-md transition-all", onClick: handleNavigateToNutritionRecords, disabled: fetchingPlans || !activeNutritionPlanId, children: [_jsx("div", { className: "text-3xl mb-2", children: "\uD83C\uDF7D\uFE0F" }), _jsx("span", { className: "text-sm font-medium text-center", children: fetchingPlans ? "Cargando..." : "Registrar comida" }), !activeNutritionPlanId && !fetchingPlans && (_jsx("span", { className: "text-xs text-red-500 mt-1", children: "Sin plan activo" }))] }), _jsxs("button", { className: "flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-md transition-all", onClick: () => navigate(`/client/history/${client.dni}`), children: [_jsx("div", { className: "text-3xl mb-2", children: "\uD83D\uDCDC" }), _jsx("span", { className: "text-sm font-medium text-center", children: "Ver mi historial" })] }), _jsxs("button", { className: "flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-md transition-all", onClick: () => navigate(`/client/${client.dni}/progress`), children: [_jsx("div", { className: "text-3xl mb-2", children: "\uD83D\uDCCA" }), _jsx("span", { className: "text-sm font-medium text-center", children: "Ver mi progreso" })] })] })] })] })] }), _jsx(FooterPag, {})] }));
};
export default ClientDashboard;
