import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ExerciseProgressSection } from "../../components/ExerciseProgressSection";
import { RmProgressSection } from "../../components/RmProgressSection";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { FooterPag } from "../../components/Footer";
import { ClientHeader } from "../../components/ClientHeader";
import { WorkoutFrequencySection } from "../../components/WorkoutFrecuencySection";

const ProgressPage = () => {
  const { dni } = useParams();
  const [trainingData, setTrainingData] = useState(null);
  const [rmData, setRmData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
    const navigate = useNavigate();
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [trainingRes, rmRes] = await Promise.all([
          fetch(
            `http://localhost:8080/api/v1/clients/${dni}/progress/training`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
          fetch(
            `http://localhost:8080/api/v1/clients/${dni}/progress/rm-evolution`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
        ]);

        if (!trainingRes.ok || !rmRes.ok)
          throw new Error("Error al cargar datos");

        setTrainingData(await trainingRes.json());
        setRmData(await rmRes.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dni]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error)
    return (

      <>
   
 <header className="bg-indigo-800 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">FITPOWER</h1>
           <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
          >
            Volver al Inicio
          </button>
        </div>
      </header>
    <div className="flex items-center justify-center min-h-[550px] px-4">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-8 max-w-md w-full text-center shadow-lg">
        <div className="mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Sin registros disponibles
          </h3>
          <p className="text-gray-600 mb-6">
            Todavía no hay registros cargados, por lo que no se puede calcular el progreso.
          </p>
        </div>
      </div>
    </div>
  );
      <FooterPag></FooterPag>
      </>
    );

  return (
    <>
      <header className="bg-indigo-800 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">FITPOWER</h1>
           <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
          >
            Volver al Inicio
          </button>
        </div>
      </header>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
 <header className="text-center mb-12 bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-xl shadow-lg border border-blue-100">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Progreso de entrenamiento
          </h1>
          <div className="text-lg text-gray-700 space-y-2">
            <p className="font-medium text-gray-800">
              {rmData?.clientName}
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <span className="text-gray-600">Del</span>
              <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-semibold border border-blue-200 shadow-sm">
                {trainingData?.startDate}
              </span>
              <span className="text-gray-600">al</span>
              <span className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-lg font-semibold border border-indigo-200 shadow-sm">
                {trainingData?.endDate}
              </span>
            </div>
          </div>
        </header>

        {/* Grid Layout Modificado */}
<div className="grid grid-cols-1 gap-6">
  <div className="bg-white rounded-xl shadow-md p-6">
    <ExerciseProgressSection data={trainingData?.exerciseProgress} />
  </div>
  
  {/* NUEVA SECCIÓN */}
  <div className="bg-white rounded-xl shadow-md p-6">
    <WorkoutFrequencySection workoutFrequency={trainingData?.workoutFrequency} />
  </div>
  
  <div className="bg-white rounded-xl shadow-md p-6">
    <RmProgressSection data={rmData} />
  </div>
</div>
      </div>
      <FooterPag />
    </>
  );
};

export default ProgressPage;
