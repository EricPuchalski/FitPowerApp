"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, TextField, Card, CardContent, Typography, Box, CircularProgress, Alert, Chip, } from "@mui/material";
import { Assignment, Info } from "@mui/icons-material";
import TrainingReport from "../../components/TrainingReport";
import { FooterPag } from "../../components/Footer";
export default function ReportClient() {
    const { clientDni } = useParams();
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [trainerComment, setTrainerComment] = useState("");
    const [nextSteps, setNextSteps] = useState("");
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [trainingPlan, setTrainingPlan] = useState(null);
    const [planLoading, setPlanLoading] = useState(true);
    const navigate = useNavigate();
    // Función para formatear fecha para mostrar (DD/MM/YYYY)
    const formatDisplayDate = (dateString) => {
        const date = new Date(dateString);
        // Ajustamos agregando un día para compensar el problema de zona horaria
        date.setDate(date.getDate() + 1);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };
    // Función para formatear fecha para inputs (YYYY-MM-DD)
    const formatInputDate = (dateString) => {
        const date = new Date(dateString);
        // No ajustamos aquí para que los inputs funcionen correctamente
        return date.toISOString().split('T')[0];
    };
    // Obtener el plan de entrenamiento activo
    useEffect(() => {
        const fetchActiveTrainingPlan = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("No se encontró el token de autenticación");
                setPlanLoading(false);
                return;
            }
            try {
                const response = await fetch(`http://localhost:8080/api/v1/training-plans/clients/${clientDni}/active`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error("No se pudo obtener el plan de entrenamiento");
                }
                const data = await response.json();
                setTrainingPlan(data);
                // Establecer fechas por defecto (createdAt hasta hoy)
                const today = new Date();
                const planStartDate = new Date(data.createdAt);
                setStartDate(formatInputDate(planStartDate));
                setEndDate(formatInputDate(today));
            }
            catch (err) {
                setError(err instanceof Error
                    ? err.message
                    : "Error al obtener el plan de entrenamiento");
            }
            finally {
                setPlanLoading(false);
            }
        };
        fetchActiveTrainingPlan();
    }, [clientDni]);
    const generateReport = async () => {
        // Validaciones adicionales
        if (!trainingPlan) {
            setError("No hay un plan de entrenamiento activo para este cliente");
            return;
        }
        const planStartDate = new Date(trainingPlan.createdAt);
        const selectedStartDate = new Date(startDate);
        if (selectedStartDate < planStartDate) {
            setError(`La fecha de inicio no puede ser anterior al inicio del plan (${formatDisplayDate(trainingPlan.createdAt)})`);
            return;
        }
        if (new Date(startDate) > new Date(endDate)) {
            setError("La fecha de inicio no puede ser mayor a la fecha final");
            return;
        }
        const token = localStorage.getItem("token");
        if (!token) {
            setError("No se encontró el token de autenticación. Inicia sesión nuevamente.");
            return;
        }
        setLoading(true);
        setError("");
        try {
            const response = await fetch(`http://localhost:8080/api/v1/clients/${clientDni}/reports/training?startDate=${startDate}&endDate=${endDate}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    trainerComment: trainerComment.trim(),
                    nextSteps: nextSteps.trim(),
                }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al generar el reporte");
            }
            const data = await response.json();
            setReportData(data);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "Error inesperado al generar el reporte");
        }
        finally {
            setLoading(false);
        }
    };
    const resetForm = () => {
        setReportData(null);
    };
    if (reportData) {
        return _jsx(TrainingReport, { data: reportData, onBack: resetForm });
    }
    if (planLoading) {
        return (_jsx(Box, { sx: { display: "flex", justifyContent: "center", mt: 4 }, children: _jsx(CircularProgress, {}) }));
    }
    return (_jsxs(_Fragment, { children: [_jsx("header", { className: "bg-indigo-800 text-white shadow-md", children: _jsxs("div", { className: "container mx-auto px-4 py-4 flex justify-between items-center", children: [_jsx("h1", { className: "text-2xl font-bold", children: "FITPOWER" }), _jsx("div", { className: "flex items-center space-x-3", children: _jsx("button", { onClick: () => navigate(-1), className: "px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors", children: "Volver al Inicio" }) })] }) }), _jsx(Box, { sx: { minHeight: "100vh", backgroundColor: "#f5f5f5", py: 4 }, children: _jsxs(Box, { sx: { maxWidth: 800, mx: "auto", px: 2 }, children: [_jsxs(Box, { sx: { textAlign: "center", mb: 4 }, children: [_jsxs(Box, { sx: { display: "flex", justifyContent: "center", gap: 1, mb: 2 }, children: [_jsx(Assignment, { sx: { fontSize: 40, color: "#fb8c00" } }), _jsx(Typography, { variant: "h4", component: "h1", sx: { fontWeight: "bold" }, children: "FitPower" })] }), _jsxs(Typography, { variant: "body1", sx: { color: "#757575" }, children: ["Informe de Entrenamiento para cliente DNI: ", clientDni] }), trainingPlan && (_jsxs(Box, { sx: { mt: 2 }, children: [_jsx(Chip, { label: `Plan activo: ${trainingPlan.name}`, color: "success", variant: "outlined", sx: { mr: 1 } }), _jsx(Chip, { label: `Inició el ${formatDisplayDate(trainingPlan.createdAt)}`, icon: _jsx(Info, {}) })] }))] }), _jsx(Card, { children: _jsxs(CardContent, { sx: { p: 3 }, children: [_jsxs(Box, { sx: { display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }, gap: 2, mb: 2 }, children: [_jsxs(Box, { children: [_jsx(Typography, { variant: "body2", sx: { mb: 1 }, children: "Fecha Inicio" }), _jsx(TextField, { fullWidth: true, id: "startDate", type: "date", value: startDate, onChange: (e) => setStartDate(e.target.value), variant: "outlined", size: "small", InputLabelProps: { shrink: true }, inputProps: {
                                                            min: trainingPlan ? formatInputDate(trainingPlan.createdAt) : undefined,
                                                            max: formatInputDate(new Date().toString())
                                                        } })] }), _jsxs(Box, { children: [_jsx(Typography, { variant: "body2", sx: { mb: 1 }, children: "Fecha Fin" }), _jsx(TextField, { fullWidth: true, id: "endDate", type: "date", value: endDate, onChange: (e) => setEndDate(e.target.value), variant: "outlined", size: "small", InputLabelProps: { shrink: true }, inputProps: {
                                                            min: startDate,
                                                            max: formatInputDate(new Date().toString())
                                                        } })] })] }), trainingPlan && (_jsxs(Alert, { severity: "info", sx: { mb: 2 }, children: ["El plan de entrenamiento ", _jsx("strong", { children: trainingPlan.name }), " comenz\u00F3 el d\u00EDa ", formatDisplayDate(trainingPlan.createdAt), ". Por favor, seleccione un rango de fechas entre esa fecha y hoy."] })), _jsxs(Box, { sx: { mb: 2 }, children: [_jsx(Typography, { variant: "body2", sx: { mb: 1 }, children: "Comentarios del Entrenador (Opcional)" }), _jsx(TextField, { fullWidth: true, id: "trainerComment", multiline: true, rows: 4, placeholder: "Observaciones sobre el progreso del cliente...", value: trainerComment, onChange: (e) => setTrainerComment(e.target.value), variant: "outlined" })] }), _jsxs(Box, { sx: { mb: 2 }, children: [_jsx(Typography, { variant: "body2", sx: { mb: 1 }, children: "Pr\u00F3ximos Pasos (Opcional)" }), _jsx(TextField, { fullWidth: true, id: "nextSteps", multiline: true, rows: 4, placeholder: "Recomendaciones para el siguiente per\u00EDodo...", value: nextSteps, onChange: (e) => setNextSteps(e.target.value), variant: "outlined" })] }), error && (_jsx(Alert, { severity: "error", sx: { mb: 2 }, children: error })), _jsx(Button, { fullWidth: true, variant: "contained", onClick: generateReport, disabled: loading || !trainingPlan, sx: {
                                            backgroundColor: "#fb8c00",
                                            "&:hover": { backgroundColor: "#e67c00" },
                                            height: "48px"
                                        }, children: loading ? _jsx(CircularProgress, { size: 24, color: "inherit" }) : "Generar Reporte" })] }) })] }) }), _jsx(FooterPag, {})] }));
}
