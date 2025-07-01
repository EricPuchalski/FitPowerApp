import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FooterPag } from '../../components/Footer';
import { NutritionPlanResponseDto } from '../../model/NutritionPlanResponseDto';
import { FiArrowRight, FiTarget, FiCalendar, FiUser } from 'react-icons/fi';

const NutritionPlanPage: React.FC = () => {
  const [nutritionPlan, setNutritionPlan] = useState<NutritionPlanResponseDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { dni } = useParams<{ dni: string }>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const clientDni = dni || localStorage.getItem('userDni');
        
        if (!clientDni) throw new Error('No se encontró el DNI del cliente');

        const response = await fetch(`http://localhost:8080/api/v1/clients/${clientDni}/nutrition-plans/active`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Error al obtener el plan de nutrición');

        const data = await response.json();
        setNutritionPlan(Array.isArray(data) ? data[0] : data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dni]);

  const handleNavigateToRecords = () => {
    if (nutritionPlan) navigate(`/client/nutrition-plans/${nutritionPlan.id}/records`);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-lg text-gray-600">Cargando tu plan de nutrición...</p>
    </div>
  );

  if (!nutritionPlan) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 text-center">
      <div className="max-w-md">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">No tienes un plan activo</h2>
        <p className="text-gray-600 mb-6">Contacta a tu nutricionista para que te asigne un plan personalizado.</p>
        <button 
          onClick={() => navigate('/client')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header - Manteniendo tu estilo original */}
      <header className="bg-indigo-800 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">FITPOWER</h1>
          <div className="flex items-center space-x-3">
            <span className="font-medium">{nutritionPlan.clientName}</span>
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center font-bold">
              {nutritionPlan.clientName.split(' ').map(n => n[0]).join('')}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation - Exactamente como lo tenías */}
      <nav className="bg-white shadow-sm">
        <ul className="container mx-auto px-4 flex">
          <li className="flex-1 text-center hover:bg-gray-50 transition-colors">
            <button
              onClick={() => navigate("/client")}
              className="w-full py-4 font-medium text-gray-600 hover:text-gray-900"
            >
              Inicio
            </button>
          </li>
          <li className="flex-1 text-center hover:bg-gray-50 transition-colors">
            <button
              onClick={() => navigate("/client/training-plan")}
              className="w-full py-4 font-medium text-gray-600 hover:text-gray-900"
            >
              Plan de Entrenamiento
            </button>
          </li>
          <li className="flex-1 text-center border-b-4 border-red-500">
            <button className="w-full py-4 font-medium text-red-500">
              Plan de Nutrición
            </button>
          </li>
        </ul>
      </nav>

      {/* Contenido Principal Mejorado */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Encabezado del Plan */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">{nutritionPlan.name}</h2>
                        <div className="flex items-center text-gray-500">
              <FiCalendar className="mr-2" size={14} />
              <span className="text-sm">Creado el {new Date(nutritionPlan.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center text-green-500">
              <FiCalendar className="mr-2" size={14} />
              <span className="text-sm">Actualizado el {new Date(nutritionPlan.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
          <button 
            onClick={handleNavigateToRecords}
            className="flex items-center px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors shadow-sm"
          >
            <span>Registrar Comida</span>
            <FiArrowRight className="ml-2" />
          </button>
        </div>

        {/* Tarjetas de Información */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tarjeta de Metas Nutricionales */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600 mr-3">
                <FiTarget size={20} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Metas Diarias</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 px-3 bg-indigo-50 rounded-md">
                <span className="text-gray-700">Calorías</span>
                <span className="font-semibold text-indigo-600">{nutritionPlan.caloricTarget} kcal</span>
              </div>
              
              <div className="flex justify-between items-center py-2 px-3 bg-indigo-50 rounded-md">
                <span className="text-gray-700">Carbohidratos</span>
                <span className="font-semibold text-indigo-600">{nutritionPlan.dailyCarbs}g</span>
              </div>
              
              <div className="flex justify-between items-center py-2 px-3 bg-indigo-50 rounded-md">
                <span className="text-gray-700">Proteínas</span>
                <span className="font-semibold text-indigo-600">{nutritionPlan.dailyProteins}g</span>
              </div>
              
              <div className="flex justify-between items-center py-2 px-3 bg-indigo-50 rounded-md">
                <span className="text-gray-700">Grasas</span>
                <span className="font-semibold text-indigo-600">{nutritionPlan.dailyFats}g</span>
              </div>
            </div>
          </div>

          {/* Tarjeta de Recomendaciones y Nutricionista */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 lg:col-span-2">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Recomendaciones</h3>
              <div className="bg-green-50 p-4 rounded-md">
                <p className="text-gray-700 whitespace-pre-line">{nutritionPlan.recommendations}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Nutricionista</h3>
              <div className="flex items-center bg-gray-50 p-3 rounded-md">
                <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mr-3">
                  <FiUser size={16} />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{nutritionPlan.nutritionistName}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <FooterPag />
    </div>
  );
};

export default NutritionPlanPage;