// src/pages/Client/NutritionProgress.tsx
"use client"

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FooterPag } from "../../components/Footer";
import { ClientHeader } from "../../components/ClientHeader";
import { Progress } from "antd";

interface MetricDTO { 
  target: number;              
  realConsumption: number;     
  compliancePercentage: number;
  delta: number;               
  daysCounted: number;         
} 

interface ProgressDTO {
  adherenceRate: number;    
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

  const getMacroName = (key: string): string => {
    const names: Record<string, string> = {
      calories: "Calorías",
      proteins: "Proteínas", 
      carbs: "Carbohidratos",
      fats: "Grasas"
    };
    return names[key] || key;
  };

  const getMacroUnit = (key: string): string =>
    key === "calories" ? "kcal" : "g";

  // 80% = aceptable, >100% = excedido
  const getProgressColor = (percentage: number): string => {
    if (percentage > 100) {
      return "#ff4d4f";            // Rojo
    }
    if (percentage >= 80) {
      return "#52c41a";            // Verde
    }
    return "#faad14";              // Naranja para bajo cumplimiento
  };

  const renderComplianceStatus = (metric: MetricDTO) => {
    const p = metric.compliancePercentage;
    if (p > 100) {
      return (
        <span className="text-red-600 font-medium">
          Excedido: {p.toFixed(1)}%
        </span>
      );
    }
    if (p >= 80) {
      return (
        <span className="text-green-600 font-medium">
          Cumplimiento aceptable: {p.toFixed(1)}%
        </span>
      );
    }
    return (
      <span className="text-yellow-600 font-medium">
        Por debajo de lo esperado: {p.toFixed(1)}%
      </span>
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

            {/* Macronutrientes */}
            {(["calories", "proteins", "carbs", "fats"] as const).map(key => {
              const metric = data[key];
              const macroName = getMacroName(key);
              const unit = getMacroUnit(key);
              const p = metric.compliancePercentage;

              return (
                <div key={key} className="bg-white p-4 rounded-lg shadow">
                  <div className="mb-3">
                    <h3 className="font-medium text-lg">{macroName}</h3>
                    <div className="flex justify-between items-center text-sm text-gray-600 mt-1">
                      <span>Objetivo: {metric.target.toFixed(1)} {unit}</span>
                      <span className={p > 100 ? "text-red-600 font-medium" : ""}>
                        Real: {metric.realConsumption.toFixed(1)} {unit}
                      </span>
                    </div>
                  </div>
                  
                  <Progress
                    percent={Math.min(Math.round(p), 100)}
                    strokeColor={getProgressColor(p)}
                    showInfo={false}
                  />

                  <div className="mt-2 text-sm">
                    {renderComplianceStatus(metric)}
                  </div>
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
