"use client";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Chip,
} from "@mui/material";
import { Assignment, Person, Info } from "@mui/icons-material";
import TrainingReport from "../../components/TrainingReport";
import { FooterPag } from "../../components/Footer";

interface ClientReportDTO {
  trainingPlanName: string;
  clientName: string;
  clientDni: string;
  clientGoals: string;
  trainerName: string;
  period: string;
  trainedDays: number;
  attendanceRate: string;
  trainedDates: string[];
  strengthProgress: {
    maxImprovement?: string;
    maxDecline?: string;
  };
  exerciseProgressDetails: Array<{
    exercise: string;
    initial: string;
    finalValue: string;
    progress: string;
    initialReps: number;
    finalReps: number;
  }>;
  restTimeAnalysis: string;
  trainerComment: string;
  nextSteps: string;
}

interface TrainingPlan {
  id: number;
  name: string;
  createdAt: string;
  trainerDni: string;
  trainerName: string;
  clientDni: string;
  clientName: string;
  trainerSpecification: string;
  clientGoal: string;
  active: boolean;
  exercises: Array<{
    id: number;
    name: string;
  }>;
}

export default function ReportClient() {
  const { clientDni } = useParams();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [trainerComment, setTrainerComment] = useState("");
  const [nextSteps, setNextSteps] = useState("");
  const [reportData, setReportData] = useState<ClientReportDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [trainingPlan, setTrainingPlan] = useState<TrainingPlan | null>(null);
  const [planLoading, setPlanLoading] = useState(true);
  const navigate = useNavigate();

  // Función para formatear fecha para mostrar (DD/MM/YYYY)
  const formatDisplayDate = (dateString: string) => {
    const date = new Date(dateString);
    // Ajustamos agregando un día para compensar el problema de zona horaria
    date.setDate(date.getDate() + 1);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Función para formatear fecha para inputs (YYYY-MM-DD)
  const formatInputDate = (dateString: string) => {
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
        const response = await fetch(
          `http://localhost:8080/api/v1/clients/${clientDni}/training-plans/active`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

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
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Error al obtener el plan de entrenamiento"
        );
      } finally {
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
      const response = await fetch(
        `http://localhost:8080/api/v1/clients/${clientDni}/reports/training?startDate=${startDate}&endDate=${endDate}`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            trainerComment: trainerComment.trim(),
            nextSteps: nextSteps.trim(),
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al generar el reporte");
      }

      const data = await response.json();
      setReportData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado al generar el reporte");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setReportData(null);
  };

  if (reportData) {
    return <TrainingReport data={reportData} onBack={resetForm} />;
  }

  if (planLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <header className="bg-indigo-800 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">FITPOWER</h1>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      </header>
      <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5", py: 4 }}>
        <Box sx={{ maxWidth: 800, mx: "auto", px: 2 }}>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mb: 2 }}>
              <Assignment sx={{ fontSize: 40, color: "#fb8c00" }} />
              <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
                FitPower
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ color: "#757575" }}>
              Informe de Entrenamiento para cliente DNI: {clientDni}
            </Typography>
            {trainingPlan && (
              <Box sx={{ mt: 2 }}>
                <Chip 
                  label={`Plan activo: ${trainingPlan.name}`} 
                  color="success" 
                  variant="outlined" 
                  sx={{ mr: 1 }} 
                />
                <Chip 
                  label={`Inició el ${formatDisplayDate(trainingPlan.createdAt)}`} 
                  icon={<Info />}
                />
              </Box>
            )}
          </Box>

          <Card>
            <CardContent sx={{ p: 3 }}>
              {/* Sección de fechas */}
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }, gap: 2, mb: 2 }}>
                <Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Fecha Inicio
                  </Typography>
                  <TextField
                    fullWidth
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    variant="outlined"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    inputProps={{
                      min: trainingPlan ? formatInputDate(trainingPlan.createdAt) : undefined,
                      max: formatInputDate(new Date().toString())
                    }}
                  />
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Fecha Fin
                  </Typography>
                  <TextField
                    fullWidth
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    variant="outlined"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    inputProps={{
                      min: startDate,
                      max: formatInputDate(new Date().toString())
                    }}
                  />
                </Box>
              </Box>

              {trainingPlan && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  El plan de entrenamiento <strong>{trainingPlan.name}</strong> comenzó el día {formatDisplayDate(trainingPlan.createdAt)}. 
                  Por favor, seleccione un rango de fechas entre esa fecha y hoy.
                </Alert>
              )}

              {/* Comentarios del entrenador */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Comentarios del Entrenador (Opcional)
                </Typography>
                <TextField
                  fullWidth
                  id="trainerComment"
                  multiline
                  rows={4}
                  placeholder="Observaciones sobre el progreso del cliente..."
                  value={trainerComment}
                  onChange={(e) => setTrainerComment(e.target.value)}
                  variant="outlined"
                />
              </Box>

              {/* Próximos pasos */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Próximos Pasos (Opcional)
                </Typography>
                <TextField
                  fullWidth
                  id="nextSteps"
                  multiline
                  rows={4}
                  placeholder="Recomendaciones para el siguiente período..."
                  value={nextSteps}
                  onChange={(e) => setNextSteps(e.target.value)}
                  variant="outlined"
                />
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Button
                fullWidth
                variant="contained"
                onClick={generateReport}
                disabled={loading || !trainingPlan}
                sx={{ 
                  backgroundColor: "#fb8c00", 
                  "&:hover": { backgroundColor: "#e67c00" },
                  height: "48px"
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Generar Reporte"}
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Box>
      <FooterPag></FooterPag>
     </>
  );
}