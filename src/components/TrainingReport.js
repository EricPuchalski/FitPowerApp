"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState } from "react";
import { Button, Card, CardContent, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress, useMediaQuery, useTheme, } from "@mui/material";
import { ArrowBack, CalendarToday, FitnessCenter, TrendingUp, AccessTime, Description, Print, Person, Download, Assignment, } from "@mui/icons-material";
import html2pdf from "html2pdf.js";
export default function TrainingReport({ data, onBack }) {
    const printRef = useRef(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [pdfGenerating, setPdfGenerating] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const generatePdf = () => {
        setPdfGenerating(true);
        const element = printRef.current;
        if (!element) {
            setPdfGenerating(false);
            return;
        }
        // Clonar el elemento para no afectar el DOM visible
        const clone = element.cloneNode(true);
        // Ajustar estilos específicos para el PDF
        clone.style.width = "190mm"; // Menor que A4 para considerar márgenes
        clone.style.margin = "0";
        clone.style.padding = "0";
        clone.style.boxSizing = "border-box";
        // Aplicar estilos específicos a todos los elementos hijos
        const allElements = clone.querySelectorAll("*");
        allElements.forEach((el) => {
            el.style.boxSizing = "border-box";
            el.style.maxWidth = "100%";
        });
        // Configuración de html2pdf con márgenes adecuados
        const opt = {
            margin: [10, 10, 10, 10], // [top, left, bottom, right]
            filename: `Informe_Entrenamiento_${data.clientName.replace(/\s+/g, "_")}_${data.period.replace(/\//g, "-")}.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: {
                scale: 2,
                logging: true,
                useCORS: true,
                scrollY: 0,
                windowWidth: 800, // Ancho fijo para consistencia
                letterRendering: true,
                allowTaint: true,
            },
            jsPDF: {
                unit: "mm",
                format: "a4",
                orientation: "portrait",
                compress: true,
            },
        };
        // Agregar el clon al cuerpo temporalmente
        const container = document.createElement("div");
        container.style.position = "absolute";
        container.style.left = "-9999px";
        container.appendChild(clone);
        document.body.appendChild(container);
        html2pdf()
            .from(clone)
            .set(opt)
            .save()
            .then(() => {
            // Eliminar el clon después de generar el PDF
            document.body.removeChild(container);
            setPdfGenerating(false);
            setOpenDialog(false);
        })
            .catch((err) => {
            console.error("Error generating PDF:", err);
            document.body.removeChild(container);
            setPdfGenerating(false);
        });
    };
    const handlePrintDialog = () => {
        setOpenDialog(true);
    };
    const getProgressColor = (progress) => {
        const value = parseFloat(progress.replace(/[+%]/g, ""));
        if (value > 10)
            return "success.main";
        if (value > 0)
            return "success.light";
        if (value === 0)
            return "text.secondary";
        return "error.main";
    };
    const getProgressBg = (progress) => {
        const value = parseFloat(progress.replace(/[+%]/g, ""));
        if (value > 10)
            return "rgba(76, 175, 80, 0.1)";
        if (value > 0)
            return "rgba(129, 199, 132, 0.1)";
        if (value === 0)
            return "rgba(97, 97, 97, 0.05)";
        return "rgba(244, 67, 54, 0.1)";
    };
    const formatProgress = (progress) => {
        if (progress.startsWith("+"))
            return `↑ ${progress}`;
        if (progress.startsWith("-"))
            return `↓ ${progress.replace("-", "")}`;
        return progress;
    };
    // obtener colores segun asisntecia
    const getAttendanceStyles = (rate) => {
        const value = parseFloat(rate.replace("%", ""));
        if (value >= 85) {
            return { bg: "#e8f5e9", color: "#2e7d32" }; // Verde
        }
        else if (value >= 60) {
            return { bg: "#fffde7", color: "#f9a825" }; // Amarillo
        }
        else {
            return { bg: "#ffebee", color: "#c62828" }; // Rojo
        }
    };
    const attendanceStyle = getAttendanceStyles(data.attendanceRate);
    return (_jsxs(Box, { sx: { minHeight: "100vh", backgroundColor: "#f5f5f5" }, children: [_jsxs(Dialog, { open: openDialog, onClose: () => setOpenDialog(false), children: [_jsx(DialogTitle, { children: "Generar Informe en PDF" }), _jsxs(DialogContent, { children: [_jsx(Typography, { children: "\u00BFDeseas generar y descargar el informe en formato PDF?" }), _jsx(Typography, { variant: "body2", color: "text.secondary", sx: { mt: 1 }, children: "El informe se generar\u00E1 en tama\u00F1o A4 listo para imprimir." })] }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: () => setOpenDialog(false), color: "inherit", children: "Cancelar" }), _jsx(Button, { onClick: generatePdf, disabled: pdfGenerating, startIcon: pdfGenerating ? _jsx(CircularProgress, { size: 20 }) : _jsx(Download, {}), color: "primary", variant: "contained", children: pdfGenerating ? "Generando..." : "Descargar PDF" })] })] }), _jsxs(Box, { sx: {
                    backgroundColor: "white",
                    borderBottom: "1px solid #e0e0e0",
                    px: 2,
                    py: 1,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    position: "sticky",
                    top: 0,
                    zIndex: 1000,
                    "@media print": { display: "none" },
                }, className: "no-print", children: [_jsx(Button, { variant: "outlined", onClick: onBack, startIcon: _jsx(ArrowBack, {}), size: isMobile ? "small" : "medium", children: isMobile ? "Volver" : "Volver al formulario" }), _jsx(Button, { variant: "contained", onClick: handlePrintDialog, startIcon: pdfGenerating ? _jsx(CircularProgress, { size: 20 }) : _jsx(Print, {}), sx: {
                            backgroundColor: "#fb8c00",
                            "&:hover": { backgroundColor: "#e67c00" },
                            minWidth: isMobile ? "auto" : "200px",
                        }, disabled: pdfGenerating, size: isMobile ? "small" : "medium", children: isMobile
                            ? pdfGenerating
                                ? "..."
                                : "PDF"
                            : pdfGenerating
                                ? "Generando..."
                                : "Descargar PDF" })] }), _jsxs(Box, { ref: printRef, sx: {
                    maxWidth: "900px",
                    mx: "auto",
                    backgroundColor: "white",
                    boxShadow: theme.shadows[1],
                    "@media print": {
                        maxWidth: "100%",
                        mx: 0,
                        boxShadow: "none",
                        backgroundColor: "white",
                        padding: 0,
                    },
                }, children: [_jsxs(Box, { sx: {
                            px: 3,
                            py: 2,
                            borderBottom: "1px solid #e0e0e0",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            "@media print": {
                                px: 2,
                                py: 1,
                                borderBottom: "2px solid #fb8c00",
                            },
                        }, children: [_jsxs(Box, { sx: { display: "flex", alignItems: "center", gap: 1 }, children: [_jsx(Box, { sx: {
                                            backgroundColor: "#fb8c00",
                                            p: 1,
                                            borderRadius: "8px",
                                            "@media print": {
                                                backgroundColor: "transparent",
                                                border: "2px solid #fb8c00",
                                            },
                                        }, children: _jsx(Description, { sx: { color: "white", "@media print": { color: "#fb8c00" } } }) }), _jsxs(Box, { children: [_jsx(Typography, { variant: "h5", sx: { fontWeight: "bold" }, children: "FitPower" }), _jsx(Typography, { variant: "body2", sx: { color: "#757575" }, children: "Informe de Entrenamiento" })] })] }), _jsxs(Box, { sx: { textAlign: "right" }, children: [_jsxs(Typography, { variant: "body2", sx: { color: "#757575" }, children: ["Generado el", " ", new Date().toLocaleDateString("es-ES", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                            })] }), _jsxs(Typography, { variant: "body2", sx: { color: "#757575" }, children: ["Per\u00EDodo: ", data.period] })] })] }), _jsxs(Box, { sx: { p: 3, "@media print": { p: 2 } }, children: [_jsxs(Box, { sx: {
                                    display: "grid",
                                    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                                    gap: 2,
                                    mb: 4,
                                    "@media print": {
                                        gridTemplateColumns: "1fr 1fr",
                                        gap: "10px",
                                        mb: "15px",
                                    },
                                }, children: [_jsx(Card, { sx: {
                                            "@media print": {
                                                boxShadow: "none",
                                                border: "1px solid #e0e0e0",
                                            },
                                        }, children: _jsxs(CardContent, { sx: { pb: 1.5, "@media print": { p: 2 } }, children: [_jsxs(Box, { sx: { display: "flex", alignItems: "center", gap: 1, mb: 1 }, children: [_jsx(Person, { sx: { color: "#fb8c00" } }), _jsx(Typography, { variant: "h6", children: "Informaci\u00F3n del Cliente" })] }), _jsxs(Box, { sx: {
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        mb: 1,
                                                    }, children: [_jsx(Typography, { variant: "body2", sx: { fontWeight: "medium" }, children: "Nombre:" }), _jsx(Typography, { variant: "body2", children: data.clientName })] }), _jsxs(Box, { sx: {
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        mb: 1,
                                                    }, children: [_jsx(Typography, { variant: "body2", sx: { fontWeight: "medium" }, children: "DNI:" }), _jsx(Typography, { variant: "body2", children: data.clientDni })] }), _jsxs(Box, { sx: { display: "flex", justifyContent: "space-between" }, children: [_jsx(Typography, { variant: "body2", sx: { fontWeight: "medium" }, children: "Entrenador:" }), _jsx(Typography, { variant: "body2", children: data.trainerName })] })] }) }), _jsx(Card, { sx: {
                                            "@media print": {
                                                boxShadow: "none",
                                                border: "1px solid #e0e0e0",
                                            },
                                        }, children: _jsxs(CardContent, { sx: { pb: 1.5, "@media print": { p: 2 } }, children: [_jsxs(Box, { sx: { display: "flex", alignItems: "center", gap: 1, mb: 1 }, children: [_jsx(FitnessCenter, { sx: { color: "#fb8c00" } }), _jsx(Typography, { variant: "h6", children: "Plan de Entrenamiento" })] }), _jsxs(Box, { sx: {
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        mb: 1,
                                                    }, children: [_jsx(Typography, { variant: "body2", sx: { fontWeight: "medium" }, children: "Plan:" }), _jsx(Typography, { variant: "body2", children: data.trainingPlanName })] }), _jsxs(Box, { sx: {
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        mb: 1,
                                                    }, children: [_jsx(Typography, { variant: "body2", sx: { fontWeight: "medium" }, children: "Objetivos:" }), _jsx(Typography, { variant: "body2", children: data.clientGoals })] }), _jsxs(Box, { sx: { display: "flex", justifyContent: "space-between" }, children: [_jsx(Typography, { variant: "body2", sx: { fontWeight: "medium" }, children: "Per\u00EDodo:" }), _jsx(Typography, { variant: "body2", children: data.period })] })] }) })] }), _jsx(Card, { sx: {
                                    mb: 4,
                                    "@media print": {
                                        boxShadow: "none",
                                        border: "1px solid #e0e0e0",
                                        mb: 3,
                                    },
                                }, children: _jsxs(CardContent, { children: [_jsxs(Box, { sx: { display: "flex", alignItems: "center", gap: 1, mb: 2 }, children: [_jsx(CalendarToday, { sx: { color: "#fb8c00" } }), _jsx(Typography, { variant: "h6", children: "Asistencia" })] }), _jsxs(Box, { sx: {
                                                display: "grid",
                                                gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                                                gap: 2,
                                                mb: 2,
                                                "@media print": {
                                                    gridTemplateColumns: "repeat(2, 1fr)",
                                                    gap: "10px",
                                                },
                                            }, children: [_jsxs(Box, { sx: {
                                                        textAlign: "center",
                                                        p: 2,
                                                        backgroundColor: "#fff8f0",
                                                        borderRadius: "8px",
                                                        "@media print": {
                                                            backgroundColor: "transparent",
                                                            border: "1px solid #e0e0e0",
                                                        },
                                                    }, children: [_jsx(Typography, { variant: "h5", sx: { fontWeight: "bold", color: "#fb8c00" }, children: data.trainedDays }), _jsx(Typography, { variant: "body2", sx: { color: "#757575" }, children: "D\u00EDas Entrenados" })] }), _jsxs(Box, { sx: {
                                                        textAlign: "center",
                                                        p: 2,
                                                        backgroundColor: attendanceStyle.bg,
                                                        borderRadius: "8px",
                                                        "@media print": {
                                                            backgroundColor: "transparent",
                                                            border: "1px solid #e0e0e0",
                                                        },
                                                    }, children: [_jsx(Typography, { variant: "h5", sx: { fontWeight: "bold", color: attendanceStyle.color }, children: data.attendanceRate }), _jsx(Typography, { variant: "body2", sx: { color: "#757575" }, children: "Tasa de Asistencia" })] })] }), data.trainedDates.length > 0 && (_jsxs(Box, { children: [_jsx(Typography, { variant: "subtitle2", sx: { fontWeight: "medium", mb: 1 }, children: "Fechas de Entrenamiento:" }), _jsx(Box, { sx: {
                                                        display: "flex",
                                                        flexWrap: "wrap",
                                                        gap: 1,
                                                        "@media print": {
                                                            gap: "5px",
                                                        },
                                                    }, children: data.trainedDates.map((date, index) => (_jsx(Box, { sx: {
                                                            px: 1,
                                                            py: 0.5,
                                                            backgroundColor: "#f5f5f5",
                                                            borderRadius: "4px",
                                                            "@media print": {
                                                                backgroundColor: "transparent",
                                                                border: "1px solid #e0e0e0",
                                                            },
                                                        }, children: _jsx(Typography, { variant: "body2", children: date }) }, index))) })] }))] }) }), data.strengthProgress && (_jsx(Card, { sx: {
                                    mb: 4,
                                    '@media print': {
                                        boxShadow: 'none',
                                        border: '1px solid #e0e0e0',
                                        mb: 3,
                                        pageBreakInside: 'avoid'
                                    }
                                }, children: _jsxs(CardContent, { children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 1, mb: 2 }, children: [_jsx(TrendingUp, { sx: { color: '#fb8c00' } }), _jsx(Typography, { variant: "h6", children: "An\u00E1lisis de Progreso" })] }), _jsxs(Box, { sx: {
                                                display: 'flex',
                                                flexDirection: { xs: 'column', md: 'row' },
                                                gap: 2,
                                                '@media print': {
                                                    flexDirection: 'column', // Siempre vertical en PDF
                                                    gap: '10px'
                                                }
                                            }, children: [data.strengthProgress.maxImprovement && (_jsxs(Card, { variant: "outlined", sx: {
                                                        flex: 1,
                                                        p: 2,
                                                        borderColor: 'success.main',
                                                        backgroundColor: 'rgba(76, 175, 80, 0.05)',
                                                        textAlign: 'center',
                                                        '@media print': {
                                                            backgroundColor: 'transparent',
                                                            border: '2px solid #2e7d32',
                                                            mb: 1
                                                        }
                                                    }, children: [_jsx(Typography, { color: "success.main", variant: "h6", sx: { fontWeight: 'bold', mb: 1 }, children: "\u25B2 Mayor Progreso" }), _jsx(Typography, { variant: "body2", children: data.strengthProgress.maxImprovement })] })), data.strengthProgress.maxDecline && (_jsxs(Card, { variant: "outlined", sx: {
                                                        flex: 1,
                                                        p: 2,
                                                        borderColor: 'error.main',
                                                        backgroundColor: 'rgba(244, 67, 54, 0.05)',
                                                        textAlign: 'center',
                                                        '@media print': {
                                                            backgroundColor: 'transparent',
                                                            border: '2px solid #d32f2f'
                                                        }
                                                    }, children: [_jsx(Typography, { color: "error.main", variant: "h6", sx: { fontWeight: 'bold', mb: 1 }, children: "\u25BC Menor Progreso" }), _jsx(Typography, { variant: "body2", children: data.strengthProgress.maxDecline })] }))] }), !data.strengthProgress.maxImprovement && !data.strengthProgress.maxDecline && (_jsx(Typography, { variant: "body2", sx: { color: 'text.secondary', textAlign: 'center', py: 2 }, children: "No hay suficientes datos para mostrar progresos significativos" }))] }) })), _jsx(Card, { sx: {
                                    mb: 4,
                                    "@media print": {
                                        boxShadow: "none",
                                        border: "1px solid #e0e0e0",
                                        mb: 3,
                                    },
                                }, children: _jsxs(CardContent, { children: [_jsx(Typography, { variant: "h6", sx: { mb: 2 }, children: "Progreso Detallado por Ejercicio" }), _jsx(TableContainer, { component: Paper, sx: { "@media print": { boxShadow: "none" } }, children: _jsxs(Table, { sx: { minWidth: 650 }, size: "small", children: [_jsx(TableHead, { children: _jsxs(TableRow, { sx: {
                                                                "@media print": { borderBottom: "2px solid #fb8c00" },
                                                            }, children: [_jsx(TableCell, { children: "Ejercicio" }), _jsx(TableCell, { align: "center", children: "Peso Inicial" }), _jsx(TableCell, { align: "center", children: "Peso Final" }), _jsx(TableCell, { align: "center", children: "Reps Inicial" }), _jsx(TableCell, { align: "center", children: "Reps Final" }), _jsx(TableCell, { align: "center", children: "Progreso" })] }) }), _jsx(TableBody, { children: data.exerciseProgressDetails.map((exercise, index) => (_jsxs(TableRow, { sx: {
                                                                backgroundColor: getProgressBg(exercise.progress),
                                                                "@media print": {
                                                                    backgroundColor: "transparent",
                                                                    borderBottom: "1px solid #e0e0e0",
                                                                },
                                                            }, children: [_jsx(TableCell, { children: exercise.exercise }), _jsx(TableCell, { align: "center", children: exercise.initial }), _jsx(TableCell, { align: "center", children: exercise.finalValue }), _jsx(TableCell, { align: "center", children: exercise.initialReps }), _jsx(TableCell, { align: "center", children: exercise.finalReps }), _jsx(TableCell, { align: "center", sx: {
                                                                        color: getProgressColor(exercise.progress),
                                                                        fontWeight: "bold",
                                                                        "@media print": {
                                                                            color: getProgressColor(exercise.progress).includes("success")
                                                                                ? "#2e7d32"
                                                                                : getProgressColor(exercise.progress).includes("error")
                                                                                    ? "#d32f2f"
                                                                                    : "#616161",
                                                                        },
                                                                    }, children: formatProgress(exercise.progress) })] }, index))) })] }) })] }) }), data.restTimeAnalysis && (_jsx(Card, { sx: {
                                    mb: 4,
                                    "@media print": {
                                        boxShadow: "none",
                                        border: "1px solid #e0e0e0",
                                        mb: 3,
                                    },
                                }, children: _jsxs(CardContent, { children: [_jsxs(Box, { sx: { display: "flex", alignItems: "center", gap: 1, mb: 2 }, children: [_jsx(AccessTime, { sx: { color: "#fb8c00" } }), _jsx(Typography, { variant: "h6", children: "An\u00E1lisis de Tiempos de Descanso" })] }), _jsx(Typography, { variant: "body1", children: data.restTimeAnalysis })] }) })), _jsxs(Box, { sx: {
                                    display: "grid",
                                    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                                    gap: 3,
                                    "@media print": {
                                        gridTemplateColumns: "1fr 1fr",
                                        gap: "10px",
                                    },
                                }, children: [data.trainerComment && (_jsx(Card, { sx: {
                                            borderRadius: 3,
                                            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                                            transition: "transform 0.3s, box-shadow 0.3s",
                                            "&:hover": {
                                                transform: "translateY(-5px)",
                                                boxShadow: "0px 6px 25px rgba(0, 0, 0, 0.15)",
                                            },
                                            "@media print": {
                                                boxShadow: "none",
                                                border: "1px solid #e0e0e0",
                                            },
                                        }, children: _jsxs(CardContent, { sx: { p: 3, "@media print": { p: 2 } }, children: [_jsxs(Box, { sx: { display: "flex", alignItems: "center", mb: 2 }, children: [_jsx(Person, { sx: { fontSize: 24, color: "#fb8c00", mr: 1 } }), _jsx(Typography, { variant: "h6", sx: { fontWeight: "bold" }, children: "Comentarios del Entrenador" })] }), _jsx(Typography, { variant: "body1", sx: { color: "#555" }, children: data.trainerComment })] }) })), data.nextSteps && (_jsx(Card, { sx: {
                                            borderRadius: 3,
                                            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                                            transition: "transform 0.3s, box-shadow 0.3s",
                                            "&:hover": {
                                                transform: "translateY(-5px)",
                                                boxShadow: "0px 6px 25px rgba(0, 0, 0, 0.15)",
                                            },
                                            "@media print": {
                                                boxShadow: "none",
                                                border: "1px solid #e0e0e0",
                                            },
                                        }, children: _jsxs(CardContent, { sx: { p: 3, "@media print": { p: 2 } }, children: [_jsxs(Box, { sx: { display: "flex", alignItems: "center", mb: 2 }, children: [_jsx(Assignment, { sx: { fontSize: 24, color: "#4caf50", mr: 1 } }), _jsx(Typography, { variant: "h6", sx: { fontWeight: "bold" }, children: "Pr\u00F3ximos Pasos" })] }), _jsx(Typography, { variant: "body1", sx: { color: "#555" }, children: data.nextSteps })] }) }))] })] })] })] }));
}
