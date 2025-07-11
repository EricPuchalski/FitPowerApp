import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, Edit2, Trash2, Calendar, FileText, User, Clock, Target, Activity, List } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Card, Button, Badge, Container, Row, Col, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { NutritionistHeader } from "../../components/NutritionistHeader";
import { useAuth } from "../../auth/hook/useAuth";
import { FooterPag } from "../../components/Footer";
export default function DashboardNutritionistPlans() {
    const { clientDni } = useParams();
    const [activePlan, setActivePlan] = useState(null);
    const [client, setClient] = useState(null);
    const [loading, setLoading] = useState({
        client: true,
        plan: true
    });
    const navigate = useNavigate();
    const { logout } = useAuth();
    useEffect(() => {
        const token = localStorage.getItem("token");
        // Función para buscar los datos del cliente
        const fetchClientData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/v1/clients/${clientDni}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                console.log(response);
                if (response.status === 404) {
                    setClient(null);
                }
                else if (!response.ok) {
                    throw new Error("Error al obtener los datos del cliente");
                }
                else {
                    const clientData = await response.json();
                    setClient(clientData);
                }
            }
            catch (error) {
                console.error("Error fetching client data:", error);
                toast.error("Error al cargar los datos del cliente");
            }
            finally {
                setLoading(prev => ({ ...prev, client: false }));
            }
        };
        // Función para buscar el plan activo
        const fetchActivePlan = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/v1/clients/${clientDni}/nutrition-plans/active`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                if (response.status === 404) {
                    setActivePlan(null);
                }
                else if (!response.ok) {
                    throw new Error("Error al obtener el plan activo");
                }
                else {
                    const planData = await response.json();
                    setActivePlan(planData);
                }
            }
            catch (error) {
                console.error("Error fetching active plan:", error);
                toast.error("Error al cargar el plan nutricional activo");
            }
            finally {
                setLoading(prev => ({ ...prev, plan: false }));
            }
        };
        // Ejecutar ambas búsquedas
        fetchClientData();
        fetchActivePlan();
    }, [clientDni]);
    const deletePlan = async (planId) => {
        const confirmed = window.confirm("¿Estás seguro de que deseas eliminar este plan?");
        if (!confirmed)
            return;
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:8080/api/v1/clients/${clientDni}/nutrition-plans/${planId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error("Error al eliminar el plan");
            }
            setActivePlan(null);
            toast.success("Plan eliminado correctamente");
        }
        catch (error) {
            console.error(error);
            toast.error("Error al eliminar el plan");
        }
    };
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };
    const getDaysActive = (createdAt) => {
        const today = new Date();
        const created = new Date(createdAt);
        const diffTime = today.getTime() - created.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };
    const handleLogout = () => {
        logout();
        navigate("/");
    };
    if (loading.client || loading.plan) {
        return (_jsx(Container, { className: "py-5", children: _jsx(Row, { children: _jsx(Col, { className: "text-center", children: _jsx("div", { className: "d-flex justify-content-center align-items-center", style: { minHeight: "400px" }, children: _jsxs("div", { children: [_jsx(Spinner, { animation: "border", variant: "primary", className: "mb-3" }), _jsx("p", { className: "text-muted", children: "Cargando datos del cliente..." })] }) }) }) }) }));
    }
    if (!client) {
        return (_jsx(Container, { className: "py-5", children: _jsx(Row, { children: _jsx(Col, { className: "text-center", children: _jsx("div", { className: "d-flex justify-content-center align-items-center", style: { minHeight: "400px" }, children: _jsxs("div", { children: [_jsx("h3", { className: "h4 fw-semibold text-dark mb-2", children: "Cliente no encontrado" }), _jsxs("p", { className: "text-muted mb-4", children: ["No se encontr\u00F3 un cliente con el DNI: ", clientDni] }), _jsx(Button, { onClick: () => navigate("/nutritionist/clients"), variant: "primary", style: { backgroundColor: "#e91e63", borderColor: "#e91e63" }, children: "Volver a la lista de clientes" })] }) }) }) }) }));
    }
    return (_jsxs(_Fragment, { children: [_jsx(NutritionistHeader, { onLogout: handleLogout }), _jsxs(Container, { className: "py-5", children: [_jsxs("div", { className: "mb-5", children: [_jsx(Row, { className: "align-items-center mb-4", children: _jsxs(Col, { xs: "auto", children: [_jsxs(Button, { onClick: () => navigate(`/nutritionist/client/${clientDni}/nutrition-plans/new/edit`), variant: "primary", style: { backgroundColor: "#4CAF50", borderColor: "#4CAF50" }, children: [_jsx(Plus, { className: "me-2", size: 16 }), "Nuevo Plan"] }), _jsxs(Button, { onClick: () => navigate(`/nutritionist/client/${clientDni}/history`), variant: "secondary", style: { backgroundColor: "#2196F3", borderColor: "#2196F3", marginLeft: "10px" }, children: [_jsx(List, { className: "me-2", size: 16 }), "Ver Historial"] })] }) }), _jsxs("div", { className: "text-center", children: [_jsx("h1", { className: "display-5 fw-bold text-dark mb-3", children: "Plan Nutricional Activo" }), _jsxs("div", { className: "d-flex flex-column flex-md-row justify-content-center align-items-center text-muted gap-3", children: [_jsxs("div", { className: "d-flex align-items-center", children: [_jsx(User, { className: "me-2", size: 16 }), _jsxs("span", { className: "fs-5", children: ["Cliente: ", client.name, " ", client.lastName, " (DNI: ", client.dni, ")"] })] }), _jsx("div", { className: "d-flex align-items-center", children: _jsxs("span", { className: "fs-5", children: ["Objetivo: ", client.goal] }) })] }), client.initialPhysicalCondition && (_jsxs("div", { className: "mt-3", children: [_jsx("h4", { className: "h5 fw-semibold", children: "Estado F\u00EDsico Inicial" }), _jsx("p", { className: "text-muted", children: client.initialPhysicalCondition })] }))] })] }), !activePlan ? (_jsx(Card, { className: "text-center p-5", children: _jsx(Card.Body, { children: _jsxs("div", { className: "mb-4", children: [_jsx("div", { className: "mx-auto bg-light rounded-circle d-flex align-items-center justify-content-center mb-4", style: { width: "96px", height: "96px" }, children: _jsx(FileText, { className: "text-muted", size: 48 }) }), _jsx("h3", { className: "h4 fw-semibold text-dark mb-2", children: "No hay plan activo" }), _jsx("p", { className: "text-muted mb-4", style: { maxWidth: "400px", margin: "0 auto" }, children: "Este cliente no tiene un plan nutricional activo en este momento. Crea uno nuevo para comenzar su seguimiento nutricional." }), _jsxs(Button, { onClick: () => navigate(`/nutritionist/client/${clientDni}/nutrition-plans/new/edit`), variant: "primary", style: { backgroundColor: "#e91e63", borderColor: "#e91e63" }, children: [_jsx(Plus, { className: "me-2", size: 16 }), "Crear Primer Plan"] })] }) }) })) : (_jsxs(Card, { className: "overflow-hidden border-start border-5", style: { borderLeftColor: "#e91e63" }, children: [_jsx(Card.Header, { style: { background: "linear-gradient(135deg, #fce4ec 0%, #f3e5f5 100%)" }, children: _jsx(Row, { className: "align-items-start", children: _jsxs(Col, { children: [_jsxs("div", { className: "d-flex align-items-center gap-3 mb-2", children: [_jsx(Card.Title, { className: "h3 text-dark mb-0", children: activePlan.name }), _jsx(Badge, { bg: activePlan.active ? "success" : "secondary", children: activePlan.active ? "Activo" : "Inactivo" })] }), _jsx(Card.Text, { className: "text-dark mb-2", children: activePlan.recommendations || "Sin recomendaciones disponibles" }), _jsxs("div", { className: "d-flex gap-3 text-muted small", children: [_jsxs("span", { children: ["\uD83D\uDCCA Meta cal\u00F3rica: ", activePlan.caloricTarget, " kcal"] }), _jsxs("span", { children: ["\uD83D\uDC68\u200D\u2695\uFE0F Nutricionista: ", activePlan.nutritionistName] })] })] }) }) }), _jsxs(Card.Body, { className: "pt-4", children: [_jsxs(Row, { className: "g-4 mb-4", children: [_jsx(Col, { md: 3, children: _jsxs("div", { className: "d-flex align-items-center p-3 bg-primary bg-opacity-10 rounded", children: [_jsx("div", { className: "me-3", children: _jsx(Target, { className: "text-primary", size: 24 }) }), _jsxs("div", { children: [_jsx("p", { className: "small fw-medium text-primary mb-1", children: "Objetivo Cal\u00F3rico" }), _jsxs("p", { className: "fs-6 fw-semibold text-primary mb-0", children: [activePlan.caloricTarget, " kcal"] })] })] }) }), _jsx(Col, { md: 3, children: _jsxs("div", { className: "d-flex align-items-center p-3 bg-success bg-opacity-10 rounded", children: [_jsx("div", { className: "me-3", children: _jsx(Activity, { className: "text-success", size: 24 }) }), _jsxs("div", { children: [_jsx("p", { className: "small fw-medium text-success mb-1", children: "Carbohidratos" }), _jsxs("p", { className: "fs-6 fw-semibold text-success mb-0", children: [activePlan.dailyCarbs, "g"] })] })] }) }), _jsx(Col, { md: 3, children: _jsxs("div", { className: "d-flex align-items-center p-3 bg-warning bg-opacity-10 rounded", children: [_jsx("div", { className: "me-3", children: _jsx(Activity, { className: "text-warning", size: 24 }) }), _jsxs("div", { children: [_jsx("p", { className: "small fw-medium text-warning mb-1", children: "Prote\u00EDnas" }), _jsxs("p", { className: "fs-6 fw-semibold text-warning mb-0", children: [activePlan.dailyProteins, "g"] })] })] }) }), _jsx(Col, { md: 3, children: _jsxs("div", { className: "d-flex align-items-center p-3 bg-info bg-opacity-10 rounded", children: [_jsx("div", { className: "me-3", children: _jsx(Activity, { className: "text-info", size: 24 }) }), _jsxs("div", { children: [_jsx("p", { className: "small fw-medium text-info mb-1", children: "Grasas" }), _jsxs("p", { className: "fs-6 fw-semibold text-info mb-0", children: [activePlan.dailyFats, "g"] })] })] }) })] }), _jsxs(Row, { className: "g-4 mb-4", children: [_jsx(Col, { md: 6, children: _jsxs("div", { className: "d-flex align-items-center p-3 bg-secondary bg-opacity-10 rounded", children: [_jsx("div", { className: "me-3", children: _jsx(Calendar, { className: "text-secondary", size: 24 }) }), _jsxs("div", { children: [_jsx("p", { className: "small fw-medium text-secondary mb-1", children: "Fecha de Creaci\u00F3n" }), _jsx("p", { className: "fs-6 fw-semibold text-secondary mb-0", children: formatDate(activePlan.createdAt) })] })] }) }), _jsx(Col, { md: 6, children: _jsxs("div", { className: "d-flex align-items-center p-3 bg-dark bg-opacity-10 rounded", children: [_jsx("div", { className: "me-3", children: _jsx(Clock, { className: "text-dark", size: 24 }) }), _jsxs("div", { children: [_jsx("p", { className: "small fw-medium text-dark mb-1", children: "D\u00EDas Activo" }), _jsx("p", { className: "fs-6 fw-semibold text-dark mb-0", children: getDaysActive(activePlan.createdAt) > 0
                                                                        ? `${getDaysActive(activePlan.createdAt)} días`
                                                                        : "Recién creado" })] })] }) })] }), _jsx("hr", { className: "my-4" }), _jsxs("div", { className: "d-flex flex-wrap gap-3", children: [_jsxs(Button, { onClick: () => navigate(`/nutritionist/client/${clientDni}/nutrition-plans/${activePlan.id}/edit`), variant: "primary", children: [_jsx(Edit2, { className: "me-2", size: 16 }), "Editar Plan"] }), _jsxs(Button, { variant: "outline-danger", onClick: () => deletePlan(activePlan.id), children: [_jsx(Trash2, { className: "me-2", size: 16 }), "Eliminar Plan"] }), _jsxs(Button, { variant: "outline-secondary", onClick: () => navigate(`/nutritionist/client/${activePlan.clientDni}/nutrition-plans/report`), children: [_jsx(FileText, { className: "me-2", size: 16 }), "Generar Informe"] })] })] })] }, activePlan.id)), _jsx(ToastContainer, { position: "bottom-right", autoClose: 3000, hideProgressBar: false, newestOnTop: false, closeOnClick: true, rtl: false, pauseOnFocusLoss: true, draggable: true, pauseOnHover: true })] }), _jsx(FooterPag, {})] }));
}
