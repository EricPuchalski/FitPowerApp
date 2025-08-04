"use client";
import { useRef, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Grid,
} from "@mui/material";
import {
  ArrowBack,
  CalendarToday,
  FitnessCenter,
  TrendingUp,
  AccessTime,
  Description,
  Print,
  Person,
  Download,
  Assignment,
  Send,
} from "@mui/icons-material";
import html2pdf from "html2pdf.js";
import { ClientReportDTO } from "../model/ClientReportDTO";

interface TrainingReportProps {
  data: ClientReportDTO;
  onBack: () => void;
}

export default function TrainingReport({ data, onBack }: TrainingReportProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [sendError, setSendError] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [confirmSendOpen, setConfirmSendOpen] = useState(false);

  const handleSendConfirmation = () => {
    setConfirmSendOpen(true);
         console.log(data.period);
  };

  const handleConfirmSend = async () => {
    setConfirmSendOpen(false);
    await sendTrainingReport();
  };

  // const generatePdf = () => {
  //   setPdfGenerating(true);
  //   const element = printRef.current;
  //   if (!element) {
  //     setPdfGenerating(false);
  //     return;
  //   }
  //   // Clonar el elemento para no afectar el DOM visible
  //   const clone = element.cloneNode(true) as HTMLElement;
  //   // Ajustar estilos específicos para el PDF
  //   clone.style.width = "190mm"; // Menor que A4 para considerar márgenes
  //   clone.style.margin = "0";
  //   clone.style.padding = "0";
  //   clone.style.boxSizing = "border-box";
  //   // Aplicar estilos específicos a todos los elementos hijos
  //   const allElements = clone.querySelectorAll("*");
  //   allElements.forEach((el: HTMLElement) => {
  //     el.style.boxSizing = "border-box";
  //     el.style.maxWidth = "100%";
  //   });
  //   // Configuración de html2pdf con márgenes adecuados
  //   const opt = {
  //     margin: [10, 10, 10, 10], // [top, left, bottom, right]
  //     filename: `Informe_Entrenamiento_${data.clientName.replace(
  //       /\s+/g,
  //       "_"
  //     )}_${data.period.replace(/\//g, "-")}.pdf`,
  //     image: { type: "jpeg", quality: 0.98 },
  //     html2canvas: {
  //       scale: 2,
  //       logging: true,
  //       useCORS: true,
  //       scrollY: 0,
  //       windowWidth: 800, // Ancho fijo para consistencia
  //       letterRendering: true,
  //       allowTaint: true,
  //     },
  //     jsPDF: {
  //       unit: "mm",
  //       format: "a4",
  //       orientation: "portrait",
  //       compress: true,
  //     },
  //   };
  //   // Agregar el clon al cuerpo temporalmente
  //   const container = document.createElement("div");
  //   container.style.position = "absolute";
  //   container.style.left = "-9999px";
  //   container.appendChild(clone);
  //   document.body.appendChild(container);
  //   html2pdf()
  //     .from(clone)
  //     .set(opt)
  //     .save()
  //     .then(() => {
  //       // Eliminar el clon después de generar el PDF
  //       document.body.removeChild(container);
  //       setPdfGenerating(false);
  //       setOpenDialog(false);
  //     })
  //     .catch((err: Error) => {
  //       console.error("Error generating PDF:", err);
  //       document.body.removeChild(container);
  //       setPdfGenerating(false);
  //     });
  // };

  const handlePrintDialog = () => {
    setOpenDialog(true);
  };

  const sendTrainingReport = async () => {
    setSending(true);
    setSendError("");
    setSendSuccess(false);

    const token = localStorage.getItem("token");
    if (!token) {
      setSendError(
        "No se encontró el token de autenticación. Inicia sesión nuevamente."
      );
      setSending(false);
      return;
    }

    try {
      // Verifica que data.period esté definido y tenga el formato correcto
      if (!data.period || typeof data.period !== "string") {
        throw new Error("El período no está definido o no es válido.");
      }

      const dateParts = data.period.split(" - ");
      if (dateParts.length !== 2) {
        throw new Error("El período no tiene el formato esperado.");
      }
 
      
      // Convertir las fechas al formato yyyy-MM-dd
      const startDate = convertToBackendDateFormat(dateParts[0]);
      const endDate = convertToBackendDateFormat(dateParts[1]);

      const response = await fetch(
        `http://localhost:8080/api/v1/clients/${data.clientDni}/training-plans/reports/pdf?startDate=${startDate}&endDate=${endDate}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            trainerComment: data.trainerComment.trim(),
            nextSteps: data.nextSteps.trim(),
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al enviar el reporte");
      }

      setSendSuccess(true);
    } catch (err) {
      setSendError(
        err instanceof Error
          ? err.message
          : "Error inesperado al enviar el reporte"
      );
    } finally {
      setSending(false);
    }
  };

  // Función para convertir la fecha al formato yyyy-MM-dd
  const convertToBackendDateFormat = (dateString: string) => {
    const [day, month, year] = dateString.split("/");
    return `${year}-${month}-${day}`;
  };

  const getProgressColor = (progress: string) => {
    const value = parseFloat(progress.replace(/[+%]/g, ""));
    if (value > 10) return "success.main";
    if (value > 0) return "success.light";
    if (value === 0) return "text.secondary";
    return "error.main";
  };

  const getProgressBg = (progress: string) => {
    const value = parseFloat(progress.replace(/[+%]/g, ""));
    if (value > 10) return "rgba(76, 175, 80, 0.1)";
    if (value > 0) return "rgba(129, 199, 132, 0.1)";
    if (value === 0) return "rgba(97, 97, 97, 0.05)";
    return "rgba(244, 67, 54, 0.1)";
  };

  const formatProgress = (progress: string) => {
    if (progress.startsWith("+")) return `↑ ${progress}`;
    if (progress.startsWith("-")) return `↓ ${progress.replace("-", "")}`;
    return progress;
  };

  const getAttendanceStyles = (rate: string) => {
    const value = parseFloat(rate.replace("%", ""));
    if (value >= 85) {
      return { bg: "#e8f5e9", color: "#2e7d32" }; // Verde
    } else if (value >= 60) {
      return { bg: "#fffde7", color: "#f9a825" }; // Amarillo
    } else {
      return { bg: "#ffebee", color: "#c62828" }; // Rojo
    }
  };

  const attendanceStyle = getAttendanceStyles(data.attendanceRate);

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      {/* Diálogo de confirmación para PDF */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Generar Informe en PDF</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Deseas generar y descargar el informe en formato PDF?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            El informe se generará en tamaño A4 listo para imprimir.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="inherit">
            Cancelar
          </Button>
          {/* <Button
            onClick={generatePdf}
            disabled={pdfGenerating}
            startIcon={pdfGenerating ? <CircularProgress size={20} /> : <Download />}
            color="primary"
            variant="contained"
          >
            {pdfGenerating ? "Generando..." : "Descargar PDF"}
          </Button> */}
        </DialogActions>
      </Dialog>

      {/* Barra de acciones - No se incluye en el PDF */}
      <Box
        sx={{
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
        }}
        className="no-print"
      >
        <Button
          variant="outlined"
          onClick={onBack}
          startIcon={<ArrowBack />}
          size={isMobile ? "small" : "medium"}
        >
          {isMobile ? "Volver" : "Volver al formulario"}
        </Button>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            onClick={handleSendConfirmation}
            startIcon={sending ? <CircularProgress size={20} /> : <Send />}
            sx={{
              backgroundColor: "#4caf50",
              "&:hover": { backgroundColor: "#388e3c" },
              minWidth: isMobile ? "auto" : "200px",
              position: "relative",
              overflow: "hidden",
              "&:disabled": {
                backgroundColor: "#81c784", // Verde más claro cuando está deshabilitado
              },
            }}
            disabled={sending || sendSuccess} // Deshabilitar después de enviar exitosamente
            size={isMobile ? "small" : "medium"}
          >
            {sending
              ? "Enviando..."
              : sendSuccess
              ? "Enviado ✓"
              : "Enviar al Cliente"}
          </Button>
          <Dialog
            open={confirmSendOpen}
            onClose={() => setConfirmSendOpen(false)}
          >
            <DialogTitle>Confirmar Envío</DialogTitle>
            <DialogContent>
              <Typography>
                ¿Estás seguro que deseas enviar este informe al cliente?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                El cliente recibirá un mail con el pdf adjunto.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setConfirmSendOpen(false)} color="inherit">
                Cancelar
              </Button>
              <Button
                onClick={handleConfirmSend}
                color="primary"
                variant="contained"
                startIcon={<Send />}
              >
                Confirmar Envío
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>

      {sendSuccess && (
        <Alert
          severity="success"
          sx={{
            mx: "auto",
            maxWidth: 800,
            mt: 2,
            boxShadow: 2,
            ".MuiAlert-message": {
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            },
          }}
          onClose={() => setSendSuccess(false)}
        >
          <Box sx={{ textAlign: "center", width: "100%" }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Informe enviado exitosamente!
            </Typography>
            <Typography variant="body2">
              El cliente ha recibido el informe de entrenamiento.
            </Typography>
          </Box>
        </Alert>
      )}

      {sendError && (
        <Alert
          severity="error"
          sx={{
            mx: "auto",
            maxWidth: 800,
            mt: 2,
            boxShadow: 2,
          }}
          onClose={() => setSendError("")}
        >
          <Typography variant="h6" sx={{ mb: 1 }}>
            Error al enviar el informe, por favor vuelva a intentarlo o
            comuniquese con la administración.
          </Typography>
          <Typography variant="body2">{sendError}</Typography>
        </Alert>
      )}

      {/* Contenido del reporte - Se incluye en el PDF */}
      <Box
        ref={printRef}
        sx={{
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
        }}
      >
        {/* Header del reporte */}
        <Box
          sx={{
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
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                backgroundColor: "#fb8c00",
                p: 1,
                borderRadius: "8px",
                "@media print": {
                  backgroundColor: "transparent",
                  border: "2px solid #fb8c00",
                },
              }}
            >
              <Description
                sx={{ color: "white", "@media print": { color: "#fb8c00" } }}
              />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                FitPower
              </Typography>
              <Typography variant="body2" sx={{ color: "#757575" }}>
                Informe de Entrenamiento
              </Typography>
            </Box>
          </Box>
          <Box sx={{ textAlign: "right" }}>
            <Typography variant="body2" sx={{ color: "#757575" }}>
              Generado el{" "}
              {new Date().toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </Typography>
            <Typography variant="body2" sx={{ color: "#757575" }}>
              Período: {data.period}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ p: 3, "@media print": { p: 2 } }}>
          {/* Información del cliente y plan */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
              mb: 4,
              "@media print": {
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
                mb: "15px",
              },
            }}
          >
            <Card
              sx={{
                "@media print": {
                  boxShadow: "none",
                  border: "1px solid #e0e0e0",
                },
              }}
            >
              <CardContent sx={{ pb: 1.5, "@media print": { p: 2 } }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <Person sx={{ color: "#fb8c00" }} />
                  <Typography variant="h6">Información del Cliente</Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                    Nombre:
                  </Typography>
                  <Typography variant="body2">{data.clientName}</Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                    DNI:
                  </Typography>
                  <Typography variant="body2">{data.clientDni}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                    Entrenador:
                  </Typography>
                  <Typography variant="body2">{data.trainerName}</Typography>
                </Box>
              </CardContent>
            </Card>
            <Card
              sx={{
                "@media print": {
                  boxShadow: "none",
                  border: "1px solid #e0e0e0",
                },
              }}
            >
              <CardContent sx={{ pb: 1.5, "@media print": { p: 2 } }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <FitnessCenter sx={{ color: "#fb8c00" }} />
                  <Typography variant="h6">Plan de Entrenamiento</Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                    Plan:
                  </Typography>
                  <Typography variant="body2">
                    {data.trainingPlanName}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                    Objetivos:
                  </Typography>
                  <Typography variant="body2">{data.clientGoals}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                    Período:
                  </Typography>
                  <Typography variant="body2">{data.period}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
          {/* Asistencia */}
          <Card
            sx={{
              mb: 4,
              "@media print": {
                boxShadow: "none",
                border: "1px solid #e0e0e0",
                mb: 3,
              },
            }}
          >
            <CardContent>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <CalendarToday sx={{ color: "#fb8c00" }} />
                <Typography variant="h6">Asistencia</Typography>
              </Box>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                  gap: 2,
                  mb: 2,
                  "@media print": {
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "10px",
                  },
                }}
              >
                <Box
                  sx={{
                    textAlign: "center",
                    p: 2,
                    backgroundColor: "#fff8f0",
                    borderRadius: "8px",
                    "@media print": {
                      backgroundColor: "transparent",
                      border: "1px solid #e0e0e0",
                    },
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: "bold", color: "#fb8c00" }}
                  >
                    {data.trainedDays}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#757575" }}>
                    Días Entrenados
                  </Typography>
                </Box>
                <Box
                  sx={{
                    textAlign: "center",
                    p: 2,
                    backgroundColor: attendanceStyle.bg,
                    borderRadius: "8px",
                    "@media print": {
                      backgroundColor: "transparent",
                      border: "1px solid #e0e0e0",
                    },
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: "bold", color: attendanceStyle.color }}
                  >
                    {data.attendanceRate}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#757575" }}>
                    Tasa de Asistencia
                  </Typography>
                </Box>
              </Box>
              {data.trainedDates.length > 0 && (
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: "medium", mb: 1 }}
                  >
                    Fechas de Entrenamiento:
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 1,
                      "@media print": {
                        gap: "5px",
                      },
                    }}
                  >
                    {data.trainedDates.map((date, index) => (
                      <Box
                        key={index}
                        sx={{
                          px: 1,
                          py: 0.5,
                          backgroundColor: "#f5f5f5",
                          borderRadius: "4px",
                          "@media print": {
                            backgroundColor: "transparent",
                            border: "1px solid #e0e0e0",
                          },
                        }}
                      >
                        <Typography variant="body2">{date}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Análisis de Progreso */}
          {data.strengthProgress && (
            <Card
              sx={{
                mb: 4,
                "@media print": {
                  boxShadow: "none",
                  border: "1px solid #e0e0e0",
                  mb: 3,
                  pageBreakInside: "avoid",
                },
              }}
            >
              <CardContent>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
                >
                  <TrendingUp sx={{ color: "#fb8c00" }} />
                  <Typography variant="h6">Análisis de Progreso</Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    gap: 2,
                    "@media print": {
                      flexDirection: "column",
                      gap: "10px",
                    },
                  }}
                >
                  {data.strengthProgress.maxImprovement && (
                    <Card
                      variant="outlined"
                      sx={{
                        flex: 1,
                        p: 2,
                        borderColor: "success.main",
                        backgroundColor: "rgba(76, 175, 80, 0.05)",
                        textAlign: "center",
                        "@media print": {
                          backgroundColor: "transparent",
                          border: "2px solid #2e7d32",
                          mb: 1,
                        },
                      }}
                    >
                      <Typography
                        color="success.main"
                        variant="h6"
                        sx={{ fontWeight: "bold", mb: 1 }}
                      >
                        ▲ Mayor Progreso
                      </Typography>
                      <Typography variant="body2">
                        {data.strengthProgress.maxImprovement}
                      </Typography>
                    </Card>
                  )}

                  {data.strengthProgress.maxDecline && (
                    <Card
                      variant="outlined"
                      sx={{
                        flex: 1,
                        p: 2,
                        borderColor: "error.main",
                        backgroundColor: "rgba(244, 67, 54, 0.05)",
                        textAlign: "center",
                        "@media print": {
                          backgroundColor: "transparent",
                          border: "2px solid #d32f2f",
                        },
                      }}
                    >
                      <Typography
                        color="error.main"
                        variant="h6"
                        sx={{ fontWeight: "bold", mb: 1 }}
                      >
                        ▼ Menor Progreso
                      </Typography>
                      <Typography variant="body2">
                        {data.strengthProgress.maxDecline}
                      </Typography>
                    </Card>
                  )}
                </Box>

                {!data.strengthProgress.maxImprovement &&
                  !data.strengthProgress.maxDecline && (
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        textAlign: "center",
                        py: 2,
                      }}
                    >
                      No hay suficientes datos para mostrar progresos
                      significativos
                    </Typography>
                  )}
              </CardContent>
            </Card>
          )}

          {/* Detalle de Progreso por Ejercicio */}
          <Card
            sx={{
              mb: 4,
              "@media print": {
                boxShadow: "none",
                border: "1px solid #e0e0e0",
                mb: 3,
              },
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Progreso Detallado por Ejercicio
              </Typography>
              <TableContainer
                component={Paper}
                sx={{ "@media print": { boxShadow: "none" } }}
              >
                <Table sx={{ minWidth: 650 }} size="small">
                  <TableHead>
                    <TableRow
                      sx={{
                        "@media print": { borderBottom: "2px solid #fb8c00" },
                      }}
                    >
                      <TableCell>Ejercicio</TableCell>
                      <TableCell align="center">Peso Inicial</TableCell>
                      <TableCell align="center">Peso Final</TableCell>
                      <TableCell align="center">Reps Inicial</TableCell>
                      <TableCell align="center">Reps Final</TableCell>
                      <TableCell align="center">Progreso</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.exerciseProgressDetails.map((exercise, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          backgroundColor: getProgressBg(exercise.progress),
                          "@media print": {
                            backgroundColor: "transparent",
                            borderBottom: "1px solid #e0e0e0",
                          },
                        }}
                      >
                        <TableCell>{exercise.exercise}</TableCell>
                        <TableCell align="center">{exercise.initial}</TableCell>
                        <TableCell align="center">
                          {exercise.finalValue}
                        </TableCell>
                        <TableCell align="center">
                          {exercise.initialReps}
                        </TableCell>
                        <TableCell align="center">
                          {exercise.finalReps}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            color: getProgressColor(exercise.progress),
                            fontWeight: "bold",
                            "@media print": {
                              color: getProgressColor(
                                exercise.progress
                              ).includes("success")
                                ? "#2e7d32"
                                : getProgressColor(exercise.progress).includes(
                                    "error"
                                  )
                                ? "#d32f2f"
                                : "#616161",
                            },
                          }}
                        >
                          {formatProgress(exercise.progress)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          {/* Análisis de Descanso */}
          {data.restTimeAnalysis && (
            <Card
              sx={{
                mb: 4,
                "@media print": {
                  boxShadow: "none",
                  border: "1px solid #e0e0e0",
                  mb: 3,
                },
              }}
            >
              <CardContent>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
                >
                  <AccessTime sx={{ color: "#fb8c00" }} />
                  <Typography variant="h6">
                    Análisis de Tiempos de Descanso
                  </Typography>
                </Box>
                <Typography variant="body1">{data.restTimeAnalysis}</Typography>
              </CardContent>
            </Card>
          )}

          {/* Comentarios y Próximos Pasos */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 3,
              "@media print": {
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
              },
            }}
          >
            {data.trainerComment && (
              <Card
                sx={{
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
                }}
              >
                <CardContent sx={{ p: 3, "@media print": { p: 2 } }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Person sx={{ fontSize: 24, color: "#fb8c00", mr: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      Comentarios del Entrenador
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ color: "#555" }}>
                    {data.trainerComment}
                  </Typography>
                </CardContent>
              </Card>
            )}
            {data.nextSteps && (
              <Card
                sx={{
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
                }}
              >
                <CardContent sx={{ p: 3, "@media print": { p: 2 } }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Assignment
                      sx={{ fontSize: 24, color: "#4caf50", mr: 1 }}
                    />
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      Próximos Pasos
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ color: "#555" }}>
                    {data.nextSteps}
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
