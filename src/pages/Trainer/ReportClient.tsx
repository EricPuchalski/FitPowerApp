"use client";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Importar useParams
import {
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Assignment, Person } from "@mui/icons-material";
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
    exerciseName: string;
    progress: string;
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

export default function ReportClient() { // Cambiado de Home a ReportClient
  const { clientDni } = useParams(); // Obtener el DNI de la URL
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [trainerComment, setTrainerComment] = useState("");
  const [nextSteps, setNextSteps] = useState("");
  const [reportData, setReportData] = useState<ClientReportDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
    const navigate = useNavigate();
  

  // Establecer fechas por defecto (1 mes atrás hasta hoy)
  useEffect(() => {
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);

    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    setStartDate(formatDate(oneMonthAgo));
    setEndDate(formatDate(today));
  }, []);

  const generateReport = async () => {
    // Validar que las fechas sean correctas
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

  return (
  
    <>
    {/* Header - Manteniendo tu estilo original */}
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
                />
              </Box>
            </Box>

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
              disabled={loading}
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