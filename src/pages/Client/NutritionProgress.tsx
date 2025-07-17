// src/pages/Client/NutritionProgress.tsx
"use client"

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Agregar useParams
import { FooterPag } from "../../components/Footer";
import { ClientHeader } from "../../components/ClientHeader";
import { Progress } from "antd"; // usar Ant Design para barras

interface MetricDTO { 
  target: number;              // valor objetivo del plan
  realConsumption: number;     // consumo real promedio
  compliancePercentage: number; // porcentaje de cumplimiento
  delta: number;               // cambio entre inicio y fin (para stagnation)
  daysCounted: number;         // días con registros
} 

interface ProgressDTO {
  adherenceRate: number;    // 0.0 - 1.0
  calories: MetricDTO;
  proteins: MetricDTO;
  carbs: MetricDTO;
  fats: MetricDTO;
}

export default function NutritionProgress() {
  const [data, setData] = useState<ProgressDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Obtener DNI desde parámetros de URL o localStorage
  const { dni: dniParam } = useParams();
  const clientDni = dniParam || localStorage.getItem("userDni");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!clientDni || !token) {
      setError("No hay sesión activa");
      setLoading(false);
      return;
    }
    fetch(
      `http://localhost:8080/api/v1/clients/${clientDni}/progress/nutrition`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then(res => {
        if (!res.ok) throw new Error("Error al cargar el progreso nutricional");
        return res.json();
      })
      .then((json: ProgressDTO) => setData(json))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [clientDni, token]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // Función para obtener el nombre legible del macronutriente
  const getMacroName = (key: string): string => {
    const names: Record<string, string> = {
      calories: "Calorías",
      proteins: "Proteínas", 
      carbs: "Carbohidratos",
      fats: "Grasas"
    };
    return names[key] || key;
  };

  // Función para obtener la unidad del macronutriente
  const getMacroUnit = (key: string): string => {
    return key === "calories" ? "kcal" : "g";
  };

  // Función para obtener el color de la barra de progreso
  const getProgressColor = (key: string, percentage: number): string => {
    if (percentage > 100) {
      return "#ff4d4f"; // Rojo para excedido
    }
    // Colores originales para normal
    return key === "calories" || key === "carbs" ? "#faad14" : "#f5222d";
  };

  // Función para renderizar el estado de cumplimiento
  const renderComplianceStatus = (metric: MetricDTO) => {
    const isExceeded = metric.compliancePercentage > 100;
    
    return (
      <div className="mt-2 text-sm">
        {isExceeded ? (
          <span className="text-red-600 font-medium">
            Excedido: {metric.compliancePercentage.toFixed(1)}%
          </span>
        ) : (
          <span className="text-gray-600">
            Porcentaje de cumplimiento: {metric.compliancePercentage.toFixed(1)}%
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <ClientHeader fullName={clientDni || ""} onLogout={handleLogout} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Progreso Nutricional</h2>
        {loading && <p>Cargando…</p>}
        {error && <p className="text-red-500">{error}</p>}
        {data && (
          <div className="space-y-6">
            {/* Adherencia al plan */}
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="font-medium mb-2">Adherencia al plan:</p>
              <Progress 
                percent={Math.round(data.adherenceRate * 100)} 
                strokeColor="#1890ff"
                showInfo
              />
            </div>

            {/* Macronutrientes - Con indicador de excedido */}
            {(["calories", "proteins", "carbs", "fats"] as const).map(key => {
              const metric = data[key];
              const macroName = getMacroName(key);
              const unit = getMacroUnit(key);
              const isExceeded = metric.compliancePercentage > 100;
              
              return (
                <div key={key} className="bg-white p-4 rounded-lg shadow">
                  <div className="mb-3">
                    <h3 className="font-medium text-lg">{macroName}</h3>
                    <div className="flex justify-between items-center text-sm text-gray-600 mt-1">
                      <span>Objetivo: {metric.target.toFixed(1)} {unit}</span>
                      <span className={isExceeded ? "text-red-600 font-medium" : ""}>
                        Real: {metric.realConsumption.toFixed(1)} {unit}
                      </span>
                    </div>
                  </div>
                  
                  <Progress
                    percent={Math.min(Math.round(metric.compliancePercentage), 100)} // Limitar a 100% visualmente
                    strokeColor={getProgressColor(key, metric.compliancePercentage)}
                    showInfo={!isExceeded} // No mostrar porcentaje en la barra si está excedido
                  />
                  
                  {/* Mostrar estado de cumplimiento */}
                  {renderComplianceStatus(metric)}
                </div>
              );
            })}
          </div>
        )}
      </main>
      <FooterPag />
    </div>
  );
}