// src/pages/Client/NutritionProgress.tsx
"use client"

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Agregar useParams
import { FooterPag } from "../../components/Footer";
import { ClientHeader } from "../../components/ClientHeader";
import { Progress } from "antd"; // usar Ant Design para barras

interface ProgressDTO {
  adherenceRate: number;    // 0.0 - 1.0
  overallCompliance: number;
  calories: { average: number; delta: number; daysCounted: number };
  proteins: { average: number; delta: number; daysCounted: number };
  carbs: { average: number; delta: number; daysCounted: number };
  fats: { average: number; delta: number; daysCounted: number };
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

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <ClientHeader fullName={clientDni || ""} onLogout={handleLogout} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Progreso Nutricional</h2>
        {loading && <p>Cargando…</p>}
        {error && <p className="text-red-500">{error}</p>}
        {data && (
          <div className="space-y-6">
            <div>
              <p className="font-medium">Adherencia al plan:</p>
              <Progress percent={Math.round(data.adherenceRate * 100)} />
            </div>
            <div>
              <p className="font-medium">Cumplimiento global:</p>
              <Progress percent={Math.round(data.overallCompliance * 100)} status="active" />
            </div>
            {(["calories", "proteins", "carbs", "fats"] as const).map(key => {
              const m = data[key];
              return (
                <div key={key}>
                  <p className="font-medium capitalize">{key}</p>
                  <Progress
                    percent={Math.round(m.average * 100)}
                    strokeColor={m.average >= 0.8 ? undefined : m.average >= 0.5 ? "orange" : "red"}
                    showInfo
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Cambio: {m.delta >= 0 ? "+" : ""}{(m.delta * 100).toFixed(1)}% desde mitad del periodo
                  </p>
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