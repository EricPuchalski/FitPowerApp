// src/pages/Nutritionist/NutritionPlanEdit.tsx
"use client";

import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../auth/hook/useAuth";
import { NutritionistHeader } from "../../components/NutritionistHeader";
import { FooterPag } from "../../components/Footer";
interface NutritionPlan {
  id?: number;
  name: string;
  caloricTarget: number;
  dailyCarbs: number;
  dailyProteins: number;
  dailyFats: number;
  recommendations?: string;
  clientDni: string;
  nutritionistId?: number; // 👈 Nuevo campo
}

export default function NutritionPlanEdit() {
  const { clientDni, planId } = useParams<{
    clientDni: string;
    planId: string;
  }>();
  const isNewPlan = planId === "new";
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [plan, setPlan] = useState<NutritionPlan>({
    name: "",
    caloricTarget: 0,
    dailyCarbs: 0,
    dailyProteins: 0,
    dailyFats: 0,
    recommendations: "",
    clientDni: clientDni || "",
  });

  const handleLogout = () => {
    logout();
    navigate("/"); // o "/login" si tenés una ruta específica
  };

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isNewPlan) {
      fetchPlan();
    } else {
      setLoading(false);
    }
  }, [planId]);

  const fetchPlan = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `http://localhost:8080/api/v1/clients/${clientDni}/nutrition-plans/${planId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error("No se pudo cargar el plan nutricional.");
      }

      const data = await res.json();
      setPlan({
        id: data.id,
        name: data.name,
        caloricTarget: data.caloricTarget,
        dailyCarbs: data.dailyCarbs,
        dailyProteins: data.dailyProteins,
        dailyFats: data.dailyFats,
        recommendations: data.recommendations || "",
        clientDni: clientDni || "",
      });
    } catch (error) {
      console.error("Error al cargar el plan:", error);
      toast.error("Error al cargar el plan nutricional");
    } finally {
      setLoading(false);
    }
  };

  const savePlan = async () => {
    setSaving(true);
    const token = localStorage.getItem("token");
    const nutritionistId = localStorage.getItem("nutritionistId");

    if (!token || !nutritionistId) {
      toast.error("Faltan credenciales o sesión expirada");
      setSaving(false);
      return;
    }

    // Validaciones adicionales basadas en el DTO
    if (!plan.name.trim()) {
      toast.error("El nombre del plan es obligatorio");
      setSaving(false);
      return;
    }

    if (!plan.caloricTarget || plan.caloricTarget <= 0) {
      toast.error("El objetivo calórico debe ser positivo");
      setSaving(false);
      return;
    }

    if (!plan.dailyCarbs || plan.dailyCarbs <= 0) {
      toast.error("Los carbohidratos diarios deben ser positivos");
      setSaving(false);
      return;
    }

    if (!plan.dailyProteins || plan.dailyProteins <= 0) {
      toast.error("Las proteínas diarias deben ser positivas");
      setSaving(false);
      return;
    }

    if (!plan.dailyFats || plan.dailyFats <= 0) {
      toast.error("Las grasas diarias deben ser positivas");
      setSaving(false);
      return;
    }

    try {
      if (isNewPlan) {
        const res = await fetch(
          `http://localhost:8080/api/v1/clients/${clientDni}/nutrition-plans`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: plan.name,
              caloricTarget: plan.caloricTarget,
              dailyCarbs: plan.dailyCarbs,
              dailyProteins: plan.dailyProteins,
              dailyFats: plan.dailyFats,
              recommendations: plan.recommendations,
              nutritionistId: parseInt(nutritionistId),
            }),
          }
        );

        if (!res.ok) throw new Error("No se pudo crear el plan nutricional");

        await res.json();
        toast.success("Plan nutricional creado con éxito");
        navigate(-1); // Vuelve atrás después de crear exitosamente
      } else {
        const res = await fetch(
          `http://localhost:8080/api/v1/clients/${clientDni}/nutrition-plans/${planId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: plan.name,
              caloricTarget: plan.caloricTarget,
              dailyCarbs: plan.dailyCarbs,
              dailyProteins: plan.dailyProteins,
              dailyFats: plan.dailyFats,
              recommendations: plan.recommendations,
                      nutritionistId: parseInt(nutritionistId),
                      

            }),
          }
        );

        if (!res.ok) throw new Error("No se pudo actualizar el plan");
        toast.success("Plan nutricional actualizado");
        // Para actualizar, mantenemos la navegación actual
        navigate(
          `/nutritionist/client/${clientDni}/nutrition-plans`
        );
      }
    } catch (err) {
      console.error(err);
      toast.error("Error al guardar el plan nutricional");
      console.log(plan);
      
    } finally {
      setSaving(false);
    }
  };

  const deletePlan = async () => {
    const confirmed = window.confirm(
      "¿Estás seguro que deseas eliminar este plan nutricional?"
    );
    if (!confirmed || !plan.id) return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        //nutrition-plans //${clientDni} //${plan.id}
        `http://localhost:8080/api/v1/clients/${clientDni}/nutrition-plans/${plan.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Error al eliminar el plan");

      toast.success("Plan eliminado correctamente");
      navigate(`/nutritionist/client/${clientDni}/nutrition-plans`);
    } catch (err) {
      console.error(err);
      toast.error("No se pudo eliminar el plan");
    }
  };

  if (loading) {
    return <div className="p-8 text-gray-500">Cargando...</div>;
  }

  return (
    <>
          <NutritionistHeader onLogout={handleLogout}></NutritionistHeader>
<div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div className="space-x-2">
          <button
            onClick={savePlan}
            disabled={saving}
            className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Guardando..." : "Guardar"}</span>
          </button>
        </div>
      </div>

      <div className="bg-white p-6 border rounded-lg shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del Plan *
          </label>
          <input
            type="text"
            value={plan.name}
            onChange={(e) => setPlan({ ...plan, name: e.target.value })}
            className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: Plan Keto Semana 1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Objetivo Calórico *
          </label>
          <input
            type="number"
            value={plan.caloricTarget}
            onChange={(e) =>
              setPlan({ ...plan, caloricTarget: +e.target.value })
            }
            className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Carbs diarios *
            </label>
            <input
              type="number"
              value={plan.dailyCarbs}
              onChange={(e) =>
                setPlan({ ...plan, dailyCarbs: +e.target.value })
              }
              className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Proteínas diarias *
            </label>
            <input
              type="number"
              value={plan.dailyProteins}
              onChange={(e) =>
                setPlan({ ...plan, dailyProteins: +e.target.value })
              }
              className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Grasas diarias *
            </label>
            <input
              type="number"
              value={plan.dailyFats}
              onChange={(e) => setPlan({ ...plan, dailyFats: +e.target.value })}
              className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Recomendaciones
          </label>
          <textarea
            value={plan.recommendations}
            onChange={(e) =>
              setPlan({ ...plan, recommendations: e.target.value })
            }
            className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={2}
            placeholder="Ej: Consumir mucho pollo, huevos, lacteos y tomar agua en cada comida."
          />
        </div>
      </div>

      <ToastContainer />
    </div>
    <FooterPag></FooterPag>
    </>
    
  );
}
